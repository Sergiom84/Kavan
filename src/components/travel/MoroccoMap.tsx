import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useCities } from '../../queries/hooks'
import { Pic } from '../ui/Pic'
import './MoroccoMap.css'

/* ---------------------------------------------------------------------------
   Mapa de Marruecos con las ciudades del catálogo.

   El mapa es una imagen: relieve, costa, rótulos y chinchetas vienen ya
   dibujados. Encima se colocan zonas activas invisibles, una por ciudad, que
   al señalarlas abren su ficha y al pulsarlas llevan a la página del destino.

   Las posiciones están medidas sobre la propia imagen (el vástago de cada
   chincheta) y van en porcentaje, así que aguantan cualquier tamaño de
   pantalla. Si se cambia la imagen del mapa hay que volver a medirlas.
--------------------------------------------------------------------------- */

const PUNTOS: Record<string, { x: number; y: number }> = {
  essaouira: { x: 44.7, y: 62.4 },
  marrakech: { x: 59.8, y: 60.7 },
  agafay: { x: 61.2, y: 67.0 },
  ouarzazate: { x: 69.6, y: 72.3 },
  erfoud: { x: 81.8, y: 65.3 },
  merzouga: { x: 85.4, y: 72.9 },
}

export function MoroccoMap() {
  const { data: cities } = useCities()
  const [activa, setActiva] = useState<string | null>(null)
  const lienzoRef = useRef<HTMLDivElement>(null)

  const conPunto = (cities ?? []).filter((c) => PUNTOS[c.slug])
  const ciudad = conPunto.find((c) => c.slug === activa)
  const punto = ciudad ? PUNTOS[ciudad.slug] : null

  /* Salir con el ratón cierra la ficha, pero en táctil no hay `mouseleave`: sin
     esto la ficha se quedaba abierta para siempre tras el primer toque. Pulsar
     fuera del mapa —o Escape— la cierra. `pointerdown` y no `click` para que
     responda antes de que el dedo levante. Sólo se escucha si hay ficha
     abierta, así que no cuelga un listener global de por vida. */
  useEffect(() => {
    if (!activa) return

    const fuera = (e: PointerEvent) => {
      if (!lienzoRef.current?.contains(e.target as Node)) setActiva(null)
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiva(null)
    }

    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [activa])

  return (
    <section className="mmap">
      <div className="mmap-canvas" ref={lienzoRef} onMouseLeave={() => setActiva(null)}>
        <img
          className="mmap-image"
          src="/images/mapa-kavan-alpha.webp"
          alt="Mapa de Marruecos con Essaouira, Marrakech, Agafay, Ouarzazate, Erfoud y Merzouga"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />

        {conPunto.map((c) => {
          const p = PUNTOS[c.slug]
          return (
            <Link
              key={c.slug}
              to={`/destinos/${c.slug}`}
              className={`mmap-hit ${activa === c.slug ? 'is-active' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onMouseEnter={() => setActiva(c.slug)}
              onFocus={() => setActiva(c.slug)}
              aria-label={`Ver ${c.name}`}
            >
              <span className="mmap-ring" aria-hidden="true" />
            </Link>
          )
        })}

        {/* Ficha de la ciudad señalada. Se apoya encima de la chincheta y se
            desplaza hacia dentro cuando la ciudad cae cerca de un borde. */}
        {ciudad && punto && (
          <div
            className="mmap-card"
            style={{
              left: `${Math.min(Math.max(punto.x, 14), 86)}%`,
              top: `${punto.y}%`,
            }}
          >
            <div className="frame mmap-card-photo">
              <Pic src={ciudad.heroImageUrl} alt="" />
            </div>
            <h3>{ciudad.name}</h3>
            <p>{ciudad.shortDescription}</p>
            <span className="label mmap-card-cta">Ver la ciudad</span>
          </div>
        )}
      </div>

      {/* Listado: el camino que funciona con teclado, con lector de pantalla
          y en móvil, donde las chinchetas quedan demasiado juntas. */}
      <div className="container">
        <ul className="mmap-list">
          {conPunto.map((c) => (
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
