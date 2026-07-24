import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './TravelAnimation.css'

/**
 * Animación al pulsar "Calcular Viaje": un 4x4 cruza las dunas.
 * Reinterpretación propia con GSAP del concepto de escena en movimiento.
 */
export function TravelAnimation({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const t = setTimeout(() => doneRef.current(), 600)
      return () => clearTimeout(t)
    }
    // Si la pestaña queda en segundo plano, GSAP no avanza: garantiza la salida
    let finished = false
    const finish = () => {
      if (!finished) {
        finished = true
        doneRef.current()
      }
    }
    const safety = setTimeout(finish, 4200)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish })
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 })
        .fromTo('#ta-car', { x: -260 }, { x: 1260, duration: 2.6, ease: 'power1.inOut' }, 0.2)
        .to('#ta-car-body', { y: -4, duration: 0.16, yoyo: true, repeat: 15, ease: 'sine.inOut' }, 0.2)
        .to('.ta-wheel', { rotation: 1080, transformOrigin: '50% 50%', duration: 2.6, ease: 'power1.inOut' }, 0.2)
        .to('#ta-dune-far', { x: -90, duration: 2.8, ease: 'power1.inOut' }, 0.2)
        .to('#ta-dune-near', { x: -190, duration: 2.8, ease: 'power1.inOut' }, 0.2)
        .to('#ta-dust', { autoAlpha: 0.5, duration: 0.4 }, 0.5)
        .to(el, { autoAlpha: 0, duration: 0.4 }, '+=0.15')
    }, el)
    return () => {
      clearTimeout(safety)
      ctx.revert()
    }
  }, [])

  return (
    <div className="travel-anim" ref={ref} role="status" aria-label="Calculando tu viaje">
      <svg viewBox="0 0 1000 560" className="travel-anim-scene" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ta-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6dcb2" />
            <stop offset="1" stopColor="#e08e55" />
          </linearGradient>
        </defs>
        <rect width="1000" height="560" fill="url(#ta-sky)" />
        <circle cx="700" cy="150" r="56" fill="#faf3e3" opacity="0.95" />
        <path
          id="ta-dune-far"
          d="M-100 330 Q 150 250 400 320 T 800 310 T 1200 330 L 1200 560 L -100 560 Z"
          fill="#c07d4b"
          opacity="0.8"
        />
        <path
          id="ta-dune-near"
          d="M-100 430 Q 200 360 500 425 T 1200 415 L 1200 560 L -100 560 Z"
          fill="#8a4f2d"
        />
        <g id="ta-car">
          <ellipse id="ta-dust" cx="-38" cy="424" rx="46" ry="10" fill="#d8bfa2" opacity="0" />
          <g id="ta-car-body">
            <rect x="0" y="360" width="150" height="42" rx="10" fill="#2b2118" />
            <path d="M28 362 L 44 330 L 112 330 L 126 362 Z" fill="#2b2118" />
            <rect x="50" y="336" width="26" height="24" rx="3" fill="#f2d9b8" />
            <rect x="82" y="336" width="24" height="24" rx="3" fill="#f2d9b8" />
            <rect x="0" y="352" width="150" height="7" rx="3.5" fill="#c4622d" />
            <rect x="142" y="368" width="12" height="10" rx="2" fill="#f6dcb2" />
            <rect x="20" y="322" width="112" height="6" rx="3" fill="#5c5044" />
            <rect x="34" y="312" width="30" height="10" rx="2" fill="#5c5044" />
            <rect x="72" y="310" width="18" height="12" rx="2" fill="#5c5044" />
          </g>
          <g className="ta-wheel">
            <circle cx="36" cy="408" r="19" fill="#2b2118" />
            <circle cx="36" cy="408" r="9" fill="#8a7c6c" />
            <path d="M36 401v14M29 408h14" stroke="#2b2118" strokeWidth="2.5" />
          </g>
          <g className="ta-wheel">
            <circle cx="116" cy="408" r="19" fill="#2b2118" />
            <circle cx="116" cy="408" r="9" fill="#8a7c6c" />
            <path d="M116 401v14M109 408h14" stroke="#2b2118" strokeWidth="2.5" />
          </g>
        </g>
      </svg>
      <span className="travel-anim-text">Preparando tu viaje</span>
    </div>
  )
}
