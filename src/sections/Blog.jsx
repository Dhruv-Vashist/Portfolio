import { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../lib/admin.jsx';
import { useBlog } from '../lib/blogStore.js';
import { clean, toText } from '../lib/sanitize.js';
import Editor from '../components/Editor.jsx';

const STATUS = {
  public: { label: 'Public', icon: '🟢' },
  private: { label: 'Private', icon: '🔒' },
  draft: { label: 'Draft', icon: '📝' },
};

const fmtDate = (t) => new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.draft;
  return <span className={`badge badge--${status}`}>{s.icon} {s.label}</span>;
}

export default function Blog() {
  const { isAdmin, login, logout, usesAccounts } = useAdmin();
  const blog = useBlog();
  const [mode, setMode] = useState({ name: 'list' }); // list | read | edit
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showLogin, setShowLogin] = useState(false);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  // Leaving owner mode must never leave the editor / private post on screen.
  useEffect(() => {
    if (!isAdmin) {
      setMode({ name: 'list' });
      setFilter('all');
    }
  }, [isAdmin]);

  // Visitors only ever see public posts. (With Supabase the database already refuses to send
  // anything else; this filter also covers the instant after logging out.)
  const visible = useMemo(
    () => (isAdmin ? blog.posts : blog.posts.filter((p) => p.status === 'public')),
    [blog.posts, isAdmin],
  );

  const counts = useMemo(() => {
    const c = { all: visible.length, public: 0, private: 0, draft: 0 };
    visible.forEach((p) => {
      if (c[p.status] !== undefined) c[p.status] += 1;
    });
    return c;
  }, [visible]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return visible
      .filter((p) => !isAdmin || filter === 'all' || p.status === filter)
      .filter((p) => {
        if (!terms.length) return true;
        const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(' ')} ${toText(p.html)}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [visible, query, filter, isAdmin]);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4500);
  };

  const save = async (data) => {
    if (saving) return;
    setSaving(true);
    const res = mode.post ? await blog.update(mode.post.id, data) : await blog.create(data);
    setSaving(false);
    if (!res.ok) {
      flash(`Could not save: ${res.error}`);
      return;
    }
    flash(mode.post ? 'Post updated.' : 'Post created.');
    setMode({ name: 'list' });
  };

  const del = async (p) => {
    if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    const res = await blog.remove(p.id);
    if (!res.ok) {
      flash(`Could not delete: ${res.error}`);
      return;
    }
    flash('Post deleted.');
    if (mode.name === 'read') setMode({ name: 'list' });
  };

  const setStatus = async (p, status) => {
    const res = await blog.update(p.id, { status });
    if (!res.ok) flash(`Could not change status: ${res.error}`);
  };

  /* ───────── editor ───────── */
  if (mode.name === 'edit' && isAdmin) {
    return (
      <div>
        <h2 className="section-title">{mode.post ? 'Edit post' : 'New post'}</h2>
        <Editor
          key={mode.post?.id || 'new'}
          post={mode.post}
          saving={saving}
          onSave={save}
          onCancel={() => setMode({ name: 'list' })}
        />
        {notice && <p className="notice" role="status">{notice}</p>}
      </div>
    );
  }

  /* ───────── reading ───────── */
  if (mode.name === 'read') {
    const p = visible.find((x) => x.id === mode.id);
    if (!p) {
      return (
        <div>
          <button className="link-btn" onClick={() => setMode({ name: 'list' })}>← Back to posts</button>
          <p className="muted">That post is not available.</p>
        </div>
      );
    }
    return (
      <article>
        <button className="link-btn" onClick={() => setMode({ name: 'list' })}>← Back to posts</button>
        <div className="post-head">
          <h2 className="section-title">{p.title}</h2>
          <div className="post-meta">
            {isAdmin && <StatusBadge status={p.status} />}
            <span>{fmtDate(p.updatedAt)}</span>
            {(p.tags || []).map((t) => <span key={t} className="chip">#{t}</span>)}
          </div>
        </div>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: clean(p.html) }} />
        {isAdmin && (
          <div className="btn-row">
            <button className="btn" onClick={() => setMode({ name: 'edit', post: p })}>Edit</button>
            <button className="btn btn--danger" onClick={() => del(p)}>Delete</button>
          </div>
        )}
        {notice && <p className="notice" role="status">{notice}</p>}
      </article>
    );
  }

  /* ───────── list ───────── */
  return (
    <div>
      <div className="blog-head">
        <h2 className="section-title">Blog</h2>
        {isAdmin && (
          <button className="btn btn--primary" onClick={() => setMode({ name: 'edit', post: null })}>
            ＋ Add Blog
          </button>
        )}
      </div>

      <div className="search">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title, content or keyword…"
          aria-label="Search blog posts"
        />
        {query && <button className="link-btn" onClick={() => setQuery('')}>Clear</button>}
      </div>

      {isAdmin && (
        <div className="filters" role="group" aria-label="Filter by status (owner only)">
          {[
            ['all', 'All'],
            ['public', '🟢 Public'],
            ['private', '🔒 Private'],
            ['draft', '📝 Draft'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`chip chip--btn${filter === key ? ' is-on' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label} <span className="chip__n">{counts[key]}</span>
            </button>
          ))}
        </div>
      )}

      {notice && <p className="notice" role="status">{notice}</p>}
      {blog.error && (
        <p className="notice notice--error" role="alert">
          Couldn’t load posts: {blog.error}. If you just set up Supabase, make sure you ran supabase/schema.sql.
        </p>
      )}

      {blog.loading ? (
        <p className="muted empty">Loading posts…</p>
      ) : results.length === 0 ? (
        <p className="muted empty">
          {query ? `No posts match “${query}”.` : isAdmin ? 'Nothing here yet — click “Add Blog” to write your first post.' : 'No posts yet. Check back soon!'}
        </p>
      ) : (
        <ul className="posts">
          {results.map((p) => (
            <li key={p.id} className="card post">
              <div className="post__top">
                {isAdmin && <StatusBadge status={p.status} />}
                <span className="muted">{fmtDate(p.updatedAt)}</span>
              </div>
              <h3 className="card__title">
                <button className="post__title" onClick={() => setMode({ name: 'read', id: p.id })}>{p.title}</button>
              </h3>
              <p className="card__text">{p.excerpt}</p>
              <ul className="tags">
                {(p.tags || []).map((t) => <li key={t} className="chip">#{t}</li>)}
              </ul>
              <div className="project__actions">
                <button className="link-btn" onClick={() => setMode({ name: 'read', id: p.id })}>Read →</button>
                {isAdmin && (
                  <>
                    <button className="link-btn" onClick={() => setMode({ name: 'edit', post: p })}>Edit</button>
                    <select
                      className="mini-select"
                      aria-label={`Change status of ${p.title}`}
                      value={p.status}
                      onChange={(e) => setStatus(p, e.target.value)}
                    >
                      <option value="public">🟢 Public</option>
                      <option value="private">🔒 Private</option>
                      <option value="draft">📝 Draft</option>
                    </select>
                    <button className="link-btn link-btn--danger" onClick={() => del(p)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className="owner">
        {isAdmin ? (
          <>
            <span>🔓 Owner mode</span>
            <button className="link-btn" onClick={logout}>Log out</button>
          </>
        ) : (
          <button className="link-btn" onClick={() => setShowLogin(true)}>🔒 Owner login</button>
        )}
      </footer>

      {showLogin && <LoginDialog usesAccounts={usesAccounts} onClose={() => setShowLogin(false)} onLogin={login} />}
    </div>
  );
}

function LoginDialog({ usesAccounts, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await onLogin(usesAccounts ? { email, password: secret } : { code: secret });
    setBusy(false);
    if (res.ok) onClose();
    else setErr(res.error || 'Login failed.');
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Owner login" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal__card" onSubmit={submit}>
        <div className="modal__head">
          <strong>Owner login</strong>
          <button type="button" className="window__close" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {usesAccounts && (
          <label>
            Email
            <input type="email" autoFocus autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} />
          </label>
        )}
        <label>
          {usesAccounts ? 'Password' : 'Passcode'}
          <input
            type="password"
            autoFocus={!usesAccounts}
            autoComplete={usesAccounts ? 'current-password' : 'off'}
            value={secret}
            onChange={(e) => { setSecret(e.target.value); setErr(''); }}
          />
        </label>
        {err && <p className="form__err" role="alert">{err}</p>}
        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" disabled={busy}>{busy ? 'Checking…' : 'Unlock'}</button>
        </div>
      </form>
    </div>
  );
}
