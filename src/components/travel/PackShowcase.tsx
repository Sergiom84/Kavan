import { Link } from 'react-router'
import type { Pack } from '../../lib/types'
import { lockNav } from '../../lib/demoLock'
import { Reveal } from '../fx/RevealText'
import { PackCard } from './PackCard'
import './PackShowcase.css'

type Props = {
  packs: Pack[]
  title?: string
  /** Acción centrada bajo el grid. Sin valor, el bloque no muestra CTA. */
  to?: string
  linkLabel?: string
}

/**
 * Escaparate de portada: tres viajes por fila y una única acción centrada.
 */
export function PackShowcase({
  packs,
  title = 'Viajes más deseados',
  to = '/packs',
  linkLabel = 'Ver todos los viajes',
}: Props) {
  if (!packs.length) return null

  return (
    <section className="pack-showcase">
      <div className="pack-showcase-inner container">
        <Reveal>
          <h2 className="label pack-showcase-title">{title}</h2>
        </Reveal>

        <div className="pack-showcase-grid">
          {packs.map((p) => (
            <PackCard key={p.id} pack={p} variant="home" />
          ))}
        </div>

        <div className="pack-showcase-closing">
          {to && (
            <Link to={to} onClick={lockNav} className="btn btn-outline pack-showcase-link">
              {linkLabel}
            </Link>
          )}

          <div className="pack-showcase-discover">
            <h3>Descubre Marruecos.</h3>
            <p>
              De las medinas que despiertan al amanecer a las dunas que cambian con la luz,
              cada ruta abre una forma distinta de viajar Marruecos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
