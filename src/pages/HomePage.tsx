import { usePacks } from '../queries/hooks'
import { PackSlider } from '../components/travel/PackSlider'
import { MoroccoOverview } from '../components/travel/MoroccoOverview'
import { HomeQuickLinks } from '../components/travel/HomeQuickLinks'
import { MoroccoIntroduction } from '../components/travel/MoroccoIntroduction'
import { DiscoverMorocco } from '../components/travel/DiscoverMorocco'
import { MoroccoMap } from '../components/travel/MoroccoMap'
import { HeroSplit } from '../components/fx/HeroSplit'
import { HeroLoader } from '../components/fx/HeroLoader'
import { HERO_FALLBACK, HERO_SIZES, HERO_SRCSET } from '../data/portada'
import './HomePage.css'

/** Portada del carrusel destacado: los 6 recorridos de referencia, sin variantes de noches. */
const EXCLUDED_FROM_HOME_SLUG = 'marrakech-ouarzazate-dades-merzouga-1-noche'

export function HomePage() {
  const { data: packs } = usePacks()
  const homePacks = packs?.filter((p) => p.slug !== EXCLUDED_FROM_HOME_SLUG)

  return (
    <>
      <HeroLoader />
      <HeroSplit
        className="hz-hero"
        media={
          <img
            src={HERO_FALLBACK}
            srcSet={HERO_SRCSET}
            sizes={HERO_SIZES}
            alt="Campamento entre las dunas de Marruecos al atardecer"
            fetchPriority="high"
          />
        }
        continuation={<HomeQuickLinks />}
      >
        <h1 className="hz-wordmark">
          <img src="/images/logo-kavan.png" alt="Kavan" />
        </h1>
      </HeroSplit>
      {/* Las tres fotos con zoom que había aquí viven ahora dentro del relato
          de Marruecos, como tríptico que entra con el scroll. */}
      <MoroccoIntroduction />
      <PackSlider packs={homePacks ?? []} />
      {/* El cierre editorial del antiguo carril: la acción hacia el catálogo y
          el texto largo de «Descubre Marruecos». */}
      <MoroccoOverview />
      <DiscoverMorocco />
      <MoroccoMap />
    </>
  )
}
