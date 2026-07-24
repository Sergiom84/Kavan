import { useTravelTips } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { Reveal, RevealGroup } from '../components/fx/RevealText'
import './ConsejosPage.css'

const TIP_ICONS: Record<string, string> = {
  moneda: 'M12 3v18M7 7.5C7 6 8.5 5 12 5s5 1 5 2.5S15.5 10 12 10s-5 1-5 2.5S8.5 15 12 15s5 1 5 2.5S15.5 19 12 19s-5-1-5-2.5',
  clima: 'M12 4v2M4 12H2m20 0h-2M6.3 6.3 4.9 4.9m14.2 1.4 1.4-1.4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z',
  telefono: 'M7 3h4l1.5 5-2.5 2a12 12 0 0 0 4 4l2-2.5 5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2Z',
  horaria: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3.5 2',
  electricidad: 'M13 2 5 13h5l-1 9 8-11h-5l1-9Z',
  propinas: 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 6c2-2.5 4-3.5 7-3.5s5 1 7 3.5M4 18h16v3H4Z',
  religion: 'M12 3c1 2.5 3 4 5 4.5V21H7V7.5C9 7 11 5.5 12 3Zm-8 18h16M10 21v-4a2 2 0 1 1 4 0v4',
  idioma: 'M4 5h9M8.5 3v2m1.5 0c-1 4.5-3.5 8-6 10m2-5c1.5 2.5 4 5 6 6m2 5 4-10 4 10m-1.5-3.5h-5',
  compras: 'M6 8h12l1 13H5L6 8Zm3 0V6a3 3 0 1 1 6 0v2',
  indumentaria: 'M9 3 4 6l2 4 2-1v12h8V9l2 1 2-4-5-3a3 3 0 0 1-6 0Z',
  sanitarios: 'M9 4h6v5h5v6h-5v5H9v-5H4V9h5V4Z',
}

/** Página 10: consejos de Marruecos. */
export function ConsejosPage() {
  const { data: tips } = useTravelTips()
  const notes = (tips ?? []).filter((t) => !['embajada', 'visado'].includes(t.slug))
  const sidebar = (tips ?? []).filter((t) => ['embajada', 'visado'].includes(t.slug))

  return (
    <>
      <PageHero image="art:oasis:consejos-hero" title="Consejos" subtitle="Marruecos" size="s" />

      {/* Datos rápidos */}
      <section className="section container">
        <RevealGroup className="consejos-quick card">
          <div className="consejos-quick-item">
            <span className="label">Idioma</span>
            <strong>Árabe / Bereber</strong>
          </div>
          <div className="consejos-quick-item">
            <span className="label">Moneda</span>
            <strong>MAD</strong>
          </div>
          <div className="consejos-quick-item">
            <span className="label">Prefijo telefónico</span>
            <strong>+212</strong>
          </div>
        </RevealGroup>
      </section>

      {/* Notas + lateral */}
      <section className="section container consejos-layout">
        <RevealGroup className="consejos-list">
          {notes.map((tip) => (
            <article key={tip.slug} className="consejos-item">
              <span className="consejos-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d={TIP_ICONS[tip.slug] ?? TIP_ICONS.moneda} />
                </svg>
              </span>
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.content}</p>
              </div>
            </article>
          ))}
        </RevealGroup>

        <aside className="consejos-side">
          {sidebar.map((tip) => (
            <Reveal key={tip.slug} className="consejos-side-card card">
              <h4>{tip.title}</h4>
              <p>{tip.content}</p>
            </Reveal>
          ))}
        </aside>
      </section>
    </>
  )
}
