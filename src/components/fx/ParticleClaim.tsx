import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ParticleClaim.css'

type Props = {
  /** Frases con llaves para el recurso tipográfico heredado de SplitTitle:
      lo que va entre llaves baja a caja baja y a menos de la mitad de cuerpo. */
  beats: string[]
}

/**
 * Una pausa editorial entre el hero y la galería: el boceto se deshace en arena
 * que reacciona al puntero, y el titular gana foco al avanzar. En móvil, sin
 * WebGL2 o con movimiento reducido queda como imagen estática plenamente
 * legible y el motor de partículas ni se descarga.
 */
gsap.registerPlugin(ScrollTrigger)

/* Pseudo-aleatorio determinista: mismo resultado en cada carga, para que el
   desorden de las palabras no cambie de una visita a otra. */
function azar(semilla: number) {
  const x = Math.sin(semilla * 999.7) * 43758.5453
  return x - Math.floor(x)
}

/* Decisión de Sergio tras comparar las seis candidatas en contexto real: Marhey,
   la que llevaba la frase que empieza por "África". Sustituye a Cormorant
   Garamond solo en este bloque. */
const FUENTE_CLAIM = "'Marhey', sans-serif"

/* Reparte una frase en palabras conservando el recurso de SplitTitle: lo que
   va entre llaves se marca como "menor" (caja baja, cuerpo reducido), pero
   aquí cada palabra —menor o no— es su propio nodo, para poder animarla
   suelta en vez de mover el bloque entero. `indice` es un contador compartido
   entre frases: la semilla del viento es la posición de la palabra en el
   conjunto completo, no en su frase. */
function palabrasDe(beat: string, indice: { valor: number }) {
  return beat.split(/(\{[^}]*\})/g).filter(Boolean).flatMap((parte, i) => {
    const menor = parte.startsWith('{')
    const contenido = menor ? parte.slice(1, -1) : parte
    return contenido.split(/(\s+)/).map((trozo, j) => {
      if (!trozo) return null
      if (/^\s+$/.test(trozo)) return <span key={`${i}-${j}`}>{trozo}</span>
      return (
        <span
          key={`${i}-${j}`}
          className={`pclaim-word${menor ? ' pclaim-word--minor' : ''}`}
          data-word-index={indice.valor++}
        >
          {trozo}
        </span>
      )
    })
  })
}

export function ParticleClaim({ beats }: Props) {
  const escenaRef = useRef<HTMLElement>(null)
  const imagenRef = useRef<HTMLImageElement>(null)
  const lienzoRef = useRef<HTMLDivElement>(null)
  const [conEfecto, setConEfecto] = useState(false)

  /* La arena sólo se monta donde tiene sentido: pantalla grande, puntero fino
     y sin `prefers-reduced-motion`. El import es dinámico para que quien no
     cumpla no se descargue ni un byte del motor WebGL. Espera a que la imagen
     esté decodificada porque el shader muestrea sus píxeles para pintar cada
     grano: sin ella la arena saldría negra. */
  useEffect(() => {
    const escena = escenaRef.current
    const host = lienzoRef.current
    const imagen = imagenRef.current
    if (!escena || !host || !imagen) return

    const apto =
      window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!apto) return

    let vivo = true
    let efecto: { destroy: () => void } | null = null

    const arrancar = async () => {
      try {
        if (!imagen.complete) {
          await new Promise<void>((resolve, reject) => {
            imagen.addEventListener('load', () => resolve(), { once: true })
            imagen.addEventListener('error', () => reject(new Error('imagen')), { once: true })
          })
        }
        if (!vivo) return
        const { DesertParticles } = await import('./DesertParticles')
        if (!vivo) return
        efecto = new DesertParticles({ container: host, image: imagen })
        if (vivo) setConEfecto(true)
      } catch {
        setConEfecto(false)
      }
    }

    arrancar()

    return () => {
      vivo = false
      efecto?.destroy()
    }
  }, [])

  useEffect(() => {
    const escena = escenaRef.current
    const apto = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!escena || !apto) return

    const contexto = gsap.context(() => {
      const frases = gsap.utils.toArray<HTMLElement>('.pclaim-beat')
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: escena,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * frases.length * .38)}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
        },
      })

      /* Bruma, no viento. Antes cada palabra llegaba lanzada desde fuera del
         encuadre (150px de desplazamiento y 10 grados de giro) y se leía como
         un golpe. Ahora apenas se mueve: sube un poco, como vapor, se contrae
         desde un 4% de más y sobre todo se condensa desde 16px de desenfoque.
         El giro casi desaparece —lo justo para que no formen una rejilla—.
         La semilla es el índice global de la palabra, así el reparto es el
         mismo en cada recarga. */
      const palabras = gsap.utils.toArray<HTMLElement>('.pclaim-word')
      palabras.forEach(palabra => {
        const i = Number(palabra.dataset.wordIndex)
        gsap.set(palabra, {
          x: -10 - azar(i * 3 + 1) * 22,
          y: 12 + azar(i * 3 + 2) * 16,
          rotate: -2 + azar(i * 3 + 3) * 4,
          scale: 1.04,
          opacity: 0,
          filter: 'blur(16px)',
        })
      })

      timeline.set(frases, { display: 'block', autoAlpha: 1, x: 0 })

      frases.forEach(frase => {
        const palabrasFrase = frase.querySelectorAll<HTMLElement>('.pclaim-word')
        timeline
          .to(palabrasFrase, {
            x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
            duration: .95, stagger: .07, ease: 'sine.out',
          })
          /* El desenfoque va aparte y dura más que el movimiento: si se
             disipara a la vez, esto sería un fundido con desplazamiento. Que la
             palabra llegue a su sitio y siga aclarándose es lo que la hace
             leerse como algo que sale de la bruma. */
          .to(palabrasFrase, {
            filter: 'blur(0px)',
            duration: 1.35, stagger: .07, ease: 'sine.out',
          }, '<')
          .to({}, { duration: .5 })
      })
    }, escena)

    return () => contexto.revert()
  }, [])

  /* La envoltura no es decorativa. ScrollTrigger, al pinchar la sección, la mete
     dentro de un `pin-spacer` que crea él mismo. Si la sección fuese la raíz del
     componente, al salir de la Home React intentaría quitarla de su padre de
     siempre —que ya no lo es— y reventaba con «removeChild: the node to be
     removed is not a child of this node», dejando la página siguiente en blanco.
     Con la envoltura, React sólo quita este div y se lleva el spacer dentro. */
  const contadorPalabras = { valor: 0 }

  return (
    <div className="pclaim-wrap">
      <section className={`pclaim${conEfecto ? ' has-particles' : ''}`} ref={escenaRef}>
        <div className="pclaim-band pclaim-band--top">
          <span className="label">Marruecos</span>
          <span className="label">Entre dos mundos</span>
        </div>
        <div className="pclaim-media">
          <img
            ref={imagenRef}
            className="pclaim-bg"
            src="/images/Oasis_Panorama_alpha.webp"
            alt="Boceto a lápiz de un ksar en Marruecos"
            loading="lazy"
            decoding="async"
          />
          <div className="pclaim-canvas" ref={lienzoRef} aria-hidden="true" />
          <div className="pclaim-inner">
            {beats.map(beat => (
              <p key={beat} className="pclaim-beat" style={{ fontFamily: FUENTE_CLAIM }}>
                {palabrasDe(beat, contadorPalabras)}
              </p>
            ))}
          </div>
        </div>
        {/* Vacía a propósito: sólo iguala el aire de la banda de arriba. */}
        <div className="pclaim-band pclaim-band--bottom" aria-hidden="true" />
      </section>
    </div>
  )
}
