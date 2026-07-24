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

export function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false)
  const { data: featured } = useFeaturedPacks()

  return (
    <>
      {/* Hero principal: foto / eslogan / vídeo */}
      <section className="home-hero">
        <div className="home-hero-media">
          <Pic src="art:dunes:home-hero" alt="Dunas del Sahara" />
        </div>
        <div className="home-hero-overlay" />
        <div className="home-hero-content container">
          <Reveal>
            <span className="label home-hero-label">Kavan, viajes a Marruecos</span>
            <h1>
              El desierto
              <br />
              te está esperando
            </h1>
            <button className="home-hero-play" onClick={() => setVideoOpen(true)}>
              <span className="home-hero-play-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
              Ver las dunas
            </button>
          </Reveal>
        </div>
      </section>

      {/* Bloque informativo */}
      <section className="section container">
        <RevealGroup className="home-info">
          <Link to="/consejos" className="home-info-card card">
            <span className="home-info-icon" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M7 11.5l3-4 2.5 2 3-3.5 2 2.5" />
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
              </svg>
            </span>
            <h3>Te ayudamos</h3>
            <p>Asesoría personalizada para diseñar tu viaje: rutas, fechas y presupuesto a tu medida.</p>
          </Link>
          <Link to="/consejos" className="home-info-card card">
            <span className="home-info-icon" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 4V2.5h6V4M8.5 9h7M8.5 13h7M8.5 17h4" />
              </svg>
            </span>
            <h3>Requisitos</h3>
            <p>Documentación, moneda, clima y toda la información práctica antes de salir de casa.</p>
          </Link>
        </RevealGroup>
      </section>

      {/* Bloque nuevo: Marruecos, cultura y geografía */}
      <section className="home-morocco">
        <div className="container">
          <Reveal className="home-morocco-inner">
            <span className="label">Marruecos</span>
            <h2>{marruecosIntro.title}</h2>
            <p>{marruecosIntro.body}</p>
            <Link to="/destinos" className="btn btn-outline home-morocco-btn">
              Descubre Marruecos
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Cifras a gran escala */}
      <section className="section container">
        <StatGrid stats={HOME_STATS} />
      </section>

      {/* Carrusel de packs más deseados */}
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <h2>Viajes más deseados</h2>
          </div>
        </Reveal>
        <Carousel>
          {(featured ?? []).map((p) => (
            <div key={p.id} className="carousel-item">
              <PackCard pack={p} />
            </div>
          ))}
        </Carousel>
        <div className="home-seeall">
          <Link to="/packs" className="btn btn-primary">
            Ver todos
          </Link>
        </div>
      </section>

      {videoOpen && <DunesVideoModal onClose={() => setVideoOpen(false)} />}
    </>
  )
}
