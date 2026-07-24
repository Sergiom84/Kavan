import { useRef, type ReactNode } from 'react'
import './Carousel.css'

/** Carrusel horizontal con flechas: N tarjetas visibles, desplazamiento por tarjeta. */
export function Carousel({ children, className }: { children: ReactNode; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('.carousel-item')
    const step = card ? card.offsetWidth + 24 : track.clientWidth / 3
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className={`carousel ${className ?? ''}`}>
      <button className="carousel-arrow" aria-label="Anterior" onClick={() => scrollBy(-1)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <div className="carousel-track" ref={trackRef}>
        {children}
      </div>
      <button className="carousel-arrow" aria-label="Siguiente" onClick={() => scrollBy(1)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
