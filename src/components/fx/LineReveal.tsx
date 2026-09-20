import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useEscena } from './ScrollScene'
import './LineReveal.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

type Props = {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
  id?: string
}

/**
 * Puerto de Copy.jsx (Greyloom): cada renglón sube desde debajo de su máscara.
 * Suelto, dispara cuando el propio texto llega a `top 75%`. Dentro de una
 * `ScrollScene` cede el mando: los renglones se apuntan a la escena y es el
 * scroll quien los sube. Sin espera a fuentes: si se retrasa el split, el
 * lector ve el texto quieto y el gesto ya no existe.
 */
export function LineReveal({ children, delay = 0, as: Tag = 'div', className, id }: Props) {
  const ref = useRef<HTMLElement>(null)
  const escena = useEscena()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line-reveal__line',
      lineThreshold: 0.1,
    })

    const textIndent = window.getComputedStyle(el).textIndent
    const firstLine = split.lines[0] as HTMLElement | undefined
    if (textIndent && textIndent !== '0px' && firstLine) {
      firstLine.style.paddingLeft = textIndent
      el.style.textIndent = '0'
    }

    if (escena) {
      const soltar = escena.registrar({ targets: split.lines, delay })
      return () => {
        soltar()
        split.revert()
        el.style.textIndent = ''
      }
    }

    gsap.set(split.lines, { yPercent: 100 })
    const tween = gsap.to(split.lines, {
      yPercent: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        once: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      split.revert()
      el.style.textIndent = ''
    }
  }, [delay, escena])

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  )
}
