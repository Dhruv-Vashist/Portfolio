import { useState } from 'react';
import { skills as builtIn } from '../data/content.js';
import { useItems } from '../lib/items.js';
import { useAdmin } from '../lib/admin.jsx';
import ItemDialog from '../components/ItemDialog.jsx';
import { AddButton, ItemActions } from '../components/ItemControls.jsx';

export default function Skills() {
  const { isAdmin } = useAdmin();
  const col = useItems('skill');
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // Once you save any group online, the online list replaces the built-in one from content.js
  const online = col.items.length > 0;
  const groups = online ? col.items.map((i) => ({ ...i.data, _item: i, _key: i.id })) : builtIn.map((g) => ({ ...g, _key: `b:${g.group}` }));

  const importBuiltIn = async () => {
    setBusy(true);
    setMsg('');
    for (const g of [...builtIn].reverse()) {
      // reversed so the first group ends up on top
      // eslint-disable-next-line no-await-in-loop
      const r = await col.create({ group: g.group, items: g.items });
      if (!r.ok) {
        setMsg(r.error || 'Could not import.');
        break;
      }
    }
    setBusy(false);
  };

  return (
    <div>
      <div className="section-bar">
        <h2 className="section-title">Technical Skills</h2>
        <AddButton label="Add skill group" onClick={() => setDialog({})} />
      </div>

      {isAdmin && !online && !col.loading && (
        <div className="owner-box">
          <p>
            These skills come from the code. To add, remove or rename them here on the site, copy them online first.
          </p>
          <button className="btn" onClick={importBuiltIn} disabled={busy}>
            {busy ? 'Copying…' : 'Make my skills editable'}
          </button>
          {msg && <p className="form__err">{msg}</p>}
        </div>
      )}
      {col.error && (
        <p className="form__err" role="alert">
          Couldn’t load online skills: {col.error}. Run supabase/add_portfolio_items.sql once.
        </p>
      )}

      <dl className="skills">
        {groups.map((g) => (
          <div className="skills__row" key={g._key}>
            <dt>{g.group}</dt>
            <dd>
              <ul className="tags">
                {(g.items || []).map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
              <ItemActions item={g._item} col={col} noun="skill group" onEdit={() => setDialog({ item: g._item })} />
            </dd>
          </div>
        ))}
      </dl>

      {dialog && <ItemDialog kind="skill" item={dialog.item} col={col} onClose={() => setDialog(null)} />}
    </div>
  );
}
