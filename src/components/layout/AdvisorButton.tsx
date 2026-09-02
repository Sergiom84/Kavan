import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import {
  ADVISOR_VISIBILITY_EVENT,
  isAdvisorVisible,
} from '../../lib/advisorVisibility'
import './AdvisorButton.css'

export function AdvisorButton() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [visible, setVisible] = useState(() => !isHome)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isHome) {
      setVisible(true)
      return
    }

    const updateVisibility = (event: Event) => {
      const { visible: nextVisible } = (
        event as CustomEvent<{ visible: boolean }>
      ).detail
      setVisible(nextVisible)
    }

    window.addEventListener(ADVISOR_VISIBILITY_EVENT, updateVisibility)
    setVisible(isAdvisorVisible())

    return () => {
      window.removeEventListener(ADVISOR_VISIBILITY_EVENT, updateVisibility)
    }
  }, [isHome])

  useEffect(() => {
    if (!visible) setOpen(false)
  }, [visible])

  if (!visible) return null

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
