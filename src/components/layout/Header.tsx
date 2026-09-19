import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './Header.css'

/* Navegación del wireframe. `boxed` marca el enlace que va en caja, como el
   botón de "Elegir viaje". */
type NavLinkDef = { to: string; label: string; end?: boolean; boxed?: boolean }

const links: NavLinkDef[] = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/packs', label: 'Packs', boxed: true },
  { to: '/destinos', label: 'Destinos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

/* El resto de secciones vive en el panel del menú. */
const extra: NavLinkDef[] = [
  { to: '/consejos', label: 'Consejos' },
  { to: '/puntos-de-interes', label: 'Puntos de interés' },
]

/**
 * Cabecera del wireframe: marca a la izquierda, navegación y menú a la
 * derecha.
 *
 * Sobre una portada que se aleja con el scroll (la Home) se comporta como la
 * referencia: conserva el tono oscuro de la portada mientras se recorre y se
 * retira hacia arriba en cuanto la portada se despega y empieza a subir. En el
 * resto de páginas, que no tienen esa portada, pasa a crema opaco al salir del
 * hero, que es lo que se ve bien sobre fondo claro.
 */
export function Header() {
  const { pathname } = useLocation()
  const esHome = pathname === '/'
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [sobrePortada, setSobrePortada] = useState(esHome)

  useLayoutEffect(() => {
    let frame = 0

    /* En Home la ráfaga ya no se recorre: la portada mide una pantalla.
       La cabecera se queda sobre la fotografía hasta que esa pantalla
       empieza a subir; entonces pasa a papel opaco. */
    const onScroll = () => {
      if (esHome) {
        const portada = document.querySelector<HTMLElement>('.hero-split')
        const caja = portada?.getBoundingClientRect()
        const portadaLlena = !caja || caja.bottom >= window.innerHeight - 1
        const papel = portada?.classList.contains('hero-split--paper') ?? false

        setSobrePortada(portadaLlena && !papel)
        setSolid(!portadaLlena || papel)
        return
      }

      /* Fuera de Home la barra se queda a la vista: transparente sobre el
         hero y beige en cuanto el hero deja de cubrirla. */
      const portada = document.querySelector('.hero-zoom')
      if (portada) {
        const caja = portada.getBoundingClientRect()
        const sobre = caja.bottom > 72
        setSobrePortada(sobre)
        setSolid(!sobre)
        return
      }

      setSobrePortada(false)
      setSolid(window.scrollY > 80)
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        onScroll()
      })
    }

    onScroll()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [esHome, pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={
        `site-header ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''} ` +
        `${sobrePortada ? 'is-over-hero' : ''}`
      }
    >
      <div className="site-header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="sr-only">Kavan</span>
          <span className="brand-wordmark" aria-hidden="true" />
        </Link>

        <div className="site-header-right">
          <nav className="site-nav">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                onClick={(e) => {
                  lockNav(e)
                  setOpen(false)
                }}
                className={({ isActive }) =>
                  `${l.boxed ? 'nav-boxed' : ''} ${isActive ? 'is-active' : ''}`
                }
              >
                <span className="label">{l.label}</span>
              </NavLink>
            ))}
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
        {[...links, ...extra].map((l) => (
          <NavLink
            key={l.label}
            to={l.to}
            end={l.end}
            onClick={(e) => {
              lockNav(e)
              setOpen(false)
            }}
            className={({ isActive }) => (isActive ? 'is-active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
