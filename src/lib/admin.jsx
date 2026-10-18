import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, hasSupabase, OWNER_EMAIL } from './supabase.js';

/*
  Owner mode.
  • Supabase configured  → real email + password login. The database (row-level security,
    see supabase/schema.sql) decides what the owner may read/write, so visitors can never
    fetch private posts or change anything.
  • Not configured       → local-only passcode (VITE_ADMIN_PASSCODE). It only hides the UI and
    is meant for trying the site on your own computer.

  login() resolves to { ok: true } or { ok: false, error }.
*/
const KEY = 'ehp.owner';
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'elaine2026';

const Ctx = createContext(null);

const isOwnerSession = (s) => !!s && (!OWNER_EMAIL || (s.user?.email || '').toLowerCase() === OWNER_EMAIL);

export function AdminProvider({ children }) {
  const [localAdmin, setLocalAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase) return undefined;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async ({ email, password, code } = {}) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: String(email || '').trim(),
        password: password || '',
      });
      if (error) {
        return { ok: false, error: error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message };
      }
      if (!isOwnerSession(data.session)) {
        await supabase.auth.signOut();
        return { ok: false, error: 'This account is not the site owner.' };
      }
      return { ok: true };
    }
    if (code === PASSCODE) {
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* ignore */
      }
      setLocalAdmin(true);
      return { ok: true };
    }
    return { ok: false, error: 'Incorrect passcode.' };
  }, []);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setLocalAdmin(false);
  }, []);

  const isAdmin = supabase ? isOwnerSession(session) : localAdmin;
  const value = useMemo(() => ({ isAdmin, login, logout, usesAccounts: hasSupabase }), [isAdmin, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);
