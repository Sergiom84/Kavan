import { usePacks } from '../queries/hooks'
import { PageHero } from '../components/ui/PageHero'
import { PackCard } from '../components/travel/PackCard'
import { RevealGroup } from '../components/fx/RevealText'
import './PacksPage.css'

/** Página 4: todos los packs. */
export function PacksPage() {
  const { data: packs } = usePacks()

  return (
    <>
      <PageHero
        image="art:kasbah:packs-hero"
        title="Nuestros viajes"
        subtitle="Rutas diseñadas y probadas, listas para hacerlas tuyas."
        size="m"
      />

      <section className="section container">
        <RevealGroup className="packs-grid">
          {(packs ?? []).map((p) => (
            <PackCard key={p.id} pack={p} showCities={false} />
          ))}
        </RevealGroup>
      </section>
    </>
  )
}
