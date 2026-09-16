import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './HomeQuickLinks.css'

const LINKS = [
  {
    to: '/packs',
    label: 'Planea tu viaje',
    description: 'Programa tu viaje para que se adapte a ti y calcula el precio final.',
    cta: 'Presupuesto online',
  },
  {
    to: '/contacto',
    label: '¿Te ayudamos?',
    description: 'Ponte en contacto con nosotros y encuentra el viaje que imaginas.',
    cta: 'Contáctanos',
  },
  {
    to: '/consejos',
    label: 'Requisitos de viaje',
    description: 'Obtén información actualizada sobre requisitos de viaje, visados, vacunas y otra información de interés.',
    cta: 'Acceder',
  },
]

/** Tres accesos comerciales de la portada. */
export function HomeQuickLinks() {
  const video = useRef<HTMLVideoElement>(null)

  /* El bloque vive dentro del hero fijado y arranca en `visibility: hidden`.
     Chrome pausa el vídeo mientras está oculto y no siempre lo reanuda al
     mostrarse, así que se comprueba a intervalo largo y se reanuda cuando el
     elemento vuelve a ser visible. Un sondeo por segundo es más barato que
     observar los cambios de estilo que hace GSAP en el padre. */
  useEffect(() => {
    const el = video.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const reanudar = () => {
      if (!el.paused || el.ended) return
      if (getComputedStyle(el).visibility !== 'visible') return
      void el.play().catch(() => {})
    }

    reanudar()
    const id = window.setInterval(reanudar, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <nav className="home-quick-links" aria-label="Accesos principales">
      {/* El fondo es decorativo: el `poster` es la misma vista congelada, así
          que si el vídeo no arranca —datos ahorrados, movimiento reducido,
          autoplay bloqueado— el bloque se queda exactamente como estaba. */}
      <video
        ref={video}
        className="home-quick-links__video"
        src="/images/tarjetas-hero.mp4"
        poster="/images/tarjetas-hero.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <h2 className="sr-only">Accesos principales</h2>
      <div className="home-quick-links__grid">
        {LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={lockNav}
            className="home-quick-links__card"
          >
            <span className="home-quick-links__title">{item.label}</span>
            <span className="home-quick-links__description">{item.description}</span>
            <span className="home-quick-links__cta">{item.cta}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
