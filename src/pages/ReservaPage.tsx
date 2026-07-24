import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { usePack } from '../queries/hooks'
import { saveQuote } from '../lib/api'
import { calculatePrice, formatPrice, PricingError } from '../lib/pricing'
import type { RoomConfig } from '../lib/types'
import { Pic } from '../components/ui/Pic'
import { DepartureCalendar } from '../components/travel/DepartureCalendar'
import { TravelAnimation } from '../components/fx/TravelAnimation'
import './ReservaPage.css'

/**
 * Página 9: reserva / crea tu viaje. Layout propio (sin cabecera ni footer
 * estándar): imagen de fondo completa, logo + botón "Ir al viaje",
 * calendario, pasajeros por habitación, número de vuelo, resumen sin precios,
 * precio final y "Calcular Viaje".
 */
export function ReservaPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: pack } = usePack(slug)

  const [departure, setDeparture] = useState<string | null>(null)
  const [rooms, setRooms] = useState<RoomConfig[]>([{ adults: 2, children: 0 }])
  const [savedRooms, setSavedRooms] = useState(false)
  const [flightNumber, setFlightNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)

  const breakdown = useMemo(() => {
    if (!pack) return null
    try {
      return calculatePrice(pack, {
        packSlug: pack.slug,
        departureDate: departure ?? '',
        rooms,
        flightNumber,
        hotelSelection: {},
        activityIds: [],
      })
    } catch {
      return null
    }
  }, [pack, rooms, departure, flightNumber])

  if (!pack) return null

  const setRoom = (i: number, patch: Partial<RoomConfig>) => {
    setSavedRooms(false)
    setRooms((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  }

  const calcular = async () => {
    setError(null)
    if (!departure) {
      setError('Elige una fecha de salida en el calendario.')
      return
    }
    try {
      const b = calculatePrice(pack, {
        packSlug: pack.slug,
        departureDate: departure,
        rooms,
        flightNumber,
        hotelSelection: {},
        activityIds: [],
      })
      const quote = await saveQuote(
        { packSlug: pack.slug, departureDate: departure, rooms, flightNumber, hotelSelection: {}, activityIds: [] },
        b,
      )
      setAnimating(true)
      // La navegación llega al terminar la animación
      sessionStorage.setItem('kavan.lastQuote', quote.id)
    } catch (e) {
      setError(e instanceof PricingError ? e.message : 'No se ha podido calcular el viaje.')
    }
  }

  return (
    <div className="reserva">
      <div className="reserva-bg">
        <Pic src={pack.heroImageUrl} alt="" />
      </div>
      <div className="reserva-veil" />

      {/* Cabecera reducida: solo logo + Ir al viaje */}
      <header className="reserva-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text" style={{ color: 'var(--accent-ink)' }}>
            Kavan
            <small style={{ color: 'rgba(248,243,234,0.7)' }}>Viajes a Marruecos</small>
          </span>
        </Link>
        <Link to={`/packs/${pack.slug}/viaje`} className="btn btn-outline reserva-header-btn">
          Ir al viaje
        </Link>
      </header>

      <main className="reserva-main">
        <h1 className="reserva-title">Crea tu viaje</h1>
        <p className="reserva-pack">{pack.title}</p>

        <div className="reserva-grid">
          {/* Calendario */}
          <section className="reserva-card card">
            <h4>Elige la fecha de salida</h4>
            <DepartureCalendar value={departure} onChange={setDeparture} tripDays={pack.days} />
          </section>

          <div className="reserva-col">
            {/* Diseña tu viaje */}
            <section className="reserva-card card">
              <h4>Diseña tu viaje</h4>
              <div className="reserva-design">
                <div className="reserva-design-row">
                  <span className="label">Salida</span>
                  <strong>
                    {departure
                      ? new Date(`${departure}T00:00:00`).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Por elegir'}
                  </strong>
                </div>
                <div className="reserva-design-row">
                  <span className="label">Duración</span>
                  <strong>
                    {pack.days} días / {pack.nights} noches
                  </strong>
                </div>
                <div className="reserva-design-row">
                  <span className="label">Número de vuelo</span>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    placeholder="AT971"
                    aria-label="Número de vuelo"
                  />
                </div>
              </div>
            </section>

            {/* Pasajeros por habitación */}
            <section className="reserva-card card">
              <h4>Configura tus pasajeros</h4>
              <div className="reserva-rooms-head">
                <span className="label">Habitaciones</span>
                <span className="label">Adultos</span>
                <span className="label">Niños</span>
                <span />
              </div>
              {rooms.map((room, i) => (
                <div key={i} className="reserva-room">
                  <span>Habitación {i + 1}</span>
                  <select
                    value={room.adults}
                    aria-label={`Adultos habitación ${i + 1}`}
                    onChange={(e) => setRoom(i, { adults: Number(e.target.value) })}
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <select
                    value={room.children}
                    aria-label={`Niños habitación ${i + 1}`}
                    onChange={(e) => setRoom(i, { children: Number(e.target.value) })}
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    className="reserva-room-remove"
                    aria-label={`Eliminar habitación ${i + 1}`}
                    disabled={rooms.length === 1}
                    onClick={() => {
                      setSavedRooms(false)
                      setRooms((rs) => rs.filter((_, j) => j !== i))
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                className="reserva-room-add"
                onClick={() => {
                  setSavedRooms(false)
                  setRooms((rs) => [...rs, { adults: 2, children: 0 }])
                }}
              >
                Añadir habitación
              </button>
              <div className="reserva-room-actions">
                <button className="btn btn-outline" onClick={() => setSavedRooms(true)}>
                  {savedRooms ? 'Guardado' : 'Guardar'}
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Resumen: itinerario sin precios */}
        <section className="reserva-card card reserva-summary">
          <h4>Resumen</h4>
          <ul className="reserva-summary-list">
            {pack.itinerary.map((day) => (
              <li key={day.dayNumber}>
                <strong>Día {day.dayNumber}</strong>
                <span>{day.title}</span>
              </li>
            ))}
          </ul>
          {breakdown && (
            <div className="reserva-total">
              <span>Precio final</span>
              <strong>{formatPrice(breakdown.total)}</strong>
            </div>
          )}
        </section>

        {error && <p className="reserva-error">{error}</p>}

        <div className="reserva-cta">
          <button className="btn btn-primary reserva-cta-btn" onClick={calcular}>
            Calcular Viaje
          </button>
        </div>
      </main>

      {animating && (
        <TravelAnimation
          onDone={() => navigate(`/viaje/${sessionStorage.getItem('kavan.lastQuote')}`)}
        />
      )}
    </div>
  )
}
