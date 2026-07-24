import { ScrollTrigger } from 'gsap/ScrollTrigger'

let armado = false

/**
 * ScrollTrigger fija las posiciones de disparo en el momento de crearse, cuando
 * todavía no han cargado ni las fotografías ni la tipografía. Si el layout se
 * desplaza después, los bloques que ya estaban en pantalla no llegan a revelarse
 * y se quedan invisibles. Recalculamos cuando el contenido termina de asentarse.
 */
export function armarRefrescoScroll() {
  if (armado || typeof window === 'undefined') return
  armado = true

  const refrescar = () => ScrollTrigger.refresh()

  window.addEventListener('load', refrescar)
  document.fonts?.ready.then(refrescar).catch(() => undefined)

  // Las fotos se cargan en diferido: agrupamos los avisos y refrescamos al final.
  let pendiente: number | undefined
  document.addEventListener(
    'load',
    () => {
      window.clearTimeout(pendiente)
      pendiente = window.setTimeout(refrescar, 120)
    },
    true,
  )
}
