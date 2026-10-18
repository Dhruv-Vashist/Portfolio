import { useCallback, useEffect, useRef, useState } from 'react';
import seed from '../data/seedPosts';
import { supabase } from './supabase.js';
import { useAdmin } from './admin.jsx';

/*
  Blog data layer.
  • Supabase configured → posts live in the `posts` table (supabase/schema.sql).
    The database only returns PUBLIC posts to visitors; the owner gets everything.
  • Not configured      → posts live in this browser's localStorage (good for trying things out).

  Every mutation resolves to { ok: true, ... } or { ok: false, error: '…message…' }.
*/
const KEY = 'ehp.blog.v1';

/* ───────── local driver ───────── */
function localRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  return seed;
}

function localWrite(posts) {
  try {
    localStorage.setItem(KEY, JSON.stringify(posts));
    return true;
  } catch {
    return false;
  }
}

const uid = () => `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const FULL = 'Could not save — browser storage is full. Try smaller or fewer images.';

/* ───────── row ⇄ post mapping (Supabase) ───────── */
const toPost = (r) => ({
  id: r.id,
  title: r.title,
  excerpt: r.excerpt || '',
  tags: r.tags || [],
  status: r.status,
  html: r.html || '',
  createdAt: Date.parse(r.created_at),
  updatedAt: Date.parse(r.updated_at),
});

const toRow = (d) => {
  const row = {};
  ['title', 'excerpt', 'tags', 'status', 'html'].forEach((k) => {
    if (d[k] !== undefined) row[k] = d[k];
  });
  return row;
};

export function useBlog() {
  const { isAdmin } = useAdmin();
  const [posts, setPosts] = useState(() => (supabase ? [] : localRead()));
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState('');
  const seq = useRef(0);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setPosts(localRead());
      return;
    }
    const mine = ++seq.current;
    setLoading(true);
    const { data, error: err } = await supabase.from('posts').select('*').order('updated_at', { ascending: false });
    if (mine !== seq.current) return; // a newer request superseded this one
    if (err) {
      setError(err.message);
    } else {
      setError('');
      setPosts(data.map(toPost));
    }
    setLoading(false);
  }, []);

  // (re)load on mount and whenever owner login state changes — what the server returns depends on it
  useEffect(() => {
    refresh();
  }, [refresh, isAdmin]);

  // local mode only: keep several tabs in sync
  useEffect(() => {
    if (supabase) return undefined;
    const onStorage = (e) => {
      if (e.key === KEY) setPosts(localRead());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const create = useCallback(async (data) => {
    if (supabase) {
      const { data: row, error } = await supabase.from('posts').insert(toRow(data)).select().single();
      if (error) return { ok: false, error: error.message };
      const post = toPost(row);
      setPosts((p) => [post, ...p]);
      return { ok: true, post };
    }
    const t = Date.now();
    const post = { ...data, id: uid(), createdAt: t, updatedAt: t };
    const next = [post, ...localRead()];
    if (!localWrite(next)) return { ok: false, error: FULL };
    setPosts(next);
    return { ok: true, post };
  }, []);

  const update = useCallback(async (id, patch) => {
    if (supabase) {
      const { data: row, error } = await supabase.from('posts').update(toRow(patch)).eq('id', id).select().single();
      if (error) return { ok: false, error: error.message };
      const post = toPost(row);
      setPosts((p) => p.map((x) => (x.id === id ? post : x)));
      return { ok: true, post };
    }
    const next = localRead().map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p));
    if (!localWrite(next)) return { ok: false, error: FULL };
    setPosts(next);
    return { ok: true };
  }, []);

  const remove = useCallback(async (id) => {
    if (supabase) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) return { ok: false, error: error.message };
      setPosts((p) => p.filter((x) => x.id !== id));
      return { ok: true };
    }
    const next = localRead().filter((p) => p.id !== id);
    if (!localWrite(next)) return { ok: false, error: FULL };
    setPosts(next);
    return { ok: true };
  }, []);

  return { posts, loading, error, create, update, remove, refresh };
}
