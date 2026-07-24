import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { usePack } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Pic } from '../components/ui/Pic'
import { formatPrice } from '../lib/pricing'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import './ElViajePage.css'

const SIDEBAR = [
  {
    title: 'Salidas',
    icon: 'M5 5h14v15H5zM5 9h14M9 3v3m6-3v3',
    items: ['Próximas salidas', 'Calendario de salidas', 'Duración del viaje', 'Opciones de salida'],
  },
  {
    title: 'Nuestros servicios',
    icon: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z',
    items: ['Alojamiento y desayuno', 'Circuito exclusivo', 'Incluye visita privada', 'Guía acompañante', 'Transporte incluido'],
  },
  {
    title: 'Interés saber',
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5v.5m0 3v5',
    items: ['Información importante', 'Recomendaciones', 'Qué llevar', 'Clima y documentos'],
  },
  {
    title: 'Condiciones y seguros',
    icon: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z',
    items: ['Condiciones generales', 'Política de cancelación', 'Seguro de viaje incluido', 'Seguro opcional'],
  },
]

/** Página 8: el viaje / ficha completa del pack. */
export function ElViajePage() {
  const { slug } = useParams()
  const { data: pack } = usePack(slug)
  const [slide, setSlide] = useState(0)

  if (!pack) return null

  return (
    <>
      <PageHero image={pack.heroImageUrl} title={pack.title} subtitle={pack.subtitle} size="m" />

      <section className="section container elviaje-layout">
        <div>
          {/* Resumen y presupuesto */}
          <Reveal className="elviaje-head">
            <div>
              <h2>{pack.title}</h2>
              <p className="elviaje-desc">{pack.description}</p>
            </div>
            <div className="elviaje-price card">
              <span className="label">{pack.days} días desde</span>
              <strong>{formatPrice(pack.priceFrom)}</strong>
              <Link to={`/reserva/${pack.slug}`} className="btn btn-primary">
                Hacer presupuesto online
              </Link>
            </div>
          </Reveal>

          {/* Itinerario con carrusel */}
          <Reveal>
            <div className="section-heading">
              <h2>Itinerario</h2>
            </div>
          </Reveal>
          <Reveal className="elviaje-slider card">
            <button
              className="carousel-arrow"
              aria-label="Anterior"
              onClick={() => setSlide((slide - 1 + pack.gallery.length) % pack.gallery.length)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="elviaje-slider-media">
              <Pic src={pack.gallery[slide]} alt={`${pack.title}, imagen ${slide + 1}`} />
              <div className="elviaje-slider-dots">
                {pack.gallery.map((g, i) => (
                  <button
                    key={g}
                    className={i === slide ? 'is-active' : ''}
                    aria-label={`Imagen ${i + 1}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </div>
            <button
              className="carousel-arrow"
              aria-label="Siguiente"
              onClick={() => setSlide((slide + 1) % pack.gallery.length)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Reveal>

          <RevealGroup className="elviaje-days">
            {pack.itinerary.map((day) => (
              <article key={day.dayNumber} className="elviaje-day">
                <div className="elviaje-day-media">
                  <Pic src={day.imageUrl} alt={day.title} />
                </div>
                <div>
                  <h3>Día {day.dayNumber}</h3>
                  <p className="elviaje-day-title">{day.title}</p>
                  <p className="elviaje-day-desc">{day.description}</p>
                </div>
              </article>
            ))}
          </RevealGroup>
        </div>

        {/* Sidebar */}
        <aside className="elviaje-side">
          {SIDEBAR.map((block) => (
            <Reveal key={block.title} className="elviaje-side-block card">
              <h4>
                <span className="elviaje-side-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d={block.icon} />
                  </svg>
                </span>
                {block.title}
              </h4>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </aside>
      </section>
    </>
  )
}
