import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { publishAdvisorVisibility } from '../../lib/advisorVisibility'
import './HeroSplit.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  media: ReactNode
  children: ReactNode
  continuation?: ReactNode
  closingCopy?: ReactNode
  className?: string
}

/**
 * Portada: la fotografía se abre por la mitad y deja pasar el bloque siguiente.
 *
 * Sustituye a `BurstGallery`, que antes de partirse disparaba una ráfaga de
 * fotografías gobernada por el scroll. La ráfaga desaparece —decisión de Sergio
 * el 2026-09-19—: la portada es ahora una sola fotografía, la misma con la que
 * termina `HeroLoader`, y el scroll sólo hace dos cosas, retirar el logotipo y
 * partir la imagen.
 *
 * El escenario va pegajoso: se queda quieto mientras el desplazamiento gobierna
 * la apertura, y las dos mitades salen de cuadro dejando ver las tarjetas.
 */

/** Dónde acaba la apertura dentro de la línea de tiempo. */
const FIN_APERTURA = 1

/** Pantallas de scroll que el escenario aguanta quieto una vez abiertas las
    tarjetas. Sin esta espera, la imagen termina de abrirse y la página sigue
    bajando en el mismo gesto: las tarjetas se ven de pasada. */
const ESPERA_FINAL_SVH = 120

/** Alto de scroll de la portada, sin contar la espera final. */
const ALTURA_PORTADA_SVH = 200

export function HeroSplit({
  media,
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
        const continuationEl = root.querySelector<HTMLElement>('.hero-split__continuation')
        const splitEl = root.querySelector<HTMLElement>('.hero-split__split')
        const mitades = gsap.utils.toArray<HTMLElement>('.hero-split__pane')
        if (!continuationEl || !splitEl || mitades.length !== 2) return

        let mostrandoContinuacion = false
        let mostrandoAsesor = false

        const actualizarCabecera = (mostrar: boolean) => {
          if (mostrandoContinuacion === mostrar) return
          mostrandoContinuacion = mostrar
          root.classList.toggle('hero-split--paper', mostrar)
          window.dispatchEvent(new Event('scroll'))
        }

        const actualizarAsesor = (mostrar: boolean) => {
          if (mostrandoAsesor === mostrar) return
          mostrandoAsesor = mostrar
          publishAdvisorVisibility(mostrar)
        }

        /* La espera alarga la línea de tiempo sin tocar el ritmo de la
           apertura, así que los umbrales se reescalan contra el total. */
        const espera = (FIN_APERTURA * ESPERA_FINAL_SVH) / ALTURA_PORTADA_SVH
        const total = FIN_APERTURA + espera
        const umbral = (posicion: number) => posicion / total

        /* Cuándo empieza a partirse. Antes de aquí sólo se respira la
           fotografía; el logotipo se retira y entra el texto. */
        const APERTURA = 0.42

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              actualizarCabecera(progress >= umbral(APERTURA))
              actualizarAsesor(progress >= umbral(APERTURA))
            },
          },
        })

        timeline.set('.hero-split__hero-media', { willChange: 'transform' }, 0)
        timeline.set('.hero-split__intro', { willChange: 'transform, opacity' }, 0)
        /* El zoom va también a las dos mitades, y no sólo a la fotografía de
           debajo: cada mitad es geométricamente idéntica a ella —la mitad mide
           media pantalla y su fotografía el doble, anclada a su lado—, así que
           con el mismo `scale` y el mismo origen quedan superpuestas. Si sólo
           escalara la de debajo, al aparecer el corte las mitades entrarían a
           otro tamaño y el salto se vería justo en el momento de partirse. */
        timeline.to(
          ['.hero-split__hero-media', '.hero-split__pane-media'],
          { scale: 1.1, duration: APERTURA },
          0,
        )
        timeline.to('.hero-split__intro', { autoAlpha: 0, yPercent: -6, duration: 0.16 }, 0.04)
        timeline.set('.hero-split__intro', { willChange: 'auto' }, 0.2)

        if (closingCopy) {
          timeline.fromTo(
            '.hero-split__closing-copy',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.14 },
            0.2,
          )
        }

        timeline.to([continuationEl, splitEl], { autoAlpha: 1, duration: 0.001 }, APERTURA)
        timeline.set(mitades, { willChange: 'transform' }, APERTURA)
        timeline.to(mitades[0], { xPercent: -100, duration: FIN_APERTURA - APERTURA }, APERTURA)
        timeline.to(mitades[1], { xPercent: 100, duration: FIN_APERTURA - APERTURA }, APERTURA)
        timeline.set(mitades, { willChange: 'auto' }, FIN_APERTURA)
        timeline.to(splitEl, { autoAlpha: 0, duration: 0.001 }, FIN_APERTURA - 0.001)
        timeline.set('.hero-split__hero-media', { willChange: 'auto' }, FIN_APERTURA)

        /* Tramo muerto: sólo existe para que el scroll siga contando mientras
           el escenario permanece fijo con las tarjetas. */
        timeline.to({}, { duration: espera }, FIN_APERTURA)
      }, root)

      return () => {
        root.classList.remove('hero-split--paper')
        publishAdvisorVisibility(false)
        window.dispatchEvent(new Event('scroll'))
        ctx.revert()
      }
    })

    mediaQuery.add('(prefers-reduced-motion: reduce)', () => {
      const continuationEl = root.querySelector<HTMLElement>('.hero-split__continuation')
      if (!continuationEl) return

      const observer = new IntersectionObserver(
        ([entry]) => publishAdvisorVisibility(entry.isIntersecting),
        { threshold: 0.15 },
      )

      observer.observe(continuationEl)

      return () => {
        observer.disconnect()
        publishAdvisorVisibility(false)
      }
    })

    return () => mediaQuery.revert()
  }, [closingCopy])

  const style = {
    '--hero-split-scroll-height': `${ALTURA_PORTADA_SVH + ESPERA_FINAL_SVH}svh`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`hero-zoom hero-split ${className}`}
      style={style}
      aria-label="Portada"
    >
      <div className="hero-split__stage">
        <div className="hero-split__hero">
          <div className="hero-split__hero-media">{media}</div>
          <div className="hz-scrim" />
          <div className="hero-split__intro">{children}</div>
          {closingCopy ? <div className="hero-split__closing-copy">{closingCopy}</div> : null}
        </div>

        {continuation ? <div className="hero-split__continuation">{continuation}</div> : null}

        {continuation ? (
          /* Las dos mitades repiten la misma fotografía: cada una la enseña al
             doble de ancho y anclada a su lado, así que juntas son la imagen
             de debajo y al separarse se lee como una sola que se abre. */
          <div className="hero-split__split" aria-hidden="true">
            <div className="hero-split__pane hero-split__pane--left">
              <div className="hero-split__pane-media">{media}</div>
              {closingCopy ? (
                <div className="hero-split__closing-copy hero-split__closing-copy--pane">
                  {closingCopy}
                </div>
              ) : null}
            </div>
            <div className="hero-split__pane hero-split__pane--right">
              <div className="hero-split__pane-media">{media}</div>
              {closingCopy ? (
                <div className="hero-split__closing-copy hero-split__closing-copy--pane">
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
