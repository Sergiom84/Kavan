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
  const [tapa, setTapa] = useState(false)
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
    const nodos = ['.site-footer', '.mmap']
      .map((sel) => document.querySelector(sel))
      .filter((n): n is Element => Boolean(n))
    if (!nodos.length) return

    const visto = new Map<Element, boolean>()
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) visto.set(entrada.target, entrada.isIntersecting)
        setTapa([...visto.values()].some(Boolean))
      },
      { threshold: 0.12 },
    )
    nodos.forEach((nodo) => observador.observe(nodo))
    return () => observador.disconnect()
  }, [pathname])

  useEffect(() => {
    if (!visible || tapa) setOpen(false)
  }, [visible, tapa])

  if (!visible || tapa) return null

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
        <span className="advisor-medallion" aria-hidden="true">
          <span className="advisor-logo" />
        </span>
        <span className="advisor-claim">Te asesoramos</span>
      </button>
    </div>
  )
}
