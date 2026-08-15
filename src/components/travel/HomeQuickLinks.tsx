import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './HomeQuickLinks.css'

const LINKS = [
  { to: '/packs', label: 'Packs' },
  { to: '/contacto', label: 'Te ayudamos' },
  { to: '/puntos-de-interes', label: 'Extras' },
]

/** Tres accesos comerciales de la portada, sin texto auxiliar. */
export function HomeQuickLinks() {
  return (
    <nav className="home-quick-links" aria-label="Accesos principales">
      <h2 className="sr-only">Accesos principales</h2>
      <div className="home-quick-links__grid">
        {LINKS.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={lockNav}
            className="home-quick-links__card"
          >
            <span className="label" aria-hidden="true">0{index + 1}</span>
            <span className="home-quick-links__title">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
