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

/** Las tres fotografías que se relevan dentro del hueco antes de la definitiva.
    Como el hueco recorta la foto en vez de encogerla, lo único que se ve es el
    centro del encuadre: `medina.webp` enseñaba un muro y `dunas-erg-chebbi` una
    ladera lisa, las dos ilegibles en una franja. Estas tres tienen materia en
    el centro y ordenan el viaje: adobe, roca, arena, campamento. */
const RELEVO = [
  { src: '/images/ait-ben-haddou.webp', alt: '' },
  { src: '/images/todra-garganta.webp', alt: '' },
  { src: '/images/dunas-amanecer.webp', alt: '' },
]

/** Fotografía final: la misma que abre el hero. */
const FINAL = '/images/hero.png'

/** Lo que tarda la palabra en entrar. */
const ENTRADA_DE_LA_PALABRA = 0.9

/** La palabra se queda quieta este tiempo antes de abrirse. Con la entrada
    delante, el hueco empieza a abrirse a los dos segundos de arrancar. */
const ESPERA_ANTES_DE_ABRIR = 1.1

/** Cuánto se separan «KA» y «VAN» mientras se relevan las fotografías. Como la
    foto no se escala sino que se descubre, el hueco es el encuadre: con 1em
    —el alto de las letras— solo cabía un recorte central sin asunto. Vive en el
    CSS porque en pantalla estrecha la palabra ya ocupa casi todo el ancho y un
    hueco de escritorio echaría la K y la N fuera. */
const anchoDelHueco = (root: HTMLElement) =>
  getComputedStyle(root).getPropertyValue('--hueco').trim() || '2.6em'

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

      tl.from(
        mitades,
        { yPercent: 105, duration: ENTRADA_DE_LA_PALABRA, stagger: 0.06 },
        0,
      )

      /* Apertura: la caja empuja las dos mitades y la ventana se abre sobre la
         fotografía, que ya está a tamaño completo detrás. */
      const apertura = ENTRADA_DE_LA_PALABRA + ESPERA_ANTES_DE_ABRIR
      const hueco = anchoDelHueco(root)
      tl.fromTo(caja, { width: '0em' }, { width: hueco, duration: 1.1 }, apertura)
      tl.fromTo(creciendo, { width: '0%' }, { width: '100%', duration: 1.1 }, apertura)
      tl.fromTo(inicio, { x: '0em' }, { x: '-0.09em', duration: 1.1 }, apertura)
      tl.fromTo(fin, { x: '0em' }, { x: '0.09em', duration: 1.1 }, apertura)

      /* Relevo de fotografías dentro del hueco. Cada una se apaga y deja ver la
         siguiente; bajo la última está ya la definitiva. */
      const cambios = apertura + 1.05
      tl.to(
        relevo,
        { opacity: 0, duration: 0.05, ease: 'none', stagger: 0.5 },
        cambios,
      )

      /* La definitiva se come la pantalla. */
      const expansion = cambios + relevo.length * 0.5 + 0.35
      tl.to(creciendo, { width: '100vw', height: '100dvh', duration: 1.6 }, expansion)
      tl.to(caja, { width: '110vw', duration: 1.6 }, expansion)
      tl.to(root, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, expansion + 1.5)
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
