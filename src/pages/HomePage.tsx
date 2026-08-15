import { useFeaturedPacks } from '../queries/hooks'
import { Pic } from '../components/ui/Pic'
import { FullGallery } from '../components/ui/FullGallery'
import { PackShowcase } from '../components/travel/PackShowcase'
import { HomeQuickLinks } from '../components/travel/HomeQuickLinks'
import { MoroccoIntroduction } from '../components/travel/MoroccoIntroduction'
import { DiscoverMorocco } from '../components/travel/DiscoverMorocco'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { HeroZoom } from '../components/fx/HeroZoom'
import { SplitTitle } from '../components/fx/SplitTitle'
import { GALERIA } from '../data/galeria'
import './HomePage.css'

export function HomePage() {
  const { data: featured } = useFeaturedPacks()

  return (
    <>
      <HeroZoom
        mode="static"
        className="hz-hero"
        media={
          <Pic src="art:dunes:home-hero" alt="Dunas del Erg Chebbi al atardecer" priority position="center 58%" />
        }
      >
        <SplitTitle as="h1" text="KAVAN" size="wordmark" className="hz-wordmark" />

        <div className="hz-hero-foot container">
          <p className="hz-hero-lede">
            Rutas privadas por el sur de Marruecos: dunas del Erg&nbsp;Chebbi, kasbahs de adobe,{' '}
            <br />
            gargantas del Todra y noches bajo un cielo sin ciudades cerca.
          </p>
        </div>
      </HeroZoom>

      <FullGallery fotos={GALERIA} auto={3000} />
      <HomeQuickLinks />
      <MoroccoIntroduction />
      <PackShowcase packs={featured ?? []} />
      <DiscoverMorocco />
      <MoroccoMap />
    </>
  )
}
