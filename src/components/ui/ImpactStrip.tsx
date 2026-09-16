import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { lockNav } from '../../lib/demoLock'
import './ImpactStrip.css'

export type ImpactSlide = {
  name: string
  image: string
  alt: string
  to?: string
}

/** Franja a sangre: equivalentes del catálogo a Ouarzazate / Fes / Chefchaouen. */
export const IMPACT_ATLAS: ImpactSlide[] = [
  {
    name: 'Ouarzazate',
    image: '/images/ouarzazate-atlas.webp',
    alt: 'Kasbahs y montañas del Atlas en Ouarzazate',
    to: '/destinos/ouarzazate',
  },
  {
    name: 'Ait Ben Haddou',
    image: '/images/ait-ben-haddou.webp',
    alt: 'Ksar de Ait Ben Haddou al atardecer',
    to: '/destinos/ouarzazate',
  },
  {
    name: 'Todra',
    image: '/images/todra-garganta.webp',
    alt: 'Gargantas del Todra',
    to: '/destinos/ouarzazate',
  },
]

export const IMPACT_SUR: ImpactSlide[] = [
  {
    name: 'Essaouira',
    image: '/images/essaouira-murallas.webp',
    alt: 'Murallas de Essaouira frente al Atlántico',
    to: '/destinos/essaouira',
  },
  {
    name: 'Merzouga',
    image: '/images/dunas-erg-chebbi.webp',
    alt: 'Dunas del Erg Chebbi en Merzouga',
    to: '/destinos/merzouga',
  },
  {
    name: 'Agafay',
    image: '/images/agafay.webp',
    alt: 'Desierto de piedra de Agafay',
    to: '/destinos/agafay',
  },
]

type Props = {
  slides?: ImpactSlide[]
  interval?: number
  label?: string
}

/** Franja full-width de fotografía con puntos de navegación discretos. */
export function ImpactStrip({
  slides = IMPACT_ATLAS,
  interval = 5600,
  label = 'Paisajes de Marruecos',
}: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (paused) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, interval)

    return () => window.clearInterval(id)
  }, [slides.length, interval, paused])

  if (!slides.length) return null

  return (
    <section
      className="impact-strip"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index
        const inner = (
          <>
            <img src={slide.image} alt={active ? slide.alt : ''} />
            <span className="impact-strip-scrim" aria-hidden="true" />
            <span className="impact-strip-name">{slide.name}</span>
          </>
        )
        const className = `impact-strip-slide${active ? ' is-active' : ''}`

        if (slide.to) {
          return (
            <Link
              key={slide.name}
              to={slide.to}
              onClick={lockNav}
              className={className}
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
            >
              {inner}
            </Link>
          )
        }

        return (
          <div key={slide.name} className={className} aria-hidden={!active}>
            {inner}
          </div>
        )
      })}

      <div className="impact-strip-dots" role="tablist" aria-label="Elegir paisaje">
        {slides.map((slide, i) => (
          <button
            key={slide.name}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={slide.name}
            className={i === index ? 'is-active' : undefined}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
