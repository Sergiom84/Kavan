import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { FotoGaleria } from '../../data/galeria'
import './BurstGallery.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  media: ReactNode
  fotos: FotoGaleria[]
  children: ReactNode
  continuation?: ReactNode
  closingCopy?: ReactNode
  className?: string
}

/**
 * Portada y ráfaga de fotografías gobernadas por el scroll.
 *
 * El escenario permanece fijo mientras el desplazamiento abre las fotografías.
 * La última se divide desde el centro y deja visible el fondo de la página para
 * enlazar con el siguiente bloque.
 */
export function BurstGallery({
  media,
  fotos,
  children,
  continuation,
  closingCopy,
  className = '',
}: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mediaQuery = gsap.matchMedia()

    mediaQuery.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const capas = gsap.utils.toArray<HTMLElement>('.burst-gallery__photo')
        if (capas.length === 0) return
        const continuationEl = root.querySelector<HTMLElement>('.burst-gallery__continuation')
        const splitEl = root.querySelector<HTMLElement>('.burst-gallery__split')
        const mitadesFinales = gsap.utils.toArray<HTMLElement>('.burst-gallery__split-pane')
        let mostrandoContinuacion = false

        const actualizarCabecera = (mostrar: boolean) => {
          if (mostrandoContinuacion === mostrar) return
          mostrandoContinuacion = mostrar
          root.classList.toggle('burst-gallery--paper', mostrar)
          window.dispatchEvent(new Event('scroll'))
        }

        const inicioRafaga = 0.14
        const finRafaga = 0.82
        const duracionFoto = 0.3
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
            onUpdate: ({ progress }) => actualizarCabecera(progress >= 0.82),
          },
        })

        timeline.set('.burst-gallery__hero-media', { willChange: 'transform' }, 0)
        timeline.set('.burst-gallery__intro', { willChange: 'transform, opacity' }, 0)
        timeline.to('.burst-gallery__hero-media', { scale: 1.06, duration: 0.28 }, 0)
        timeline.to(
          '.burst-gallery__intro',
          { autoAlpha: 0, yPercent: -4, duration: 0.1 },
          0.04,
        )
        timeline.set('.burst-gallery__intro', { willChange: 'auto' }, 0.14)
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

        if (continuationEl && splitEl && mitadesFinales.length === 2) {
          timeline.to([continuationEl, splitEl], { autoAlpha: 1, duration: 0.001 }, 0.839)
          timeline.set(mitadesFinales, { willChange: 'transform' }, 0.84)
          timeline.to(
            mitadesFinales[0],
            { xPercent: -100, duration: 0.18 },
            0.84,
          )
          timeline.to(
            mitadesFinales[1],
            { xPercent: 100, duration: 0.18 },
            0.84,
          )
          timeline.set(mitadesFinales, { willChange: 'auto' }, 1.02)
          timeline.to(splitEl, { autoAlpha: 0, duration: 0.001 }, 1.019)
        }
      }, root)

      return () => {
        root.classList.remove('burst-gallery--paper')
        window.dispatchEvent(new Event('scroll'))
        ctx.revert()
      }
    })

    return () => mediaQuery.revert()
  }, [fotos.length])

  const style = {
    '--burst-scroll-height': `${Math.max(365, 260 + fotos.length * 35)}svh`,
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
              <img src={foto.src} alt={foto.alt} decoding="async" />
              {closingCopy && indice === fotos.length - 1 ? (
                <div className="burst-gallery__closing-copy">{closingCopy}</div>
              ) : null}
            </div>
          ))}
        </div>

        {continuation ? (
          <div className="burst-gallery__continuation">{continuation}</div>
        ) : null}

        {continuation && fotos.length > 0 ? (
          <div className="burst-gallery__split" aria-hidden="true">
            <div className="burst-gallery__split-pane burst-gallery__split-pane--left">
              <img src={fotos[fotos.length - 1].src} alt="" decoding="async" />
              {closingCopy ? (
                <div className="burst-gallery__split-copy burst-gallery__split-copy--left">
                  {closingCopy}
                </div>
              ) : null}
            </div>
            <div className="burst-gallery__split-pane burst-gallery__split-pane--right">
              <img src={fotos[fotos.length - 1].src} alt="" decoding="async" />
              {closingCopy ? (
                <div className="burst-gallery__split-copy burst-gallery__split-copy--right">
                  {closingCopy}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
