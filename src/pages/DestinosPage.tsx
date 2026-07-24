import { Link } from 'react-router'
import { useCities } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Carousel } from '../components/ui/Carousel'
import { CityCard } from '../components/travel/CityCard'
import { Reveal } from '../components/fx/RevealText'

/** Página 2: Descubre Marruecos. */
export function DestinosPage() {
  const { data: cities } = useCities()
  const names = (cities ?? []).map((c) => c.name).join(', ')

  return (
    <>
      <PageHero
        image="art:medina:destinos-hero"
        title="Descubre Marruecos"
        subtitle="Ciudades imperiales, desierto y océano: un país que se recorre con todos los sentidos."
        size="m"
      />

      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <h2>Marruecos te ofrece</h2>
          </div>
          <p style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>{names}</p>
        </Reveal>
        <Carousel>
          {(cities ?? []).map((c) => (
            <div key={c.id} className="carousel-item">
              <CityCard city={c} />
            </div>
          ))}
        </Carousel>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          <Link to="/puntos-de-interes" className="btn btn-outline">
            Ver todos
          </Link>
        </div>
      </section>
    </>
  )
}
