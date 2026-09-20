import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { armarRefrescoScroll, registrarFijado } from '../../lib/scroll'
import './MoroccoTriptych.css'

gsap.registerPlugin(ScrollTrigger)

const LAMINAS = [
  {
    src: '/images/todra-garganta.webp',
    alt: 'Paredes verticales de las gargantas del Todra',
  },
  {
    src: '/images/ait-ben-haddou.webp',
    alt: 'Ksar de Ait Ben Haddou al atardecer',
  },
  {
    src: '/images/ouarzazate-atlas.webp',
    alt: 'Kasbahs y montañas del Atlas en Ouarzazate',
  },
]

/**
 * El retrato deja de estar solo. La primera lámina entra centrada y, a cada
 * tramo de scroll, llega otra desde fuera del margen derecho mientras el grupo
 * se recoloca: al final las tres están en fila con la del medio centrada en la
 * pantalla y las otras dos simétricas a su lado.
 *
 * Mismo mecanismo que el rail de PackShowcase y que el bloque «Antes de tu
 * visita» de Lucy-lara-site: pin + scrub, cada lámina con su propio `x` para
 * que parezca que viene de fuera, y el carril con el suyo para el encuadre.
 */
export function MoroccoTriptych() {
  const sceneRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scene = sceneRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!scene || !viewport || !track) return

    armarRefrescoScroll()
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const laminas = gsap.utils.toArray<HTMLElement>('[data-lamina]', track)
      const pasos = laminas.length - 1
      if (pasos < 1) return

      viewport.classList.add('is-pinned')

      /* Ancho del grupo formado por las `k` primeras láminas, medido en el
         carril. Con láminas iguales, centrar el grupo de tres deja la del
         medio en el eje de la pantalla sin cálculos aparte. */
      const anchoGrupo = (k: number) => {
        const ultima = laminas[k - 1]
        return ultima ? ultima.offsetLeft + ultima.offsetWidth : 0
      }
      const centrado = (k: number) => viewport.clientWidth / 2 - anchoGrupo(k) / 2
      /* Sitio de espera de la lámina `i`: justo fuera del margen derecho, con
         el carril en el encuadre que tendrá al empezar ese tramo. */
      const entrada = (i: number) =>
        viewport.clientWidth - centrado(i) - (laminas[i]?.offsetLeft ?? 0) + 48

      gsap.set(track, { x: () => centrado(1) })
      laminas.forEach((lamina, i) => {
        if (i > 0) gsap.set(lamina, { x: () => entrada(i) })
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * pasos)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      laminas.forEach((lamina, i) => {
        if (i === 0) return
        const tramo = i - 1
        tl.fromTo(
          lamina,
          { x: () => entrada(i) },
          { x: 0, duration: 1, immediateRender: false },
          tramo,
        )
        tl.to(track, { x: () => centrado(i + 1), duration: 1 }, tramo)
      })

      const soltarPrioridad = registrarFijado(scene, tl.scrollTrigger)

      return () => {
        soltarPrioridad()
        viewport.classList.remove('is-pinned')
        gsap.set([track, ...laminas], { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sceneRef} className="triptico" aria-label="Paisajes de Marruecos">
      <div ref={viewportRef} className="triptico__viewport">
        <div ref={trackRef} className="triptico__track">
          {LAMINAS.map((lamina) => (
            <figure key={lamina.src} className="triptico__lamina" data-lamina>
              <img src={lamina.src} alt={lamina.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
