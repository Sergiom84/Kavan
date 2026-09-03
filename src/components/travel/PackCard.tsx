import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { formatPrice } from '../../lib/pricing'
import { lockNav } from '../../lib/demoLock'
import { Pic } from '../ui/Pic'
import { cities } from '../../data/seed'
import './PackCard.css'

type Props = {
  pack: Pack
  showCities?: boolean
  /** Panel deslizante sobre la fotografía en lugar de texto debajo (wireframe 1). */
  overlay?: boolean
  /** Tratamiento editorial de la portada: título en foto y datos siempre visibles debajo. */
  variant?: 'default' | 'home'
}

/** Tarjeta de pack (wireframes 1, 4 y 6). Enlaza a la página hub del pack (11). */
export function PackCard({ pack, showCities = true, overlay = false, variant = 'default' }: Props) {
  const isHome = variant === 'home'
  const hasOverlay = overlay && !isHome
  const cityNames = pack.citySlugs
    .map((s) => cities.find((c) => c.slug === s)?.name)
    .filter(Boolean)
    .join(' · ')
  /** El recorrido comercial manda; las ciudades del sistema son el respaldo. */
  const routeText = pack.routeLabel ?? cityNames
  const originCity = cities.find((c) => c.slug === pack.citySlugs[0])?.name ?? ''

  return (
    <Link
      to={`/packs/${pack.slug}`}
      onClick={lockNav}
      className={`pack-card ${hasOverlay ? 'pack-card--overlay' : ''} ${isHome ? 'pack-card--home' : ''}`}
    >
      <div className="pack-card-media">
        {/* La capa de fondo sobresale por los cuatro lados: heredado del
            encuadre original, ahora sin desplazamiento. */}
        <div className="pack-card-bg">
          <Pic src={pack.heroImageUrl} alt={pack.title} />
        </div>

        {/* Sobre la foto va la ciudad de salida, no el recorrido entero: con
            rutas de cuatro y cinco paradas el nombre ocupaba dos líneas. */}
        {isHome ? (
          <h3 className="pack-card-home-tag">{originCity}</h3>
        ) : (
          /* Precio en reposo. Con panel, queda cubierto al subir éste, que lo
             recoge arriba: el precio nunca desaparece. */
          <span className="pack-card-tag">Desde {formatPrice(pack.priceFrom)}</span>
        )}

        {hasOverlay && (
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
                <strong>{routeText}</strong>
              </p>
            )}
          </div>
        )}

        {/* La línea interior va en su propia capa y por encima del panel: es
            el marco de la tarjeta, no del contenido. */}
        {!isHome && <span className="pack-card-inline" aria-hidden="true" />}
      </div>

      <div className="pack-card-body">
        {!isHome && <h3 className="pack-card-title">{pack.title}</h3>}

        {isHome && (
          <>
            <p className="pack-card-home-description">{pack.subtitle}</p>
            <ul className="pack-card-home-meta" aria-label={`Datos de ${pack.title}`}>
              <li className="pack-card-home-duration">
                <span className="sr-only">Duración</span>
                <strong>{pack.days} días · {pack.nights} noches</strong>
              </li>
              <li className="pack-card-home-price">
                <span className="sr-only">Precio demo</span>
                <strong>Desde {formatPrice(pack.priceFrom)}</strong>
              </li>
              {showCities && (
                <li className="pack-card-home-zones">
                  <span className="sr-only">Recorrido</span>
                  <strong>{routeText}</strong>
                </li>
              )}
            </ul>
          </>
        )}

        {/* Con panel, el subtítulo y las ciudades ya viven dentro de la foto. */}
        {!hasOverlay && !isHome && (
          <>
            <p className="pack-card-subtitle">{pack.subtitle}</p>
            {showCities && (
              <p className="pack-card-cities">
                <span className="label">Visitando</span>
                <strong>{routeText}</strong>
              </p>
            )}
          </>
        )}
      </div>
    </Link>
  )
}
