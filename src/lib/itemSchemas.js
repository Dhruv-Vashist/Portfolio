/*
  Describes the "Add / Edit" forms for the three owner-editable lists.
  To add a field later: add it to `fields` here and show it in the matching section.
*/

export const KINDS = {
  project: {
    noun: 'project',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Vulkan Deferred Renderer' },
      { key: 'category', label: 'Category', type: 'text', placeholder: 'Rendering, Engine, Tools…', help: 'Used for the filter buttons above the projects.' },
      { key: 'summary', label: 'Short summary', type: 'textarea', rows: 2, required: true },
      { key: 'details', label: 'More details (optional)', type: 'textarea', rows: 4, help: 'Shown when a visitor clicks “More +”.' },
      { key: 'stack', label: 'Tech stack', type: 'tags', placeholder: 'C++, Vulkan, GLSL', help: 'Separate with commas.' },
      { key: 'links', label: 'Links', type: 'links', help: 'One per line:  Label | https://link  (e.g. GitHub | https://github.com/you/repo)' },
      { key: 'image', label: 'Screenshot / cover image (optional)', type: 'image' },
    ],
  },
  experience: {
    noun: 'experience',
    fields: [
      { key: 'role', label: 'Role', type: 'text', required: true, placeholder: 'Graphics Programming Intern' },
      { key: 'company', label: 'Company / organisation', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Remote' },
      { key: 'period', label: 'Period', type: 'text', required: true, placeholder: 'Jun 2026 — Present' },
      { key: 'points', label: 'What you did', type: 'list', rows: 5, help: 'One bullet point per line.' },
    ],
  },
  skill: {
    noun: 'skill group',
    fields: [
      { key: 'group', label: 'Group name', type: 'text', required: true, placeholder: 'Graphics APIs' },
      { key: 'items', label: 'Skills', type: 'tags', required: true, placeholder: 'Vulkan, Direct3D 12 (DX12), OpenGL', help: 'Separate with commas. Add or delete skills by editing this list.' },
    ],
  },
  achievement: {
    noun: 'achievement',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Top 10% — Codeforces Round' },
      { key: 'year', label: 'Year', type: 'text', required: true, placeholder: '2026' },
      { key: 'kind', label: 'Type', type: 'select', options: ['Award', 'Certification', 'Milestone'], default: 'Award' },
      { key: 'text', label: 'Description', type: 'textarea', rows: 3 },
    ],
  },
};

/** Only http(s) links are ever rendered (blocks javascript: and similar). */
export const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? u : '');
export const safeImage = (u) => (/^(https?:\/\/|data:image\/)/i.test(String(u || '')) ? u : '');

const addScheme = (u) => (/^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`);

function parseLinks(text) {
  const links = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i += 1) {
    const parts = lines[i].split('|').map((p) => p.trim());
    const label = parts.length > 1 ? parts[0] : '';
    const raw = parts.length > 1 ? parts.slice(1).join('|') : parts[0];
    let url;
    try {
      const parsed = new URL(addScheme(raw));
      if (!/^https?:$/.test(parsed.protocol)) throw new Error('bad');
      url = parsed.href;
    } catch {
      return { error: `Line ${i + 1} is not a valid web address.` };
    }
    links.push({ label: label || new URL(url).hostname.replace(/^www\./, ''), url });
  }
  return { links };
}

const encode = (f, v) => {
  if (f.type === 'list') return (v || []).join('\n');
  if (f.type === 'tags') return (v || []).join(', ');
  if (f.type === 'links') return (v || []).map((l) => `${l.label} | ${l.url}`).join('\n');
  return v ?? f.default ?? '';
};

/** Saved data → form field strings */
export const toForm = (kind, data = {}) =>
  Object.fromEntries(KINDS[kind].fields.map((f) => [f.key, encode(f, data[f.key])]));

/** Form strings → { data } or { errors } */
export function fromForm(kind, values) {
  const errors = {};
  const data = {};
  KINDS[kind].fields.forEach((f) => {
    const v = values[f.key] ?? '';
    if (f.type === 'list') data[f.key] = v.split('\n').map((x) => x.trim()).filter(Boolean);
    else if (f.type === 'tags') data[f.key] = v.split(',').map((x) => x.trim()).filter(Boolean);
    else if (f.type === 'links') {
      const r = parseLinks(v);
      if (r.error) errors[f.key] = r.error;
      else data[f.key] = r.links;
    } else data[f.key] = typeof v === 'string' ? v.trim() : v;

    if (f.required && !String(v).trim()) errors[f.key] = `${f.label} is required.`;
  });
  return Object.keys(errors).length ? { errors } : { data };
}
