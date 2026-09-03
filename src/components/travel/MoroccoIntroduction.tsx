import './MoroccoIntroduction.css'

/** Introducción editorial de la Home. Marca también el final del tramo inmersivo. */
export function MoroccoIntroduction() {
  return (
    <section className="home-introduction" aria-labelledby="morocco-introduction-title">
      <div className="home-introduction__content">
        <h2 id="morocco-introduction-title">Marruecos</h2>
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
        <ul>
          <li>
            <strong>Ciudades Imperiales y Medinas de Ensueño:</strong> Recorre la
            emblemática plaza <strong>Jemaa el-Fna</strong> y la imponente Mezquita
            Koutoubia en Marrakech, piérdete en sus coloridos zocos y sumérgete en
            la historia.
          </li>
          <li>
            <strong>Naturaleza en Estado Puro:</strong> Admira atardeceres
            espectaculares sobre las dunas de Merzouga, explora oasis ocultos,
            cascadas, costas escarpadas y playas paradisíacas.
          </li>
          <li>
            <strong>Cultura Bereber Auténtica:</strong> Visita las tradicionales
            kasbahs de arcilla y piedra, como la famosa <strong>Ait Ben
            Haddou</strong>, y vive la hospitalidad local en los pueblos del
            desierto.
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
