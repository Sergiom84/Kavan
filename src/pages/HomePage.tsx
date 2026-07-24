import { useState } from 'react'
import { Link } from 'react-router'
import { useFeaturedPacks } from '../queries/hooks'
import { marruecosIntro } from '../data/seed'
import { Pic } from '../components/ui/Pic'
import { Carousel } from '../components/ui/Carousel'
import { PackCard } from '../components/travel/PackCard'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import { SplitTitle } from '../components/fx/SplitTitle'
import { DunesVideoModal } from '../components/fx/DunesVideoModal'
import './HomePage.css'

/* Las cifras se presentan como en Horizonte: número gigante en serif, rótulo
   diminuto en mono al lado, una tarjeta por dato y desplazamiento lateral. */
const CIFRAS = [
  { value: '3', unit: 'horas de vuelo', detail: 'Desde España' },
  { value: '6', unit: 'ciudades', detail: 'De Merzouga a Essaouira' },
  { value: '5', unit: 'rutas diseñadas', detail: 'Del desierto a la costa' },
  { value: '6', unit: 'plazas por circuito', detail: '4x4 exclusivo con chófer' },
  { value: '150', unit: 'km de dunas', detail: 'Erg Chebbi' },
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
      {/* ---- Portada: foto a sangre y el logotipo estirado de borde a borde ---- */}
      <section className="hz-hero">
        <div className="hz-hero-media">
          <Pic src="art:dunes:home-hero" alt="Dunas del Erg Chebbi al atardecer" priority position="center 58%" />
        </div>
        <div className="hz-scrim" />

        <div className="hz-hero-inner">
          <SplitTitle as="h1" text="KAVAN" size="wordmark" align="center" className="hz-wordmark" />

          <div className="hz-hero-foot container">
            <p className="hz-hero-lede">
              Rutas privadas por el sur de Marruecos: dunas del Erg&nbsp;Chebbi, kasbahs de
              adobe, gargantas del Todra y noches bajo un cielo sin ciudades cerca.
            </p>

            <div className="hz-hero-actions">
              <div className="hz-pills">
                <Link to="/packs" className="hz-pill is-active">Viajes</Link>
                <Link to="/destinos" className="hz-pill">Destinos</Link>
              </div>

              <button className="hz-video-cta" onClick={() => setVideoOpen(true)}>
                <span className="label">Ver las dunas</span>
              </button>
            </div>
          </div>

          <span className="hz-scroll-caption label">Scroll down</span>
        </div>
      </section>

      {/* ---- Claim a pantalla completa sobre fotografía ---- */}
      <section className="hz-claim">
        <div className="hz-claim-media">
          <Pic src="art:camel:claim" alt="Caravana de dromedarios al atardecer" position="center 55%" />
        </div>
        <div className="hz-scrim" />
        <Reveal className="hz-claim-inner">
          <SplitTitle
            text="RUTAS {privadas}, GRUPOS {pequeños}, DESIERTO {de} VERDAD — VIAJAR {así} ES OTRA COSA."
            align="center"
            className="hz-claim-title"
          />
        </Reveal>
      </section>

      {/* ---- Concepto: crema, mucho aire, un rótulo y un párrafo ---- */}
      <section className="hz-concept">
        <Reveal className="hz-concept-inner">
          <span className="label hz-eyebrow">Concepto</span>
          <p className="hz-concept-text">{marruecosIntro.body}</p>
        </Reveal>
      </section>

      {/* ---- Ubicación: titular a la izquierda y fotografía al fondo ---- */}
      <section className="hz-location">
        <div className="hz-location-media">
          <Pic src="art:stone:location" alt="Cumbres del Alto Atlas" position="center 50%" />
        </div>
        <div className="container hz-location-inner">
          <Reveal>
            <SplitTitle
              text="ENTRE {el} ATLÁNTICO {y} EL SÁHARA, {en} LA COSTA {y} LAS MONTAÑAS {de} MARRUECOS"
              align="left"
              className="hz-location-title"
            />
            <Link to="/destinos" className="btn btn-primary hz-location-cta">Ver los destinos</Link>
          </Reveal>
          <span className="label hz-location-tag">Marrakech, Marruecos</span>
        </div>
      </section>

      {/* ---- Cifras: número gigante por tarjeta, en banda horizontal ---- */}
      <section className="hz-figures">
        <RevealGroup className="hz-figures-track">
          {CIFRAS.map((c) => (
            <article key={c.unit} className="hz-figure">
              <div className="hz-figure-head">
                <span className="hz-figure-value">{c.value}</span>
                <span className="label hz-figure-unit">{c.unit}</span>
              </div>
              <p className="hz-figure-detail">{c.detail}</p>
            </article>
          ))}
        </RevealGroup>
      </section>

      {/* ---- Claim intermedio sobre crema ---- */}
      <section className="hz-statement">
        <Reveal>
          <SplitTitle
            text="VIAJES {diseñados} UNO {a} UNO PARA {que} NO TENGAS {que} PENSAR EN NADA"
            align="center"
            className="hz-statement-title"
          />
        </Reveal>
      </section>

      {/* ---- Viajes ---- */}
      <section className="hz-packs">
        <div className="container">
          <Reveal>
            <div className="hz-packs-head">
              <span className="label hz-eyebrow">Viajes más deseados</span>
              <Link to="/packs" className="link-arrow">
                Ver todos
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
        <Carousel>
          {(featured ?? []).map((p) => (
            <div key={p.id} className="carousel-item">
              <PackCard pack={p} />
            </div>
          ))}
        </Carousel>
      </section>

      {/* ---- Ayuda ---- */}
      <section className="hz-help-section container">
        <RevealGroup className="hz-help">
          {AYUDA.map((item) => (
            <Link key={item.n} to={item.to} className="hz-help-item">
              <span className="label hz-help-n">{item.n}</span>
              <div className="hz-help-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <span className="hz-help-arrow" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {videoOpen && <DunesVideoModal onClose={() => setVideoOpen(false)} />}
    </>
  )
}
