import { useState } from 'react';
import { experience as builtIn } from '../data/content.js';
import { useItems } from '../lib/items.js';
import { useAdmin } from '../lib/admin.jsx';
import ItemDialog from '../components/ItemDialog.jsx';
import { AddButton, ItemActions, ListStatus } from '../components/ItemControls.jsx';

export default function Experience() {
  const { isAdmin } = useAdmin();
  const col = useItems('experience');
  const [dialog, setDialog] = useState(null);
  const all = [...col.items.map((i) => ({ ...i.data, _item: i, _key: i.id })), ...builtIn.map((j) => ({ ...j, _key: `b:${j.role}${j.company}` }))];

  return (
    <div>
      <div className="section-bar">
        <h2 className="section-title">Work Experience</h2>
        <AddButton label="Add experience" onClick={() => setDialog({})} />
      </div>
      <ListStatus col={col} count={all.length} noun="experience" isAdmin={isAdmin} />
      <ol className="timeline">
        {all.map((job) => (
          <li className="timeline__item" key={job._key}>
            <span className="timeline__dot" aria-hidden="true" />
            <article className="card">
              <div className="card__head">
                <div>
                  <h3 className="card__title">{job.role}</h3>
                  <p className="card__sub">{[job.company, job.location].filter(Boolean).join(' · ')}</p>
                </div>
                <span className="chip chip--solid">{job.period}</span>
              </div>
              {job.points?.length > 0 && (
                <ul className="bullets">
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
              <ItemActions item={job._item} col={col} noun="experience" onEdit={() => setDialog({ item: job._item })} />
            </article>
          </li>
        ))}
      </ol>
      {dialog && <ItemDialog kind="experience" item={dialog.item} col={col} onClose={() => setDialog(null)} />}
    </div>
  );
}
