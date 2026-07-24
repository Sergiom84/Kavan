import { useState } from 'react'
import './DepartureCalendar.css'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/**
 * Calendario de salida. La fecha de regreso se calcula sola con la duración
 * del pack y se resalta como rango en el calendario.
 */
export function DepartureCalendar({
  value,
  onChange,
  tripDays,
}: {
  value: string | null
  onChange: (iso: string) => void
  tripDays: number
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const initial = value ? new Date(value) : today
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const first = new Date(viewYear, viewMonth, 1)
  const startOffset = (first.getDay() + 6) % 7 // lunes = 0
  const gridStart = new Date(viewYear, viewMonth, 1 - startOffset)

  const departure = value ? new Date(`${value}T00:00:00`) : null
  const returnDate = departure ? new Date(departure.getTime() + (tripDays - 1) * 86400000) : null

  const cells = Array.from({ length: 42 }, (_, i) => new Date(gridStart.getTime() + i * 86400000))

  const shift = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  return (
    <div className="dep-calendar">
      <div className="dep-calendar-head">
        <button className="carousel-arrow" aria-label="Mes anterior" onClick={() => shift(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <strong>
          {MONTHS[viewMonth]} {viewYear}
        </strong>
        <button className="carousel-arrow" aria-label="Mes siguiente" onClick={() => shift(1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="dep-calendar-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="dep-calendar-weekday">
            {w}
          </span>
        ))}
        {cells.map((d) => {
          const iso = toIso(d)
          const inMonth = d.getMonth() === viewMonth
          const past = d < today
          const isDeparture = departure && iso === toIso(departure)
          const isReturn = returnDate && iso === toIso(returnDate)
          const inRange = departure && returnDate && d > departure && d < returnDate
          return (
            <button
              key={iso}
              disabled={past}
              onClick={() => onChange(iso)}
              className={[
                'dep-calendar-day',
                inMonth ? '' : 'is-out',
                past ? 'is-past' : '',
                isDeparture ? 'is-departure' : '',
                isReturn ? 'is-return' : '',
                inRange ? 'is-range' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>

      {departure && returnDate && (
        <div className="dep-calendar-range">
          <div>
            <span className="label">Salida</span>
            <strong>{departure.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</strong>
          </div>
          <div>
            <span className="label">Regreso</span>
            <strong>{returnDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</strong>
          </div>
        </div>
      )}
    </div>
  )
}
