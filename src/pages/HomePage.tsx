import { useState } from 'react'
import { Link } from 'react-router'
import { useFeaturedPacks } from '../queries/hooks'
import { marruecosIntro } from '../data/seed'
import { Pic } from '../components/ui/Pic'
import { Carousel } from '../components/ui/Carousel'
import { PackCard } from '../components/travel/PackCard'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import { DunesVideoModal } from '../components/fx/DunesVideoModal'
import { StatGrid } from '../components/fx/StatGrid'
import './HomePage.css'

const HOME_STATS = [
  { value: 6, title: 'Ciudades', detail: 'de Merzouga a Essaouira' },
  { value: 5, title: 'Rutas diseñadas', detail: 'del desierto a la costa' },
  { value: 212, title: 'Prefijo de Marruecos', detail: 'a un vuelo corto de casa' },
  { value: 6, suffix: '', title: 'Plazas por circuito', detail: '4x4 exclusivo con chófer' },
]

const AYUDA = [
  {
    n: '01',
    to: '/consejos',
    title: 'Te ayudamos',
    text: 'Asesoría personalizada para diseñar tu viaje: rutas, fechas y presupuesto a tu medida.',
  },
  {
    n: '02',
    to: '/consejos',
    title: 'Requisitos',
    text: 'Documentación, moneda, clima y toda la información práctica antes de salir de casa.',
  },
]

export function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false)
  const { data: featured } = useFeaturedPacks()

  return (
    <>
      {/* Hero principal: foto / eslogan / vídeo */}
      <section className="home-hero">
        <div className="home-hero-media">
          <Pic src="art:dunes:home-hero" alt="Dunas del Erg Chebbi al atardecer" priority position="center 58%" />
        </div>
        <div className="home-hero-overlay" />

        <div className="home-hero-content container">
          <Reveal>
            <span className="label home-hero-label">Kavan, viajes a Marruecos</span>
            <h1 className="home-hero-title">El desierto te está esperando</h1>
            <p className="home-hero-text">
              Rutas privadas por el sur de Marruecos: dunas del Erg Chebbi, kasbahs de adobe,
              gargantas del Todra y noches bajo un cielo sin ciudades cerca.
            </p>
            <div className="home-hero-actions">
              <Link to="/packs" className="btn btn-sun">
                Ver los viajes
              </Link>
              <button className="btn btn-ghost home-hero-play" onClick={() => setVideoOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
                Ver las dunas
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bloque informativo */}
      <section className="section-tight container">
        <RevealGroup className="home-help">
          {AYUDA.map((item) => (
            <Link key={item.n} to={item.to} className="home-help-item">
              <span className="home-help-n">{item.n}</span>
              <div className="home-help-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <span className="home-help-arrow" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {/* Marruecos: cultura y geografía */}
      <section className="band-sand section">
        <div className="container home-morocco">
          <Reveal className="home-morocco-media">
            <div className="frame home-morocco-frame">
              <Pic src="/images/medina.webp" alt="Calle de la medina de Marrakech" />
            </div>
            <div className="frame home-morocco-frame-small">
              <Pic src="/images/alto-atlas.webp" alt="Cumbres nevadas del Alto Atlas" />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="home-morocco-text">
            <span className="label">Marruecos</span>
            <h2>{marruecosIntro.title}</h2>
            <p className="measure-wide">{marruecosIntro.body}</p>
            <Link to="/destinos" className="link-arrow home-morocco-link">
              Descubre Marruecos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Cifras a gran escala */}
      <section className="section-tight container">
        <StatGrid stats={HOME_STATS} />
      </section>

      {/* Carrusel de packs más deseados */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <div className="section-head-text">
              <span className="label">Viajes más deseados</span>
              <h2>Rutas que ya están diseñadas y salen todo el año</h2>
            </div>
            <Link to="/packs" className="link-arrow">
              Ver todos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </Reveal>
        <Carousel>
          {(featured ?? []).map((p) => (
            <div key={p.id} className="carousel-item">
              <PackCard pack={p} />
            </div>
          ))}
        </Carousel>
      </section>

      {videoOpen && <DunesVideoModal onClose={() => setVideoOpen(false)} />}
    </>
  )
}
