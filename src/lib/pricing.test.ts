import { describe, expect, it } from 'vitest'
import { packs } from '../data/seed'
import { calculatePrice, PricingError } from './pricing'

const dunas = packs.find((p) => p.slug === 'dunas-de-merzouga')!

const base = {
  packSlug: dunas.slug,
  departureDate: '2026-10-01',
  flightNumber: '',
  hotelSelection: {},
  activityIds: [],
}

describe('calculatePrice', () => {
  it('2 adultos, 1 habitación, hoteles por defecto', () => {
    const b = calculatePrice(dunas, { ...base, rooms: [{ adults: 2, children: 0 }] })
    expect(b.supplementPp).toBe(0)
    expect(b.unitAdult).toBe(495)
    expect(b.total).toBe(990)
    expect(b.travelers).toHaveLength(2)
  })

  it('2 adultos + 2 niños en 2 habitaciones', () => {
    const b = calculatePrice(dunas, {
      ...base,
      rooms: [
        { adults: 1, children: 1 },
        { adults: 1, children: 1 },
      ],
    })
    expect(b.adults).toBe(2)
    expect(b.children).toBe(2)
    expect(b.total).toBe(2 * 495 + 2 * 330)
    expect(b.travelers.filter((t) => t.room === 2)).toHaveLength(2)
  })

  it('upgrade de un hotel suma suplemento por persona y noche', () => {
    // Ouarzazate: 2 noches a +22 €/pax/noche = +44 €/pax
    const b = calculatePrice(dunas, {
      ...base,
      rooms: [{ adults: 2, children: 0 }],
      hotelSelection: { 'st-dunas-ouarzazate': 'op-dunas-ouar-supa' },
    })
    expect(b.supplementPp).toBe(44)
    expect(b.unitAdult).toBe(539)
    expect(b.total).toBe(1078)
    expect(b.hotelLines).toHaveLength(1)
  })

  it('upgrade de todos los hoteles', () => {
    // Ouarzazate 2n*22 + Erfoud 1n*18 + Merzouga 1n*35 = 44+18+35 = 97
    const b = calculatePrice(dunas, {
      ...base,
      rooms: [{ adults: 2, children: 1 }],
      hotelSelection: {
        'st-dunas-ouarzazate': 'op-dunas-ouar-supa',
        'st-dunas-erfoud': 'op-dunas-erf-supa',
        'st-dunas-merzouga': 'op-dunas-mer-supa',
      },
    })
    expect(b.supplementPp).toBe(97)
    expect(b.total).toBe(2 * (495 + 97) + (330 + 97))
    // El desglose por viajero suma exactamente el total
    const sum = b.travelers.reduce((s, t) => s + t.amount, 0)
    expect(sum).toBe(b.total)
  })

  it('valida capacidad máxima y adulto obligatorio', () => {
    expect(() => calculatePrice(dunas, { ...base, rooms: [{ adults: 5, children: 2 }] })).toThrow(PricingError)
    expect(() => calculatePrice(dunas, { ...base, rooms: [{ adults: 0, children: 2 }] })).toThrow(PricingError)
    expect(() => calculatePrice(dunas, { ...base, rooms: [] })).toThrow(PricingError)
  })
})
