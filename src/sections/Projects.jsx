import { useMemo, useState } from 'react';
import { projects as builtIn } from '../data/content.js';
import { useItems } from '../lib/items.js';
import { useAdmin } from '../lib/admin.jsx';
import { safeUrl, safeImage } from '../lib/itemSchemas.js';
import ItemDialog from '../components/ItemDialog.jsx';
import { AddButton, ItemActions, ListStatus } from '../components/ItemControls.jsx';

export default function Projects() {
  const { isAdmin } = useAdmin();
  const col = useItems('project');
  const [dialog, setDialog] = useState(null);
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);

  const all = useMemo(
    () => [...col.items.map((i) => ({ ...i.data, _item: i, _key: i.id })), ...builtIn.map((p) => ({ ...p, _key: `b:${p.title}` }))],
    [col.items],
  );
  const categories = ['All', ...new Set(all.map((p) => p.category).filter(Boolean))];
  const active = categories.includes(cat) ? cat : 'All';
  const shown = all.filter((p) => active === 'All' || p.category === active);

  return (
    <div>
      <div className="section-bar">
        <h2 className="section-title">Projects</h2>
        <AddButton label="Add project" onClick={() => setDialog({})} />
      </div>

      {categories.length > 2 && (
        <div className="filters" role="tablist" aria-label="Filter projects">
          {categories.map((c) => (
            <button key={c} role="tab" aria-selected={active === c} className={`chip chip--btn${active === c ? ' is-on' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      <ListStatus col={col} count={all.length} noun="project" isAdmin={isAdmin} />

      <div className="grid">
        {shown.map((p) => {
          const isOpen = open === p._key;
          const img = safeImage(p.image);
          return (
            <article className={`card project${isOpen ? ' is-open' : ''}`} key={p._key}>
              {img && <img className="project__img" src={img} alt={`${p.title} screenshot`} loading="lazy" />}
              {p.category && <span className="project__cat">{p.category}</span>}
              <h3 className="card__title">{p.title}</h3>
              <p className="card__text">{p.summary}</p>
              {isOpen && p.details && <p className="card__text project__details">{p.details}</p>}
              {p.stack?.length > 0 && (
                <ul className="tags" aria-label="Tech stack">
                  {p.stack.map((s) => (
                    <li key={s} className="chip">{s}</li>
                  ))}
                </ul>
              )}
              <div className="project__actions">
                {p.details && (
                  <button className="link-btn" onClick={() => setOpen(isOpen ? null : p._key)} aria-expanded={isOpen}>
                    {isOpen ? 'Less −' : 'More +'}
                  </button>
                )}
                {(p.links || []).filter((l) => safeUrl(l.url)).map((l) => (
                  <a key={l.url} className="link-btn" href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
              <ItemActions item={p._item} col={col} noun="project" onEdit={() => setDialog({ item: p._item })} />
            </article>
          );
        })}
      </div>

      {dialog && <ItemDialog kind="project" item={dialog.item} col={col} onClose={() => setDialog(null)} />}
    </div>
  );
}
