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
            <span className="home-quick-links__title">{item.label}</span>
            <span className="home-quick-links__description">{item.description}</span>
            <span className="home-quick-links__cta">{item.cta}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
