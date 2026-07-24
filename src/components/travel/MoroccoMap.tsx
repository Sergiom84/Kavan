import { useState } from 'react'
import { Link } from 'react-router'
import { useCities } from '../../queries/hooks'
import { Pic } from '../ui/Pic'
import './MoroccoMap.css'

/* ---------------------------------------------------------------------------
   Mapa real de Marruecos con las ciudades del catálogo.

   Las chinchetas se colocan por coordenadas geográficas de verdad, no a ojo:
   se proyectan sobre el recuadro del mapa con una regla lineal. Así, si mañana
   se añade una ciudad, basta con meter su latitud y longitud.
--------------------------------------------------------------------------- */

/** Recuadro del mapa, en grados. */
const BOUNDS = { west: -10.5, east: -3.5, south: 29.5, north: 36 }

const toX = (lon: number) => ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100
const toY = (lat: number) => ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * 100

/* Coordenadas reales de las ciudades del catálogo.

   `arriba` sube el rótulo por encima del punto. Hace falta donde dos ciudades
   caen juntas de verdad: Agafay está a 30 km de Marrakech, así que sus
   rótulos se pisarían si ambos colgasen hacia abajo. */
const COORDS: Record<string, { lat: number; lon: number; arriba?: boolean }> = {
  merzouga: { lat: 31.1, lon: -4.01 },
  erfoud: { lat: 31.44, lon: -4.24, arriba: true },
  ouarzazate: { lat: 30.93, lon: -6.94 },
  agafay: { lat: 31.45, lon: -8.3 },
  marrakech: { lat: 31.63, lon: -8.01, arriba: true },
  essaouira: { lat: 31.51, lon: -9.77, arriba: true },
}

/** Referencias que sitúan al viajero, sin enlace. */
const REFERENCIAS = [
  { name: 'Tánger', lat: 35.76, lon: -5.83 },
  { name: 'Rabat', lat: 34.02, lon: -6.84 },
  { name: 'Casablanca', lat: 33.57, lon: -7.59 },
  { name: 'Fez', lat: 34.03, lon: -5.0 },
  { name: 'Agadir', lat: 30.42, lon: -9.6 },
]

/* Contorno de Marruecos, proyectado al viewBox de 1000 x 620. Va de Tánger
   por el Mediterráneo hacia el este, baja por el borde y vuelve subiendo la
   costa atlántica: Agadir, Essaouira, Safi, El Jadida, Casablanca, Rabat. */
const CONTORNO =
  'M667,23 L733,39 L938,71 L1000,86 L1000,620 L43,620 ' +
  'L86,582 L129,532 L93,443 L104,428 L180,353 L210,312 L284,262 ' +
  'L416,232 L446,220 L523,189 L560,166 L621,77 L639,50 Z'

export function MoroccoMap() {
  const { data: cities } = useCities()
  const [activa, setActiva] = useState<string | null>(null)

  const conCoords = (cities ?? []).filter((c) => COORDS[c.slug])
  const ciudadActiva = conCoords.find((c) => c.slug === activa)

  return (
    <section className="mmap">
      <div className="container mmap-head">
        <span className="label">Marruecos te ofrece</span>
        <span className="label mmap-region">Del Atlántico al Sáhara</span>
      </div>

      <div className="container">
        <div className="mmap-canvas" onMouseLeave={() => setActiva(null)}>
          <svg className="mmap-shape" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            <path d={CONTORNO} />
          </svg>

          {REFERENCIAS.map((r) => (
            <span
              key={r.name}
              className="mmap-ref label"
              style={{ left: `${toX(r.lon)}%`, top: `${toY(r.lat)}%` }}
            >
              {r.name}
            </span>
          ))}

          {conCoords.map((c) => {
            const { lat, lon, arriba } = COORDS[c.slug]
            return (
              <Link
                key={c.slug}
                to={`/destinos/${c.slug}`}
                className={`mmap-pin ${arriba ? 'mmap-pin--arriba' : ''} ${activa === c.slug ? 'is-active' : ''}`}
                style={{ left: `${toX(lon)}%`, top: `${toY(lat)}%` }}
                onMouseEnter={() => setActiva(c.slug)}
                onFocus={() => setActiva(c.slug)}
              >
                <span className="mmap-dot" aria-hidden="true" />
                <span className="mmap-name">{c.name}</span>
              </Link>
            )
          })}

          {/* Vista previa de la ciudad señalada */}
          <div className={`mmap-preview ${ciudadActiva ? 'is-visible' : ''}`} aria-hidden={!ciudadActiva}>
            {ciudadActiva && (
              <>
                <div className="frame mmap-preview-photo">
                  <Pic src={ciudadActiva.heroImageUrl} alt="" />
                </div>
                <h3>{ciudadActiva.name}</h3>
                <p>{ciudadActiva.shortDescription}</p>
                <span className="label mmap-preview-cta">Ver la ciudad</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Listado accesible y utilizable con el teclado o desde el móvil */}
      <div className="container">
        <ul className="mmap-list">
          {conCoords.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/destinos/${c.slug}`}
                onMouseEnter={() => setActiva(c.slug)}
                onFocus={() => setActiva(c.slug)}
              >
                <span className="label">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
