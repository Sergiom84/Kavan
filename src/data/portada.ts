/**
 * La fotografía de portada, en un solo sitio porque la usan dos bloques que
 * tienen que enseñar exactamente lo mismo: el hero y la entrada `HeroLoader`,
 * que termina depositando su última imagen encima del hero. Si se separan, el
 * relevo entre ambos deja de ser invisible.
 *
 * El original venía a 1774 px de ancho y se quedaba corto a pantalla completa:
 * en un portátil retina había que ampliarlo al doble. Estas variantes salen de
 * `Hero2`, la misma fotografía reconstruida a 3548 px.
 */

/** Anchos servidos. El navegador elige según pantalla y densidad. */
const ANCHOS = [1600, 2400, 3548] as const

export const HERO_SRCSET = ANCHOS.map((ancho) => `/images/hero-${ancho}.webp ${ancho}w`).join(', ')

/**
 * Cuánto ancho ocupa realmente la fotografía, que no es `100vw`.
 *
 * Va a sangre con `object-fit: cover` y es apaisada 2:1, así que en cuanto la
 * pantalla es más alta que ancha —cualquier móvil— el recorte la estira por la
 * altura y su ancho pasa a ser el doble del alto del viewport. Con `100vw` el
 * navegador pedía la variante de 1600 px en un móvil que necesitaba 2025.
 *
 * Si algún navegador no entendiera `max()`, descarta el `sizes` y asume
 * `100vw`, que es exactamente donde estábamos: se degrada, no se rompe.
 */
export const HERO_SIZES = 'max(100vw, 200vh)'

/** Para navegadores que ignoren `srcset`: el término medio, no el mayor. */
export const HERO_FALLBACK = '/images/hero-2400.webp'

/** Versión reducida para el hueco del wordmark, de unos 240 px de ancho. */
export const HERO_MINIATURA = '/images/loader/hero-mini.webp'
