import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitTitle } from './SplitTitle'
import './ParticleClaim.css'

type Props = {
  /** La frase con las llaves del recurso tipográfico, como en SplitTitle. */
  text: string
}

/**
 * La frase sobre blanco roto, dibujada con partículas.
 *
 * El efecto sólo entra en pantalla ancha, con puntero fino y sin
 * `prefers-reduced-motion`: en móvil son cientos de miles de puntos por
 * fotograma para nada. Cuando no entra, o si el navegador no da WebGL2, la
 * frase se queda escrita y no se pierde nada.
 *
 * El texto vive siempre en el DOM. Cuando el efecto arranca deja de dibujarse,
 * pero sigue estando ahí para el lector de pantalla y para el buscador.
 */
gsap.registerPlugin(ScrollTrigger)

export function ParticleClaim({ text }: Props) {
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
        efecto = new DesertParticles({ container: host, image: imagen })
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
  }, [text])

  useEffect(() => {
    const escena = escenaRef.current
    if (!escena || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const contexto = gsap.context(() => {
      gsap.to(escena, {
        '--desert-reveal': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: escena,
          start: 'top 72%',
          end: 'bottom 42%',
          scrub: 0.45,
        },
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
          src="/images/dunas-erg-chebbi.webp"
          alt="Dunas del Erg Chebbi en el desierto de Marruecos"
          loading="lazy"
          decoding="async"
        />
        <div className="pclaim-canvas" ref={lienzoRef} aria-hidden="true" />
        <div className="pclaim-inner">
          <SplitTitle size="display" align="center" className="pclaim-title" text={text} />
        </div>
      </div>
      <div className="pclaim-band pclaim-band--bottom">
        <span className="label">Marruecos</span>
        <span className="label">01 — 05</span>
      </div>
    </section>
  )
}
