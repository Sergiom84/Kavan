import { imageCredits } from '../data/imageCredits'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/fx/RevealText'
import './CreditosPage.css'

/** Atribución de las fotografías, exigida por sus licencias libres. */
export function CreditosPage() {
  return (
    <>
      <PageHero
        image="art:arch:creditos"
        title="Créditos fotográficos"
        subtitle="Las imágenes de esta web proceden de Wikimedia Commons y se reproducen bajo licencias libres, citando a su autor."
        size="s"
      />

      <section className="section container">
        <Reveal>
          <ul className="creditos-list">
            {imageCredits.map((c) => (
              <li key={c.file} className="creditos-item">
                <div className="creditos-thumb frame">
                  <img src={`/images/${c.file}`} alt="" loading="lazy" />
                </div>
                <div className="creditos-body">
                  <h3>{c.title}</h3>
                  <p>{c.author}</p>
                </div>
                <div className="creditos-meta">
                  <span className="label">{c.license}</span>
                  <a href={c.source} target="_blank" rel="noreferrer" className="link-arrow">
                    Original
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  )
}
