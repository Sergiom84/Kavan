import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './HomeQuickLinks.css'

const LINKS = [
  { to: '/packs', label: 'Packs', description: 'Viajes pensados para recorrer Marruecos sin prisa.' },
  { to: '/contacto', label: 'Te ayudamos', description: 'Una conversación para empezar a dibujar tu ruta.' },
  { to: '/puntos-de-interes', label: 'Extras', description: 'Pequeños desvíos que hacen el viaje más tuyo.' },
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
          </Link>
        ))}
      </div>
    </nav>
  )
}
