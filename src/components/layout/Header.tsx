import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import './Header.css'

const links = [
  { to: '/packs', label: 'Packs' },
  { to: '/destinos', label: 'Destinos' },
  { to: '/puntos-de-interes', label: 'Puntos de interés' },
  { to: '/consejos', label: 'Consejos' },
]

/**
 * Cabecera de tres zonas con el logotipo centrado, como en Horizonte:
 * a la izquierda el menú y las dos acciones principales, en el centro la
 * marca, y a la derecha el contacto. Sobre la portada va en claro y sin
 * fondo; en cuanto se abandona, pasa a crema opaco.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`site-header ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="site-header-inner">
        {/* Izquierda: menú + acciones */}
        <div className="site-header-left">
          <button
            className="menu-button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="label">Menú</span>
          </button>

          <Link to="/packs" className="header-cta" onClick={() => setOpen(false)}>
            <span className="label">Elegir viaje</span>
          </Link>

          <Link to="/destinos" className="header-link" onClick={() => setOpen(false)}>
            <span className="label">Mapa de destinos</span>
          </Link>
        </div>

        {/* Centro: la marca */}
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-name">Kavan</span>
        </Link>

        {/* Derecha: contacto */}
        <div className="site-header-right">
          <a href="tel:+34600000000" className="header-link">
            <span className="label">+34 600 000 000</span>
          </a>
          <span className="header-divider" aria-hidden="true" />
          <a href="mailto:info@kavanviajes.com" className="header-link">
            <span className="label">Contacto</span>
          </a>
        </div>
      </div>

      {/* Panel de navegación a pantalla completa */}
      <nav className="site-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? 'is-active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
