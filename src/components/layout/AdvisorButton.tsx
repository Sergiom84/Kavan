import { useState } from 'react'
import './AdvisorButton.css'

export function AdvisorButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="advisor">
      {open && (
        <div className="advisor-menu">
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noreferrer"
            className="advisor-option"
          >
            WhatsApp
          </a>
          <a href="mailto:info@kavanviajes.com" className="advisor-option">
            Correo
          </a>
        </div>
      )}
      <button
        className="advisor-toggle"
        aria-expanded={open}
        aria-label="Te asesoramos"
        onClick={() => setOpen((v) => !v)}
      >
        <img
          className="advisor-logo"
          src="/images/logo-kavan.png"
          alt=""
        />
      </button>
    </div>
  )
}
