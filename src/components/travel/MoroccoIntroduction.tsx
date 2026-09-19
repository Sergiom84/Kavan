import { LineReveal } from '../fx/LineReveal'
import './MoroccoIntroduction.css'

/** Fotografía vertical que corta el bloque a media lectura. */
const RETRATO = '/images/todra-garganta.webp'

/**
 * Presentación del país, en cinco tiempos que se leen bajando.
 *
 * Era un bloque de prosa corrida sobre papel. Pasa a escenas que ocupan la
 * pantalla y se van descubriendo línea a línea —ver `LineReveal`—, con la duna
 * escultórica abriendo y el cierre en oscuro.
 *
 * La duna no es una fotografía del banco: sale de la forma de la onda que trajo
 * Sergio como referencia, remapeada a la paleta Sáhara y con el grano de las
 * dunas del proyecto encima, de modo que el fondo blanco del original se funde
 * con el papel del sitio.
 */
export function MoroccoIntroduction() {
  return (
    <div className="morocco" aria-labelledby="morocco-title">
      <section className="morocco__portada">
        <div className="morocco__portada-media">
          <img
            src="/images/duna-onda.webp"
            srcSet="/images/duna-onda-1400.webp 1400w, /images/duna-onda.webp 2000w"
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <LineReveal as="h2" className="morocco__titulo">
          <span id="morocco-title">Marruecos</span>
        </LineReveal>
      </section>

      <section className="morocco__entrada">
        <LineReveal as="p" className="morocco__rotulo">
          Entre el Atlántico y el Mediterráneo
        </LineReveal>
        <LineReveal as="p" className="morocco__frase">
          Marruecos, la puerta de entrada a África, es uno de los destinos más
          fascinantes entre el océano Atlántico y el mar Mediterráneo. Un país donde
          los paisajes desérticos del Sáhara y las majestuosas montañas del Alto
          Atlas se funden con una riqueza cultural e histórica única.
        </LineReveal>
      </section>

      <section className="morocco__retrato">
        <img src={RETRATO} alt="Paredes verticales de las gargantas del Todra" loading="lazy" decoding="async" />
      </section>

      <section className="morocco__pilares">
        <div className="morocco__pilares-titulo">
          <LineReveal as="h3">
            Si buscas una experiencia inolvidable, nuestros viajes organizados a
            Marruecos te llevan a descubrir
          </LineReveal>
        </div>
        {/* Cada pilar entra por su cuenta y con su retardo: en un solo bloque las
            trece líneas salían de corrido y los tres puntos se leían pegados. */}
        <ul className="morocco__pilares-lista">
          <li>
            <LineReveal as="p" delay={0}>
              <strong>Ciudades Imperiales y Medinas de Ensueño:</strong> Recorre la
              emblemática plaza Jemaa el-Fna y la imponente Mezquita Koutoubia en
              Marrakech, piérdete en sus coloridos zocos y sumérgete en la historia.
            </LineReveal>
          </li>
          <li>
            <LineReveal as="p" delay={0.12}>
              <strong>Naturaleza en Estado Puro:</strong> Admira atardeceres
              espectaculares sobre las dunas de Merzouga, explora oasis ocultos,
              cascadas, costas escarpadas y playas paradisíacas.
            </LineReveal>
          </li>
          <li>
            <LineReveal as="p" delay={0.24}>
              <strong>Cultura Bereber Auténtica:</strong> Visita las tradicionales
              kasbahs de arcilla y piedra, como la famosa Ait Ben Haddou, y vive la
              hospitalidad local en los pueblos del desierto.
            </LineReveal>
          </li>
        </ul>
      </section>

      <section className="morocco__cierre">
        <LineReveal as="p" className="morocco__rotulo">
          Bajo las estrellas
        </LineReveal>
        <LineReveal as="p" className="morocco__frase">
          Completa tu ruta degustando la gastronomía marroquí más auténtica y
          disfrutando de un tradicional té a la menta bajo las estrellas. ¿Listo para
          tu próxima aventura? Explora nuestros circuitos por Marruecos.
        </LineReveal>
      </section>
    </div>
  )
}
