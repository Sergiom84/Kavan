import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitTitle } from './SplitTitle'
import './ParticleClaim.css'

type Props = {
  /** Frases con llaves para el recurso tipográfico de SplitTitle. */
  beats: string[]
}

/**
 * Una pausa editorial entre el hero y la galería: acuarela, arena WebGL
 * y titular que gana foco al avanzar. En móvil, con movimiento reducido o sin
 * WebGL2 queda como fotografía estática plenamente legible.
 */
gsap.registerPlugin(ScrollTrigger)

export function ParticleClaim({ beats }: Props) {
  const escenaRef = useRef<HTMLElement>(null)
  const lienzoRef = useRef<HTMLDivElement>(null)
  const imagenRef = useRef<HTMLImageElement>(null)
  const [conEfecto, setConEfecto] = useState(false)

  useEffect(() => {
    const escena = escenaRef.current
    const host = lienzoRef.current
    const imagen = imagenRef.current
    if (!escena || !host || !imagen) return

    const apto =
      window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!apto) return

    let vivo = true
    let efecto: { destroy: () => void } | null = null

    const arrancar = async () => {
      try {
        if (!imagen.complete) await new Promise<void>((resolve, reject) => {
          imagen.addEventListener('load', () => resolve(), { once: true })
          imagen.addEventListener('error', () => reject(), { once: true })
        })
        if (!vivo) return
        const { DesertParticles } = await import('./DesertParticles')
        if (!vivo) return
        efecto = new DesertParticles({ container: host, image: imagen, particles: 400000 })
        if (vivo) setConEfecto(true)
      } catch {
        setConEfecto(false)
      }
    }

    arrancar()

    return () => {
      vivo = false
      efecto?.destroy()
    }
  }, [])

  useEffect(() => {
    const escena = escenaRef.current
    const apto = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!escena || !apto) return

    const contexto = gsap.context(() => {
      const frases = gsap.utils.toArray<HTMLElement>('.pclaim-beat')
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: escena,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * frases.length * .38)}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
        },
      })

      timeline
        .set(escena, { '--desert-reveal': 1 })
        .set(frases.slice(1), { autoAlpha: 0, x: 40, display: 'none', filter: 'blur(0rem)' })

      frases.slice(1).forEach(frase => {
        timeline
          .set(frase, { display: 'block' })
          .to(frase, { autoAlpha: 1, x: 0, duration: .38, ease: 'none' })
          .to({}, { duration: .42 })
      })
    }, escena)

    return () => contexto.revert()
  }, [])

  return (
    <section className={`pclaim ${conEfecto ? 'has-particles' : ''}`} ref={escenaRef}>
      <div className="pclaim-band pclaim-band--top">
        <span className="label">Marruecos</span>
        <span className="label">Entre dos mundos</span>
      </div>
      <div className="pclaim-media">
        <img
          ref={imagenRef}
          className="pclaim-bg"
          src="/images/kasbah-acuarela.webp"
          alt="Acuarela de una kasbah en Marruecos"
          loading="lazy"
          decoding="async"
        />
        <div className="pclaim-canvas" ref={lienzoRef} aria-hidden="true" />
        <div className="pclaim-inner">
          {beats.map(beat => (
            <SplitTitle
              key={beat}
              as="p"
              size="lead"
              align="center"
              className="pclaim-beat"
              text={beat}
            />
          ))}
        </div>
      </div>
      <div className="pclaim-band pclaim-band--bottom">
        <span className="label">Marruecos</span>
        <span className="label">01 — 05</span>
      </div>
    </section>
  )
}
