import { usePacks } from '../queries/hooks'
import { PackShowcase } from '../components/travel/PackShowcase'
import { HomeQuickLinks } from '../components/travel/HomeQuickLinks'
import { MoroccoIntroduction } from '../components/travel/MoroccoIntroduction'
import { DiscoverMorocco } from '../components/travel/DiscoverMorocco'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { BurstGallery } from '../components/fx/BurstGallery'
import { HERO_RAFAGA } from '../data/galeria'
import './HomePage.css'

export function HomePage() {
  const { data: packs } = usePacks()

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
      <PackShowcase packs={packs ?? []} />
      <DiscoverMorocco />
      <MoroccoMap />
    </>
  )
}
