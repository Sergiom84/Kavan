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
  const titleRef = useRef<HTMLHeadingElement>(null)

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
      // El desplazamiento táctil del modo móvil no se suma al transform
      // cuando se vuelve a escritorio al redimensionar la ventana.
      viewport.scrollLeft = 0

      /* El título vive pegado al carril, pero en cuanto el pin arranca cede
         su alto a las tarjetas: se colapsa en los primeros px de scroll para
         que la foto y el texto de abajo no se corten en pantallas bajas. El
         arrastre horizontal (más abajo) espera a que termine este colapso:
         si arrancan a la vez, la primera tarjeta ya se está yendo mientras
         el título todavía se ve, y da la sensación de que "no da tiempo". */
      const TITLE_COLLAPSE_PX = 160
      // Después del colapso, deja el primer grupo completo durante un tramo
      // de scroll. Es distancia, no un temporizador ni un avance automático.
      const entryHold = () => window.innerHeight * 0.6
      const titleEl = titleRef.current
      let titleTween: gsap.core.Tween | null = null
      if (titleEl) {
        gsap.set(titleEl, { height: titleEl.offsetHeight, overflow: 'hidden' })
        titleTween = gsap.to(titleEl, {
          height: 0,
          marginBottom: 0,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: `top+=${TITLE_COLLAPSE_PX} top`,
            scrub: true,
          },
        })
      }

      const sizeItems = () => {
        scene.style.setProperty('--pack-entry-hold', `${entryHold()}px`)
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
        const width = (viewport.clientWidth - gap * (VISIBLES - 1)) / VISIBLES
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

      /* Las dunas del fondo acompañan al carril a un octavo de su velocidad.
         Esa diferencia es el efecto: si fueran a la misma, el bloque entero
         parecería una sola imagen deslizándose. El valor sale del transform
         real del carril, no de un cálculo aparte, así que no se puede
         desincronizar. */
      const FACTOR_DUNAS = 0.12
      const sticky = scene.querySelector<HTMLElement>('.pack-showcase-sticky')
      const moverDunas = () => {
        if (!sticky) return
        const x = Number(gsap.getProperty(track, 'x')) || 0
        sticky.style.setProperty('--dunas-x', `${x * FACTOR_DUNAS}px`)
      }

      gsap.fromTo(track, { x: 0 }, {
        x: () => -distance(),
        ease: 'none',
        onUpdate: moverDunas,
        scrollTrigger: {
          trigger: scene,
          start: () => `top+=${TITLE_COLLAPSE_PX + entryHold()} top`,
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: sizeItems,
          /* Sin snap a propósito: con snap, un solo golpe de rueda hacía
             saltar el scroll entero hasta el siguiente tercio (confirmado
             viendo scrollY teletransportarse ~900px en un frame). Sin snap
             el carril avanza proporcional a lo que se scrollea de verdad. */
        },
      })

      return () => {
        scene.classList.remove('is-pinned')
        viewport.classList.remove('is-pinned')
        scene.style.removeProperty('--pasos')
        scene.style.removeProperty('--pack-entry-hold')
        sticky?.style.removeProperty('--dunas-x')
        gsap.set(track, { clearProps: 'transform' })
        items.forEach((item) => {
          item.style.removeProperty('flex')
          item.style.removeProperty('width')
        })
        titleTween?.scrollTrigger?.kill()
        titleTween?.kill()
        if (titleEl) gsap.set(titleEl, { clearProps: 'height,overflow,marginBottom,opacity' })
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
            {title && (
              <Reveal>
                <h2 ref={titleRef} className="pack-showcase-title">{title}</h2>
              </Reveal>
            )}

            <div className="pack-showcase-rail">
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
      </div>

      <div className="pack-showcase-inner container">
        <div className="pack-showcase-closing">
          {to && (
            <Link to={to} onClick={lockNav} className="btn btn-outline pack-showcase-link">
              {linkLabel}
            </Link>
          )}

          <div className="pack-showcase-discover">
            {/* El rótulo entra por la fotografía, apoyado en el filo izquierdo:
                la misma calle a la que mira el texto que viene debajo. */}
            <div className="pack-showcase-discover-band">
              <img
                src="/images/marruecos.webp"
                alt="Calle empedrada de casas azules con buganvillas y el sol poniéndose tras las montañas"
                loading="lazy"
                decoding="async"
              />
              <h3>Descubre Marruecos</h3>
            </div>
            <p>
              Hacer <strong>turismo en Marruecos</strong> es adentrarse en un destino
              lleno de contrastes. Un país único donde las antiguas medinas, mezquitas
              y zocos tradicionales conviven en armonía con impresionantes paisajes
              naturales.
            </p>
            <p>
              Desde los mágicos desiertos y los fértiles oasis del Gran Sur, hasta las
              playas del Atlántico y las cumbres nevadas del Atlas, Marruecos ofrece
              una diversidad inolvidable.
            </p>
            <p className="pack-showcase-discover-subhead">
              <strong>Los imprescindibles de nuestras rutas por Marruecos:</strong>
            </p>
            <ul>
              <li>
                <strong>Marrakech, la Ciudad Imperial:</strong> Explora su fascinante
                medina, recorre los colores de sus zocos y vive el ambiente único de la
                plaza Jemaa el-Fna junto a la majestuosa Mezquita Koutoubia.
              </li>
              <li>
                <strong>Essaouira y la Costa Atlántica:</strong> Descubre la joya
                bohemia del Atlántico. Pasea por su medina blanca amurallada, contempla
                su puerto pesquero y disfruta del ambiente marino.
              </li>
              <li>
                <strong>Ruta de las Kasbahs y el Gran Sur:</strong> Recorre antiguas
                fortalezas bereberes de arcilla y piedra, explora palmerales infinitos
                y vive la magia inolvidable de las dunas del Sáhara.
              </li>
            </ul>
            <p>
              Marruecos es, sin duda, <strong>el más cercano de los grandes viajes</strong>.
            </p>
            <p>
              Marruecos es una fascinante combinación de modernidad y tradición. Un
              país de contrastes donde explorar medinas históricas, vibrantes zocos y
              grandiosas fortalezas. Su variada geografía abarca desde los mágicos
              desiertos del Sáhara y los oasis del Gran Sur, hasta la brisa marina del
              Atlántico y majestuosas cordilleras montañosas.
            </p>
            <p>
              Durante tu <strong>viaje a Marruecos</strong>, podrás sumergirte en el
              encanto imperial de <strong>Marrakech</strong> y admirar su patrimonio
              histórico. En la costa, te espera la encantadora{' '}
              <strong>Essaouira</strong>, con sus murallas costeras y su ambiente
              relajado. Adentrándote hacia el interior, recorrerás la mítica{' '}
              <strong>Ruta de las Kasbahs</strong>, repleta de fortalezas bereberes
              tradicionales y palmerales que se recortan sobre las dunas del desierto.
            </p>
            <p>
              Déjate sorprender por la hospitalidad local y convierte tu próxima
              escapada a Marruecos en un viaje memorable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
