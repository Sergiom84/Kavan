import { useMemo } from 'react'

/**
 * Resuelve las imágenes del contenido a fotografía real.
 *
 * El contenido referencia las fotos como "art:<motivo>:<semilla>". El motivo
 * describe qué se ve (dunas, kasbah, medina...) y la semilla identifica el uso
 * concreto. Aquí el motivo elige el repertorio de fotos y la semilla decide, de
 * forma estable, cuál de ellas se usa: la misma referencia da siempre la misma
 * imagen, y dos referencias distintas del mismo motivo no repiten foto.
 */

type Motif = 'dunes' | 'kasbah' | 'medina' | 'arch' | 'oasis' | 'coast' | 'jaima' | 'camel' | 'stars' | 'stone'

const BANK: Record<Motif, string[]> = {
  dunes: ['dunas-erg-chebbi', 'dunas-amanecer', 'dunas-textura', 'campamento-jaima'],
  kasbah: ['ait-ben-haddou', 'kasbah-taourirt', 'ksar-taourirt', 'dades-kasbah', 'draa-timidert'],
  medina: ['medina', 'souk', 'rissani-zoco', 'essaouira-medina', 'spices', 'artisan', 'terrace-night'],
  arch: ['zellige', 'palacio-bahia', 'riad-room', 'majorelle', 'riad'],
  oasis: ['draa-palmeral', 'todra-palmeras', 'lalla-takerkoust', 'majorelle', 'riad'],
  coast: ['essaouira-barcas', 'essaouira-puerto', 'essaouira-skala', 'essaouira-murallas', 'essaouira-medina'],
  jaima: ['campamento-jaima', 'agafay-dromedaries', 'dunas-textura'],
  camel: ['dromedarios', 'agafay-dromedaries', 'campamento-jaima'],
  stars: ['terrace-night', 'jemaa-el-fna', 'dunas-amanecer'],
  stone: ['ouarzazate-atlas', 'alto-atlas', 'atlas', 'dades-kasbah', 'lalla-takerkoust'],
}

/** Fotos fijadas para los usos donde la imagen concreta importa. */
const PINNED: Record<string, string> = {
  'home-hero': 'dunas-erg-chebbi',
  'merzouga-hero': 'dunas-amanecer',
  'ouarzazate-hero': 'ait-ben-haddou',
  'marrakech-hero': 'jemaa-el-fna',
  'erfoud-hero': 'draa-palmeral',
  'essaouira-hero': 'essaouira-barcas',
  'agafay-hero': 'agafay-dromedaries',
  'erg-chebbi': 'dunas-erg-chebbi',
  'khamlia': 'gnawa',
  'dayet-srji': 'lalla-takerkoust',
  'ait-ben-haddou': 'ait-ben-haddou',
  'atlas-studios': 'ouarzazate-atlas',
  'taourirt': 'kasbah-taourirt',
  'jemaa': 'jemaa-el-fna',
  'majorelle': 'majorelle',
  'bahia': 'palacio-bahia',
  'tafilalet': 'draa-palmeral',
  'rissani': 'rissani-zoco',
  'skala': 'essaouira-skala',
  'puerto': 'essaouira-puerto',
  'essaouira-poi': 'essaouira-medina',
  'agafay-camp': 'campamento-jaima',
  'lalla': 'lalla-takerkoust',
  'mirador': 'alto-atlas',
  'fosiles': 'artisan',
}

/** Hash determinista: la misma semilla resuelve siempre a la misma foto. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function resolveImage(src: string): string {
  if (!src.startsWith('art:')) return src

  const [, motif = 'dunes', seed = ''] = src.split(':')

  const pinned = PINNED[seed]
  if (pinned) return `/images/${pinned}.webp`

  const bank = BANK[motif as Motif] ?? BANK.dunes
  // La semilla incluye a menudo un índice final ("merzouga-3"): lo aprovechamos
  // para repartir las fotos de una misma galería sin repetirlas seguidas.
  const trailing = /(\d+)$/.exec(seed)
  const offset = trailing ? Number(trailing[1]) : 0
  const pick = bank[(hash(seed) + offset) % bank.length]
  return `/images/${pick}.webp`
}

export function Pic({
  src,
  alt = '',
  className,
  priority = false,
  position,
}: {
  src: string
  alt?: string
  className?: string
  /** Las imágenes por encima del pliegue no deben cargarse en diferido. */
  priority?: boolean
  /** Encuadre, p. ej. "center 30%" para bajar el horizonte. */
  position?: string
}) {
  const url = useMemo(() => resolveImage(src), [src])

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position }}
    />
  )
}
