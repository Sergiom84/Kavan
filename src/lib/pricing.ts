import type { Pack, PriceBreakdown, QuoteConfig, HotelSupplementLine, TravelerLine } from './types'

const round2 = (n: number) => Math.round(n * 100) / 100

export class PricingError extends Error {}

/**
 * Motor de precios. Puro: entrada pack + configuración, salida desglose.
 * Suplemento hotelero por persona y noche (estándar del sector); niños pagan
 * el mismo suplemento. El resultado se congela en la cotización guardada.
 */
export function calculatePrice(pack: Pack, config: QuoteConfig): PriceBreakdown {
  const adults = config.rooms.reduce((s, r) => s + r.adults, 0)
  const children = config.rooms.reduce((s, r) => s + r.children, 0)
  const pax = adults + children

  if (pax < 1) throw new PricingError('Configura al menos un viajero.')
  if (adults < 1) throw new PricingError('Debe viajar al menos un adulto.')
  if (pax > pack.maxPax) throw new PricingError(`Este pack admite hasta ${pack.maxPax} viajeros.`)

  const hotelLines: HotelSupplementLine[] = []
  let supplementPp = 0

  for (const stay of pack.stays) {
    const selectedId = config.hotelSelection[stay.id]
    const option =
      stay.options.find((o) => o.id === selectedId) ?? stay.options.find((o) => o.isDefault) ?? stay.options[0]
    if (!option) continue
    if (option.supplementPpNight > 0) {
      const amountPp = round2(option.supplementPpNight * stay.nights)
      supplementPp = round2(supplementPp + amountPp)
      hotelLines.push({
        stayId: stay.id,
        cityName: stay.cityName,
        hotelName: option.hotelName,
        category: option.category,
        nights: stay.nights,
        ppNight: option.supplementPpNight,
        amountPp,
      })
    }
  }

  const unitAdult = round2(pack.priceAdult + supplementPp)
  const unitChild = round2(pack.priceChild + supplementPp)

  const travelers: TravelerLine[] = []
  config.rooms.forEach((room, i) => {
    for (let a = 0; a < room.adults; a++) travelers.push({ room: i + 1, type: 'adulto', amount: unitAdult })
    for (let c = 0; c < room.children; c++) travelers.push({ room: i + 1, type: 'nino', amount: unitChild })
  })

  const total = round2(adults * unitAdult + children * unitChild)

  return {
    currency: 'EUR',
    baseAdult: pack.priceAdult,
    baseChild: pack.priceChild,
    hotelLines,
    supplementPp,
    unitAdult,
    unitChild,
    travelers,
    adults,
    children,
    total,
  }
}

export const formatPrice = (n: number, currency = 'EUR'): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency, maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n)
