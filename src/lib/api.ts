import { activities, cities, packs, travelTips } from '../data/seed'
import type { Activity, City, Pack, QuoteConfig, PriceBreakdown, TravelTip } from './types'
import { supabase } from './supabase'

/**
 * Capa de acceso a datos. Hoy sirve el catálogo local; cuando Supabase esté
 * poblado, cada función puede consultar primero la base de datos y usar el
 * catálogo local como respaldo. Las firmas no cambian.
 */

export async function fetchPacks(): Promise<Pack[]> {
  return packs
}

export async function fetchPack(slug: string): Promise<Pack | undefined> {
  return packs.find((p) => p.slug === slug)
}

export async function fetchFeaturedPacks(): Promise<Pack[]> {
  return packs
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99))
}

export async function fetchCities(): Promise<City[]> {
  return cities
}

export async function fetchCity(slug: string): Promise<City | undefined> {
  return cities.find((c) => c.slug === slug)
}

export async function fetchActivities(citySlugs?: string[]): Promise<Activity[]> {
  if (!citySlugs?.length) return activities
  return activities.filter((a) => a.citySlug && citySlugs.includes(a.citySlug))
}

export async function fetchTravelTips(): Promise<TravelTip[]> {
  return travelTips
}

export interface SavedQuote {
  id: string
  config: QuoteConfig
  breakdown: PriceBreakdown
  createdAt: string
}

const QUOTES_KEY = 'kavan.quotes'

/**
 * Persistencia de cotizaciones: localStorage siempre (recuperable en el
 * dispositivo) e insert en Supabase si está configurado (lead para la agencia).
 */
export async function saveQuote(config: QuoteConfig, breakdown: PriceBreakdown): Promise<SavedQuote> {
  const quote: SavedQuote = {
    id: crypto.randomUUID(),
    config,
    breakdown,
    createdAt: new Date().toISOString(),
  }
  const all = loadQuotes()
  all[quote.id] = quote
  localStorage.setItem(QUOTES_KEY, JSON.stringify(all))

  if (supabase) {
    const pack = packs.find((p) => p.slug === config.packSlug)
    await supabase.from('quotes').insert({
      id: quote.id,
      pack_id: pack?.id,
      departure_date: config.departureDate,
      days: pack?.days ?? 0,
      flight_number: config.flightNumber || null,
      rooms: config.rooms,
      hotel_selection: config.hotelSelection,
      activity_ids: config.activityIds,
      price_breakdown: breakdown,
      total: breakdown.total,
    })
  }
  return quote
}

export function loadQuotes(): Record<string, SavedQuote> {
  try {
    return JSON.parse(localStorage.getItem(QUOTES_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function loadQuote(id: string): SavedQuote | undefined {
  return loadQuotes()[id]
}

export function updateQuote(quote: SavedQuote): void {
  const all = loadQuotes()
  all[quote.id] = quote
  localStorage.setItem(QUOTES_KEY, JSON.stringify(all))
}
