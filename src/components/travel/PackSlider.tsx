import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Pack } from '../../lib/types'
import { formatPrice } from '../../lib/pricing'
import { lockNav } from '../../lib/demoLock'
import { armarRefrescoScroll, registrarFijado } from '../../lib/scroll'
import { cities } from '../../data/seed'
import { resolveImage } from '../ui/Pic'
import { PackCard } from './PackCard'
import './PackSlider.css'

gsap.registerPlugin(ScrollTrigger)

/* El barrido entra por el filo derecho y descubre la lámina hacia la izquierda.
   Los cuatro puntos son los mismos en los dos estados: sin eso, el polígono no
   se puede interpolar y el barrido se convierte en un corte seco. */
const OCULTA = 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
const VISIBLE = 'polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)'

/** La mitad de abajo llega un poco después que la de arriba. Es el desfase que
    hace que las dos bandas se lean como dos piezas y no como una foto partida. */
const DESFASE = 0.12

type Props = {
  packs: Pack[]
  title?: string
}

const ciudadDe = (pack: Pack) =>
  cities.find((c) => c.slug === pack.citySlugs[0])?.name ?? pack.title

/** El recorrido comercial manda; las ciudades del sistema son el respaldo.
    Mismo criterio que `PackCard`, que es de donde viene este dato. */
const rutaDe = (pack: Pack) =>
  pack.routeLabel ??
  pack.citySlugs
    .map((s) => cities.find((c) => c.slug === s)?.name)
    .filter(Boolean)
    .join(' · ')

/**
 * Escaparate de portada. La fotografía del viaje vive partida en dos bandas
 * desplazadas; al bajar, la siguiente entra con un barrido desde el filo
 * derecho mientras el nombre de la ciudad se desplaza por su carril y la ficha
 * de cristal, dentro de la propia fotografía, cambia de viaje.
 *
 * Puerto del slider modular de referencia (`Kavan_ideas/modular-slider`), con
 * el avance atado al scroll en vez de al clic: en esta web el clic lleva a la
 * ficha del pack y no puede significar además "siguiente".
 */
export function PackSlider({ packs, title = 'Viajes más deseados' }: Props) {
  const sceneRef = useRef<HTMLElement>(null)
  const rotulosRef = useRef<HTMLDivElement>(null)
  const laminasRef = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(0)
  const [conEfecto, setConEfecto] = useState(false)

  useLayoutEffect(() => {
    const scene = sceneRef.current
    const rotulos = rotulosRef.current
    const laminas = laminasRef.current
    if (!scene || !rotulos || !laminas || packs.length < 2) return

    armarRefrescoScroll()
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      setConEfecto(true)

      const altas = gsap.utils.toArray<HTMLElement>('[data-capa="alta"]', laminas)
      const bajas = gsap.utils.toArray<HTMLElement>('[data-capa="baja"]', laminas)
      const rotuloEls = gsap.utils.toArray<HTMLElement>('[data-rotulo]', rotulos)
      const pasos = packs.length - 1
      if (!altas.length || pasos < 1) return

      const foto = (capa: HTMLElement) => capa.querySelector('img')

      altas.concat(bajas).forEach((capa, i) => {
        const primera = i === 0 || i === altas.length
        gsap.set(capa, { clipPath: primera ? VISIBLE : OCULTA })
        gsap.set(foto(capa), { scale: primera ? 1 : 2 })
      })
      gsap.set(rotuloEls, { opacity: (i: number) => (i === 0 ? 1 : 0.18) })
      gsap.set(rotulos, { xPercent: 0 })

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
          /* La ficha cambia cuando la lámina nueva ya ocupa la mayor parte del
             cuadro; antes, el precio pertenecía a una foto que aún no se ve. */
          onUpdate: (self) => {
            const siguiente = Math.min(pasos, Math.max(0, Math.floor(self.progress * pasos + 0.35)))
            setActivo((actual) => (actual === siguiente ? actual : siguiente))
          },
        },
      })

      for (let i = 1; i <= pasos; i += 1) {
        const tramo = i - 1
        tl.to(altas[i], { clipPath: VISIBLE, duration: 1 }, tramo)
        tl.to(foto(altas[i]), { scale: 1, duration: 1 }, tramo)
        tl.to(bajas[i], { clipPath: VISIBLE, duration: 1 }, tramo + DESFASE)
        tl.to(foto(bajas[i]), { scale: 1, duration: 1 }, tramo + DESFASE)

        tl.to(rotulos, { xPercent: (-100 / packs.length) * i, duration: 1 }, tramo)
        tl.to(rotuloEls[i], { opacity: 1, duration: 1 }, tramo)
        tl.to(rotuloEls[i - 1], { opacity: 0.18, duration: 1 }, tramo)
      }

      /* Este bloque depende de datos, así que su pin nace más tarde que los de
         abajo. Al apuntarse, los que ya estaban recuperan su sitio: sin esto se
         quedan con la posición que midieron cuando aquí no había nada que
         fijar, y se clavan encima de este bloque. */
      const soltarPrioridad = registrarFijado(scene, tl.scrollTrigger)

      return () => {
        soltarPrioridad()
        setConEfecto(false)
        setActivo(0)
        tl.scrollTrigger?.kill()
        tl.kill()
        gsap.set(altas.concat(bajas), { clearProps: 'clip-path' })
        gsap.set(rotuloEls.concat(rotulos), { clearProps: 'transform,opacity' })
      }
    })

    return () => mm.revert()
  }, [packs])

  if (!packs.length) return null

  const pack = packs[Math.min(activo, packs.length - 1)]

  return (
    <section ref={sceneRef} className="pack-slider" aria-labelledby="pack-slider-title">
      <div className="pack-slider__escena">
        <h2 id="pack-slider-title" className="pack-slider__titulo">
          {title}
        </h2>

        {/* Los nombres se desplazan por su propio carril, como en la
            referencia. Para quien no ve la pantalla, la lista de abajo dice lo
            mismo sin depender del scroll. */}
        <div className="pack-slider__rotulos" aria-hidden="true">
          <div
            className="pack-slider__carril"
            ref={rotulosRef}
            style={{ width: `${packs.length * 100}%` }}
          >
            {packs.map((p) => (
              <span className="pack-slider__rotulo" data-rotulo key={p.id}>
                {ciudadDe(p)}
              </span>
            ))}
          </div>
        </div>

        <div className="pack-slider__laminas" ref={laminasRef}>
          <div className="pack-slider__mitad pack-slider__mitad--alta">
            {packs.map((p, i) => (
              <div className="pack-slider__capa" data-capa="alta" key={p.id}>
                <img
                  src={resolveImage(p.heroImageUrl)}
                  alt={i === 0 ? p.title : ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          <div className="pack-slider__mitad pack-slider__mitad--baja">
            {packs.map((p) => (
              <div className="pack-slider__capa" data-capa="baja" key={p.id}>
                <img src={resolveImage(p.heroImageUrl)} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>

          {/* La ficha vive dentro de la fotografía, sobre la banda de abajo. */}
          <Link
            to={`/packs/${pack.slug}`}
            onClick={lockNav}
            className="pack-slider__ficha"
            key={pack.id}
          >
            <span className="pack-slider__ficha-ciudad">{ciudadDe(pack)}</span>
            <span className="pack-slider__ficha-dato">
              {pack.days} días · {pack.nights} noches
            </span>
            {/* El recorrido: es lo que contaba la tarjeta del carril anterior y
                lo que distingue dos packs que salen de la misma ciudad. En los
                que no salen de ella, repetiría el rótulo y no se enseña. */}
            {rutaDe(pack) !== ciudadDe(pack) && (
              <span className="pack-slider__ficha-ruta">
                <span className="sr-only">Recorrido: </span>
                {rutaDe(pack)}
              </span>
            )}
            <span className="pack-slider__ficha-precio">Desde {formatPrice(pack.priceFrom)}</span>
          </Link>
        </div>

        <ul className="sr-only">
          {packs.map((p) => (
            <li key={p.id}>
              <Link to={`/packs/${p.slug}`} onClick={lockNav}>
                {p.title} — {p.days} días, {p.nights} noches, desde {formatPrice(p.priceFrom)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sin el efecto —móvil, tableta o movimiento reducido— el bloque enseña
          los viajes tal cual, sin pin ni barridos. */}
      {!conEfecto && (
        <div className="pack-slider__rejilla">
          {packs.map((p) => (
            <PackCard key={p.id} pack={p} variant="home" />
          ))}
        </div>
      )}
    </section>
  )
}
