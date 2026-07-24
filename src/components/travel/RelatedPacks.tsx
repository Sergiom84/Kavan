import { Link } from 'react-router'
import { useFeaturedPacks } from '../../queries/hooks'
import { Carousel } from '../ui/Carousel'
import { PackCard } from './PackCard'
import { Reveal } from '../fx/RevealText'

/** Bloque "Otros viajes deseados" + Ver todos (wireframes 1, 6 y 11). */
export function RelatedPacks({
  title = 'Otros viajes deseados',
  excludeSlug,
}: {
  title?: string
  excludeSlug?: string
}) {
  const { data } = useFeaturedPacks()
  const items = (data ?? []).filter((p) => p.slug !== excludeSlug)
  if (!items.length) return null

  return (
    <section className="section container">
      <Reveal>
        <div className="section-heading">
          <h2>{title}</h2>
        </div>
      </Reveal>
      <Carousel>
        {items.map((p) => (
          <div key={p.id} className="carousel-item">
            <PackCard pack={p} />
          </div>
        ))}
      </Carousel>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
        <Link to="/packs" className="btn btn-outline">
          Ver todos
        </Link>
      </div>
    </section>
  )
}
