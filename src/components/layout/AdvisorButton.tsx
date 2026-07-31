import { useEffect, useState } from 'react'
import './AdvisorButton.css'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* El efecto: brújula flotante con sol, dunas y una aguja que gira. Cada frase
   trae su propio ángulo, calibrado en Lab-FX para que la aguja nunca invada la
   zona del texto. */
const FRASES = [
  '¿Dónde quieres despertar?',
  'Encuentra tu ruta',
  'Diseñamos tu viaje',
  'Pregúntale a la brújula',
]
const ANGULOS = [24, -30, 38, -42]
const RITMO = 3200
const RETARDO_CAMBIO = 220

export function AdvisorButton() {
  const [open, setOpen] = useState(false)
  const [indice, setIndice] = useState(0)
  const [cambiando, setCambiando] = useState(false)

  useEffect(() => {
    if (reduced()) return
    let salida: number | undefined
    const ritmo = window.setInterval(() => {
      setCambiando(true)
      salida = window.setTimeout(() => {
        setIndice((i) => (i + 1) % FRASES.length)
        setCambiando(false)
      }, RETARDO_CAMBIO)
    }, RITMO)
    return () => {
      window.clearInterval(ritmo)
      window.clearTimeout(salida)
    }
  }, [])

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
      {/* El rótulo accesible es fijo: la frase que rota es decorativa y no
          debe leerse como si el botón cambiase de función cada 3 segundos. */}
      <button
        className="advisor-toggle"
        aria-expanded={open}
        aria-label="Te asesoramos"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="advisor-highlight" aria-hidden="true" />

        <span className="advisor-scene" aria-hidden="true">
          <span className="advisor-sun" />
          <span className="advisor-dune-back" />
          <span className="advisor-dune-front" />
        </span>

        <span
          className="advisor-needle-system"
          style={{ transform: `rotate(${ANGULOS[indice]}deg)` }}
          aria-hidden="true"
        >
          <span className="advisor-needle" />
          <span className="advisor-needle-center" />
        </span>

        <span className="advisor-shine" aria-hidden="true" />

        <span className="advisor-text-zone" aria-hidden="true">
          <span className={`advisor-phrase ${cambiando ? 'is-changing' : ''}`}>
            {FRASES[indice]}
          </span>
        </span>
      </button>
    </div>
  )
}
