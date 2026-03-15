import { createClient } from '@supabase/supabase-js';
import { appEnv } from './env';

export const supabase = appEnv.hasSupabase
  ? createClient(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
