import { createClient } from '@supabase/supabase-js'

const supabaseUri = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

if (!supabaseUri || !supabaseAnonKey) {
  throw new Error(
    "Missing supabase env vars"
  )
}

export function createClerkSupabaseClient(
  getToken: () => Promise<string | null>
) {
  return createClient(supabaseUri, supabaseAnonKey, {
    async accessToken() { return getToken() }
  })
}