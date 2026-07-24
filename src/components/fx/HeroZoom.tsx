import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HeroZoom.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Portada que se aleja con el scroll.
 *
 * La sección mide varias pantallas de alto y dentro lleva un escenario
 * pegajoso que se queda quieto mientras se recorre. Sobre ese escenario, el
 * scroll gobierna tres cosas a la vez: la fotografía se aleja, la portada se
 * retira y van entrando los textos intermedios. Al llegar al final el
 * escenario se despega solo y entra el bloque siguiente.
 *
 * El pegado se hace con `position: sticky` en lugar de con el pin de GSAP:
 * es una línea de CSS, no introduce el elemento espaciador que el pin añade
 * al documento, y convive sin roces con el scroll suave de Lenis.
 */

type Props = {
  /** Fotografía de fondo. Se aleja de `zoomDesde` a 1. */
  media: ReactNode
  /** Frases que aparecen y se van mientras la imagen se aleja. */
  beats?: string[]
  /** Pantallas de scroll que dura el efecto. */
  pantallas?: number
  /** Escala inicial: cuanto más alta, más cerca arranca la fotografía. */
  zoomDesde?: number
  className?: string
  /** Contenido de la primera pantalla: logotipo, entradilla, botones. */
  children: ReactNode
}

export function HeroZoom({
  media,
  beats = [],
  pantallas = 3,
  zoomDesde = 1.45,
  className = '',
  children,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    /* Sin efecto si se ha pedido menos movimiento: la sección se queda en una
       pantalla y la portada se ve entera y quieta. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })

      // La fotografía se aleja durante todo el recorrido.
      tl.fromTo(
        '.hero-zoom__media',
        { scale: zoomDesde },
        { scale: 1, ease: 'none', duration: 1 },
        0,
      )

      // La portada se retira en el primer cuarto.
      tl.to('.hero-zoom__intro', { autoAlpha: 0, y: -40, ease: 'none', duration: 0.2 }, 0.03)

      /* Cada frase entra, se sostiene y se va. El reparto deja la última
         pantalla libre para que el bloque siguiente no pise a ningún texto. */
      const hueco = 0.72 / Math.max(beats.length, 1)
      beats.forEach((_, i) => {
        const inicio = 0.26 + i * hueco
        tl.fromTo(
          `.hero-zoom__beat[data-beat="${i}"]`,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: 'none', duration: hueco * 0.32 },
          inicio,
        )
        tl.to(
          `.hero-zoom__beat[data-beat="${i}"]`,
          { autoAlpha: 0, y: -28, ease: 'none', duration: hueco * 0.28 },
          inicio + hueco * 0.66,
        )
      })
    }, root)

    return () => ctx.revert()
  }, [beats.length, zoomDesde])

  return (
    <section
      ref={rootRef}
      className={`hero-zoom ${className}`}
      style={{ height: `${pantallas * 100}svh` }}
    >
      <div className="hero-zoom__stage">
        <div className="hero-zoom__media">{media}</div>
        <div className="hz-scrim" />

        <div className="hero-zoom__intro">{children}</div>

        {beats.map((texto, i) => (
          <p key={i} className="hero-zoom__beat" data-beat={i}>
            {texto}
          </p>
        ))}
      </div>
    </section>
  )
}
