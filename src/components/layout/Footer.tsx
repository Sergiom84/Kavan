import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './Footer.css'

const legal = [
  { label: 'Condiciones', to: '/condiciones' },
  { label: 'Privacidad', to: '/privacidad' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'Insolvencia', to: '/insolvencia' },
  { label: 'Créditos', to: '/creditos' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-statement">Marruecos a tu medida</p>
        <nav className="footer-legal" aria-label="Enlaces legales">
          {legal.map((l) => (
            <Link key={l.label} to={l.to} onClick={lockNav}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
