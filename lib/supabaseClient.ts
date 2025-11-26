// lib/supabaseClient.ts
// PRODUCTION VERSION - Uses environment variables

import { createClient } from '@supabase/supabase-js';

// Read from environment variables (Vite uses import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate credentials exist
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
  
  throw new Error(
    "Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables or .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure auth flow
  },
  // Global options for better error handling
  global: {
    headers: {
      'x-client-info': 'vibex-app',
    },
  },
  // Realtime options
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit realtime events
    },
  },
});

// Helper to check connection (useful for debugging)
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.error('Supabase connection check failed:', error.message);
      return false;
    }
    console.log('✓ Supabase connection verified');
    return true;
  } catch (e) {
    console.error('Supabase connection check error:', e);
    return false;
  }
};