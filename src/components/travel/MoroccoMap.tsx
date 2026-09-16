import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useCities } from '../../queries/hooks'
import { lockNav } from '../../lib/demoLock'
import { Pic } from '../ui/Pic'
import './MoroccoMap.css'

/* ---------------------------------------------------------------------------
   Mapa de Marruecos con las ciudades del catálogo.

   El mapa es una imagen: relieve, costa, las chinchetas y los rótulos de
   referencia (Tánger, Rabat, Casablanca, Fez, Agadir) vienen ya dibujados.

   Los nombres de las ciudades del catálogo NO. Estaban quemados en el archivo
   y eso los dejaba fuera de alcance: cuerpo fijo, sin escalar en móvil, blandos
   en pantallas retina y con Zagora y Agafay —que nunca estuvieron dibujadas—
   imitándolos desde CSS. Se borraron del WebP (`scripts/mapa/borrar-rotulos.py`)
   y se reponen aquí, los siete con el mismo tratamiento.

   Las posiciones están medidas sobre la propia imagen (la base del vástago de
   cada chincheta, por análisis de píxeles) y van en porcentaje, así que
   aguantan cualquier tamaño de pantalla. `lado` reproduce la colocación
   original del rótulo respecto a su chincheta. Si se cambia la imagen del mapa
   hay que volver a medirlo todo.
--------------------------------------------------------------------------- */

type Lado = 'izquierda' | 'derecha' | 'abajo'

const PUNTOS: Record<string, { x: number; y: number; lado: Lado }> = {
  essaouira: { x: 44.3, y: 52.1, lado: 'izquierda' },
  marrakech: { x: 59.8, y: 50.8, lado: 'derecha' },
  agafay: { x: 61.3, y: 55.6, lado: 'derecha' },
  ouarzazate: { x: 69.8, y: 59.7, lado: 'abajo' },
  zagora: { x: 76.6, y: 66.3, lado: 'abajo' },
  erfoud: { x: 82.3, y: 54.3, lado: 'derecha' },
  merzouga: { x: 86.0, y: 60.1, lado: 'abajo' },
}

const ZAGORA = {
  slug: 'zagora',
  name: 'Zagora',
  heroImageUrl: '/images/draa-palmeral.webp',
}

export function MoroccoMap() {
  const { data: cities } = useCities()
  const [activa, setActiva] = useState<string | null>(null)
  const lienzoRef = useRef<HTMLDivElement>(null)

  const conPunto = [...(cities ?? []).filter((c) => PUNTOS[c.slug]), ZAGORA]
  const ciudad = conPunto.find((c) => c.slug === activa)
  const punto = ciudad ? PUNTOS[ciudad.slug] : null

  /* Salir con el ratón cierra la ficha, pero en táctil no hay `mouseleave`.
     Mientras haya una ciudad activa, cualquier pulsación que no sea sobre una
     chincheta cierra su miniatura, también dentro del propio mapa. `pointerdown`
     responde antes de que el dedo o el ratón se levanten; Escape conserva la
     salida equivalente por teclado. */
  useEffect(() => {
    if (!activa) return

    const fuera = (e: PointerEvent) => {
      const objetivo = e.target
      if (!(objetivo instanceof Element) || !objetivo.closest('.mmap-hit')) {
        setActiva(null)
      }
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
      <div
        className="mmap-canvas"
        ref={lienzoRef}
        onMouseLeave={() => setActiva(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setActiva(null)
        }}
      >
        <img
          className="mmap-image"
          src="/images/mapa-kavan-alpha.webp"
          alt="Mapa de Marruecos: la costa atlántica, el relieve del Atlas y las ciudades de referencia Tánger, Rabat, Casablanca, Fez y Agadir"
          width={1448}
          height={1086}
          loading="lazy"
          decoding="async"
        />

        {/* Zagora no está dibujada en el mapa: su chincheta se compone aquí. */}
        <span className="mmap-zagora-marker" aria-hidden="true">
          <span className="mmap-added-pin">
            <span className="mmap-added-pin-dot" />
          </span>
        </span>

        {/* Los rótulos son decorativos: el nombre accesible de cada ciudad vive
            en el `aria-label` de su chincheta, y en móvil, donde las chinchetas
            se retiran, lo aporta el carrusel de destinos. Se pintan siempre,
            también en móvil, porque forman parte de la cartografía. */}
        {conPunto.map((c) => {
          const p = PUNTOS[c.slug]
          return (
            <span
              key={c.slug}
              className={`mmap-rotulo is-${p.lado}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-hidden="true"
            >
              {c.name}
            </span>
          )
        })}

        {conPunto.map((c) => {
          const p = PUNTOS[c.slug]
          const props = {
            className: `mmap-hit ${activa === c.slug ? 'is-active' : ''}`,
            style: { left: `${p.x}%`, top: `${p.y}%` },
            onMouseEnter: () => setActiva(c.slug),
            onFocus: () => setActiva(c.slug),
            'aria-label': `Ver ${c.name}`,
          }

          const contenido = (
            <>
              <span className="mmap-live-pin" aria-hidden="true">
                <span className="mmap-live-pin-head" />
              </span>
              <span className="mmap-ring" aria-hidden="true" />
            </>
          )

          if (c.slug === 'zagora') {
            return (
              <button key={c.slug} type="button" {...props} onClick={() => setActiva(c.slug)}>
                {contenido}
              </button>
            )
          }

          return (
            <Link
              key={c.slug}
              to={`/destinos/${c.slug}`}
              onClick={lockNav}
              {...props}
            >
              {contenido}
            </Link>
          )
        })}

        {/* Miniatura decorativa de la ciudad señalada. El enlace y su nombre
            accesible siguen viviendo en la chincheta. */}
        {ciudad && punto && (
          <div
            className="mmap-card"
            aria-hidden="true"
            style={{
              left: `${Math.min(Math.max(punto.x, 14), 86)}%`,
              top: `${punto.y}%`,
            }}
          >
            <Pic src={ciudad.heroImageUrl} alt="" />
          </div>
        )}
      </div>
    </section>
  )
}
