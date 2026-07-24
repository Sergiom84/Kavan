import { Link } from 'react-router'
import { PageHero } from '../components/ui/PageHero'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import { SplitTitle } from '../components/fx/SplitTitle'
import { Pic } from '../components/ui/Pic'
import './NosotrosPage.css'

/* Cifras del proyecto. Se presentan como en la referencia: número grande en
   serif fina y rótulo diminuto en mono debajo. */
const CIFRAS = [
  { value: '3', unit: 'horas de vuelo', detail: 'Desde España' },
  { value: '6', unit: 'ciudades', detail: 'De Merzouga a Essaouira' },
  { value: '5', unit: 'rutas diseñadas', detail: 'Del desierto a la costa' },
  { value: '6', unit: 'plazas por circuito', detail: '4x4 exclusivo con chófer' },
]

const EQUIPO = [
  { nombre: 'Sergio', rol: 'Dirección y rutas', foto: 'art:medina:equipo-1' },
  { nombre: 'Yasmina', rol: 'Atención al viajero', foto: 'art:arch:equipo-2' },
  { nombre: 'Hamid', rol: 'Guía en destino', foto: 'art:kasbah:equipo-3' },
]

export function NosotrosPage() {
  return (
    <>
      <PageHero
        image="art:stone:nosotros-hero"
        title="Nosotros"
        subtitle="Quiénes somos y cómo trabajamos"
        size="s"
      />

      {/* Misión, con el recurso de tamaños mezclados */}
      <section className="nos-mission">
        <Reveal className="nos-mission-inner">
          <span className="label nos-eyebrow">Nuestra manera de viajar</span>
          <SplitTitle
            align="center"
            text="GRUPOS {pequeños}, GUÍAS {locales}, RUTAS {que no salen en} NINGÚN CATÁLOGO"
          />
        </Reveal>
      </section>

      {/* Cifras */}
      <section className="nos-figures">
        <RevealGroup className="nos-figures-track">
          {CIFRAS.map((c) => (
            <article key={c.unit} className="nos-figure">
              <div className="nos-figure-head">
                <span className="nos-figure-value">{c.value}</span>
                <span className="label nos-figure-unit">{c.unit}</span>
              </div>
              <p className="nos-figure-detail">{c.detail}</p>
            </article>
          ))}
        </RevealGroup>
      </section>

      {/* Cita */}
      <section className="nos-quote">
        <Reveal>
          <span className="label nos-eyebrow">Cómo lo hacemos</span>
          <blockquote>
            «No vendemos plazas en un autobús. Diseñamos un viaje por familia, con
            un chófer que conoce las pistas y una casa donde te esperan con té.»
          </blockquote>
          <p className="nos-quote-author">Equipo de Kavan</p>
        </Reveal>
      </section>

      {/* Equipo */}
      <section className="nos-team container">
        <Reveal>
          <div className="nos-section-head">
            <span className="label">Equipo</span>
          </div>
        </Reveal>
        <RevealGroup className="nos-team-grid">
          {EQUIPO.map((p) => (
            <article key={p.nombre} className="nos-person">
              <div className="frame nos-person-photo">
                <Pic src={p.foto} alt={p.nombre} />
              </div>
              <h3>{p.nombre}</h3>
              <span className="label">{p.rol}</span>
            </article>
          ))}
        </RevealGroup>
      </section>

      {/* Cierre */}
      <section className="nos-cta">
        <Reveal>
          <SplitTitle align="center" text="¿EMPEZAMOS {a diseñar} TU VIAJE?" />
          <div className="nos-cta-actions">
            <Link to="/packs" className="btn btn-primary">Ver los packs</Link>
            <Link to="/contacto" className="btn btn-outline">Hablar con nosotros</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
