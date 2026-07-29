import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { Carousel } from '../ui/Carousel'
import { Reveal } from '../fx/RevealText'
import { PackCard } from './PackCard'
import './PackShowcase.css'

type Props = {
  packs: Pack[]
  title?: string
  /** Enlace del pie de la columna. Sin valor, la columna es sólo el rótulo. */
  to?: string
  linkLabel?: string
}

/**
 * Bloque de packs en dos columnas: el rótulo de sección fijo a la izquierda,
 * con el enlace anclado abajo, y el carril de tarjetas a la derecha sangrando
 * por el borde de la pantalla. Portado del bloque de eventos de Grand Hotel
 * Lviv (layout y motion; color y tipografía son los de Kavan).
 */
export function PackShowcase({
  packs,
  title = 'Viajes más deseados',
  to = '/packs',
  linkLabel = 'Ver todos',
}: Props) {
  if (!packs.length) return null

  return (
    <section className="pack-showcase">
      <div className="pack-showcase-inner">
        <Reveal className="pack-showcase-sidebar">
          <h2 className="pack-showcase-title">{title}</h2>
          {to && (
            <Link to={to} className="btn btn-outline pack-showcase-link">
              {linkLabel}
            </Link>
          )}
        </Reveal>

        {/* Sin flechas: el carril se recorre a mano y la tarjeta cortada por la
            derecha es lo que anuncia que hay más. */}
        <div className="pack-showcase-rail">
          <Carousel arrows={false}>
            {packs.map((p) => (
              <div key={p.id} className="carousel-item">
                <PackCard pack={p} overlay />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}
