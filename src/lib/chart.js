// Tiny dependency-free chart generator that returns an inline SVG string.
// The SVG is inserted into blog posts and stays crisp at any size.

const PALETTE = ['#636b3f', '#e8731a', '#3a8fc4', '#c9a227', '#d46a9a', '#2f6f5e'];
const FONT = 'font-family="Rubik, Arial, sans-serif"';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const short = (s, n = 12) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

/** "Label, 12" per line  →  [{label, value}] */
export function parseData(text) {
  return text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(.*?)[,:\t]\s*(-?\d+(?:\.\d+)?)\s*$/);
      return m ? { label: m[1].trim(), value: parseFloat(m[2]) } : null;
    })
    .filter(Boolean);
}

function niceMax(v) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

const fmt = (n) => (Math.abs(n) >= 1000 ? `${+(n / 1000).toFixed(1)}k` : `${+n.toFixed(2)}`);

export function chartToSvg({ type = 'bar', title = '', data = [] }) {
  const W = 560;
  const H = 320;
  const top = title ? 46 : 20;
  let body = '';

  if (title) {
    body += `<text x="${W / 2}" y="28" text-anchor="middle" ${FONT} font-size="17" font-weight="600" fill="#2c2c24">${esc(title)}</text>`;
  }

  if (type === 'pie') {
    const pos = data.filter((d) => d.value > 0);
    const total = pos.reduce((a, d) => a + d.value, 0) || 1;
    const cx = 170;
    const cy = top + (H - top - 10) / 2;
    const r = Math.min(110, (H - top - 20) / 2);
    let a0 = -Math.PI / 2;
    pos.forEach((d, i) => {
      const frac = d.value / total;
      const a1 = a0 + frac * Math.PI * 2;
      const color = PALETTE[i % PALETTE.length];
      if (pos.length === 1) {
        body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
      } else {
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        body += `<path d="M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${color}" stroke="#f5eedd" stroke-width="2"/>`;
      }
      const ly = top + 14 + i * 24;
      body += `<rect x="330" y="${ly - 11}" width="14" height="14" rx="3" fill="${color}"/>`;
      body += `<text x="352" y="${ly}" ${FONT} font-size="13" fill="#2c2c24">${esc(short(d.label, 20))} — ${Math.round(frac * 100)}%</text>`;
      a0 = a1;
    });
  } else {
    const l = 48;
    const r = 16;
    const b = 56;
    const iw = W - l - r;
    const ih = H - top - b;
    const max = niceMax(Math.max(...data.map((d) => d.value), 0));
    for (let i = 0; i <= 4; i++) {
      const y = top + ih - (ih * i) / 4;
      body += `<line x1="${l}" y1="${y}" x2="${W - r}" y2="${y}" stroke="#cfc8b0" stroke-width="1"/>`;
      body += `<text x="${l - 8}" y="${y + 4}" text-anchor="end" ${FONT} font-size="11" fill="#6b6b5a">${fmt((max * i) / 4)}</text>`;
    }
    const step = iw / Math.max(data.length, 1);
    const pts = [];
    data.forEach((d, i) => {
      const h = (Math.max(d.value, 0) / max) * ih;
      const cx = l + step * (i + 0.5);
      const y = top + ih - h;
      if (type === 'line') {
        pts.push([cx, y]);
      } else {
        body += `<rect x="${(l + step * i + step * 0.18).toFixed(2)}" y="${y.toFixed(2)}" width="${(step * 0.64).toFixed(2)}" height="${h.toFixed(2)}" rx="4" fill="${PALETTE[i % PALETTE.length]}"/>`;
        body += `<text x="${cx.toFixed(2)}" y="${(y - 6).toFixed(2)}" text-anchor="middle" ${FONT} font-size="11" font-weight="600" fill="#2c2c24">${fmt(d.value)}</text>`;
      }
      body += `<text x="${cx.toFixed(2)}" y="${H - b + 20}" text-anchor="middle" ${FONT} font-size="12" fill="#2c2c24">${esc(short(d.label))}</text>`;
    });
    if (type === 'line' && pts.length) {
      body += `<polyline points="${pts.map((p) => p.map((n) => n.toFixed(2)).join(',')).join(' ')}" fill="none" stroke="#e8731a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
      pts.forEach(([x, y], i) => {
        body += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="5" fill="#f5eedd" stroke="#e8731a" stroke-width="3"/>`;
        body += `<text x="${x.toFixed(2)}" y="${(y - 11).toFixed(2)}" text-anchor="middle" ${FONT} font-size="11" font-weight="600" fill="#2c2c24">${fmt(data[i].value)}</text>`;
      });
    }
    body += `<line x1="${l}" y1="${top + ih}" x2="${W - r}" y2="${top + ih}" stroke="#2c2c24" stroke-width="1.5"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title || type + ' chart')}"><rect width="${W}" height="${H}" rx="12" fill="#fbf7ec"/>${body}</svg>`;
}
