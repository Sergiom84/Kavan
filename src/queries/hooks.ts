import { useQuery } from '@tanstack/react-query'
import {
  fetchActivities,
  fetchCities,
  fetchCity,
  fetchFeaturedPacks,
  fetchPack,
  fetchPacks,
  fetchTravelTips,
} from '../lib/api'

export const usePacks = () => useQuery({ queryKey: ['packs'], queryFn: fetchPacks })
export const usePack = (slug: string | undefined) =>
  useQuery({ queryKey: ['pack', slug], queryFn: () => fetchPack(slug!), enabled: !!slug })
export const useFeaturedPacks = () => useQuery({ queryKey: ['packs', 'featured'], queryFn: fetchFeaturedPacks })
export const useCities = () => useQuery({ queryKey: ['cities'], queryFn: fetchCities })
export const useCity = (slug: string | undefined) =>
  useQuery({ queryKey: ['city', slug], queryFn: () => fetchCity(slug!), enabled: !!slug })
export const useActivities = (citySlugs?: string[]) =>
  useQuery({ queryKey: ['activities', citySlugs], queryFn: () => fetchActivities(citySlugs) })
export const useTravelTips = () => useQuery({ queryKey: ['tips'], queryFn: fetchTravelTips })
