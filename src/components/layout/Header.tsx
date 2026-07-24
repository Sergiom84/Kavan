import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import './Header.css'

/* Navegación del wireframe. `boxed` marca el enlace que va en caja, como el
   botón de "Elegir viaje".

   Nota: /nosotros y /contacto todavía no existen como páginas. Hasta que se
   creen, "Nosotros" apunta a Consejos y "Contacto" abre el correo. */
const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/packs', label: 'Packs', boxed: true },
  { to: '/destinos', label: 'Destinos' },
  { to: '/consejos', label: 'Nosotros' },
]

/**
 * Cabecera del wireframe: marca a la izquierda, navegación y menú a la
 * derecha. Sobre la portada va en claro y sin fondo; al abandonarla pasa a
 * crema opaco.
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
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-name">Kavan</span>
          <span className="brand-tag label">Viajes a Marruecos</span>
        </Link>

        <div className="site-header-right">
          <nav className="site-nav">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${l.boxed ? 'nav-boxed' : ''} ${isActive ? 'is-active' : ''}`
                }
              >
                <span className="label">{l.label}</span>
              </NavLink>
            ))}
            <a href="mailto:info@kavanviajes.com" onClick={() => setOpen(false)}>
              <span className="label">Contacto</span>
            </a>
          </nav>

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
          </button>
        </div>
      </div>

      {/* Panel a pantalla completa para móvil y para el botón de menú */}
      <nav className="site-menu">
        {links.map((l) => (
          <NavLink
            key={l.label}
            to={l.to}
            end={l.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => (isActive ? 'is-active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/puntos-de-interes" onClick={() => setOpen(false)}>
          Puntos de interés
        </NavLink>
        <a href="mailto:info@kavanviajes.com" onClick={() => setOpen(false)}>
          Contacto
        </a>
      </nav>
    </header>
  )
}
