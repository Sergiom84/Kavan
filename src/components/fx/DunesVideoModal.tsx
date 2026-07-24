import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './DunesVideoModal.css'

/**
 * Vídeo flotante de las dunas (wireframe 1). Mientras no exista el vídeo real,
 * se proyecta una escena animada; cuando Marta facilite el mp4, basta con
 * sustituir la escena por un elemento <video>.
 */
export function DunesVideoModal({ onClose }: { onClose: () => void }) {
  const sceneRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const svg = sceneRef.current
    if (!svg) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to('#dv-sun', { y: -46, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('#dv-dune-far', { x: -30, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('#dv-dune-near', { x: 24, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('#dv-haze', { opacity: 0.25, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, svg)
    return () => ctx.revert()
  }, [])

  return (
    <div className="dunes-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dunes-modal-frame" onClick={(e) => e.stopPropagation()}>
        <button className="dunes-modal-close" aria-label="Cerrar" onClick={onClose}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <svg ref={sceneRef} viewBox="0 0 960 540" className="dunes-modal-scene" aria-label="Las dunas de Merzouga">
          <defs>
            <linearGradient id="dv-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6dcb2" />
              <stop offset="1" stopColor="#e59a5f" />
            </linearGradient>
          </defs>
          <rect width="960" height="540" fill="url(#dv-sky)" />
          <circle id="dv-sun" cx="640" cy="240" r="58" fill="#faf3e3" opacity="0.95" />
          <rect id="dv-haze" width="960" height="540" fill="#f2d9b8" opacity="0.08" />
          <path
            id="dv-dune-far"
            d="M-60 340 Q 160 260 400 330 T 780 320 T 1060 340 L 1060 540 L -60 540 Z"
            fill="#c07d4b"
            opacity="0.85"
          />
          <path
            id="dv-dune-near"
            d="M-60 430 Q 220 360 480 425 T 1020 415 L 1020 540 L -60 540 Z"
            fill="#8a4f2d"
          />
        </svg>
      </div>
    </div>
  )
}
