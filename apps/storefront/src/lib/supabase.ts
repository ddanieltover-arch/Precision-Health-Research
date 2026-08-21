import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  '';

const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  '';

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SALES_MANAGER' | 'READ_ONLY';

export const ADMIN_SESSION_KEY = 'phr_admin_session';
export const ADMIN_WRITE_KEY = 'phr_admin_write_key';

export function getAdminWriteKey(): string {
  try {
    const fromSession = sessionStorage.getItem(ADMIN_WRITE_KEY);
    if (fromSession) return fromSession;
  } catch {
    /* ignore */
  }
  return ((import.meta.env.VITE_ADMIN_PASSWORD as string) || '').trim();
}

export function setAdminWriteKey(key: string | null) {
  try {
    if (!key) sessionStorage.removeItem(ADMIN_WRITE_KEY);
    else sessionStorage.setItem(ADMIN_WRITE_KEY, key);
  } catch {
    /* ignore */
  }
}