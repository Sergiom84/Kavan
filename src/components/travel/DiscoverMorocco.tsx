import { Link } from 'react-router'
import { useCities } from '../../queries/hooks'
import { lockNav } from '../../lib/demoLock'
import { Carousel } from '../ui/Carousel'
import { Pic } from '../ui/Pic'
import './DiscoverMorocco.css'

type Props = {
  title?: string
}

/** Carrusel editorial de ciudades para la portada. */
export function DiscoverMorocco({ title = 'Marruecos te ofrece' }: Props) {
  const { data: cities } = useCities()

  if (!cities?.length) return null

  return (
    <section className="discover-morocco" aria-labelledby="discover-morocco-title">
      <div className="container discover-morocco-heading">
        <h2 id="discover-morocco-title" className="discover-morocco-title">
          {title}
        </h2>
      </div>

      <div className="container discover-morocco-carousel">
        <Carousel auto={3000}>
          {cities.map((city) => (
            <div className="carousel-item" key={city.id}>
              <Link
                to={`/destinos/${city.slug}`}
                onClick={lockNav}
                className="discover-card"
              >
                <div className="discover-card-media">
                  <Pic src={city.heroImageUrl} alt={city.name} />
                  <div className="discover-card-overlay">
                    <h3>{city.name}</h3>
                    <p>{city.shortDescription}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
