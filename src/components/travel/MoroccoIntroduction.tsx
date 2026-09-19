import { Link } from 'react-router'
import { LineReveal } from '../fx/LineReveal'
import './MoroccoIntroduction.css'

const RETRATO = '/images/todra-garganta.webp'

/**
 * Puerto del relato Greyloom (text-17-650.mp4): hero 100svh → página blanca
 * 100svh → retrato → dos columnas → página negra 100svh. El texto entra
 * renglón a renglón; las secciones de 100svh hacen el corte de página.
 */
export function MoroccoIntroduction() {
  return (
    <div className="morocco" aria-labelledby="morocco-title">
      <section className="morocco__hero">
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
      </section>

      <section className="morocco__about">
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
      </section>

      <section className="morocco__about-img">
        <img src={RETRATO} alt="Paredes verticales de las gargantas del Todra" loading="lazy" decoding="async" />
      </section>

      <section className="morocco__story">
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
      </section>

      <section className="morocco__philosophy">
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
      </section>
    </div>
  )
}
