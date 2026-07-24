import { useState } from 'react'
import type { Pack } from '../../lib/types'
import { Pic } from '../ui/Pic'
import { RevealGroup } from '../fx/RevealText'
import './ItineraryTimeline.css'

/**
 * Timeline del itinerario (wireframe 6). Con `withSummary` muestra la tarjeta
 * lateral "Resumen del itinerario"; sin ella es la versión embebida (pág. 13).
 */
export function ItineraryTimeline({ pack, withSummary = true }: { pack: Pack; withSummary?: boolean }) {
  const [active, setActive] = useState(1)

  const scrollToDay = (day: number) => {
    setActive(day)
    document.getElementById(`dia-${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className={`itinerary ${withSummary ? 'has-summary' : ''}`}>
      <RevealGroup className="itinerary-days">
        {pack.itinerary.map((day) => (
          <article key={day.dayNumber} id={`dia-${day.dayNumber}`} className="itinerary-day">
            <div className="itinerary-marker" aria-hidden="true">
              <span />
            </div>
            <div className="itinerary-media">
              <Pic src={day.imageUrl} alt={day.title} />
            </div>
            <div className="itinerary-text">
              <h3>
                Día {day.dayNumber}
                <small>{day.title}</small>
              </h3>
              <p>{day.description}</p>
            </div>
          </article>
        ))}
      </RevealGroup>

      {withSummary && (
        <aside className="itinerary-summary card">
          <h4>Resumen del itinerario</h4>
          <ul>
            {pack.itinerary.map((day) => (
              <li key={day.dayNumber}>
                <button
                  className={active === day.dayNumber ? 'is-active' : ''}
                  onClick={() => scrollToDay(day.dayNumber)}
                >
                  <span className="itinerary-radio" aria-hidden="true" />
                  Día {day.dayNumber}
                </button>
              </li>
            ))}
          </ul>
          <div className="itinerary-duration">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            <div>
              <strong>Duración total</strong>
              <span>
                {pack.days} días / {pack.nights} noches
              </span>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
