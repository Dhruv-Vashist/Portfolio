// Starter posts so the blog isn't empty on first load.
// After first load, posts are persisted in localStorage (see src/lib/blogStore.js).
const now = Date.now();
const day = 86400000;

export default [
  {
    id: 'seed-1',
    title: 'Designing with intention',
    excerpt: 'Why every spacing, colour and word on a screen should have a reason.',
    tags: ['design', 'process'],
    status: 'public',
    createdAt: now - 12 * day,
    updatedAt: now - 12 * day,
    html:
      '<h2>Start with the why</h2><p>Before I open Figma, I write one sentence: <em>what should the person feel or be able to do after this screen?</em> Everything that does not serve that sentence is a candidate for removal.</p><ul><li>Name the user and the moment</li><li>Pick one primary action</li><li>Remove, then add back only what is missing</li></ul><p>Small decisions compound — that is where intention shows.</p>',
  },
  {
    id: 'seed-2',
    title: 'A tiny colour system for retro interfaces',
    excerpt: 'Olive, cream and a single orange accent — how a restrained palette keeps things friendly.',
    tags: ['colour', 'ui'],
    status: 'public',
    createdAt: now - 5 * day,
    updatedAt: now - 5 * day,
    html:
      '<h2>Three colours, many moods</h2><p>A cream background, an olive structure colour and one loud accent is enough for most interfaces. Use the accent for exactly one thing per view.</p><p><strong>Tip:</strong> always check contrast for small text against the cream background.</p>',
  },
  {
    id: 'seed-3',
    title: 'Notes for a case study (private)',
    excerpt: 'Internal outline — only visible in owner mode.',
    tags: ['notes'],
    status: 'private',
    createdAt: now - 3 * day,
    updatedAt: now - 3 * day,
    html: '<p>Outline: problem → research → decisions → outcome. Add metrics before publishing.</p>',
  },
  {
    id: 'seed-4',
    title: 'Draft: lessons from my first year as a product designer',
    excerpt: 'Work in progress.',
    tags: ['career'],
    status: 'draft',
    createdAt: now - 1 * day,
    updatedAt: now - 1 * day,
    html: '<p>Ideas: feedback loops, working with engineers, saying no kindly…</p>',
  },
];
