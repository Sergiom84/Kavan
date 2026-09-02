import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerLenis } from '../../lib/lenisControl'
import { Header } from './Header'
import { Footer } from './Footer'
import { AdvisorButton } from './AdvisorButton'

/* Sin `Preloader`: la pantalla de arranque con las dunas y el contador de 0 a
   100% se retiró por decisión de Sergio (2026-07-29), no convencía. El
   componente sigue en `fx/Preloader` porque `design-system/MASTER.md` lo cita
   como referencia de tono para los estados de carga; si vuelve a hacer falta
   una espera real, se parte de ahí. */
gsap.registerPlugin(ScrollTrigger)

export function SiteLayout() {
  const { pathname } = useLocation()

  /* Scroll suave. Es la mitad de la sensación de lujo del original: sin él,
     los reveals se disparan a saltos y el parallax da tirones. Lenis conduce
     el reloj de GSAP para que ambos vayan en el mismo fotograma. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    registerLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const onRaf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onRaf)
      registerLenis(null)
      lenis.destroy()
    }
  }, [])

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
      [/^\/nosotros$/, 'Nosotros — Kavan'],
      [/^\/contacto$/, 'Contacto — Kavan'],
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
