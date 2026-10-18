import { useEffect, useRef, useState } from 'react';
import { chartToSvg, parseData } from '../lib/chart.js';
import { clean, toText } from '../lib/sanitize.js';
import { hasSupabase } from '../lib/supabase.js';
import { uploadBlogImage } from '../lib/storage.js';

const run = (cmd, val = null) => document.execCommand(cmd, false, val);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function normaliseUrl(u) {
  const v = u.trim();
  if (!v) return '';
  if (/^(https?:|mailto:)/i.test(v)) return v;
  return `https://${v}`;
}

/** Downscale an uploaded image to a JPEG blob (keeps posts and storage small). */
async function resizeToBlob(file, max = 1200) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / bmp.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/jpeg', 0.82),
  );
}

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/** Supabase on → upload and use the public URL. Supabase off → embed as a data URL. */
async function prepareImage(file) {
  const blob = await resizeToBlob(file);
  return hasSupabase ? uploadBlogImage(blob) : blobToDataUrl(blob);
}

function Dialog({ title, onClose, children }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__card">
        <div className="modal__head">
          <strong>{title}</strong>
          <button className="window__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const SAMPLE = 'Jan, 12\nFeb, 19\nMar, 8\nApr, 24';

export default function Editor({ post, onSave, onCancel, saving = false }) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [tags, setTags] = useState((post?.tags || []).join(', '));
  const [status, setStatus] = useState(post?.status || 'draft');
  const [dialog, setDialog] = useState(null); // 'link' | 'image' | 'chart'
  const [error, setError] = useState('');
  const [words, setWords] = useState(0);

  const ed = useRef(null);
  const saved = useRef(null);

  useEffect(() => {
    ed.current.innerHTML = clean(post?.html || '<p><br></p>');
    setWords(toText(ed.current.innerHTML).split(' ').filter(Boolean).length);
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      /* not supported everywhere */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSel = () => {
    const s = window.getSelection();
    if (s.rangeCount && ed.current.contains(s.anchorNode)) saved.current = s.getRangeAt(0).cloneRange();
  };
  const restoreSel = () => {
    ed.current.focus();
    const s = window.getSelection();
    if (saved.current) {
      s.removeAllRanges();
      s.addRange(saved.current);
    }
  };
  // `after: true` drops block content (images, charts) after the selection instead of replacing it.
  const insertHtml = (html, { after = false } = {}) => {
    if (after && saved.current) saved.current.collapse(false);
    restoreSel();
    run('insertHTML', html);
    setDialog(null);
    onInput();
  };
  const onInput = () => setWords(toText(ed.current.innerHTML).split(' ').filter(Boolean).length);

  const openDialog = (name) => {
    saveSel();
    setDialog(name);
  };

  const tb = (cmd, val) => () => {
    ed.current.focus();
    run(cmd, val);
    onInput();
  };

  const submit = () => {
    if (!title.trim()) {
      setError('Please add a title before saving.');
      return;
    }
    const html = clean(ed.current.innerHTML);
    const text = toText(html);
    onSave({
      title: title.trim(),
      excerpt: excerpt.trim() || text.slice(0, 160),
      tags: tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      status,
      html,
    });
  };

  return (
    <div className="editor">
      <div className="editor__meta">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
        </label>
        <label>
          Short excerpt <small>(optional — auto-generated if empty)</small>
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={200} />
        </label>
        <div className="editor__row">
          <label>
            Tags <small>(comma separated)</small>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="design, process" />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="public">🟢 Public</option>
              <option value="private">🔒 Private</option>
              <option value="draft">📝 Draft</option>
            </select>
          </label>
        </div>
      </div>

      <div className="toolbar" role="toolbar" aria-label="Formatting" onMouseDown={(e) => e.target.tagName !== 'SELECT' && e.preventDefault()}>
        <button title="Undo" onClick={tb('undo')}>↶</button>
        <button title="Redo" onClick={tb('redo')}>↷</button>
        <span className="toolbar__sep" />
        <select
          aria-label="Text style"
          defaultValue="p"
          onChange={(e) => {
            ed.current.focus();
            run('formatBlock', `<${e.target.value}>`);
            onInput();
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
        </select>
        <span className="toolbar__sep" />
        <button title="Bold" onClick={tb('bold')}><b>B</b></button>
        <button title="Italic" onClick={tb('italic')}><i>I</i></button>
        <button title="Underline" onClick={tb('underline')}><u>U</u></button>
        <button title="Strikethrough" onClick={tb('strikeThrough')}><s>S</s></button>
        <span className="toolbar__sep" />
        <button title="Bulleted list" onClick={tb('insertUnorderedList')}>• List</button>
        <button title="Numbered list" onClick={tb('insertOrderedList')}>1. List</button>
        <span className="toolbar__sep" />
        <button title="Align left" onClick={tb('justifyLeft')}>⇤</button>
        <button title="Align center" onClick={tb('justifyCenter')}>↔</button>
        <button title="Align right" onClick={tb('justifyRight')}>⇥</button>
        <button title="Justify" onClick={tb('justifyFull')}>☰</button>
        <span className="toolbar__sep" />
        <button title="Insert link" onClick={() => openDialog('link')}>🔗 Link</button>
        <button title="Insert image" onClick={() => openDialog('image')}>🖼 Image</button>
        <button title="Insert chart" onClick={() => openDialog('chart')}>📊 Chart</button>
        <button title="Clear formatting" onClick={tb('removeFormat')}>⌫</button>
      </div>

      <div className="paper-wrap">
        <div
          ref={ed}
          className="paper post-body"
          contentEditable
          suppressContentEditableWarning
          spellCheck
          role="textbox"
          aria-multiline="true"
          aria-label="Post content"
          onInput={onInput}
          onBlur={saveSel}
        />
      </div>

      {error && <p className="form__err" role="alert">{error}</p>}
      <div className="editor__actions">
        <span className="editor__count">{words} words</span>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn--primary" onClick={submit} disabled={saving}>
          {saving ? 'Saving…' : `Save ${status === 'public' ? '& publish' : status === 'private' ? 'as private' : 'draft'}`}
        </button>
      </div>

      {dialog === 'link' && <LinkDialog onClose={() => setDialog(null)} onInsert={(url, label) => {
        const href = normaliseUrl(url);
        if (!href) return;
        restoreSel();
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) {
          run('createLink', href);
          setDialog(null);
          onInput();
        } else {
          insertHtml(`<a href="${esc(href)}">${esc(label || href)}</a>&nbsp;`);
        }
      }} />}
      {dialog === 'image' && <ImageDialog onClose={() => setDialog(null)} onInsert={(src, alt, caption) =>
        insertHtml(`<figure><img src="${esc(src)}" alt="${esc(alt)}">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure><p><br></p>`, { after: true })
      } />}
      {dialog === 'chart' && <ChartDialog onClose={() => setDialog(null)} onInsert={(svg, caption) =>
        insertHtml(`<figure class="chart">${svg}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure><p><br></p>`, { after: true })
      } />}
    </div>
  );
}

function LinkDialog({ onClose, onInsert }) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  return (
    <Dialog title="Insert link" onClose={onClose}>
      <label>URL<input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" /></label>
      <label>Link text <small>(used if no text is selected)</small><input value={label} onChange={(e) => setLabel(e.target.value)} /></label>
      <div className="modal__actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" onClick={() => onInsert(url, label)} disabled={!url.trim()}>Insert</button>
      </div>
    </Dialog>
  );
}

function ImageDialog({ onClose, onInsert }) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      setSrc(await prepareImage(file));
    } catch (ex) {
      setErr(hasSupabase && ex?.message ? `Upload failed: ${ex.message}` : 'Could not read that image. Try a JPG or PNG.');
    }
    setBusy(false);
  };

  return (
    <Dialog title="Insert image" onClose={onClose}>
      <label>Upload from device<input type="file" accept="image/*" onChange={pick} /></label>
      <label>…or paste an image URL<input value={src.startsWith('data:') ? '' : src} onChange={(e) => setSrc(e.target.value.trim())} placeholder="https://…/photo.jpg" /></label>
      {src && <img className="modal__preview" src={src} alt="Preview" />}
      <label>Alt text <small>(describe the image)</small><input value={alt} onChange={(e) => setAlt(e.target.value)} /></label>
      <label>Caption <small>(optional)</small><input value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
      {err && <p className="form__err">{err}</p>}
      <div className="modal__actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" disabled={!src || busy} onClick={() => onInsert(src, alt, caption)}>
          {busy ? 'Processing…' : 'Insert'}
        </button>
      </div>
    </Dialog>
  );
}

function ChartDialog({ onClose, onInsert }) {
  const [type, setType] = useState('bar');
  const [title, setTitle] = useState('Monthly sign-ups');
  const [raw, setRaw] = useState(SAMPLE);
  const [caption, setCaption] = useState('');
  const data = parseData(raw);
  const svg = data.length ? chartToSvg({ type, title, data }) : '';

  return (
    <Dialog title="Insert chart" onClose={onClose}>
      <div className="editor__row">
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </label>
        <label>Chart title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      </div>
      <label>Data <small>(one “label, value” per line)</small>
        <textarea rows="5" value={raw} onChange={(e) => setRaw(e.target.value)} />
      </label>
      <div className="modal__preview chart-preview" dangerouslySetInnerHTML={{ __html: svg || '<p class="muted">Add at least one “label, number” line.</p>' }} />
      <label>Caption <small>(optional)</small><input value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
      <div className="modal__actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" disabled={!svg} onClick={() => onInsert(svg, caption)}>Insert chart</button>
      </div>
    </Dialog>
  );
}
