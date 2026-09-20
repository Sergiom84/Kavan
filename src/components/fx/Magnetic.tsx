import { cloneElement, useLayoutEffect, useRef, type ReactElement, type Ref } from 'react'
import gsap from 'gsap'

type Props = {
  /** Un único hijo que acepte `ref`. */
  children: ReactElement<{ ref?: Ref<HTMLElement> }>
  /** Cuánto se deja arrastrar por el cursor. 1 = lo sigue a la par. */
  fuerza?: number
}

/**
 * El elemento se deja atraer por el cursor mientras está encima y vuelve a su
 * sitio con un rebote elástico al salir.
 *
 * Puerto del efecto magnético de referencia (Animaster, Physics Effects 3). Se
 * añade lo que el original no trae: `quickTo` creado y destruido con el
 * componente, escuchas retiradas al desmontar, y renuncia silenciosa con
 * `prefers-reduced-motion` —el elemento se queda quieto y sigue funcionando—.
 */
export function Magnetic({ children, fuerza = 1 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Un dedo no tiene posición sobre el elemento: no hay nada que seguir.
    if (!window.matchMedia('(hover: hover)').matches) return

    const aX = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' })
    const aY = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' })

    const seguir = (e: MouseEvent) => {
      const { height, width, left, top } = el.getBoundingClientRect()
      aX((e.clientX - (left + width / 2)) * fuerza)
      aY((e.clientY - (top + height / 2)) * fuerza)
    }
    const soltar = () => {
      aX(0)
      aY(0)
    }

    el.addEventListener('mousemove', seguir)
    el.addEventListener('mouseleave', soltar)

    return () => {
      el.removeEventListener('mousemove', seguir)
      el.removeEventListener('mouseleave', soltar)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [fuerza])

  return cloneElement(children, { ref })
}
