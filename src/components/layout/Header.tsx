import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import './Header.css'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/packs', label: 'Packs' },
  { to: '/destinos', label: 'Destinos' },
  { to: '/puntos-de-interes', label: 'Puntos de interés' },
  { to: '/consejos', label: 'Consejos' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            Kavan
            <small>Viajes a Marruecos</small>
          </span>
        </Link>

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
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

        <button
          className="nav-toggle"
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
