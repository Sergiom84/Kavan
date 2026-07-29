import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { formatPrice } from '../../lib/pricing'
import { Pic } from '../ui/Pic'
import { cities } from '../../data/seed'
import './PackCard.css'

type Props = {
  pack: Pack
  showCities?: boolean
  /** Panel deslizante sobre la fotografía en lugar de texto debajo (wireframe 1). */
  overlay?: boolean
}

/** Tarjeta de pack (wireframes 1, 4 y 6). Enlaza a la página hub del pack (11). */
export function PackCard({ pack, showCities = true, overlay = false }: Props) {
  const cityNames = pack.citySlugs
    .map((s) => cities.find((c) => c.slug === s)?.name)
    .filter(Boolean)
    .join(' · ')

  return (
    <Link to={`/packs/${pack.slug}`} className={`pack-card ${overlay ? 'pack-card--overlay' : ''}`}>
      <div className="pack-card-media">
        {/* La capa de fondo sobresale por los cuatro lados: heredado del
            encuadre original, ahora sin desplazamiento. */}
        <div className="pack-card-bg">
          <Pic src={pack.heroImageUrl} alt={pack.title} />
        </div>

        {/* Precio en reposo. Con panel, queda cubierto al subir éste, que lo
            recoge arriba: el precio nunca desaparece. */}
        <span className="pack-card-tag">Desde {formatPrice(pack.priceFrom)}</span>

        {overlay && (
          <div className="pack-card-panel">
            <div className="pack-card-panel-top">
              {/* El precio ya lo anuncia la pastilla: aquí es la misma cifra
                  en otra posición, no un dato nuevo. */}
              <span className="pack-card-panel-price" aria-hidden="true">
                Desde {formatPrice(pack.priceFrom)}
              </span>
              {/* La referencia pone la hora al otro extremo de esta fila. Los
                  packs no tienen hora de salida todavía: queda el hueco. */}
              {/* <span className="pack-card-panel-time">08:00</span> */}
            </div>

            <p className="pack-card-panel-caption">{pack.subtitle}</p>

            {showCities && (
              <p className="pack-card-panel-cities">
                <span className="label">Visitando</span>
                <strong>{cityNames}</strong>
              </p>
            )}
          </div>
        )}

        {/* La línea interior va en su propia capa y por encima del panel: es
            el marco de la tarjeta, no del contenido. */}
        <span className="pack-card-inline" aria-hidden="true" />
      </div>

      <div className="pack-card-body">
        <h3 className="pack-card-title">{pack.title}</h3>

        {/* Con panel, el subtítulo y las ciudades ya viven dentro de la foto. */}
        {!overlay && (
          <>
            <p className="pack-card-subtitle">{pack.subtitle}</p>
            {showCities && (
              <p className="pack-card-cities">
                <span className="label">Visitando</span>
                <strong>{cityNames}</strong>
              </p>
            )}
          </>
        )}
      </div>
    </Link>
  )
}
