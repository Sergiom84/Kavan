import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useCities, useCity, usePacks } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Pic } from '../components/ui/Pic'
import { PackCard } from '../components/travel/PackCard'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import './CiudadPage.css'

/** Página 3: ciudad / actividad-destino, con puntos de interés y resto de ciudades. */
export function CiudadPage() {
  const { slug } = useParams()
  const { data: city } = useCity(slug)
  const { data: cities } = useCities()
  const { data: packs } = usePacks()
  const [mainImage, setMainImage] = useState(0)

  const relatedPacks = useMemo(
    () => (packs ?? []).filter((p) => slug && p.citySlugs.includes(slug)).slice(0, 3),
    [packs, slug],
  )
  const otherCities = (cities ?? []).filter((c) => c.slug !== slug)

  if (!city) return null
  const gallery = [city.heroImageUrl, ...city.gallery]

  return (
    <>
      <PageHero image={city.heroImageUrl} title={city.name} size="m" />

      <section className="section container">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Marruecos', to: '/destinos' }, { label: city.name }]}
        />
        <Reveal>
          <h2>{city.name}</h2>
          <p className="ciudad-desc">{city.longDescription}</p>
        </Reveal>

        {/* Galería */}
        <Reveal className="ciudad-gallery card">
          <div className="ciudad-gallery-main">
            <Pic src={gallery[mainImage]} alt={`${city.name}, imagen ${mainImage + 1}`} />
          </div>
          <div className="ciudad-gallery-thumbs">
            <button
              className="carousel-arrow"
              aria-label="Anterior"
              onClick={() => setMainImage((mainImage - 1 + gallery.length) % gallery.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            {gallery.map((img, i) => (
              <button
                key={img}
                className={`ciudad-thumb ${i === mainImage ? 'is-active' : ''}`}
                onClick={() => setMainImage(i)}
                aria-label={`Imagen ${i + 1}`}
              >
                <Pic src={img} alt="" />
              </button>
            ))}
            <button
              className="carousel-arrow"
              aria-label="Siguiente"
              onClick={() => setMainImage((mainImage + 1) % gallery.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Reveal>

        <Reveal>
          <h3 className="ciudad-content-title">Descubriendo rincones increíbles</h3>
          <p className="ciudad-desc">{city.shortDescription}</p>
        </Reveal>
      </section>

      {/* Puntos de interés (bloque de la página 5, corrección de la reunión) */}
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <h2>Puntos de interés</h2>
          </div>
        </Reveal>
        <RevealGroup className="ciudad-pois">
          {city.pois.map((poi) => (
            <article key={poi.id} className="ciudad-poi card">
              <div className="ciudad-poi-media">
                <Pic src={poi.imageUrl} alt={poi.title} />
              </div>
              <div className="ciudad-poi-body">
                <h3>{poi.title}</h3>
                <p>{poi.description}</p>
              </div>
            </article>
          ))}
        </RevealGroup>
      </section>

      {/* Packs relacionados */}
      {relatedPacks.length > 0 && (
        <section className="section container">
          <Reveal>
            <div className="section-heading">
              <h2>Dónde disfrutar esta actividad</h2>
            </div>
          </Reveal>
          <RevealGroup className="ciudad-related">
            {relatedPacks.map((p) => (
              <PackCard key={p.id} pack={p} showCities={false} />
            ))}
          </RevealGroup>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
            <Link to="/packs" className="btn btn-outline">
              Ver todos
            </Link>
          </div>
        </section>
      )}

      {/* Resto de ciudades con un par de frases (corrección de la reunión) */}
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <h2>Otras ciudades</h2>
          </div>
        </Reveal>
        <RevealGroup className="ciudad-others">
          {otherCities.map((c) => (
            <Link key={c.id} to={`/destinos/${c.slug}`} className="ciudad-other card">
              <div className="ciudad-other-media">
                <Pic src={c.heroImageUrl} alt={c.name} />
              </div>
              <div>
                <h3>{c.name}</h3>
                <p>{c.shortDescription}</p>
              </div>
            </Link>
          ))}
        </RevealGroup>
      </section>
    </>
  )
}
