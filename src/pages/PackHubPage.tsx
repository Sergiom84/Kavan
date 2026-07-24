import { Link, useParams } from 'react-router'
import { useCities, usePack } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Carousel } from '../components/ui/Carousel'
import { CityCard } from '../components/travel/CityCard'
import { RelatedPacks } from '../components/travel/RelatedPacks'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import './PackHubPage.css'

/**
 * Página 11 (nueva, corrección de la reunión): hub del pack.
 * De un vistazo → Itinerario (6), Detalles (7), Consejos (10), Calculadora (9).
 */
export function PackHubPage() {
  const { slug } = useParams()
  const { data: pack } = usePack(slug)
  const { data: cities } = useCities()

  if (!pack) return null
  const packCities = pack.citySlugs
    .map((s) => (cities ?? []).find((c) => c.slug === s))
    .filter((c) => c !== undefined)

  return (
    <>
      <PageHero image={pack.heroImageUrl} title={pack.title} subtitle={pack.subtitle} size="m" />

      <section className="section container">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: pack.title }]} />

        {/* De un vistazo */}
        <Reveal>
          <div className="section-heading">
            <h2>De un vistazo</h2>
          </div>
        </Reveal>
        <RevealGroup className="packhub-glance">
          <Link to={`/packs/${pack.slug}/itinerario`} className="packhub-glance-item card">
            <h3>Itinerario</h3>
            <p>Día a día, de la llegada al regreso</p>
          </Link>
          <Link to={`/packs/${pack.slug}/detalles`} className="packhub-glance-item card">
            <h3>Detalles</h3>
            <p>Qué incluye tu viaje</p>
          </Link>
          <Link to="/consejos" className="packhub-glance-item card">
            <h3>Consejos</h3>
            <p>Todo lo práctico antes de salir</p>
          </Link>
          <Link to={`/reserva/${pack.slug}`} className="packhub-glance-item card is-accent">
            <h3>Calculadora</h3>
            <p>Diseña y cotiza tu viaje</p>
          </Link>
        </RevealGroup>
      </section>

      {/* Ciudades del paquete en tarjetas */}
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <h2>Ciudades del viaje</h2>
          </div>
        </Reveal>
        {packCities.length > 3 ? (
          <Carousel>
            {packCities.map((c) => (
              <div key={c.id} className="carousel-item">
                <CityCard city={c} />
              </div>
            ))}
          </Carousel>
        ) : (
          <RevealGroup className="packhub-cities">
            {packCities.map((c) => (
              <CityCard key={c.id} city={c} />
            ))}
          </RevealGroup>
        )}
        <Reveal className="packhub-desc">
          <p>{pack.description}</p>
        </Reveal>
      </section>

      <RelatedPacks excludeSlug={pack.slug} />
    </>
  )
}
