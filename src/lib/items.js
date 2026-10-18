import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase.js';

/*
  Owner-editable lists: projects, experience, achievements.
  • Supabase configured → rows in the `portfolio_items` table (supabase/add_portfolio_items.sql).
    Everyone can read; only the owner can write.
  • Not configured      → saved in this browser's localStorage (for trying things out).

  Item shape: { id, kind, data: {...fields}, position }   — higher position = shown first.
  Every mutation resolves to { ok: true } or { ok: false, error }.
*/
const KEY = 'ehp.items.v1';

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};
const writeLocal = (all) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
};
const byPosition = (list) => [...list].sort((a, b) => b.position - a.position);
let lastPos = 0;
const nextPos = () => (lastPos = Math.max(Date.now(), lastPos + 1));
const uid = () => `i_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const toItem = (r) => ({ id: r.id, kind: r.kind, data: r.data || {}, position: Number(r.position) });

export function useItems(kind) {
  const [items, setItems] = useState(() => (supabase ? [] : byPosition(readLocal()[kind] || [])));
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState('');
  const seq = useRef(0);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setItems(byPosition(readLocal()[kind] || []));
      return;
    }
    const mine = ++seq.current;
    setLoading(true);
    const { data, error: err } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('kind', kind)
      .order('position', { ascending: false });
    if (mine !== seq.current) return;
    if (err) setError(err.message);
    else {
      setError('');
      setItems(data.map(toItem));
    }
    setLoading(false);
  }, [kind]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveLocal = (next) => {
    const all = readLocal();
    all[kind] = next;
    if (!writeLocal(all)) return false;
    setItems(byPosition(next));
    return true;
  };

  const create = useCallback(
    async (data) => {
      const position = nextPos();
      if (supabase) {
        const { data: row, error: err } = await supabase
          .from('portfolio_items')
          .insert({ kind, data, position })
          .select()
          .single();
        if (err) return { ok: false, error: err.message };
        setItems((cur) => byPosition([...cur, toItem(row)]));
        return { ok: true };
      }
      const next = [...(readLocal()[kind] || []), { id: uid(), kind, data, position }];
      return saveLocal(next) ? { ok: true } : { ok: false, error: 'Browser storage is full — try a smaller image.' };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind],
  );

  const update = useCallback(
    async (id, data) => {
      if (supabase) {
        const { data: row, error: err } = await supabase
          .from('portfolio_items')
          .update({ data })
          .eq('id', id)
          .select()
          .single();
        if (err) return { ok: false, error: err.message };
        setItems((cur) => cur.map((i) => (i.id === id ? toItem(row) : i)));
        return { ok: true };
      }
      const next = (readLocal()[kind] || []).map((i) => (i.id === id ? { ...i, data } : i));
      return saveLocal(next) ? { ok: true } : { ok: false, error: 'Browser storage is full — try a smaller image.' };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind],
  );

  const remove = useCallback(
    async (id) => {
      if (supabase) {
        const { error: err } = await supabase.from('portfolio_items').delete().eq('id', id);
        if (err) return { ok: false, error: err.message };
        setItems((cur) => cur.filter((i) => i.id !== id));
        return { ok: true };
      }
      const next = (readLocal()[kind] || []).filter((i) => i.id !== id);
      return saveLocal(next) ? { ok: true } : { ok: false, error: 'Could not delete.' };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind],
  );

  /** dir = -1 → move up (towards the top), +1 → move down. Swaps positions with the neighbour. */
  const move = useCallback(
    async (id, dir) => {
      const list = supabase ? items : byPosition(readLocal()[kind] || []);
      const i = list.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return { ok: true };
      const a = list[i];
      const b = list[j];
      if (supabase) {
        const r1 = await supabase.from('portfolio_items').update({ position: b.position }).eq('id', a.id);
        const r2 = await supabase.from('portfolio_items').update({ position: a.position }).eq('id', b.id);
        const err = r1.error || r2.error;
        if (err) return { ok: false, error: err.message };
        setItems((cur) =>
          byPosition(
            cur.map((x) => {
              if (x.id === a.id) return { ...x, position: b.position };
              if (x.id === b.id) return { ...x, position: a.position };
              return x;
            }),
          ),
        );
        return { ok: true };
      }
      const next = list.map((x) => {
        if (x.id === a.id) return { ...x, position: b.position };
        if (x.id === b.id) return { ...x, position: a.position };
        return x;
      });
      return saveLocal(next) ? { ok: true } : { ok: false, error: 'Could not reorder.' };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, items],
  );

  return { items, loading, error, create, update, remove, move };
}
