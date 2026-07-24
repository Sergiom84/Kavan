import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { loadQuote, updateQuote } from '../lib/api'
import { usePack } from '../queries/hooks'
import { calculatePrice, formatPrice } from '../lib/pricing'
import { CATEGORY_LABEL } from '../lib/types'
import { Pic } from '../components/ui/Pic'
import { ItineraryTimeline } from '../components/travel/ItineraryTimeline'
import './TuViajePage.css'

gsap.registerPlugin(Flip)

/**
 * Página 12 (nueva): tu viaje comienza. Fondo a toda página, pestañas
 * Hoteles (por defecto) e Itinerario (página 13 = itinerario embebido),
 * y tarjeta vertical con el desglose del precio.
 */
export function TuViajePage() {
  const { quoteId } = useParams()
  const quote = useMemo(() => (quoteId ? loadQuote(quoteId) : undefined), [quoteId])
  const { data: pack } = usePack(quote?.config.packSlug)

  const [tab, setTab] = useState<'hoteles' | 'itinerario'>('hoteles')
  const [selection, setSelection] = useState<Record<string, string>>(quote?.config.hotelSelection ?? {})
  const tabsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = tabsRef.current
    if (!el) return
    const state = Flip.getState(el.querySelectorAll('.tuviaje-tab-pill'))
    Flip.from(state, { duration: 0.4, ease: 'power2.inOut' })
  }, [tab])

  const breakdown = useMemo(() => {
    if (!pack || !quote) return null
    try {
      return calculatePrice(pack, { ...quote.config, hotelSelection: selection })
    } catch {
      return quote.breakdown
    }
  }, [pack, quote, selection])

  if (!quote || !pack) {
    return (
      <div className="tuviaje tuviaje-empty">
        <p>No se ha encontrado la cotización.</p>
        <Link to="/packs" className="btn btn-primary">
          Ver los viajes
        </Link>
      </div>
    )
  }

  const departure = new Date(`${quote.config.departureDate}T00:00:00`)
  const returnDate = new Date(departure.getTime() + (pack.days - 1) * 86400000)

  const selectOption = (stayId: string, optionId: string, isDefault: boolean) => {
    const next = { ...selection }
    if (isDefault) delete next[stayId]
    else next[stayId] = optionId
    setSelection(next)
    if (breakdown) {
      updateQuote({ ...quote, config: { ...quote.config, hotelSelection: next }, breakdown })
    }
  }

  return (
    <div className="tuviaje">
      <div className="tuviaje-bg">
        <Pic src={pack.gallery[0] ?? pack.heroImageUrl} alt="" />
      </div>
      <div className="tuviaje-veil" />

      {/* Barra superior */}
      <header className="tuviaje-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text" style={{ color: 'var(--accent-ink)' }}>
            Kavan
            <small style={{ color: 'rgba(248,243,234,0.7)' }}>Viajes a Marruecos</small>
          </span>
        </Link>
        <div className="tuviaje-header-actions">
          <Link to={`/reserva/${pack.slug}`} className="btn btn-outline tuviaje-header-btn">
            Revisar las fechas de viaje
          </Link>
          <Link to={`/packs/${pack.slug}/viaje`} className="btn btn-outline tuviaje-header-btn">
            Ir al viaje
          </Link>
        </div>
      </header>

      <main className="tuviaje-main">
        {/* Hero pequeño alargado con pestañas */}
        <div className="tuviaje-hero card">
          <div className="tuviaje-hero-media">
            <Pic src={pack.heroImageUrl} alt={pack.title} />
          </div>
          <div className="tuviaje-hero-body">
            <div>
              <h1>{pack.title}</h1>
              <p className="tuviaje-dates">
                {departure.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                {' — '}
                {returnDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                {quote.config.flightNumber && ` · Vuelo ${quote.config.flightNumber}`}
              </p>
            </div>
            <div className="tuviaje-tabs" ref={tabsRef} role="tablist">
              {(['hoteles', 'itinerario'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  className={`tuviaje-tab ${tab === t ? 'is-active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {tab === t && <span className="tuviaje-tab-pill" aria-hidden="true" />}
                  <span className="tuviaje-tab-label">{t === 'hoteles' ? 'Hoteles' : 'Itinerario'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tuviaje-layout">
          <div className="tuviaje-content card">
            {tab === 'hoteles' ? (
              <div className="tuviaje-hotels">
                {pack.stays.map((stay) => {
                  const selectedId =
                    selection[stay.id] ?? stay.options.find((o) => o.isDefault)?.id ?? stay.options[0]?.id
                  return (
                    <section key={stay.id} className="tuviaje-stay">
                      <header className="tuviaje-stay-head">
                        <h3>{stay.cityName}</h3>
                        <span className="label">
                          {stay.nights} {stay.nights === 1 ? 'noche' : 'noches'}
                        </span>
                      </header>
                      {stay.options.map((option) => {
                        const active = option.id === selectedId
                        return (
                          <button
                            key={option.id}
                            className={`tuviaje-hotel ${active ? 'is-active' : ''}`}
                            onClick={() => selectOption(stay.id, option.id, option.isDefault)}
                          >
                            <div className="tuviaje-hotel-media">
                              <Pic src={option.thumbnailUrl} alt={option.hotelName} />
                            </div>
                            <div className="tuviaje-hotel-body">
                              <h4>{option.hotelName}</h4>
                              <span className="tuviaje-hotel-cat">
                                {CATEGORY_LABEL[option.category]}
                                {' · '}
                                {Array.from({ length: option.stars })
                                  .map(() => '★')
                                  .join('')}
                              </span>
                              <p>{option.description}</p>
                            </div>
                            <div className="tuviaje-hotel-price">
                              {option.supplementPpNight > 0 ? (
                                <>
                                  <strong>+{formatPrice(option.supplementPpNight * stay.nights)}</strong>
                                  <span className="label">por persona</span>
                                </>
                              ) : (
                                <span className="tuviaje-hotel-included">Incluido</span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </section>
                  )
                })}
              </div>
            ) : (
              /* Página 13: itinerario embebido, sin cabecera ni relacionados */
              <ItineraryTimeline pack={pack} withSummary={false} />
            )}
          </div>

          {/* Tarjeta vertical de precio */}
          <aside className="tuviaje-price card">
            <h4>Precio del viaje</h4>
            {breakdown && (
              <>
                <ul className="tuviaje-price-travelers">
                  {breakdown.travelers.map((t, i) => (
                    <li key={i}>
                      <span>
                        {t.type === 'adulto' ? 'Adulto' : 'Niño'}
                        <small> · Habitación {t.room}</small>
                      </span>
                      <strong>{formatPrice(t.amount)}</strong>
                    </li>
                  ))}
                </ul>

                {breakdown.hotelLines.length > 0 && (
                  <div className="tuviaje-price-supplements">
                    <span className="label">Suplementos incluidos</span>
                    <ul>
                      {breakdown.hotelLines.map((l) => (
                        <li key={l.stayId}>
                          <span>
                            {l.hotelName}
                            <small>
                              {' '}
                              · {l.nights} {l.nights === 1 ? 'noche' : 'noches'}
                            </small>
                          </span>
                          <strong>+{formatPrice(l.amountPp)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="tuviaje-price-total">
                  <span>Total</span>
                  <strong>{formatPrice(breakdown.total)}</strong>
                </div>

                <div className="tuviaje-price-actions">
                  <a
                    href={`https://wa.me/34600000000?text=${encodeURIComponent(
                      `Reserva ${pack.title} — salida ${quote.config.departureDate} — total ${formatPrice(breakdown.total)} — ref ${quote.id.slice(0, 8)}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Reservar
                  </a>
                  <a
                    href={`mailto:info@kavanviajes.com?subject=${encodeURIComponent(
                      `Pre-reserva ${pack.title}`,
                    )}&body=${encodeURIComponent(`Referencia ${quote.id.slice(0, 8)} — salida ${quote.config.departureDate}`)}`}
                    className="btn btn-outline"
                  >
                    Pre-reservar
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
