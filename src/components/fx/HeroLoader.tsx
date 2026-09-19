import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './HeroLoader.css'

/**
 * Entrada de la portada: el wordmark de Kavan se abre por la mitad y el hueco
 * se convierte en la fotografía de campamento que preside el hero.
 *
 * El wordmark no es tipografía sino `Logotipo sin Morocco.png` con máscara, así
 * que la palabra no se puede partir letra a letra. Se parte la propia imagen:
 * dos ventanas recortadas del mismo PNG —una encuadrada en «KA», otra en
 * «VAN»— que se separan al crecer la caja. La tipografía es entonces la del
 * logo real, no una aproximación.
 *
 * Termina con `hero.png` a pantalla completa, la misma fotografía con la que
 * arranca `BurstGallery`: al desvanecerse el velo no hay corte visible.
 */

/** Las tres fotografías que se relevan dentro del hueco antes de la definitiva. */
const RELEVO = [
  { src: '/images/ait-ben-haddou.webp', alt: '' },
  { src: '/images/medina.webp', alt: '' },
  { src: '/images/dunas-erg-chebbi.webp', alt: '' },
]

/** Fotografía final: la misma que abre el hero. */
const FINAL = '/images/hero.png'

/** La palabra se queda quieta este tiempo antes de abrirse. Petición expresa:
    que se lea «Kavan» antes de que ocurra nada más. */
const ESPERA_ANTES_DE_ABRIR = 2

/** La entrada se reproduce en cada carga de la portada —decisión de Sergio el
    2026-09-19, sabiendo que cansa en visitas repetidas—. Solo la salta quien
    pide menos movimiento en su sistema. */
function debeReproducirse() {
  if (typeof window === 'undefined') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function HeroLoader() {
  const [activo, setActivo] = useState(debeReproducirse)
  const rootRef = useRef<HTMLDivElement>(null)

  const cerrar = useCallback(() => setActivo(false), [])

  useLayoutEffect(() => {
    if (!activo) return
    const root = rootRef.current
    if (!root) return

    document.body.classList.add('hero-loader-abierto')

    const ctx = gsap.context(() => {
      const mitades = gsap.utils.toArray<HTMLElement>('.hero-loader__mark')
      const inicio = root.querySelector<HTMLElement>('.hero-loader__half--start')
      const fin = root.querySelector<HTMLElement>('.hero-loader__half--end')
      const caja = root.querySelector<HTMLElement>('.hero-loader__box')
      const creciendo = root.querySelector<HTMLElement>('.hero-loader__growing')
      const relevo = gsap.utils.toArray<HTMLElement>('.hero-loader__relay')

      const tl = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: cerrar,
      })

      tl.from(mitades, { yPercent: 105, duration: 1.25, stagger: 0.08 }, 0)

      /* Apertura: la caja empuja las dos mitades y la fotografía crece con ella. */
      const apertura = 1.25 + ESPERA_ANTES_DE_ABRIR
      tl.fromTo(caja, { width: '0em' }, { width: '1em', duration: 1.25 }, apertura)
      tl.fromTo(creciendo, { width: '0%' }, { width: '100%', duration: 1.25 }, apertura)
      tl.fromTo(inicio, { x: '0em' }, { x: '-0.05em', duration: 1.25 }, apertura)
      tl.fromTo(fin, { x: '0em' }, { x: '0.05em', duration: 1.25 }, apertura)

      /* Relevo de fotografías dentro del hueco. Cada una se apaga y deja ver la
         siguiente; bajo la última está ya la definitiva. */
      const cambios = apertura + 1.2
      tl.to(
        relevo,
        { opacity: 0, duration: 0.05, ease: 'none', stagger: 0.55 },
        cambios,
      )

      /* La definitiva se come la pantalla. */
      const expansion = cambios + relevo.length * 0.55 + 0.45
      tl.to(creciendo, { width: '100vw', height: '100dvh', duration: 1.8 }, expansion)
      tl.to(caja, { width: '110vw', duration: 1.8 }, expansion)
      tl.to(root, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, expansion + 1.55)
    }, root)

    return () => {
      document.body.classList.remove('hero-loader-abierto')
      ctx.revert()
    }
  }, [activo, cerrar])

  if (!activo) return null

  return (
    <div className="hero-loader" ref={rootRef} role="presentation">
      <div className="hero-loader__word">
        <div className="hero-loader__half hero-loader__half--start">
          <span className="hero-loader__mark" />
        </div>

        <div className="hero-loader__box">
          <div className="hero-loader__box-inner">
            <div className="hero-loader__growing">
              <div className="hero-loader__growing-wrap">
                {RELEVO.map((foto, indice) => (
                  <img
                    key={foto.src}
                    className="hero-loader__relay"
                    style={{ zIndex: RELEVO.length - indice }}
                    src={foto.src}
                    alt={foto.alt}
                    loading="eager"
                    decoding="async"
                  />
                ))}
                <img
                  className="hero-loader__cover"
                  src={FINAL}
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-loader__half hero-loader__half--end">
          <span className="hero-loader__mark" />
        </div>
      </div>

      <span className="hero-loader__sr">Kavan</span>
    </div>
  )
}
