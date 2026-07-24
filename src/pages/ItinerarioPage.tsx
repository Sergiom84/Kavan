import { useParams } from 'react-router'
import { usePack } from '../queries/hooks'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { ItineraryTimeline } from '../components/travel/ItineraryTimeline'
import { RelatedPacks } from '../components/travel/RelatedPacks'
import { Reveal } from '../components/fx/RevealText'

/** Página 6: itinerario del pack. */
export function ItinerarioPage() {
  const { slug } = useParams()
  const { data: pack } = usePack(slug)

  if (!pack) return null

  return (
    <>
      <section className="section container" style={{ paddingBottom: 0 }}>
        <Reveal>
          <div className="section-heading">
            <h2>Itinerario</h2>
          </div>
        </Reveal>
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: pack.title, to: `/packs/${pack.slug}` }]} />
      </section>

      <section className="section container">
        <ItineraryTimeline pack={pack} />
      </section>

      <RelatedPacks excludeSlug={pack.slug} />
    </>
  )
}
