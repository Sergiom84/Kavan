import { Link } from 'react-router'
import { useFeaturedPacks } from '../queries/hooks'
import { Pic } from '../components/ui/Pic'
import { Carousel } from '../components/ui/Carousel'
import { PackCard } from '../components/travel/PackCard'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { Reveal } from '../components/fx/RevealText'
import { SplitTitle } from '../components/fx/SplitTitle'
import { HeroZoom } from '../components/fx/HeroZoom'
import './HomePage.css'

/* Orden de la página:
   cabecera · hero (con los dos accesos) · Marruecos · carrusel de packs · pie */

/* Los dos accesos que el wireframe ponía en un bloque propio bajo la portada.
   Ahora viven dentro de la portada, como pastillas. */
const AYUDA = [
  { to: '/consejos', title: 'Te ayudamos' },
  { to: '/consejos', title: 'Requisitos' },
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
          {/* El corte de línea es deliberado: el texto va en dos filas, no en
              cuatro. En móvil no cabe y se deja fluir. */}
          <p className="hz-hero-lede">
            Rutas privadas por el sur de Marruecos: dunas del Erg&nbsp;Chebbi, kasbahs de adobe,
            <br />
            gargantas del Todra y noches bajo un cielo sin ciudades cerca.
          </p>

          {/* Los dos accesos del bloque informativo del wireframe, subidos a la
              portada: aquí se ven sin tener que bajar. */}
          <div className="hz-pills">
            {AYUDA.map((item, i) => (
              <Link key={item.title} to={item.to} className={`hz-pill ${i === 0 ? 'is-active' : ''}`}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <span className="hz-scroll-caption label">Scroll down</span>
      </HeroZoom>

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
