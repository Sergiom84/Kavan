import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../../lib/lenisControl'
import { armarRefrescoScroll } from '../../lib/scroll'
import './ScrollScene.css'

gsap.registerPlugin(ScrollTrigger)

type Registro = {
  /** Los renglones enmascarados que suben. Los pone `LineReveal`. */
  targets: Element[]
  /** Desfase relativo dentro de la escena, en fracción de la propia escena. */
  delay: number
}

type EscenaApi = {
  registrar: (r: Registro) => () => void
}

const EscenaCtx = createContext<EscenaApi | null>(null)
const GrupoCtx = createContext<((st: ScrollTrigger) => () => void) | null>(null)

/** `LineReveal` lo consulta: dentro de una escena, el scroll manda; fuera, no. */
export function useEscena() {
  return useContext(EscenaCtx)
}

type SceneProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /**
   * Cuánto scroll cuesta revelar la escena entera, en pantallas. 1 = el lector
   * baja una pantalla completa para ver el último renglón.
   */
  hold?: number
}

/**
 * Una escena se clava en pantalla y cede el mando al scroll: mientras el lector
 * baja, los renglones van subiendo desde su máscara; si sube, se deshacen. No es
 * una animación con temporizador, es una posición del scroll.
 */
export function ScrollScene({ children, as: Tag = 'section', className, hold = 1 }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const registros = useRef<Registro[]>([])
  const registrarEnGrupo = useContext(GrupoCtx)

  // Estable: los hijos se apuntan en su propio efecto, que corre antes que este.
  const api = useMemo<EscenaApi>(
    () => ({
      registrar: (r) => {
        registros.current.push(r)
        return () => {
          registros.current = registros.current.filter((x) => x !== r)
        }
      },
    }),
    [],
  )

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    armarRefrescoScroll()

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = registros.current
      if (!items.length) return

      /* Si el texto no cabe en la pantalla (portátil bajo, móvil apaisado), el
         pin dejaría los últimos renglones fuera de encuadre para siempre. Ahí
         el bloque se lee como antes: el texto entra al pasar, sin clavarse. */
      const cabe = () => el.offsetHeight <= window.innerHeight + 1
      if (!cabe()) {
        items.forEach((item) => gsap.set(item.targets, { yPercent: 0 }))
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${window.innerHeight * hold}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          /* Sin inercia en el scrub: el texto va exactamente donde está el
             scroll. Con un scrub suavizado, el lector suelta la rueda y las
             letras siguen moviéndose solas, que es justo lo que no queremos. */
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      items.forEach((item, i) => {
        gsap.set(item.targets, { yPercent: 100 })
        tl.to(
          item.targets,
          { yPercent: 0, duration: 1, stagger: 0.25 },
          i === 0 ? 0 : `>-0.4+=${item.delay * 4}`,
        )
      })

      // Cola muerta: el último renglón se queda leído un tramo antes de soltar
      // el pin, para que la escena no se vaya en el mismo gesto que la completa.
      tl.to({}, { duration: 0.35 })

      const st = tl.scrollTrigger
      const soltarDelGrupo = st && registrarEnGrupo ? registrarEnGrupo(st) : undefined

      return () => {
        soltarDelGrupo?.()
        st?.kill()
        tl.kill()
        items.forEach((item) => gsap.set(item.targets, { clearProps: 'transform' }))
      }
    })

    return () => mm.revert()
  }, [hold, registrarEnGrupo])

  return (
    <EscenaCtx.Provider value={api}>
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    </EscenaCtx.Provider>
  )
}

type GroupProps = {
  children: ReactNode
  className?: string
  /**
   * Tramos de paso más largos que esto (en pantallas) se dejan en paz: ahí hay
   * contenido propio que el lector tiene derecho a mirar, no una transición.
   */
  maxSalto?: number
}

/**
 * El pegamento entre escenas. Entre el final de una y el principio de la
 * siguiente sólo hay tránsito, así que cuando el lector se para en medio le
 * llevamos al borde más cercano: la escena entra de golpe, no a medio encuadre.
 */
export function ScrollSceneGroup({ children, className, maxSalto = 1.5 }: GroupProps) {
  const escenas = useRef<ScrollTrigger[]>([])
  const animando = useRef(false)

  const registrar = useMemo(
    () => (st: ScrollTrigger) => {
      escenas.current.push(st)
      return () => {
        escenas.current = escenas.current.filter((x) => x !== st)
      }
    },
    [],
  )

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let pendiente: number | undefined
    let ultimaY = window.scrollY
    let bajando = true

    const destino = () => {
      const y = window.scrollY
      const orden = [...escenas.current].sort((a, b) => a.start - b.start)

      for (let i = 0; i < orden.length - 1; i += 1) {
        const fin = orden[i].end
        const inicio = orden[i + 1].start
        if (y <= fin || y >= inicio) continue
        if (inicio - fin > window.innerHeight * maxSalto) return null
        /* Al borde al que iba, no al más cercano: si el lector baja, devolverle
           a la escena que acaba de dejar es discutirle el gesto. */
        return bajando ? inicio : fin
      }

      /* Sólo se salta entre escenas. La entrada al bloque se deja en paz: ahí
         manda lo que venga antes (en la portada, el zoom del hero), y meterle
         un salto sería quitarle el scroll al lector fuera de nuestro terreno. */
      return null
    }

    const alPararse = () => {
      if (animando.current) return
      const objetivo = destino()
      if (objetivo === null || Math.abs(objetivo - window.scrollY) < 2) return

      const lenis = getLenis()
      animando.current = true
      const liberar = () => {
        animando.current = false
        ultimaY = window.scrollY
      }
      if (lenis) {
        lenis.scrollTo(objetivo, { duration: 0.45, lock: true, onComplete: liberar })
      } else {
        window.scrollTo({ top: objetivo, behavior: 'smooth' })
        window.setTimeout(liberar, 500)
      }
    }

    const onScroll = () => {
      if (!animando.current) {
        const y = window.scrollY
        if (y !== ultimaY) bajando = y > ultimaY
        ultimaY = y
      }
      window.clearTimeout(pendiente)
      pendiente = window.setTimeout(alPararse, 140)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(pendiente)
      window.removeEventListener('scroll', onScroll)
    }
  }, [maxSalto])

  return (
    <GrupoCtx.Provider value={registrar}>
      <div className={className}>{children}</div>
    </GrupoCtx.Provider>
  )
}
