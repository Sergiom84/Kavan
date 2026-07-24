import { Link } from 'react-router'
import { useFeaturedPacks } from '../queries/hooks'
import { Pic } from '../components/ui/Pic'
import { Carousel } from '../components/ui/Carousel'
import { PackCard } from '../components/travel/PackCard'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import { SplitTitle } from '../components/fx/SplitTitle'
import { HeroZoom } from '../components/fx/HeroZoom'
import './HomePage.css'

/* Orden de la página, según el wireframe:
   cabecera · hero · bloque informativo · Marruecos · carrusel de packs · pie */

const AYUDA = [
  {
    to: '/consejos',
    title: 'Te ayudamos',
    text: 'Asesoría personalizada para diseñar tu viaje: rutas, fechas y presupuesto a tu medida.',
    /* El wireframe pedía un apretón de manos, pero a 48px en línea fina no
       se distingue: se lee como una montaña. Un bocadillo de conversación
       transmite lo mismo y se reconoce al instante. */
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
        <path d="M8 10h32a2 2 0 012 2v20a2 2 0 01-2 2H20l-9 7v-7H8a2 2 0 01-2-2V12a2 2 0 012-2z" />
        <circle cx="17" cy="22" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="22" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="31" cy="22" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/consejos',
    title: 'Requisitos',
    text: 'Documentación, moneda, clima y toda la información práctica antes de salir de casa.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
        <rect x="12" y="8" width="24" height="34" />
        <path d="M18 6h12v5H18z" />
        <path d="M18 20h12M18 27h12M18 34h7" />
      </svg>
    ),
  },
]

export function HomePage() {
  const { data: featured } = useFeaturedPacks()

  return (
    <>
      {/* ---- Hero: la fotografía se aleja con el scroll y entran los textos ---- */}
      <HeroZoom
        className="hz-hero"
        media={
          <Pic src="art:dunes:home-hero" alt="Dunas del Erg Chebbi al atardecer" priority position="center 58%" />
        }
        beats={[
          'Cuatro días sin cobertura, sin prisa y sin nadie más en el horizonte.',
          'Un chófer que conoce las pistas. Una casa donde te esperan con té.',
        ]}
      >
        <SplitTitle as="h1" text="KAVAN" size="wordmark" className="hz-wordmark" />

        <div className="hz-hero-foot container">
          <p className="hz-hero-lede">
            Rutas privadas por el sur de Marruecos: dunas del Erg&nbsp;Chebbi, kasbahs de
            adobe, gargantas del Todra y noches bajo un cielo sin ciudades cerca.
          </p>

          <div className="hz-pills">
            <Link to="/packs" className="hz-pill is-active">Packs</Link>
            <Link to="/destinos" className="hz-pill">Destinos</Link>
          </div>
        </div>

        <span className="hz-scroll-caption label">Scroll down</span>
      </HeroZoom>

      {/* ---- Bloque informativo ---- */}
      <section className="hz-help-section container">
        <RevealGroup className="hz-help">
          {AYUDA.map((item) => (
            <Link key={item.title} to={item.to} className="hz-help-item">
              <span className="hz-help-icon" aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="hz-help-arrow label">Saber más</span>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {/* ---- Marruecos: cultura y geografía, sobre fotografía ---- */}
      <section className="hz-claim">
        <div className="hz-claim-media">
          <Pic src="art:camel:claim" alt="Dromedarios frente a una kasbah de adobe" position="center 55%" />
        </div>
        <div className="hz-scrim" />
        <Reveal className="hz-claim-inner">
          <SplitTitle
            size="lead"
            align="center"
            className="hz-claim-title"
            /* Los nombres propios se quedan fuera de las llaves: dentro se
               ponen en caja baja y "África" perdería la mayúscula. */
            text={
              'ENTRE {el} ATLÁNTICO {y el} SAHARA, MARRUECOS CONCENTRA {en pocos kilómetros} ' +
              'MEDINAS MILENARIAS, {cumbres nevadas del} ATLAS, {valles de palmeras y el} ' +
              'MAYOR MAR DE DUNAS {del norte de} ÁFRICA. UN PAÍS {de té a la menta}, ' +
              'HOSPITALIDAD BEREBER {y ciudades imperiales donde cada puerta esconde un patio}. ' +
              'A MENOS {de tres horas de vuelo}, OTRO MUNDO.'
            }
          />
        </Reveal>
      </section>

      {/* ---- Viajes más deseados ---- */}
      <section className="hz-packs">
        <div className="container">
          <Reveal>
            <div className="hz-packs-head">
              <span className="label hz-eyebrow">Viajes más deseados</span>
            </div>
          </Reveal>
        </div>

        {/* Dentro del contenedor: si no, las tarjetas llegan al borde de la
            pantalla y el carrusel parece desbordarse. */}
        <div className="container">
          <Carousel>
            {(featured ?? []).map((p) => (
              <div key={p.id} className="carousel-item">
                <PackCard pack={p} />
              </div>
            ))}
          </Carousel>

          <div className="hz-packs-foot">
            <Link to="/packs" className="btn btn-outline">Ver todos</Link>
          </div>
        </div>
      </section>

      {/* ---- Marruecos te ofrece: mapa real con las ciudades del catálogo ---- */}
      <MoroccoMap />
    </>
  )
}
