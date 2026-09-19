import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import './LineReveal.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

type Props = {
  children: ReactNode
  /** Espera antes de arrancar, para escalonar dos bloques del mismo golpe. */
  delay?: number
  /** Etiqueta del contenedor. `div` rompería la semántica dentro de un `li`. */
  as?: ElementType
  className?: string
}

/**
 * El texto entra línea a línea desde debajo de su propia caja.
 *
 * `SplitText` parte el párrafo por líneas reales —las que produce el ancho
 * disponible, no las del marcado— y enmascara cada una, así que cada renglón
 * asoma por su propio borde en vez de deslizarse sobre el papel.
 *
 * Se espera a `document.fonts.ready` antes de medir: con la tipografía de
 * respaldo puesta, las líneas se cortan donde no toca y el reparto queda mal
 * hasta que se recarga.
 *
 * Sin movimiento, el texto se queda donde está: legible y quieto.
 */
export function LineReveal({ children, delay = 0, as: Tag = 'div', className }: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const mediaQuery = gsap.matchMedia()

    mediaQuery.add('(prefers-reduced-motion: no-preference)', () => {
      let split: SplitText | undefined
      let tween: gsap.core.Tween | undefined
      let cancelado = false

      document.fonts.ready.then(() => {
        if (cancelado) return

        split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line-reveal__line',
          lineThreshold: 0.1,
        })

        gsap.set(split.lines, { yPercent: 100 })
        tween = gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          delay,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        })
      })

      return () => {
        cancelado = true
        tween?.scrollTrigger?.kill()
        tween?.kill()
        split?.revert()
      }
    })

    return () => mediaQuery.revert()
  }, [delay])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
