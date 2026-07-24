import { Link } from 'react-router'
import './Footer.css'

const legal = [
  { label: 'Contacto', to: '/#contacto' },
  { label: 'Condiciones generales', to: '/condiciones' },
  { label: 'Privacidad', to: '/privacidad' },
  { label: 'Política de cookies', to: '/cookies' },
  { label: 'Política de insolvencia', to: '/insolvencia' },
]

const MARQUEE_WORDS = ['Marruecos', 'Sáhara', 'Kasbahs', 'Dunas', 'Marrakech', 'Kavan']

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee-track">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i}>
              {w}
              <span className="footer-marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-title">Kavan</span>
            <p>Viajes a Marruecos diseñados a tu medida.</p>
          </div>
          <div className="footer-contact">
            <span className="label">Contacto</span>
            <a href="mailto:info@kavanviajes.com">info@kavanviajes.com</a>
            <a href="https://wa.me/34600000000" target="_blank" rel="noreferrer">
              WhatsApp +34 600 000 000
            </a>
          </div>
          <div className="footer-social">
            <span className="label">Síguenos</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
        <div className="footer-legal">
          {legal.map((l) => (
            <Link key={l.label} to={l.to}>{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
