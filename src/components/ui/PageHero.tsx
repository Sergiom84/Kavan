import type { ReactNode } from 'react'
import { Pic } from './Pic'
import { Reveal } from '../fx/RevealText'
import './PageHero.css'

/** Hero estándar: imagen de fondo + título + subtítulo (regla R1 del cliente). */
export function PageHero({
  image,
  title,
  subtitle,
  children,
  size = 'm',
}: {
  image: string
  title: string
  subtitle?: string
  children?: ReactNode
  size?: 's' | 'm' | 'l'
}) {
  return (
    <section className={`page-hero page-hero-${size}`}>
      <div className="page-hero-media">
        <Pic src={image} alt="" />
      </div>
      <div className="page-hero-overlay" />
      <div className="page-hero-content container">
        <Reveal>
          <h1>{title}</h1>
          {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  )
}
