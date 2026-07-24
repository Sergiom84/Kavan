import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './StatGrid.css'

gsap.registerPlugin(ScrollTrigger)

export interface Stat {
  value: number
  suffix?: string
  title: string
  detail: string
}

/** Cifras a gran escala, con recuento animado al entrar en el viewport. */
export function StatGrid({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = el.querySelectorAll<HTMLElement>('.stat-number')
    if (reduced) {
      nodes.forEach((n, i) => (n.textContent = `${stats[i].value}${stats[i].suffix ?? ''}`))
      return
    }
    const ctx = gsap.context(() => {
      nodes.forEach((node, i) => {
        const counter = { value: 0 }
        gsap.to(counter, {
          value: stats[i].value,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => {
            node.textContent = `${Math.round(counter.value)}${stats[i].suffix ?? ''}`
          },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [stats])

  return (
    <div className="stat-grid" ref={ref}>
      {stats.map((s, i) => (
        <div key={i} className="stat-item">
          <span className="stat-number">0{s.suffix ?? ''}</span>
          <div className="stat-copy">
            <h4>{s.title}</h4>
            <span className="label">{s.detail}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
