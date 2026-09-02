import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Pack } from '../../lib/types'
import { lockNav } from '../../lib/demoLock'
import { armarRefrescoScroll } from '../../lib/scroll'
import { Reveal } from '../fx/RevealText'
import { PackCard } from './PackCard'
import './PackShowcase.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  packs: Pack[]
  title?: string
  /** Acción centrada bajo el grid. Sin valor, el bloque no muestra CTA. */
  to?: string
  linkLabel?: string
}

const VISIBLES = 3

/**
 * Escaparate de portada: tres viajes a la vista. En escritorio el scroll
 * desplaza el carril y van entrando los que no cabían; luego la página sigue.
 */
export function PackShowcase({
  packs,
  title = 'Viajes más deseados',
  to = '/packs',
  linkLabel = 'Ver todos los viajes',
}: Props) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scene = sceneRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!scene || !viewport || !track || packs.length <= VISIBLES) return

    armarRefrescoScroll()
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray<HTMLElement>('.pack-showcase-item', track)
      const pasos = Math.max(0, items.length - VISIBLES)
      if (pasos === 0) return

      scene.style.setProperty('--pasos', String(pasos))
      scene.classList.add('is-pinned')
      viewport.classList.add('is-pinned')

      const sizeItems = () => {
        const host = viewport.parentElement ?? viewport
        const width = host.clientWidth / VISIBLES
        items.forEach((item) => {
          item.style.flex = `0 0 ${width}px`
          item.style.width = `${width}px`
        })
      }
      const distance = () => {
        sizeItems()
        const first = items[0]
        const lastStart = items[pasos]
        if (!first || !lastStart) return 0
        return Math.max(0, lastStart.offsetLeft - first.offsetLeft)
      }
      sizeItems()

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: sizeItems,
          snap: {
            snapTo: 1 / pasos,
            duration: { min: 0.12, max: 0.28 },
            delay: 0.05,
            ease: 'power1.inOut',
          },
        },
      })

      return () => {
        scene.classList.remove('is-pinned')
        viewport.classList.remove('is-pinned')
        scene.style.removeProperty('--pasos')
        gsap.set(track, { clearProps: 'transform' })
        items.forEach((item) => {
          item.style.removeProperty('flex')
          item.style.removeProperty('width')
        })
      }
    })

    return () => mm.revert()
  }, [packs])

  if (!packs.length) return null

  return (
    <section className="pack-showcase">
      <div ref={sceneRef} className="pack-showcase-scene">
        <div className="pack-showcase-sticky">
          <div className="pack-showcase-inner container">
            <Reveal>
              <h2 className="pack-showcase-title">{title}</h2>
            </Reveal>

            <div ref={viewportRef} className="pack-showcase-viewport">
              <div ref={trackRef} className="pack-showcase-track">
                {packs.map((p) => (
                  <div className="pack-showcase-item" key={p.id}>
                    <PackCard pack={p} variant="home" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pack-showcase-inner container">
        <div className="pack-showcase-closing">
          {to && (
            <Link to={to} onClick={lockNav} className="btn btn-outline pack-showcase-link">
              {linkLabel}
            </Link>
          )}

          <div className="pack-showcase-discover">
            <h3>Descubre Marruecos.</h3>
            <p>
              De las medinas que despiertan al amanecer a las dunas que cambian con la luz,
              cada ruta abre una forma distinta de viajar Marruecos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
