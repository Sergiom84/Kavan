import { useEffect, useState } from 'react'
import './Preloader.css'

/**
 * Pantalla de carga con contador, como la de la referencia.
 *
 * A diferencia del original, aquí no bloquea nada: la página ya está montada
 * detrás y el velo se retira solo. El sitio de Horizonte espera a precargar
 * ~200 imágenes antes de mostrar nada, y ese es su mayor problema de
 * rendimiento; no merece la pena copiarlo.
 */
export function Preloader() {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }

    let current = 0
    const timer = window.setInterval(() => {
      current = Math.min(100, current + Math.random() * 18 + 8)
      setPct(current)
      if (current >= 100) {
        window.clearInterval(timer)
        window.setTimeout(() => setHidden(true), 220)
        // Se saca del árbol tras la transición para que no quede capturando
        // clics ni repintando.
        window.setTimeout(() => setGone(true), 1050)
      }
    }, 150)

    return () => window.clearInterval(timer)
  }, [])

  if (gone) return null

  return (
    <div className={`preloader ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <div className="preloader-mark">
        <svg viewBox="0 0 100 100" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="50" r="34" />
          <line x1="38" y1="16" x2="38" y2="84" />
          <line x1="62" y1="16" x2="62" y2="84" />
          <line x1="38" y1="50" x2="62" y2="50" />
        </svg>
      </div>

      <div className="preloader-bar">
        <span style={{ width: `${pct}%` }} />
      </div>

      <p className="preloader-pct label">Cargando… {Math.floor(pct)}%</p>
    </div>
  )
}
