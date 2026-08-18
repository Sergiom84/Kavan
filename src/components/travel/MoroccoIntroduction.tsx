import './MoroccoIntroduction.css'

/** Introducción editorial de la Home. Marca también el final del tramo inmersivo. */
export function MoroccoIntroduction() {
  return (
    <section className="home-introduction" aria-labelledby="morocco-introduction-title">
      <div className="home-introduction__content">
        <h2 id="morocco-introduction-title">Marruecos</h2>
        <p>
          Marruecos concentra en pocos kilómetros medinas milenarias, cumbres nevadas
          del Atlas, valles de palmeras y el mayor mar de dunas del norte de África.
          Un país de té a la menta, hospitalidad bereber y ciudades imperiales donde
          cada puerta esconde un patio. A menos de tres horas de vuelo, otro mundo.
        </p>
      </div>
    </section>
  )
}
