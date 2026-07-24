import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { AdvisorButton } from './AdvisorButton'

export function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const titles: [RegExp, string][] = [
      [/^\/$/, 'Kavan — Viajes a Marruecos'],
      [/^\/destinos$/, 'Destinos — Kavan'],
      [/^\/destinos\//, 'Destino — Kavan'],
      [/^\/packs$/, 'Nuestros viajes — Kavan'],
      [/^\/packs\/.+\/itinerario$/, 'Itinerario — Kavan'],
      [/^\/packs\/.+\/detalles$/, 'Detalles del viaje — Kavan'],
      [/^\/packs\/.+\/viaje$/, 'El viaje — Kavan'],
      [/^\/packs\//, 'Pack de viaje — Kavan'],
      [/^\/puntos-de-interes$/, 'Puntos de interés — Kavan'],
      [/^\/consejos$/, 'Consejos de viaje — Kavan'],
    ]
    document.title = titles.find(([re]) => re.test(pathname))?.[1] ?? 'Kavan — Viajes a Marruecos'
  }, [pathname])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <AdvisorButton />
      <Footer />
    </>
  )
}
