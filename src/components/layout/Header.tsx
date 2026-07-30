import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
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
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [sobrePortada, setSobrePortada] = useState(false)
  const [oculta, setOculta] = useState(false)

  useEffect(() => {
    /* La portada se busca en cada scroll y no una sola vez: al navegar entre
       páginas el mismo Header sobrevive y el elemento cambia. */
    const onScroll = () => {
      const portada = document.querySelector('.hero-zoom')
      setSobrePortada(portada !== null)

      if (portada) {
        /* El escenario está pegado mientras el final de la sección quede por
           debajo del borde inferior. Cuando lo alcanza, se despega y la
           portada empieza a subir: es el momento de retirar la cabecera.

           La comprobación de altura evita que la cabecera arranque escondida:
           en el primer fotograma la portada puede medir todavía cero y la
           comparación saldría cierta sin haber movido nada. */
        const caja = portada.getBoundingClientRect()
        setOculta(caja.height > 0 && caja.bottom <= window.innerHeight)
        setSolid(false)
        return
      }

      setOculta(false)
      setSolid(window.scrollY > 80)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

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
        `${sobrePortada ? 'is-over-hero' : ''} ${oculta && !open ? 'is-hidden' : ''}`
      }
    >
      <div className="site-header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          {/* El sello va como símbolo, sin texto alternativo: el nombre ya está
              escrito al lado y repetirlo lo haría sonar dos veces al lector. */}
          <img className="brand-mark" src="/images/logo-kavan.png" alt="" width="512" height="512" />
          <span className="brand-name">Kavan</span>
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
