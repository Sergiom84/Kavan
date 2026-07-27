import { Link } from 'react-router'
import { useFeaturedPacks } from '../queries/hooks'
import { Pic } from '../components/ui/Pic'
import { Carousel } from '../components/ui/Carousel'
import { FullGallery } from '../components/ui/FullGallery'
import { PackCard } from '../components/travel/PackCard'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { Reveal } from '../components/fx/RevealText'
import { HeroZoom } from '../components/fx/HeroZoom'
import { ParticleClaim } from '../components/fx/ParticleClaim'
import './HomePage.css'

/* Orden de la página:
   cabecera · hero (con los dos accesos) · Marruecos en partículas · galería ·
   carrusel de packs · mapa · pie */

/* Los dos accesos que el wireframe ponía en un bloque propio bajo la portada.
   Ahora viven dentro de la portada, como pastillas. */
const AYUDA = [
  { to: '/consejos', title: 'Te ayudamos' },
  { to: '/consejos', title: 'Requisitos' },
]

/* La frase sobre Marruecos. Las llaves marcan las palabras que bajan a caja
   baja; los nombres propios se quedan fuera de ellas o perderían la mayúscula. */
const CLAIM =
  'ENTRE {el} ATLÁNTICO {y el} SAHARA, MARRUECOS CONCENTRA {en pocos kilómetros} ' +
  'MEDINAS MILENARIAS, {cumbres nevadas del} ATLAS, {valles de palmeras y el} ' +
  'MAYOR MAR DE DUNAS {del norte de} ÁFRICA. UN PAÍS {de té a la menta}, ' +
  'HOSPITALIDAD BEREBER {y ciudades imperiales donde cada puerta esconde un patio}. ' +
  'A MENOS {de tres horas de vuelo}, OTRO MUNDO.'

/* Galería del país. Las rutas van directas a public/images y no por Pic: aquí
   la foto concreta importa, no es un motivo intercambiable. */
const GALERIA = [
  { src: '/images/ait-ben-haddou.webp', pie: 'Aït Ben Haddou', alt: 'Ksar de Aït Ben Haddou al atardecer' },
  { src: '/images/dunas-erg-chebbi.webp', pie: 'Erg Chebbi', alt: 'Dunas del Erg Chebbi' },
  { src: '/images/medina.webp', pie: 'Medina de Marrakech', alt: 'Calle de la medina de Marrakech' },
  { src: '/images/todra-garganta.webp', pie: 'Gargantas del Todra', alt: 'Paredes verticales de las gargantas del Todra' },
  { src: '/images/kasbah-taourirt.webp', pie: 'Kasbah Taourirt', alt: 'Kasbah Taourirt en Ouarzazate' },
  { src: '/images/essaouira-puerto.webp', pie: 'Essaouira', alt: 'Barcas azules en el puerto de Essaouira' },
  { src: '/images/dades-kasbah.webp', pie: 'Valle del Dadés', alt: 'Kasbah de adobe en el valle del Dadés' },
  { src: '/images/jemaa-el-fna.webp', pie: 'Jemaa el-Fna', alt: 'Plaza de Jemaa el-Fna al anochecer' },
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
        {/* El nombre ya no se pinta en la portada: vive en la cabecera. La
            página necesita un titular de todos modos, así que queda como
            encabezado accesible sin representación visual. */}
        <h1 className="sr-only">Kavan — viajes privados a Marruecos</h1>

        <div className="hz-hero-foot container">
          {/* El corte de línea es deliberado: el texto va en dos filas, no en
              cuatro. En móvil no cabe y se deja fluir. */}
          <p className="hz-hero-lede">
            Rutas privadas por el sur de Marruecos: dunas del Erg&nbsp;Chebbi, kasbahs de adobe,
            <br />
            gargantas del Todra y noches bajo un cielo sin ciudades cerca.
          </p>

          {/* Línea de pie de la portada: los dos accesos a la izquierda y el
              aviso de scroll centrado, a la misma altura. */}
          <div className="hz-hero-bottom">
            <div className="hz-pills">
              {AYUDA.map((item, i) => (
                <Link key={item.title} to={item.to} className={`hz-pill ${i === 0 ? 'is-active' : ''}`}>
                  {item.title}
                </Link>
              ))}
            </div>
            <span className="hz-scroll-caption label">Scroll down</span>
          </div>
        </div>
      </HeroZoom>

      {/* ---- Marruecos: la frase dibujada con partículas sobre blanco roto ---- */}
      <ParticleClaim text={CLAIM} />

      {/* ---- Galería a sangre: una fotografía por pantalla ---- */}
      <FullGallery fotos={GALERIA} auto={3500} />

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
          {/* Sin flechas: son tres tarjetas y caben las tres en pantalla. */}
          <Carousel arrows={false}>
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
