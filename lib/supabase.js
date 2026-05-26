import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug: log env vars availability (not the actual values)
if (typeof window !== 'undefined') {
  console.log('Supabase env check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPrefix: supabaseUrl?.substring(0, 30)
  })
}

// Create client only if env vars are available
// This prevents build-time errors in Docker
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else if (typeof window !== 'undefined') {
  // Only warn in browser, not during build
  console.warn('Missing Supabase environment variables')
}

// Helper to get supabase client with runtime check
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Missing Supabase environment variables')
  }
  return supabase
}

export { supabase }
