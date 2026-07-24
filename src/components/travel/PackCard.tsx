import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { formatPrice } from '../../lib/pricing'
import { Pic } from '../ui/Pic'
import { cities } from '../../data/seed'
import './PackCard.css'

/** Inclinación máxima de la tarjeta, en grados. */
const TILT = 7

/** Tarjeta de pack (wireframes 1, 4 y 6). Enlaza a la página hub del pack (11). */
export function PackCard({ pack, showCities = true }: { pack: Pack; showCities?: boolean }) {
  const mediaRef = useRef<HTMLDivElement>(null)

  const cityNames = pack.citySlugs
    .map((s) => cities.find((c) => c.slug === s)?.name)
    .filter(Boolean)
    .join(' · ')

  /* La tarjeta se inclina siguiendo al cursor. El cálculo se escribe en
     variables CSS y es el CSS quien mueve la tarjeta: así el trabajo lo hace
     el compositor y no hay reflow en cada movimiento del ratón. */
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = mediaRef.current
    if (!el || e.pointerType !== 'mouse') return

    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width // 0 izquierda, 1 derecha
    const py = (e.clientY - r.top) / r.height // 0 arriba, 1 abajo

    el.style.setProperty('--rx', `${(0.5 - py) * TILT * 2}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * TILT * 2}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }

  const onPointerLeave = () => {
    const el = mediaRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <Link to={`/packs/${pack.slug}`} className="pack-card">
      <div className="pack-card-stage" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <div className="pack-card-media" ref={mediaRef}>
          <Pic src={pack.heroImageUrl} alt={pack.title} />
          {/* Filete por dentro del borde */}
          <span className="pack-card-inline" aria-hidden="true" />
          {/* Reflejo que sigue al cursor */}
          <span className="pack-card-sheen" aria-hidden="true" />
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
