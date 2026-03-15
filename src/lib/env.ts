const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ??
  '';
const adminEmailsRaw = import.meta.env.VITE_ADMIN_EMAILS?.trim() ?? '';

export const appEnv = {
  supabaseUrl,
  supabaseAnonKey,
  adminEmails: adminEmailsRaw
    .split(',')
    .map((value: string) => value.trim().toLowerCase())
    .filter(Boolean),
  hasSupabase: Boolean(supabaseUrl && supabaseAnonKey)
};
