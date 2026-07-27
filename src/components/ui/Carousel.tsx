import { useEffect, useRef, type ReactNode } from 'react'
import './Carousel.css'

type Props = {
  children: ReactNode
  className?: string
  /** Controles al pie. Se quitan donde el carril se recorre a mano. */
  arrows?: boolean
  /** Milisegundos entre avances. Sin valor, el carrusel no se mueve solo. */
  auto?: number
}

/** Carrusel horizontal: el carril ocupa todo el ancho y los controles van al pie. */
export function Carousel({ children, className, arrows = true, auto }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const desplazar = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('.carousel-item')
    const hueco = parseFloat(getComputedStyle(track).columnGap) || 0
    const paso = card ? card.offsetWidth + hueco : track.clientWidth / 3
    track.scrollBy({ left: dir * paso, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!auto || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let parado = false
    const parar = () => {
      parado = true
    }
    const seguir = () => {
      parado = false
    }

    /* Se detiene mientras el puntero está encima o algo tiene el foco dentro:
       si no, el carril se mueve justo cuando alguien va a pulsar. */
    track.addEventListener('pointerenter', parar)
    track.addEventListener('pointerleave', seguir)
    track.addEventListener('focusin', parar)
    track.addEventListener('focusout', seguir)

    const timer = window.setInterval(() => {
      // En segundo plano no tiene sentido avanzar.
      if (parado || document.hidden) return

      /* Al llegar al final vuelve al principio. El margen de 2px absorbe los
         decimales del scroll, que nunca cuadra al píxel exacto. */
      const fin = track.scrollWidth - track.clientWidth - track.scrollLeft <= 2
      if (fin) track.scrollTo({ left: 0, behavior: 'smooth' })
      else desplazar(1)
    }, auto)

    return () => {
      window.clearInterval(timer)
      track.removeEventListener('pointerenter', parar)
      track.removeEventListener('pointerleave', seguir)
      track.removeEventListener('focusin', parar)
      track.removeEventListener('focusout', seguir)
    }
  }, [auto])

  return (
    <div className={`carousel ${className ?? ''}`}>
      <div className="carousel-track" ref={trackRef}>
        {children}
      </div>

      {arrows && (
        <div className="carousel-nav">
          <button className="carousel-arrow" aria-label="Anterior" onClick={() => desplazar(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button className="carousel-arrow" aria-label="Siguiente" onClick={() => desplazar(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
