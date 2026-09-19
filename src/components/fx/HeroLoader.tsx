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
    Se ven enteras y encogidas, así que se sirven ya reducidas a 720 px: el
    hueco mide unos 240 px de ancho y encoger ahí un original de 1800 px las
    dejaba sucias.

    Las tres son apaisadas a propósito: el hueco lo es, y una fotografía
    vertical ahí dentro se recorta tanto que parece ampliada. Ordenan el viaje
    como lo ordena la ruta: kasbah, Atlas, arena, campamento. */
const RELEVO = [
  { src: '/images/loader/ait-ben-haddou-mini.webp', alt: '' },
  { src: '/images/loader/alto-atlas-mini.webp', alt: '' },
  { src: '/images/loader/dunas-amanecer-mini.webp', alt: '' },
]

/** Fotografía final: la misma que abre el hero. Va en dos capas porque tiene
    que verse bien encogida en el hueco y a pantalla completa después: la
    reducida manda mientras es pequeña y cede a la grande en mitad de la
    expansión, cuando las dos se ven igual y el cambio no se nota. */
const FINAL = '/images/hero.png'
const FINAL_MINI = '/images/loader/hero-mini.webp'

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
    document.documentElement.classList.add('hero-loader-abierto')

    const ctx = gsap.context(() => {
      const mitades = gsap.utils.toArray<HTMLElement>('.hero-loader__mark')
      const inicio = root.querySelector<HTMLElement>('.hero-loader__half--start')
      const fin = root.querySelector<HTMLElement>('.hero-loader__half--end')
      const caja = root.querySelector<HTMLElement>('.hero-loader__box')
      const creciendo = root.querySelector<HTMLElement>('.hero-loader__growing')
      const relevo = gsap.utils.toArray<HTMLElement>('.hero-loader__relay')
      /* Nunca debería faltar ninguno: los pinta este mismo componente. Si
         faltaran, se retira el velo en vez de dejarlo puesto tapando la
         portada con el scroll bloqueado. */
      if (!inicio || !fin || !caja || !creciendo) {
        cerrar()
        return
      }

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

      /* La definitiva crece hasta ocupar el sitio exacto del hero.

         Antes crecía a `100vw` × `100dvh` confiando en que el flex la dejaría
         centrada, y no lo hacía: el corte del wordmark cae al 40%, no al 50%,
         así que la ventana terminaba 40 px a la izquierda del hero, y `100vw`
         cuenta la barra de scroll que reaparece al soltar el `overflow`. Esos
         55 px eran el salto. Ahora la ventana se saca del flujo al empezar la
         expansión y se lleva al rectángulo medido del hero, de modo que el
         último fotograma del velo cae encima del hero por construcción y no
         por coincidencia. */
      const expansion = cambios + relevo.length * 0.5 + 0.35
      const destino = () =>
        document
          .querySelector('.burst-gallery__hero-media')
          ?.getBoundingClientRect() ??
        new DOMRect(0, 0, document.documentElement.clientWidth, window.innerHeight)

      tl.add(() => {
        const desde = creciendo.getBoundingClientRect()
        gsap.set(creciendo, {
          position: 'fixed',
          top: desde.top,
          left: desde.left,
          width: desde.width,
          height: desde.height,
        })
      }, expansion)

      tl.to(
        creciendo,
        {
          top: () => destino().top,
          left: () => destino().left,
          width: () => destino().width,
          height: () => destino().height,
          duration: 1.6,
          /* `expo.inOut` —el de la referencia— aquí llegaba a cuadruplicar su
             propia velocidad media en mitad del recorrido, y ese acelerón se
             lee como un tirón. `power2.inOut` recorre lo mismo sin el pico. */
          ease: 'power2.inOut',
        },
        expansion,
      )
      tl.to(caja, { width: '110vw', duration: 1.6, ease: 'power2.inOut' }, expansion)

      /* La reducida cede a la grande a media expansión: para entonces la
         ventana ya es ancha y las dos se ven igual de definidas. */
      tl.to(
        '.hero-loader__cover--mini',
        { opacity: 0, duration: 0.5, ease: 'none' },
        expansion + 0.55,
      )

      tl.to(root, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, expansion + 1.5)
    }, root)

    return () => {
      document.body.classList.remove('hero-loader-abierto')
      document.documentElement.classList.remove('hero-loader-abierto')
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
                    /* Por encima de las dos capas de la definitiva. */
                    style={{ zIndex: RELEVO.length - indice + 1 }}
                    src={foto.src}
                    alt={foto.alt}
                    loading="eager"
                    decoding="async"
                  />
                ))}
                <img
                  className="hero-loader__cover hero-loader__cover--mini"
                  src={FINAL_MINI}
                  alt=""
                  loading="eager"
                />
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
