import DOMPurify from 'dompurify';

// Open every link in a new tab, safely.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/** Sanitise rich-text HTML (allows HTML + inline SVG charts, images, links). */
export const clean = (html) =>
  DOMPurify.sanitize(html || '', {
    USE_PROFILES: { html: true, svg: true },
    ADD_ATTR: ['target'],
  });

/** Plain text of an HTML string — used for search and auto-excerpts. */
export function toText(html) {
  const doc = new DOMParser().parseFromString(clean(html), 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}
