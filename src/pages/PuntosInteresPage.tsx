import { Link } from 'react-router'
import { useCities, useFeaturedPacks } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Pic } from '../components/ui/Pic'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import './PuntosInteresPage.css'

/**
 * Página 5: puntos de interés de Marruecos.
 * Corrección de la reunión: foto/título arriba y bloque "De un vistazo" con
 * accesos a Detalles, Consejos e Itinerario.
 */
export function PuntosInteresPage() {
  const { data: cities } = useCities()
  const { data: featured } = useFeaturedPacks()
  const firstPack = featured?.[0]

  return (
    <>
      <PageHero
        image="art:arch:poi-hero"
        title="Puntos de interés"
        subtitle="Marruecos"
        size="m"
      />

      <section className="section container">
        <Reveal className="poi-intro">
          <p>
            Descubre los lugares más fascinantes de Marruecos. Desde el desierto del Sahara hasta ciudades
            imperiales llenas de historia y cultura, cada destino ofrece una experiencia única e inolvidable.
          </p>
        </Reveal>

        {/* De un vistazo */}
        {firstPack && (
          <RevealGroup className="poi-glance">
            <Link to={`/packs/${firstPack.slug}/itinerario`} className="poi-glance-item card">
              Itinerario
            </Link>
            <Link to={`/packs/${firstPack.slug}/detalles`} className="poi-glance-item card">
              Detalles
            </Link>
            <Link to="/consejos" className="poi-glance-item card">
              Consejos
            </Link>
          </RevealGroup>
        )}
      </section>

      <section className="section container">
        <RevealGroup className="poi-grid">
          {(cities ?? []).map((city) => (
            <Link key={city.id} to={`/destinos/${city.slug}`} className="poi-card card">
              <div className="poi-card-media">
                <Pic src={city.heroImageUrl} alt={city.name} />
              </div>
              <div className="poi-card-body">
                <h3>{city.name}</h3>
                <p>{city.shortDescription}</p>
              </div>
            </Link>
          ))}
        </RevealGroup>
      </section>
    </>
  )
}
