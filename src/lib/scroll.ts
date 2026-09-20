import { ScrollTrigger } from 'gsap/ScrollTrigger'

let armado = false

const fijados: { el: Element; st: ScrollTrigger }[] = []
let refrescoPendiente: number | undefined

/**
 * Apunta un bloque que se fija en pantalla y reparte las prioridades de
 * recálculo por orden de aparición en el documento.
 *
 * Al recalcular, ScrollTrigger suelta todos los pines para medir la página
 * desnuda y los vuelve a aplicar por orden de prioridad. Un bloque que se
 * recalcula antes que otro que tiene encima mide una página a la que todavía le
 * falta el alto de aquel pin y se clava antes de tiempo, encima del anterior.
 *
 * El orden no puede salir ni de cuándo se monta cada bloque ni de su posición
 * al montarse: un bloque que espera datos —el escaparate de viajes— crea su pin
 * después que los que tiene debajo, y para entonces esos ya han alargado la
 * página. Las dos medidas mienten; el orden del documento, no.
 */
export function registrarFijado(el: Element, st: ScrollTrigger | undefined) {
  if (!st) return () => undefined

  fijados.push({ el, st })
  fijados.sort((a, b) =>
    a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
  fijados.forEach((f, i) => {
    f.st.vars.refreshPriority = -i
  })
  ScrollTrigger.sort()

  // El que llega tarde obliga a recolocarse a los que ya estaban. Agrupado:
  // durante el montaje se registran varios seguidos y basta un recálculo.
  if (typeof window !== 'undefined') {
    window.clearTimeout(refrescoPendiente)
    refrescoPendiente = window.setTimeout(() => ScrollTrigger.refresh(), 0)
  }

  return () => {
    const i = fijados.findIndex((f) => f.st === st)
    if (i >= 0) fijados.splice(i, 1)
  }
}

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
