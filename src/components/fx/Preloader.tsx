import { useState } from 'react'
import { TravelAnimation } from './TravelAnimation'
import './Preloader.css'

/**
 * Pantalla de carga del sitio: el mismo 4x4 cruzando las dunas que se ve al
 * calcular el viaje.
 *
 * Vive en el layout, así que solo corre en la primera carga: navegar entre
 * páginas no la vuelve a lanzar. La animación se retira sola al terminar y
 * entonces se saca del árbol, para que no quede capturando clics.
 */
export function Preloader() {
  const [gone, setGone] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  if (gone) return null

  return <TravelAnimation className="is-preloader" label="Cargando" onDone={() => setGone(true)} />
}
