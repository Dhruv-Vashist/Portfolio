import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Tolerate a pasted URL with a trailing slash or a path like /rest/v1 — only the origin is valid.
let url = rawUrl;
try {
  if (rawUrl) url = new URL(rawUrl).origin;
} catch {
  /* leave as typed; Supabase will report it */
}

/** True when both Supabase env variables are filled in (see .env.example). */
export const hasSupabase = Boolean(url && key);

/** The Supabase client, or null → the site falls back to browser-only storage. */
export const supabase = hasSupabase ? createClient(url, key) : null;

/** Optional extra check in the UI; the database enforces the real rule (supabase/schema.sql). */
export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || '').trim().toLowerCase();
