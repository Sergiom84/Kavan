import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useCities } from '../../queries/hooks'
import { Pic } from '../ui/Pic'
import './MoroccoMap.css'

/* ---------------------------------------------------------------------------
   Mapa de Marruecos con las ciudades del catálogo.

   El mapa es una imagen: relieve, costa y rótulos de referencia (Tánger,
   Rabat, Casablanca, Fez, Agadir) vienen ya dibujados. El titular y las
   chinchetas SÍ son HTML: la versión anterior de la imagen traía el titular
   horneado en mayúsculas y, para poder ponerlo en su caso normal sin
   redibujar píxeles, Sergio reexportó el mapa sin ese texto
   (`mapa-kavan_2.png`, 2026-07-29) y aquí se reconstruye como texto real.

   Las posiciones de las chinchetas están medidas sobre la propia imagen (el
   vástago de cada una, por análisis de píxeles) y van en porcentaje, así que
   aguantan cualquier tamaño de pantalla. Si se cambia la imagen del mapa hay
   que volver a medirlas.
--------------------------------------------------------------------------- */

const TITULO = 'Ubicación privilegiada entre Essaouira, Marrakech, Agafay, Ouarzazate, Erfoud y Merzouga, en el fascinante norte de África'

const PUNTOS: Record<string, { x: number; y: number }> = {
  essaouira: { x: 44.3, y: 52.1 },
  marrakech: { x: 59.8, y: 50.8 },
  agafay: { x: 61.3, y: 55.6 },
  ouarzazate: { x: 69.8, y: 59.7 },
  erfoud: { x: 82.3, y: 54.3 },
  merzouga: { x: 86.0, y: 60.1 },
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
          width={1448}
          height={1086}
          loading="lazy"
          decoding="async"
        />

        <h2 className="mmap-title">{TITULO}</h2>

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
