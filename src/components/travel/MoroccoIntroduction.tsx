import './MoroccoIntroduction.css'

/* Las miniaturas acompañan a cada punto: son la misma fotografía del banco del
   proyecto, recortada en redondo. Decorativas —el texto del punto ya nombra lo
   que se ve—, por eso van con `alt` vacío. */
const MINIATURAS = {
  ciudades: '/images/jemaa-el-fna.webp',
  naturaleza: '/images/dunas-amanecer.webp',
  bereber: '/images/ait-ben-haddou.webp',
}

/** Introducción editorial de la Home. Marca también el final del tramo inmersivo. */
export function MoroccoIntroduction() {
  return (
    <section className="home-introduction" aria-labelledby="morocco-introduction-title">
      <div className="home-introduction__band">
        <img
          src="/images/ouarzazate-atlas.webp"
          alt="Ouarzazate de adobe con las cumbres nevadas del Alto Atlas al fondo"
          loading="lazy"
          decoding="async"
        />
        <h2 id="morocco-introduction-title">Marruecos</h2>
      </div>

      <div className="home-introduction__content">
        <p>
          Marruecos, la puerta de entrada a África, es uno de los destinos más
          fascinantes entre el océano Atlántico y el mar Mediterráneo. Un país donde
          los paisajes desérticos del Sáhara y las majestuosas montañas del Alto
          Atlas se funden con una riqueza cultural e histórica única.
        </p>
        <p>
          Si buscas una experiencia inolvidable, nuestros <strong>viajes organizados
          a Marruecos</strong> te llevan a descubrir:
        </p>
        <ul className="home-introduction__pilares">
          <li>
            <img src={MINIATURAS.ciudades} alt="" loading="lazy" decoding="async" />
            <p>
              <strong>Ciudades Imperiales y Medinas de Ensueño:</strong> Recorre la
              emblemática plaza <strong>Jemaa el-Fna</strong> y la imponente Mezquita
              Koutoubia en Marrakech, piérdete en sus coloridos zocos y sumérgete en
              la historia.
            </p>
          </li>
          <li>
            <img src={MINIATURAS.naturaleza} alt="" loading="lazy" decoding="async" />
            <p>
              <strong>Naturaleza en Estado Puro:</strong> Admira atardeceres
              espectaculares sobre las dunas de Merzouga, explora oasis ocultos,
              cascadas, costas escarpadas y playas paradisíacas.
            </p>
          </li>
          <li>
            <img src={MINIATURAS.bereber} alt="" loading="lazy" decoding="async" />
            <p>
              <strong>Cultura Bereber Auténtica:</strong> Visita las tradicionales
              kasbahs de arcilla y piedra, como la famosa <strong>Ait Ben
              Haddou</strong>, y vive la hospitalidad local en los pueblos del
              desierto.
            </p>
          </li>
        </ul>
        <p>
          Completa tu ruta degustando la gastronomía marroquí más auténtica y
          disfrutando de un tradicional té a la menta bajo las estrellas.
        </p>
        <p>
          <strong>¿Listo para tu próxima aventura? Explora nuestros circuitos por
          Marruecos</strong>
        </p>
      </div>
    </section>
  )
}
