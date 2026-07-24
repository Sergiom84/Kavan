import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/**
 * Cliente Supabase, o null si no hay credenciales configuradas.
 * Sin credenciales la app funciona con el catálogo local de src/data/seed.ts.
 */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null
