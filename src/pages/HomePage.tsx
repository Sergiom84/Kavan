import { Link } from 'react-router'
import { useFeaturedPacks } from '../queries/hooks'
import { lockNav } from '../lib/demoLock'
import { Pic } from '../components/ui/Pic'
import { PackShowcase } from '../components/travel/PackShowcase'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { HeroZoom } from '../components/fx/HeroZoom'
import { SplitTitle } from '../components/fx/SplitTitle'
import { ParticleClaim } from '../components/fx/ParticleClaim'
import './HomePage.css'

/* Orden de la página:
   cabecera · hero (con los dos accesos) · Marruecos · viajes más deseados ·
   mapa · pie

   La galería a sangre (`FullGallery`) salió de aquí el 2026-07-29: iba justo
   bajo el bloque de Marruecos y Sergio la reserva para otra página. El bloque
   sigue disponible en `components/ui/FullGallery` y sus fotos en
   `data/galeria.ts`; no hay que rehacer nada para recolocarla. */

/* Los dos accesos que el wireframe ponía en un bloque propio bajo la portada.
   Ahora viven dentro de la portada, como pastillas. */
const AYUDA = [
  { to: '/consejos', title: 'Te ayudamos' },
  { to: '/consejos', title: 'Requisitos' },
]

/* La frase de la pausa editorial. Las llaves marcan las palabras que bajan a
   caja baja; los nombres propios se quedan fuera o perderían la mayúscula. */
const CLAIM = [
  'Entre {el} Atlántico {y el} Sahara, Marruecos',
  'concentra {en pocos kilómetros} medinas milenarias, {cumbres}',
  '{nevadas del} Atlas, {valles de palmeras y el} mayor mar de dunas {del norte de}',
  'África. Un país {de té a la menta},',
  'hospitalidad bereber {y ciudades imperiales donde cada puerta esconde un patio}.',
  'A menos {de tres horas de vuelo}, otro mundo.',
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

          {/* Línea de pie de la portada: los dos accesos a la izquierda y el
              aviso de scroll centrado, a la misma altura. */}
          <div className="hz-hero-bottom">
            <div className="hz-pills">
              {AYUDA.map((item, i) => (
                <Link
                  key={item.title}
                  to={item.to}
                  onClick={lockNav}
                  className={`hz-pill ${i === 0 ? 'is-active' : ''}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <span className="hz-scroll-caption label">Scroll down</span>
          </div>
        </div>
      </HeroZoom>

      {/* ---- Marruecos: boceto a lápiz y texto revelado ---- */}
      <ParticleClaim beats={CLAIM} />

      {/* ---- Viajes más deseados ---- */}
      <PackShowcase packs={featured ?? []} />

      {/* ---- Marruecos te ofrece: mapa real con las ciudades del catálogo ---- */}
      <MoroccoMap />
    </>
  )
}
