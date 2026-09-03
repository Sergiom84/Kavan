import { usePacks } from '../queries/hooks'
import { PackShowcase } from '../components/travel/PackShowcase'
import { HomeQuickLinks } from '../components/travel/HomeQuickLinks'
import { MoroccoIntroduction } from '../components/travel/MoroccoIntroduction'
import { DiscoverMorocco } from '../components/travel/DiscoverMorocco'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { BurstGallery } from '../components/fx/BurstGallery'
import { HERO_RAFAGA } from '../data/galeria'
import './HomePage.css'

/** Portada del carrusel destacado: los 6 recorridos de referencia, sin variantes de noches. */
const EXCLUDED_FROM_HOME_SLUG = 'marrakech-ouarzazate-dades-merzouga-1-noche'

export function HomePage() {
  const { data: packs } = usePacks()
  const homePacks = packs?.filter((p) => p.slug !== EXCLUDED_FROM_HOME_SLUG)

  return (
    <>
      <BurstGallery
        className="hz-hero"
        fotos={HERO_RAFAGA}
        media={
          <img src="/images/hero.png" alt="Campamento entre las dunas de Marruecos al atardecer" fetchPriority="high" />
        }
        continuation={<HomeQuickLinks />}
        closingCopy={
          <p className="hz-hero-lede">
            Rutas privadas por el sur de Marruecos: dunas del Erg&nbsp;Chebbi, kasbahs de adobe,{' '}
            <br />
            gargantas del Todra y noches bajo un cielo sin ciudades cerca.
          </p>
        }
      >
        <h1 className="hz-wordmark">
          <img src="/images/logo-kavan.png" alt="Kavan" />
        </h1>
      </BurstGallery>
      <MoroccoIntroduction />
      <PackShowcase packs={homePacks ?? []} />
      <DiscoverMorocco />
      <MoroccoMap />
    </>
  )
}
