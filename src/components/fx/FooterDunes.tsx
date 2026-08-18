import { useEffect, useRef } from 'react'
import { DunesShader } from './DunesShader'
import './FooterDunes.css'

/** Duna animada del cierre. Fuera de pantalla o sin soporte queda el pie estático. */
export function FooterDunes() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches
    ) return

    const dunas = new DunesShader({ container: host, escala: 0.42 })
    if (!dunas.listo) {
      dunas.destroy()
      return
    }

    const observador = new IntersectionObserver(
      ([entrada]) => (entrada.isIntersecting ? dunas.arrancar() : dunas.detener()),
      { threshold: 0.05 },
    )
    observador.observe(host)

    return () => {
      observador.disconnect()
      dunas.destroy()
    }
  }, [])

  return <div className="footer-dunes" ref={hostRef} aria-hidden="true" />
}
