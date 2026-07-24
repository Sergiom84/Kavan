import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { formatPrice } from '../../lib/pricing'
import { Pic } from '../ui/Pic'
import { cities } from '../../data/seed'
import './PackCard.css'

/* El original gira hasta 15° por eje. Aquí las tarjetas son bastante más
   grandes que las suyas de 240px, y a ese tamaño 15° se siente brusco: se
   queda en 7°, que es donde el gesto resulta suave. El desplazamiento del
   fondo en sentido contrario sí se mantiene generoso, porque es lo que da la
   sensación de profundidad. */
const GIRO = 14 // grados sobre el recorrido completo, ±7 desde el centro
const DESPLAZAMIENTO = 26 // px sobre el recorrido completo, ±13 desde el centro

/** Al salir, el original espera un segundo antes de devolver la tarjeta. */
const RETARDO_SALIDA = 1000

/** Tarjeta de pack (wireframes 1, 4 y 6). Enlaza a la página hub del pack (11). */
export function PackCard({ pack, showCities = true }: { pack: Pack; showCities?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const salidaRef = useRef<number | undefined>(undefined)

  const cityNames = pack.citySlugs
    .map((s) => cities.find((c) => c.slug === s)?.name)
    .filter(Boolean)
    .join(' · ')

  const aplicar = (px: number, py: number) => {
    const card = cardRef.current
    const bg = bgRef.current
    if (!card || !bg) return
    card.style.transform = `rotateY(${px * GIRO}deg) rotateX(${py * -GIRO}deg)`
    bg.style.transform = `translate(${px * -DESPLAZAMIENTO}px, ${py * -DESPLAZAMIENTO}px)`
  }

  /* El giro se calcula desde el centro de la tarjeta: -0,5 en el borde
     izquierdo y +0,5 en el derecho. Se escribe directo en el elemento para
     que lo resuelva el compositor, sin volver a maquetar en cada movimiento. */
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card || e.pointerType !== 'mouse') return
    const r = card.getBoundingClientRect()
    aplicar((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5)
  }

  const onPointerEnter = () => window.clearTimeout(salidaRef.current)

  const onPointerLeave = () => {
    salidaRef.current = window.setTimeout(() => aplicar(0, 0), RETARDO_SALIDA)
  }

  return (
    <Link to={`/packs/${pack.slug}`} className="pack-card">
      <div
        className="pack-card-stage"
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <div className="pack-card-media" ref={cardRef}>
          {/* La capa de fondo sobresale por los cuatro lados para que al
              desplazarse nunca asome el borde. */}
          <div className="pack-card-bg" ref={bgRef}>
            <Pic src={pack.heroImageUrl} alt={pack.title} />
          </div>
          {/* La línea interior va en su propia capa. En el original se ve a
              través de un fondo al 50%, pero eso apagaría la fotografía. */}
          <span className="pack-card-inline" aria-hidden="true" />
          <span className="pack-card-tag">Desde {formatPrice(pack.priceFrom)}</span>
        </div>
      </div>

      <div className="pack-card-body">
        <h3 className="pack-card-title">{pack.title}</h3>
        <p className="pack-card-subtitle">{pack.subtitle}</p>
        {showCities && (
          <p className="pack-card-cities">
            <span className="label">Visitando</span>
            <strong>{cityNames}</strong>
          </p>
        )}
      </div>
    </Link>
  )
}
