export type HotelCategory = 'estandar' | 'superior_a' | 'superior_b' | 'superior_c'

export const CATEGORY_LABEL: Record<HotelCategory, string> = {
  estandar: 'Estándar',
  superior_a: 'Superior A',
  superior_b: 'Superior B',
  superior_c: 'Superior C',
}

export interface Poi {
  id: string
  title: string
  description: string
  imageUrl: string
}

export interface City {
  id: string
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  heroImageUrl: string
  gallery: string[]
  pois: Poi[]
}

export interface ItineraryDay {
  dayNumber: number
  title: string
  description: string
  imageUrl: string
  citySlug?: string
}

export interface PackDetailItem {
  type: 'incluye' | 'no_incluye' | 'nota_importante'
  content: string
}

export interface PackHighlight {
  title: string
  description: string
}

export interface StayHotelOption {
  id: string
  hotelName: string
  category: HotelCategory
  stars: number
  description: string
  thumbnailUrl: string
  supplementPpNight: number
  isDefault: boolean
}

export interface PackStay {
  id: string
  citySlug: string
  cityName: string
  nights: number
  options: StayHotelOption[]
}

export interface Pack {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  days: number
  nights: number
  maxPax: number
  priceFrom: number
  priceAdult: number
  priceChild: number
  childAgeMax: number
  featured: boolean
  featuredRank?: number
  heroImageUrl: string
  gallery: string[]
  citySlugs: string[]
  itinerary: ItineraryDay[]
  details: PackDetailItem[]
  highlights: PackHighlight[]
  stays: PackStay[]
}

export interface Activity {
  id: string
  title: string
  description: string
  imageUrl: string
  citySlug?: string
  durationLabel: string
  priceAdult: number | null
  priceChild: number | null
}

export interface TravelTip {
  slug: string
  title: string
  content: string
}

export interface RoomConfig {
  adults: number
  children: number
}

export interface QuoteConfig {
  packSlug: string
  departureDate: string // ISO yyyy-mm-dd
  rooms: RoomConfig[]
  flightNumber: string
  /** stayId -> optionId elegido (si difiere del default) */
  hotelSelection: Record<string, string>
  activityIds: string[]
}

export interface HotelSupplementLine {
  stayId: string
  cityName: string
  hotelName: string
  category: HotelCategory
  nights: number
  ppNight: number
  amountPp: number
}

export interface TravelerLine {
  room: number
  type: 'adulto' | 'nino'
  amount: number
}

export interface PriceBreakdown {
  currency: string
  baseAdult: number
  baseChild: number
  hotelLines: HotelSupplementLine[]
  supplementPp: number
  unitAdult: number
  unitChild: number
  travelers: TravelerLine[]
  adults: number
  children: number
  total: number
}
