import { useState, type FormEvent } from 'react'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/fx/RevealText'
import { SplitTitle } from '../components/fx/SplitTitle'
import './ContactoPage.css'

const HORARIO = [
  { dias: 'Lunes a viernes', horas: '10:00 – 19:00' },
  { dias: 'Sábado', horas: '10:00 – 14:00' },
  { dias: 'Domingo', horas: 'Cerrado' },
]

export function ContactoPage() {
  const [enviado, setEnviado] = useState(false)

  /* Sin backend todavía: el formulario sólo confirma en pantalla. Cuando haya
     endpoint, aquí va el POST. */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <>
      <PageHero
        image="art:coast:contacto-hero"
        title="Contacto"
        subtitle="Cuéntanos qué viaje tienes en la cabeza"
        size="s"
      />

      {/* Bloque oscuro con los datos, al modo de la referencia */}
      <section className="cto-panel">
        <div className="cto-panel-inner container">
          <div className="cto-panel-top">
            <div>
              <span className="label">Contacto</span>
              <span className="label cto-label-soft">Oficina de viajes</span>
            </div>
            <div className="cto-panel-lines">
              <a href="tel:+34600000000" className="cto-phone">+34 600 000 000</a>
              <a href="mailto:info@kavanviajes.com">info@kavanviajes.com</a>
            </div>
          </div>

          <div className="cto-mark" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="50" cy="50" r="34" />
              <line x1="38" y1="16" x2="38" y2="84" />
              <line x1="62" y1="16" x2="62" y2="84" />
              <line x1="38" y1="50" x2="62" y2="50" />
            </svg>
          </div>

          <div className="cto-panel-bottom">
            <div>
              <p className="cto-place">Marrakech, Marruecos</p>
              <div className="cto-socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://wa.me/34600000000" target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            </div>

            <dl className="cto-hours">
              {HORARIO.map((h) => (
                <div key={h.dias}>
                  <dt className="label">{h.dias}</dt>
                  <dd>{h.horas}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="cto-form-section">
        <Reveal className="cto-form-inner">
          <SplitTitle align="center" text="ESCRÍBENOS {y te contestamos} EN 24 HORAS" />

          {enviado ? (
            <p className="cto-sent" role="status">
              Gracias. Hemos recibido tu mensaje y te contestamos en menos de 24 horas.
            </p>
          ) : (
            <form className="cto-form" onSubmit={onSubmit}>
              <label className="cto-field">
                <span className="label">Nombre</span>
                <input type="text" name="nombre" required autoComplete="name" />
              </label>
              <label className="cto-field">
                <span className="label">Correo</span>
                <input type="email" name="email" required autoComplete="email" />
              </label>
              <label className="cto-field">
                <span className="label">Teléfono</span>
                <input type="tel" name="telefono" autoComplete="tel" />
              </label>
              <label className="cto-field cto-field--wide">
                <span className="label">Qué viaje tienes en mente</span>
                <textarea name="mensaje" rows={4} required />
              </label>
              <button type="submit" className="btn btn-primary cto-submit">Enviar</button>
            </form>
          )}
        </Reveal>
      </section>
    </>
  )
}
