import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config'

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase: SupabaseClient | null = supabaseConfigurado
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export interface EstrategiaPublicada {
  cliente: string
  md_source: string
  updated_at: string
}

/** Busca pública por slug exato — única leitura permitida ao anon (RPC). */
export async function buscarEstrategia(slug: string): Promise<EstrategiaPublicada | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('get_estrategia', { p_slug: slug })
  if (error) throw new Error(error.message)
  const linha = Array.isArray(data) ? data[0] : data
  return linha ?? null
}
