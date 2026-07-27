import { useEffect, useRef, useState } from 'react'
import './FullGallery.css'

export type Foto = { src: string; alt: string; pie: string }

type Props = {
  fotos: Foto[]
  /** Milisegundos entre avances. Sin valor, no se mueve sola. */
  auto?: number
}

/**
 * Galería a sangre: una fotografía por pantalla.
 *
 * Medida sobre la referencia (sección `features` de Horizonte Village): cada
 * diapositiva ocupa el 100% del ancho y del alto del viewport con la imagen
 * recortada a `cover`, el contador va abajo a la izquierda con el número en
 * cuerpo de titular y el total a la mitad, y las flechas abajo a la derecha.
 *
 * El desplazamiento es scroll con anclaje, no un `transform` sobre un carril:
 * así se puede arrastrar con el dedo sin escribir nada para el táctil, y el
 * número activo se deduce de la posición real en vez de un estado paralelo que
 * se pueda desincronizar.
 */
export function FullGallery({ fotos, auto }: Props) {
  const carrilRef = useRef<HTMLDivElement>(null)
  const [activa, setActiva] = useState(0)

  // El índice se lee del scroll: es la única fuente de verdad.
  useEffect(() => {
    const carril = carrilRef.current
    if (!carril) return

    const alScroll = () => {
      const i = Math.round(carril.scrollLeft / carril.clientWidth)
      setActiva(Math.max(0, Math.min(fotos.length - 1, i)))
    }
    carril.addEventListener('scroll', alScroll, { passive: true })
    return () => carril.removeEventListener('scroll', alScroll)
  }, [fotos.length])

  const irA = (i: number) => {
    const carril = carrilRef.current
    if (!carril) return
    const destino = (i + fotos.length) % fotos.length
    carril.scrollTo({ left: destino * carril.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const carril = carrilRef.current
    if (!auto || !carril) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let parado = false
    const parar = () => {
      parado = true
    }
    const seguir = () => {
      parado = false
    }
    carril.addEventListener('pointerenter', parar)
    carril.addEventListener('pointerleave', seguir)
    carril.addEventListener('focusin', parar)
    carril.addEventListener('focusout', seguir)

    /* Fuera de pantalla tampoco avanza: si no, al llegar a la galería estaría
       en una foto cualquiera en vez de en la primera. */
    let visible = false
    const observador = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.4,
    })
    observador.observe(carril)

    const timer = window.setInterval(() => {
      if (parado || !visible || document.hidden) return
      const i = Math.round(carril.scrollLeft / carril.clientWidth)
      carril.scrollTo({ left: ((i + 1) % fotos.length) * carril.clientWidth, behavior: 'smooth' })
    }, auto)

    return () => {
      window.clearInterval(timer)
      observador.disconnect()
      carril.removeEventListener('pointerenter', parar)
      carril.removeEventListener('pointerleave', seguir)
      carril.removeEventListener('focusin', parar)
      carril.removeEventListener('focusout', seguir)
    }
  }, [auto, fotos.length])

  const dos = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="fgal">
      <div className="fgal-track" ref={carrilRef}>
        {fotos.map((f, i) => (
          <div className="fgal-slide" key={f.src}>
            <img
              src={f.src}
              alt={f.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className="fgal-scrim" />

      <div className="fgal-bar">
        <div className="fgal-count">
          <span className="fgal-count-now">{dos(activa + 1)}</span>
          <span className="fgal-count-all">/ {dos(fotos.length)}</span>
          <span className="fgal-place label">{fotos[activa]?.pie}</span>
        </div>

        <div className="fgal-arrows">
          <button className="fgal-arrow" aria-label="Anterior" onClick={() => irA(activa - 1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button className="fgal-arrow" aria-label="Siguiente" onClick={() => irA(activa + 1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
