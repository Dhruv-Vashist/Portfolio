import { useState } from 'react';
import { achievements as builtIn } from '../data/content.js';
import { useItems } from '../lib/items.js';
import { useAdmin } from '../lib/admin.jsx';
import ItemDialog from '../components/ItemDialog.jsx';
import { AddButton, ItemActions, ListStatus } from '../components/ItemControls.jsx';

const GLYPH = { Award: '★', Certification: '✔', Milestone: '▲' };

export default function Achievements() {
  const { isAdmin } = useAdmin();
  const col = useItems('achievement');
  const [dialog, setDialog] = useState(null);
  const all = [...col.items.map((i) => ({ ...i.data, _item: i, _key: i.id })), ...builtIn.map((a) => ({ ...a, _key: `b:${a.title}` }))];

  return (
    <div>
      <div className="section-bar">
        <h2 className="section-title">Achievements</h2>
        <AddButton label="Add achievement" onClick={() => setDialog({})} />
      </div>
      <ListStatus col={col} count={all.length} noun="achievement" isAdmin={isAdmin} />
      <ul className="ach">
        {all.map((a) => {
          const kind = a.kind || 'Award';
          return (
            <li key={a._key} className="card ach__item">
              <span className={`ach__glyph ach__glyph--${kind.toLowerCase()}`} aria-hidden="true">
                {GLYPH[kind] || '●'}
              </span>
              <div>
                <div className="ach__meta">
                  <span className="chip chip--solid">{a.year}</span>
                  <span className="chip">{kind}</span>
                </div>
                <h3 className="card__title">{a.title}</h3>
                {a.text && <p className="card__text">{a.text}</p>}
                <ItemActions item={a._item} col={col} noun="achievement" onEdit={() => setDialog({ item: a._item })} />
              </div>
            </li>
          );
        })}
      </ul>
      {dialog && <ItemDialog kind="achievement" item={dialog.item} col={col} onClose={() => setDialog(null)} />}
    </div>
  );
}
