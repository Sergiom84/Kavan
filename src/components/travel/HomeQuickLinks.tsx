import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './HomeQuickLinks.css'

/* Iconos de línea, dibujados sobre la retícula de 24. Geometría morisca —arco
   de herradura, lazo de ocho puntas— en lugar de pictogramas genéricos. Son
   decorativos: el rótulo de debajo ya nombra el acceso. */

const IconoRuta = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path d="M12 2.5 13.9 6l3.9.6-2.8 2.8.7 3.9L12 11.5 8.3 13.3l.7-3.9L6.2 6.6 10.1 6Z" />
    <path d="M12 14.5v7" />
    <path d="M8.5 21.5h7" />
  </svg>
)

const IconoConversacion = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path d="M4 10.5a6.5 6.5 0 0 1 13 0v6.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M8 11.5h5" />
    <path d="M8 15h3" />
  </svg>
)

const IconoDocumento = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path d="M6 21V7.5a4 4 0 0 1 8 0V21Z" />
    <path d="M6 21h12" />
    <path d="M14 12h4v9" />
    <path d="M9 11h2" />
  </svg>
)

const LINKS: {
  to: string
  label: string
  description: string
  cta: string
  icono: ReactNode
}[] = [
  {
    to: '/packs',
    label: 'Planea tu viaje',
    description: 'Programa tu viaje para que se adapte a ti y calcula el precio final.',
    cta: 'Presupuesto online',
    icono: IconoRuta,
  },
  {
    to: '/contacto',
    label: '¿Te ayudamos?',
    description: 'Ponte en contacto con nosotros y encuentra el viaje que imaginas.',
    cta: 'Contáctanos',
    icono: IconoConversacion,
  },
  {
    to: '/consejos',
    label: 'Requisitos de viaje',
    description: 'Obtén información actualizada sobre requisitos de viaje, visados, vacunas y otra información de interés.',
    cta: 'Acceder',
    icono: IconoDocumento,
  },
]

/** Tres accesos comerciales de la portada. */
export function HomeQuickLinks() {
  return (
    <nav className="home-quick-links" aria-label="Accesos principales">
      <h2 className="sr-only">Accesos principales</h2>
      <div className="home-quick-links__grid">
        {LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={lockNav}
            className="home-quick-links__card"
          >
            <span className="home-quick-links__icon">{item.icono}</span>
            <span className="home-quick-links__title">{item.label}</span>
            <span className="home-quick-links__description">{item.description}</span>
            <span className="home-quick-links__cta">{item.cta}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
