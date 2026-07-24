import { Link } from 'react-router'
import type { City } from '../../lib/types'
import { Pic } from '../ui/Pic'
import './CityCard.css'

/** Tarjeta de ciudad/destino (wireframes 2, 5 y 11). Enlaza a la página de ciudad (3). */
export function CityCard({ city }: { city: City }) {
  return (
    <Link to={`/destinos/${city.slug}`} className="city-card card">
      <div className="city-card-media">
        <Pic src={city.heroImageUrl} alt={city.name} />
      </div>
      <div className="city-card-body">
        <h3>{city.name}</h3>
        <p>{city.shortDescription}</p>
      </div>
    </Link>
  )
}
