import { useMemo } from 'react'

type Motif = 'dunes' | 'kasbah' | 'medina' | 'arch' | 'oasis' | 'coast' | 'jaima' | 'camel' | 'stars' | 'stone'

/** Hash determinista simple para variar cada ilustración según su semilla. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const PALETTES = [
  { sky: ['#f6e3c5', '#e8b98a'], far: '#d8a06b', mid: '#c07d4b', near: '#8a4f2d', sun: '#f0e9dd' },
  { sky: ['#f2d9b8', '#dfa478'], far: '#cf9059', mid: '#a9683c', near: '#6f3c22', sun: '#faf3e3' },
  { sky: ['#ead9c9', '#c99a72'], far: '#b97f4e', mid: '#96603a', near: '#5d3722', sun: '#f5ecd9' },
  { sky: ['#f7e8cf', '#f0c896'], far: '#e0a668', mid: '#b57b45', near: '#7c4a29', sun: '#fdf7ea' },
  { sky: ['#e5cdb3', '#b98a68'], far: '#a06f47', mid: '#7d5233', near: '#4c3020', sun: '#f2e8d5' },
]

function rng(seed: number) {
  let s = seed || 1
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1)
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61)
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296
  }
}

function dunePath(rand: () => number, y: number, amp: number, w = 800): string {
  const pts: string[] = [`M0 ${y + (rand() - 0.5) * amp}`]
  const n = 4 + Math.floor(rand() * 3)
  for (let i = 1; i <= n; i++) {
    const x = (w / n) * i
    const cy = y + (rand() - 0.5) * amp
    const cx = x - w / n / 2
    pts.push(`Q ${cx} ${cy - amp * rand()} ${x} ${y + (rand() - 0.5) * amp}`)
  }
  return `${pts.join(' ')} L ${w} 500 L 0 500 Z`
}

function motifShapes(motif: Motif, rand: () => number, p: (typeof PALETTES)[0]): string {
  const near = p.near
  const mid = p.mid
  switch (motif) {
    case 'kasbah': {
      const x = 140 + rand() * 320
      return `
        <rect x="${x}" y="250" width="150" height="130" fill="${near}"/>
        <rect x="${x - 40}" y="290" width="60" height="90" fill="${near}"/>
        <rect x="${x + 130}" y="280" width="70" height="100" fill="${mid}"/>
        <rect x="${x + 15}" y="222" width="26" height="34" fill="${near}"/>
        <rect x="${x + 60}" y="222" width="26" height="34" fill="${near}"/>
        <rect x="${x + 105}" y="222" width="26" height="34" fill="${near}"/>
        <rect x="${x + 40}" y="300" width="22" height="40" rx="11" fill="${p.sky[0]}" opacity="0.85"/>
        <rect x="${x + 90}" y="300" width="22" height="40" rx="11" fill="${p.sky[0]}" opacity="0.65"/>`
    }
    case 'medina': {
      const x = 90 + rand() * 260
      return `
        <rect x="${x}" y="240" width="60" height="150" fill="${near}"/>
        <rect x="${x + 8}" y="205" width="44" height="40" fill="${near}"/>
        <rect x="${x + 20}" y="180" width="20" height="30" fill="${near}"/>
        <rect x="${x + 90}" y="280" width="180" height="110" fill="${mid}"/>
        <rect x="${x + 300}" y="300" width="140" height="90" fill="${near}"/>
        <rect x="${x + 120}" y="315" width="26" height="55" rx="13" fill="${p.sky[0]}" opacity="0.8"/>
        <rect x="${x + 175}" y="315" width="26" height="55" rx="13" fill="${p.sky[0]}" opacity="0.6"/>`
    }
    case 'arch': {
      const x = 250 + rand() * 200
      return `
        <path d="M ${x} 400 L ${x} 250 Q ${x + 90} 150 ${x + 180} 250 L ${x + 180} 400 Z" fill="${near}"/>
        <path d="M ${x + 34} 400 L ${x + 34} 268 Q ${x + 90} 200 ${x + 146} 268 L ${x + 146} 400 Z" fill="${p.sky[1]}"/>
        <circle cx="${x + 90}" cy="180" r="10" fill="${p.sun}" opacity="0.9"/>`
    }
    case 'oasis': {
      const x = 160 + rand() * 340
      const palm = (px: number, s: number) => `
        <path d="M ${px} 390 Q ${px + 6 * s} 330 ${px + 3 * s} 285" stroke="${near}" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>
        <path d="M ${px + 3 * s} 288 q -45 -25 -75 -2 q 40 -8 75 12 q 35 -22 74 -8 q -32 -20 -74 -2 q -8 -35 -38 -48 q 22 22 32 50 q 28 -30 62 -32 q -35 -6 -62 22" fill="${near}"/>`
      return `${palm(x, 1)}${palm(x + 130 * (0.6 + rand() * 0.8), 0.75)}
        <ellipse cx="${x + 60}" cy="402" rx="150" ry="14" fill="${p.sky[1]}" opacity="0.55"/>`
    }
    case 'coast': {
      return `
        <rect x="0" y="330" width="800" height="80" fill="${p.sky[1]}" opacity="0.7"/>
        <path d="M0 330 Q 200 322 400 330 T 800 330 L 800 342 Q 600 334 400 342 T 0 342 Z" fill="${p.sun}" opacity="0.6"/>
        <path d="M ${420 + rand() * 200} 322 l 26 -40 l 6 40 Z" fill="${near}"/>
        <path d="M ${180 + rand() * 160} 328 l 20 -30 l 5 30 Z" fill="${mid}"/>
        <rect x="60" y="250" width="120" height="80" fill="${near}"/>
        <rect x="80" y="222" width="24" height="30" fill="${near}"/>`
    }
    case 'jaima': {
      const x = 200 + rand() * 300
      return `
        <path d="M ${x} 390 L ${x + 90} 280 L ${x + 180} 390 Z" fill="${near}"/>
        <path d="M ${x + 60} 390 L ${x + 90} 320 L ${x + 120} 390 Z" fill="${p.sky[0]}" opacity="0.8"/>
        <path d="M ${x - 130} 392 L ${x - 70} 330 L ${x - 10} 392 Z" fill="${mid}"/>
        <circle cx="${x + 90}" cy="255" r="4" fill="${near}"/>`
    }
    case 'camel': {
      const x = 260 + rand() * 240
      return `
        <path d="M ${x} 380 q 8 -50 40 -55 q 15 -25 35 -18 q 25 -35 50 -8 q 30 -8 38 26 q 25 6 20 55 l -18 0 q 2 -38 -18 -40 l -6 40 l -16 0 l 2 -36 q -25 10 -48 2 l -4 34 l -16 0 l 2 -40 q -20 4 -22 40 Z" fill="${near}"/>
        <path d="M ${x + 118} 300 q 16 -4 18 -28 q 10 -2 8 -14 q -14 -6 -18 6 q -10 24 -14 30 Z" fill="${near}"/>`
    }
    case 'stars': {
      let stars = ''
      for (let i = 0; i < 26; i++) {
        stars += `<circle cx="${rand() * 800}" cy="${rand() * 240}" r="${1 + rand() * 2.2}" fill="${p.sun}" opacity="${0.5 + rand() * 0.5}"/>`
      }
      return `${stars}<circle cx="${600 + rand() * 120}" cy="90" r="26" fill="${p.sun}" opacity="0.95"/>
        <circle cx="${588 + rand() * 120}" cy="82" r="24" fill="${p.sky[0]}"/>`
    }
    case 'stone': {
      let rocks = ''
      for (let i = 0; i < 5; i++) {
        const rx = rand() * 720
        rocks += `<ellipse cx="${rx}" cy="${360 + rand() * 30}" rx="${40 + rand() * 70}" ry="${14 + rand() * 20}" fill="${i % 2 ? mid : near}" opacity="${0.75 + rand() * 0.25}"/>`
      }
      return rocks
    }
    default:
      return ''
  }
}

export function Pic({ src, alt = '', className }: { src: string; alt?: string; className?: string }) {
  const svg = useMemo(() => {
    if (!src.startsWith('art:')) return null
    const [, motif = 'dunes', seed = 'kavan'] = src.split(':')
    const h = hash(seed)
    const rand = rng(h)
    const p = PALETTES[h % PALETTES.length]
    const night = motif === 'stars'
    const sky0 = night ? '#2e2438' : p.sky[0]
    const sky1 = night ? '#54405a' : p.sky[1]
    const sunY = 90 + rand() * 110
    const sunX = 120 + rand() * 560
    const body = `
      <defs>
        <linearGradient id="sky-${h}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${sky0}"/>
          <stop offset="1" stop-color="${sky1}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sky-${h})"/>
      ${night ? '' : `<circle cx="${sunX}" cy="${sunY}" r="${34 + rand() * 22}" fill="${p.sun}" opacity="0.9"/>`}
      <path d="${dunePath(rand, 300, 60)}" fill="${p.far}" opacity="0.85"/>
      <path d="${dunePath(rand, 360, 50)}" fill="${p.mid}" opacity="0.92"/>
      ${motifShapes((motif as Motif) ?? 'dunes', rand, p)}
      <path d="${dunePath(rand, 420, 40)}" fill="${p.near}"/>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">${body}</svg>`,
    )}`
  }, [src])

  return (
    <img
      src={svg ?? src}
      alt={alt}
      className={className}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}
