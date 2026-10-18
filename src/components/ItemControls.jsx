import { useState } from 'react';
import { useAdmin } from '../lib/admin.jsx';

/** "＋ Add …" button — only the signed-in owner sees it. */
export function AddButton({ label, onClick }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;
  return (
    <button className="btn btn--primary" onClick={onClick}>
      ＋ {label}
    </button>
  );
}

/** ▲ ▼ Edit Delete — only for the owner, and only for items saved online (not built-in ones). */
export function ItemActions({ item, col, noun, onEdit }) {
  const { isAdmin } = useAdmin();
  const [busy, setBusy] = useState(false);
  if (!isAdmin || !item) return null;

  const index = col.items.findIndex((i) => i.id === item.id);
  const run = async (fn) => {
    setBusy(true);
    const res = await fn();
    setBusy(false);
    if (!res.ok) window.alert(res.error || 'Something went wrong.');
  };
  const del = () => {
    if (window.confirm(`Delete this ${noun}? This cannot be undone.`)) run(() => col.remove(item.id));
  };

  return (
    <div className="item-actions" role="group" aria-label={`Manage ${noun}`}>
      <button className="link-btn" disabled={busy || index <= 0} onClick={() => run(() => col.move(item.id, -1))} aria-label="Move up" title="Move up">
        ▲
      </button>
      <button className="link-btn" disabled={busy || index >= col.items.length - 1} onClick={() => run(() => col.move(item.id, 1))} aria-label="Move down" title="Move down">
        ▼
      </button>
      <button className="link-btn" disabled={busy} onClick={onEdit}>
        Edit
      </button>
      <button className="link-btn link-btn--danger" disabled={busy} onClick={del}>
        Delete
      </button>
    </div>
  );
}

/** Message shown while loading / when a list is empty / when loading failed. */
export function ListStatus({ col, count, noun, isAdmin }) {
  if (col.error) {
    return (
      <p className="form__err" role="alert">
        Couldn’t load {noun}s: {col.error}. If you just set up Supabase, run supabase/add_portfolio_items.sql.
      </p>
    );
  }
  if (col.loading && count === 0) return <p className="muted empty">Loading…</p>;
  if (count > 0) return null;
  return (
    <p className="muted empty">
      {isAdmin ? `No ${noun}s yet — click “＋ Add ${noun}” to add your first one.` : `${noun[0].toUpperCase()}${noun.slice(1)}s are on the way — check back soon!`}
    </p>
  );
}
