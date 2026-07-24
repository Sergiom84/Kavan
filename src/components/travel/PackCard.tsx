import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { formatPrice } from '../../lib/pricing'
import { Pic } from '../ui/Pic'
import { cities } from '../../data/seed'
import './PackCard.css'

/** Tarjeta de pack (wireframes 1, 4 y 6). Enlaza a la página hub del pack (11). */
export function PackCard({ pack, showCities = true }: { pack: Pack; showCities?: boolean }) {
  const cityNames = pack.citySlugs
    .map((s) => cities.find((c) => c.slug === s)?.name)
    .filter(Boolean)
    .join(', ')

  return (
    <Link to={`/packs/${pack.slug}`} className="pack-card card">
      <div className="pack-card-media">
        <Pic src={pack.heroImageUrl} alt={pack.title} />
      </div>
      <div className="pack-card-body">
        <h3 className="pack-card-title">{pack.title}</h3>
        <p className="pack-card-subtitle">{pack.subtitle}</p>
        <div className="pack-card-price">
          <span className="label">Salida desde</span>
          <strong>{formatPrice(pack.priceFrom)}</strong>
        </div>
        {showCities && (
          <p className="pack-card-cities">
            <span className="label">Visitando</span>
            {cityNames}
          </p>
        )}
      </div>
    </Link>
  )
}
