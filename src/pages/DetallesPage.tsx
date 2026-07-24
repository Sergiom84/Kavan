import { Link, useParams } from 'react-router'
import { usePack } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import './DetallesPage.css'

/**
 * Página 7: detalles / qué incluye.
 * Corrección de la reunión: sin la tarjeta lateral "Resumen del pack".
 */
export function DetallesPage() {
  const { slug } = useParams()
  const { data: pack } = usePack(slug)

  if (!pack) return null
  const incluye = pack.details.filter((d) => d.type === 'incluye')
  const noIncluye = pack.details.filter((d) => d.type === 'no_incluye')
  const notas = pack.details.filter((d) => d.type === 'nota_importante')

  const tabs = [
    { label: 'Itinerario', to: `/packs/${pack.slug}/itinerario` },
    { label: 'Detalles', to: `/packs/${pack.slug}/detalles`, active: true },
    { label: 'Consejos', to: '/consejos' },
    { label: 'Calculadora', to: `/reserva/${pack.slug}` },
  ]

  return (
    <>
      <PageHero image={pack.heroImageUrl} title={pack.title} subtitle={pack.subtitle} size="m" />

      {/* Tabs de navegación del pack */}
      <nav className="detalles-tabs">
        <div className="container detalles-tabs-inner">
          {tabs.map((t) => (
            <Link key={t.label} to={t.to} className={t.active ? 'is-active' : ''}>
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="section container detalles-layout">
        <div>
          <Reveal>
            <h2 className="detalles-title">Qué incluye</h2>
          </Reveal>
          <RevealGroup className="detalles-list">
            {incluye.map((d) => (
              <div key={d.content} className="detalles-item">
                <span className="detalles-check" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {d.content}
              </div>
            ))}
          </RevealGroup>

          <Reveal>
            <h2 className="detalles-title">No incluye</h2>
          </Reveal>
          <RevealGroup className="detalles-list">
            {noIncluye.map((d) => (
              <div key={d.content} className="detalles-item">
                <span className="detalles-check is-no" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </span>
                {d.content}
              </div>
            ))}
          </RevealGroup>

          <Reveal className="detalles-notes card">
            <h4>Notas importantes</h4>
            <ul>
              {notas.map((d) => (
                <li key={d.content}>{d.content}</li>
              ))}
            </ul>
          </Reveal>

          <RevealGroup>
            {pack.highlights.map((h) => (
              <div key={h.title} className="detalles-highlight card">
                <h3>{h.title}</h3>
                <p>{h.description}</p>
              </div>
            ))}
          </RevealGroup>
        </div>

        <aside className="detalles-side">
          <Reveal className="card detalles-side-card">
            <Link to={`/reserva/${pack.slug}`} className="btn btn-primary">
              Reservar ahora
            </Link>
            <a
              href="https://wa.me/34600000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Consultar por WhatsApp
            </a>
          </Reveal>
        </aside>
      </section>
    </>
  )
}
