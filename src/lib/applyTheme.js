import { presets } from '../data/theme.js';

/** Applies colours (as CSS variables) and the background style from src/data/theme.js */
export function applyTheme(theme) {
  const root = document.documentElement;
  const vars = { ...(presets[theme.preset] || presets.olive), ...(theme.custom || {}) };
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(`--${name}`, value);

  const s = document.body.style;
  const bg = theme.background || {};
  // reset to the stylesheet default (graph-paper grid)
  s.backgroundImage = '';
  s.backgroundSize = '';
  s.backgroundPosition = '';
  s.backgroundRepeat = '';
  s.backgroundAttachment = '';

  if (bg.style === 'plain') {
    s.backgroundImage = 'none';
  } else if (bg.style === 'dots') {
    s.backgroundImage = 'radial-gradient(var(--grid) 1.6px, transparent 1.9px)';
    s.backgroundSize = '18px 18px';
  } else if (bg.style === 'image' && bg.image) {
    s.backgroundImage = `url("${String(bg.image).replace(/"/g, '%22')}")`;
    s.backgroundSize = 'cover';
    s.backgroundPosition = 'center';
    s.backgroundRepeat = 'no-repeat';
    s.backgroundAttachment = 'fixed';
  }
}
