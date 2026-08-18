import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { FotoGaleria } from '../../data/galeria'
import './BurstGallery.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  media: ReactNode
  fotos: FotoGaleria[]
  children: ReactNode
  className?: string
}

/**
 * Portada y ráfaga de fotografías gobernadas por el scroll.
 *
 * El escenario se mantiene pegado con CSS y la única timeline se construye a
 * partir de `fotos`: añadir o retirar una imagen no exige crear disparadores
 * nuevos. Cada capa abre su recorte desde el centro mientras crece y empieza
 * antes de que la anterior haya terminado.
 */
export function BurstGallery({ media, fotos, children, className = '' }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [cantidadCargada, setCantidadCargada] = useState(() => {
    if (typeof window === 'undefined') return Math.min(2, fotos.length)

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? fotos.length
      : Math.min(2, fotos.length)
  })

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualizarPreferencia = () => {
      if (consulta.matches) setCantidadCargada(fotos.length)
    }

    actualizarPreferencia()
    consulta.addEventListener('change', actualizarPreferencia)

    return () => consulta.removeEventListener('change', actualizarPreferencia)
  }, [fotos.length])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mediaQuery = gsap.matchMedia()

    mediaQuery.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const capas = gsap.utils.toArray<HTMLElement>('.burst-gallery__photo')
        if (capas.length === 0) return

        const inicioRafaga = 0.11
        const finRafaga = 0.92
        const duracionFoto = 0.23
        const separacion =
          capas.length > 1
            ? (finRafaga - inicioRafaga - duracionFoto) / (capas.length - 1)
            : 0

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              if (progress < Math.max(0, inicioRafaga - separacion)) return

              const indiceActual =
                separacion > 0
                  ? Math.max(0, Math.floor((progress - inicioRafaga) / separacion))
                  : 0
              const hasta = Math.min(capas.length, indiceActual + 3)
              setCantidadCargada((cantidadActual) => Math.max(cantidadActual, hasta))
            },
          },
        })

        timeline.set('.burst-gallery__hero-media', { willChange: 'transform' }, 0)
        timeline.set('.burst-gallery__intro', { willChange: 'transform, opacity' }, 0)
        timeline.to('.burst-gallery__hero-media', { scale: 1.08, duration: 0.28 }, 0)
        timeline.to(
          '.burst-gallery__intro',
          { autoAlpha: 0, yPercent: -4, duration: 0.09 },
          0.035,
        )
        timeline.set('.burst-gallery__intro', { willChange: 'auto' }, 0.125)
        timeline.set('.burst-gallery__hero-media', { willChange: 'auto' }, 0.28)

        capas.forEach((capa, indice) => {
          const inicio = inicioRafaga + indice * separacion

          timeline.set(capa, { willChange: 'transform, clip-path' }, inicio)
          timeline.fromTo(
            capa,
            {
              scale: 0.35,
              clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
            },
            {
              scale: 1,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              duration: duracionFoto,
            },
            inicio,
          )
          timeline.set(capa, { willChange: 'auto' }, inicio + duracionFoto)
        })
      }, root)

      return () => ctx.revert()
    })

    return () => mediaQuery.revert()
  }, [fotos.length])

  /* Ocho fotos comparten un recorrido acotado: crece suavemente si cambia el
     repertorio, sin convertir cada nueva imagen en otra pantalla completa. */
  const style = {
    '--burst-scroll-height': `${Math.max(330, 230 + fotos.length * 25)}svh`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`hero-zoom burst-gallery ${className}`}
      style={style}
      aria-label="Portada y fotografías de Marruecos"
    >
      <div className="burst-gallery__stage">
        <div className="burst-gallery__hero">
          <div className="burst-gallery__hero-media">{media}</div>
          <div className="hz-scrim" />
          <div className="burst-gallery__intro">{children}</div>
        </div>

        <div className="burst-gallery__photos">
          {fotos.map((foto, indice) => (
            <div
              className="burst-gallery__photo"
              key={foto.src}
              style={{ zIndex: indice + 1 }}
            >
              <img
                src={indice < cantidadCargada ? foto.src : undefined}
                data-src={indice < cantidadCargada ? undefined : foto.src}
                alt={foto.alt}
                aria-hidden={indice < cantidadCargada ? undefined : true}
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
