import { Link } from 'react-router'
import { LineReveal } from '../fx/LineReveal'
import { ScrollScene, ScrollSceneGroup } from '../fx/ScrollScene'
import './MoroccoIntroduction.css'

const RETRATO = '/images/todra-garganta.webp'

/**
 * Puerto del relato Greyloom (text-17-650.mp4): hero 100svh → página blanca
 * 100svh → retrato → dos columnas → página negra 100svh. Cada texto es una
 * escena que se clava en pantalla y se lee bajando: el scroll sube los
 * renglones uno a uno y, terminado el último, lleva de golpe al siguiente
 * encuadre. El retrato no es escena, pasa de largo.
 */
export function MoroccoIntroduction() {
  return (
    <ScrollSceneGroup className="morocco">
      <ScrollScene className="morocco__hero scroll-scene" hold={0.6}>
        <div className="morocco__hero-img">
          <img
            src="/images/duna-onda.webp"
            srcSet="/images/duna-onda-1400.webp 1400w, /images/duna-onda.webp 2000w"
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="morocco__hero-header">
          <LineReveal as="h2" id="morocco-title" className="morocco__titulo" delay={0.5}>
            Marruecos
          </LineReveal>
        </div>
      </ScrollScene>

      <ScrollScene className="morocco__about scroll-scene">
        <LineReveal as="span" className="morocco__kicker">
          Marruecos
        </LineReveal>
        <div className="morocco__about-header">
          <LineReveal as="p" className="morocco__lead">
            Marruecos, la puerta de entrada a África, es uno de los destinos más
            fascinantes entre el océano Atlántico y el mar Mediterráneo. Un país
            donde los paisajes desérticos del Sáhara y las majestuosas montañas
            del Alto Atlas se funden con una riqueza cultural e histórica única.
          </LineReveal>
        </div>
      </ScrollScene>

      <section className="morocco__about-img">
        <img src={RETRATO} alt="Paredes verticales de las gargantas del Todra" loading="lazy" decoding="async" />
      </section>

      <ScrollScene className="morocco__story scroll-scene" hold={1.2}>
        <div className="morocco__story-col">
          <LineReveal as="h3" className="morocco__story-title">
            Si buscas una experiencia inolvidable, nuestros viajes organizados a
            Marruecos te llevan a descubrir
          </LineReveal>
        </div>
        <div className="morocco__story-col">
          <LineReveal as="p">
            <strong>Ciudades Imperiales y Medinas de Ensueño:</strong> Recorre la
            emblemática plaza Jemaa el-Fna y la imponente Mezquita Koutoubia en
            Marrakech, piérdete en sus coloridos zocos y sumérgete en la historia.
          </LineReveal>
          <LineReveal as="p" delay={0.08}>
            <strong>Naturaleza en Estado Puro:</strong> Admira atardeceres
            espectaculares sobre las dunas de Merzouga, explora oasis ocultos,
            cascadas, costas escarpadas y playas paradisíacas.
          </LineReveal>
          <LineReveal as="p" delay={0.16}>
            <strong>Cultura Bereber Auténtica:</strong> Visita las tradicionales
            kasbahs de arcilla y piedra, como la famosa Ait Ben Haddou, y vive la
            hospitalidad local en los pueblos del desierto.
          </LineReveal>
        </div>
      </ScrollScene>

      <ScrollScene className="morocco__philosophy scroll-scene">
        <LineReveal as="span" className="morocco__kicker">
          La ruta
        </LineReveal>
        <div className="morocco__about-header">
          <LineReveal as="p" className="morocco__lead">
            Completa tu ruta degustando la gastronomía marroquí más auténtica y
            disfrutando de un tradicional té a la menta bajo las estrellas.
          </LineReveal>
          <p className="morocco__cta">
            <Link to="/packs">
              ¿Listo para tu próxima aventura? Explora nuestros circuitos por Marruecos
            </Link>
          </p>
        </div>
      </ScrollScene>
    </ScrollSceneGroup>
  )
}
