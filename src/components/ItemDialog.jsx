import { useState } from 'react';
import { KINDS, fromForm, toForm, safeImage } from '../lib/itemSchemas.js';
import { prepareImage } from '../lib/imageUpload.js';

/** Add / edit form for a project, experience or achievement. Fields come from itemSchemas.js */
export default function ItemDialog({ kind, item, col, onClose }) {
  const schema = KINDS[kind];
  const [values, setValues] = useState(() => toForm(kind, item?.data));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);

  const set = (key, v) => {
    setValues((cur) => ({ ...cur, [key]: v }));
    setErrors((cur) => ({ ...cur, [key]: undefined }));
  };

  const pickImage = async (key, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImgBusy(true);
    setFormError('');
    try {
      set(key, await prepareImage(file));
    } catch (ex) {
      setFormError(`Image failed: ${ex.message || 'try a JPG or PNG'}`);
    }
    setImgBusy(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const r = fromForm(kind, values);
    if (r.errors) {
      setErrors(r.errors);
      return;
    }
    setBusy(true);
    setFormError('');
    const res = item ? await col.update(item.id, r.data) : await col.create(r.data);
    setBusy(false);
    if (res.ok) onClose();
    else setFormError(res.error || 'Could not save.');
  };

  const title = `${item ? 'Edit' : 'Add'} ${schema.noun}`;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <form className="modal__card modal__card--wide" onSubmit={submit} noValidate>
        <div className="modal__head">
          <strong>{title}</strong>
          <button type="button" className="window__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        {schema.fields.map((f, idx) => (
          <label key={f.key}>
            {f.label}
            {f.type === 'text' && (
              <input
                autoFocus={idx === 0}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
                aria-invalid={!!errors[f.key]}
              />
            )}
            {f.type === 'tags' && (
              <input value={values[f.key]} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
            )}
            {(f.type === 'textarea' || f.type === 'list' || f.type === 'links') && (
              <textarea
                rows={f.rows || 3}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
                aria-invalid={!!errors[f.key]}
              />
            )}
            {f.type === 'select' && (
              <select value={values[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            )}
            {f.type === 'image' && (
              <>
                <input type="file" accept="image/*" onChange={(e) => pickImage(f.key, e)} />
                {imgBusy && <small>Processing image…</small>}
                {safeImage(values[f.key]) && (
                  <span className="img-preview">
                    <img src={values[f.key]} alt="Preview" />
                    <button type="button" className="link-btn link-btn--danger" onClick={() => set(f.key, '')}>
                      Remove image
                    </button>
                  </span>
                )}
              </>
            )}
            {f.help && <small>{f.help}</small>}
            {errors[f.key] && <span className="form__err">{errors[f.key]}</span>}
          </label>
        ))}

        {formError && (
          <p className="form__err" role="alert">
            {formError}
          </p>
        )}
        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn--primary" disabled={busy || imgBusy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
