import { useEffect, useRef, useState } from 'react'
import { SplitTitle } from './SplitTitle'
import './ParticleClaim.css'

type Props = {
  /** La frase con las llaves del recurso tipográfico, como en SplitTitle. */
  text: string
}

/**
 * La frase sobre blanco roto, dibujada con partículas.
 *
 * El efecto sólo entra en pantalla ancha, con puntero fino y sin
 * `prefers-reduced-motion`: en móvil son cientos de miles de puntos por
 * fotograma para nada. Cuando no entra, o si el navegador no da WebGL2, la
 * frase se queda escrita y no se pierde nada.
 *
 * El texto vive siempre en el DOM. Cuando el efecto arranca deja de dibujarse,
 * pero sigue estando ahí para el lector de pantalla y para el buscador.
 */
export function ParticleClaim({ text }: Props) {
  const lienzoRef = useRef<HTMLDivElement>(null)
  const tituloRef = useRef<HTMLDivElement>(null)
  const [conEfecto, setConEfecto] = useState(false)
  const [fondoOk, setFondoOk] = useState(true)

  useEffect(() => {
    const host = lienzoRef.current
    const titulo = tituloRef.current
    if (!host || !titulo) return

    const apto =
      window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!apto) return

    let vivo = true
    let efecto: { destroy: () => void } | null = null

    /* La carga es diferida: son ~90 KB de librería que no hacen falta para
       leer la página, y hay que esperar a que la tipografía esté disponible o
       el rasterizado saldría con la fuente de respaldo. */
    const arrancar = async () => {
      try {
        await document.fonts.ready
        if (!vivo) return

        const { ParticleText } = await import('./ParticleText')
        if (!vivo) return

        const estilo = getComputedStyle(document.documentElement)
        const tinta = estilo.getPropertyValue('--particle-1').trim() || '#2a2119'
        const acento = estilo.getPropertyValue('--particle-2').trim() || '#c4622d'

        /* La frase se oculta sólo cuando hay escena montada. Si el rasterizado
           no encontrase ni un píxel, o si la sección aún no tuviese tamaño, el
           texto se queda visible en vez de dejar el bloque en blanco. */
        efecto = new ParticleText({
          container: host,
          origen: titulo,
          colores: [tinta, acento],
          onListo: () => {
            if (vivo) setConEfecto(true)
          },
        })
      } catch {
        /* Sin WebGL2, con la GPU en lista negra o si falla la carga: la frase
           se queda escrita. No hay nada que avisar al visitante. */
        setConEfecto(false)
      }
    }

    arrancar()

    return () => {
      vivo = false
      efecto?.destroy()
    }
  }, [text])

  return (
    <section className={`pclaim ${conEfecto ? 'has-particles' : ''}`}>
      {/* Tres capas: la acuarela al fondo, la frase encima y la arena arriba.

          Si la acuarela falta, la capa se retira: un `img` roto deja el icono
          de imagen ausente en la esquina, y el bloque se queda con su color de
          respaldo sin que se note nada. */}
      {fondoOk && (
        <img
          className="pclaim-bg"
          src="/images/kasbah-acuarela.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onError={() => setFondoOk(false)}
        />
      )}
      <div className="pclaim-inner" ref={tituloRef}>
        <SplitTitle size="lead" align="center" className="pclaim-title" text={text} />
      </div>
      <div className="pclaim-canvas" ref={lienzoRef} aria-hidden="true" />
    </section>
  )
}
