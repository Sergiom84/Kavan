import { useEffect, useState } from 'react'
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
  const [solid, setSolid] = useState(false)

  // Sobre el hero la cabecera va en claro; en cuanto se abandona, pasa a fondo sólido.
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
      <div className="container site-header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-name">Kavan</span>
          <span className="brand-tag">Viajes a Marruecos</span>
        </Link>

        <nav className="site-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
