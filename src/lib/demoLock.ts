import type { MouseEvent } from 'react'

/* Bloqueo temporal para la presentación al cliente (2026-07-30): Sergio quiere
   enseñar sólo la Home, con el resto de enlaces visibles pero inertes.

   Revertir es cambiar esta constante a `false` — no hace falta tocar ningún
   otro fichero de los que importan `lockNav`. */
export const DEMO_LOCK = true

export function lockNav(e: MouseEvent) {
  if (DEMO_LOCK) e.preventDefault()
}
