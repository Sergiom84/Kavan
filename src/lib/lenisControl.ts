import type Lenis from 'lenis'

let instance: Lenis | null = null
let locks = 0

export function registerLenis(lenis: Lenis | null) {
  instance = lenis
  if (instance && locks > 0) instance.stop()
}

/** Detiene Lenis y el overflow de la página. Varios bloqueos se anidan. */
export function lockSmoothScroll() {
  locks += 1
  instance?.stop()
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

export function unlockSmoothScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return

  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  instance?.start()
}
