import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import { Magnetic } from '../fx/Magnetic'
import './Footer.css'

const legal = [
  { label: 'Condiciones', to: '/condiciones' },
  { label: 'Privacidad', to: '/privacidad' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'Insolvencia', to: '/insolvencia' },
  { label: 'Créditos', to: '/creditos' },
]

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M14 8.5V11h2.4l-.4 2.6H14V21h-3v-7.4H9V11h2V8.8C11 6.6 12.2 5 15 5c.8 0 1.6.1 1.6.1V7.4H15.4c-.9 0-1.4.5-1.4 1.1Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="2.5" y="6" width="19" height="12" rx="3.2" />
        <path d="M10.2 9.4v5.2L15.4 12Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-statement">Marruecos a tu medida</p>
        <nav className="footer-socials" aria-label="Redes sociales">
          {socials.map((s) => (
            <Magnetic key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                {s.icon}
              </a>
            </Magnetic>
          ))}
        </nav>
        <nav className="footer-legal" aria-label="Enlaces legales">
          {legal.map((l) => (
            <Link key={l.label} to={l.to} onClick={lockNav}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
