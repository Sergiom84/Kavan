import { useEffect, useRef, useState } from 'react'
import { DunesShader } from './DunesShader'
import { TravelAnimation } from './TravelAnimation'
import './Preloader.css'

/** Lo que se ve la portada antes de entrar. */
const DURACION = 3200

/**
 * Pantalla de carga: un campo de dunas recorrido por la cámara.
 *
 * Vive en el layout, así que sólo corre en la primera carga: navegar entre
 * páginas no la vuelve a lanzar. Si el navegador no trae WebGL2 o el shader no
 * compila, cae al 4x4 cruzando las dunas, que es puro GSAP y funciona siempre.
 */
export function Preloader() {
  const [fuera, setFuera] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [saliendo, setSaliendo] = useState(false)
  const [sinWebGL, setSinWebGL] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (fuera || !host) return

    const dunas = new DunesShader({ container: host })
    if (!dunas.listo) {
      dunas.destroy()
      setSinWebGL(true)
      return
    }
    dunas.arrancar()

    /* Dos tiempos: primero se desvanece el velo y sólo después se saca del
       árbol, para que la transición se vea y no quede capturando clics. */
    const aSalir = window.setTimeout(() => setSaliendo(true), DURACION)
    const aFuera = window.setTimeout(() => setFuera(true), DURACION + 700)

    return () => {
      window.clearTimeout(aSalir)
      window.clearTimeout(aFuera)
      dunas.destroy()
    }
  }, [fuera])

  if (fuera) return null

  if (sinWebGL) {
    return <TravelAnimation className="is-preloader" label="Cargando" onDone={() => setFuera(true)} />
  }

  return (
    <div
      className={`preloader ${saliendo ? 'is-saliendo' : ''}`}
      role="status"
      aria-label="Cargando"
      ref={hostRef}
    >
      <span className="preloader-label label">Cargando</span>
    </div>
  )
}
