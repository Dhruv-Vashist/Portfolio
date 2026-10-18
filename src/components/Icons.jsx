const INK = '#2f3322';

export function LetterIcon({ letter = 'h' }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="13" style={{ fill: "var(--olive)" }} stroke={INK} strokeWidth="3" />
      <rect x="9" y="9" width="46" height="46" rx="9" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" />
      <text x="32" y="46" textAnchor="middle" fontFamily="Rubik, Arial, sans-serif" fontWeight="700" fontSize="40" style={{ fill: "var(--on-bar)" }}>
        {letter}
      </text>
    </svg>
  );
}

export function FolderIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M5 14h19l6 6h29v34H5z" fill="#f6e47a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M5 54l5-26h52l-5 26z" fill="#fbf0a4" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="20" y="35" width="20" height="6" rx="1.5" fill="#6f8fd4" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}

const SOCIAL = {
  linkedin: { bg: '#3a8fc4', node: <text x="32" y="44" textAnchor="middle" fontFamily="Rubik, Arial" fontWeight="700" fontSize="34" fill="#fff">in</text> },
  github: {
    bg: '#363b45',
    node: (
      <path
        fill="#f5eedd"
        d="M32 12c-11 0-20 9-20 20 0 8.8 5.7 16.300 13.600 19 1 .2 1.400-.4 1.400-1v-3.500c-5.500 1.200-6.700-2.700-6.700-2.700-.9-2.300-2.200-2.900-2.200-2.900-1.800-1.200.1-1.200.1-1.200 2 .1 3 2 3 2 1.800 3 4.700 2.200 5.800 1.700.2-1.300.7-2.200 1.300-2.700-4.400-.5-9-2.200-9-9.900 0-2.200.8-4 2-5.400-.2-.5-.9-2.600.2-5.300 0 0 1.700-.5 5.500 2a19 19 0 0110 0c3.800-2.500 5.500-2 5.500-2 1.100 2.700.4 4.800.2 5.300 1.300 1.400 2 3.200 2 5.400 0 7.700-4.700 9.400-9.100 9.900.7.600 1.400 1.800 1.400 3.700V50c0 .6.400 1.200 1.400 1C46.300 48.300 52 40.800 52 32c0-11-9-20-20-20z"
      />
    ),
  },
  behance: { bg: '#0b5ec4', node: <text x="32" y="43" textAnchor="middle" fontFamily="Rubik, Arial" fontWeight="700" fontSize="30" fill="#fff">Bē</text> },
  dribbble: {
    bg: '#ef8fbd',
    node: (
      <g fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round">
        <circle cx="32" cy="32" r="15" />
        <path d="M20 22c10 2 20 10 24 22M17 33c10 0 21-3 29-8M26 17c5 8 7 18 5 30" />
      </g>
    ),
  },
  youtube: {
    bg: '#e53935',
    node: (
      <g>
        <rect x="13" y="20" width="38" height="25" rx="8" fill="#fff" />
        <path d="M28 26.500l10.500 6-10.500 6z" fill="#e53935" />
      </g>
    ),
  },
  reddit: {
    bg: '#ff5a1f',
    node: (
      <g>
        <ellipse cx="32" cy="38" rx="17" ry="11.500" fill="#fff" />
        <circle cx="18.500" cy="29.500" r="4.200" fill="#fff" />
        <circle cx="45.500" cy="29.500" r="4.200" fill="#fff" />
        <circle cx="26" cy="37" r="3" fill="#ff5a1f" />
        <circle cx="38" cy="37" r="3" fill="#ff5a1f" />
        <path d="M26 43c3.500 2.600 8.500 2.600 12 0" stroke="#ff5a1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M32 27l2.200-10 9 2.200" stroke="#fff" strokeWidth="2.400" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="45.500" cy="19.500" r="3.200" fill="#fff" />
      </g>
    ),
  },
  discord: {
    bg: '#5865f2',
    node: (
      <g>
        <path d="M19 23l-2-6 9 2.500zM45 23l2-6-9 2.500z" fill="#fff" />
        <rect x="13" y="20" width="38" height="27" rx="13" fill="#fff" />
        <ellipse cx="24.500" cy="33.500" rx="4" ry="4.800" fill="#5865f2" />
        <ellipse cx="39.500" cy="33.500" rx="4" ry="4.800" fill="#5865f2" />
      </g>
    ),
  },
  twitter: {
    bg: '#14171a',
    node: <path d="M19 18l26 28M45 18L19 46" stroke="#fff" strokeWidth="5.500" strokeLinecap="round" />,
  },
  codeforces: {
    bg: '#f4f1e6',
    node: (
      <g>
        <rect x="13" y="31" width="11" height="20" rx="2.500" fill="#f5b93a" />
        <rect x="26.500" y="14" width="11" height="37" rx="2.500" fill="#2b86c9" />
        <rect x="40" y="25" width="11" height="26" rx="2.500" fill="#d8403c" />
      </g>
    ),
  },
  instagram: {
    bg: '#d6479a',
    node: (
      <g fill="none" stroke="#fff" strokeWidth="4">
        <rect x="14" y="14" width="36" height="36" rx="11" />
        <circle cx="32" cy="32" r="8.500" />
        <circle cx="43" cy="21" r="1.500" fill="#fff" />
      </g>
    ),
  },
  website: {
    bg: '#2f8f83',
    node: (
      <g fill="none" stroke="#fff" strokeWidth="3.200" strokeLinecap="round">
        <circle cx="32" cy="32" r="17" />
        <path d="M15 32h34M32 15c-9 9-9 25 0 34M32 15c9 9 9 25 0 34" />
      </g>
    ),
  },
  email: {
    bg: '#c9a227',
    node: (
      <g fill="none" stroke="#fff" strokeWidth="3.400" strokeLinejoin="round" strokeLinecap="round">
        <rect x="13" y="19" width="38" height="27" rx="5" />
        <path d="M15 23l17 13 17-13" />
      </g>
    ),
  },
};

const ALIAS = { x: 'twitter', yt: 'youtube', cf: 'codeforces', mail: 'email', web: 'website', ig: 'instagram' };

/**
 * <SocialIcon name="youtube" />
 * Unknown names get a coloured badge with a letter, so ANY site works:
 *   { id: 'leetcode', label: 'LeetCode', url: '...', color: '#f89f1b', letter: 'L' }
 */
export function SocialIcon({ name, color, letter, label }) {
  const key = ALIAS[name] || name;
  const s = SOCIAL[key];
  if (!s) {
    const l = (letter || label || name || '?').toString().trim().charAt(0).toUpperCase();
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="14" fill={color || '#6b7280'} stroke={INK} strokeWidth="3" />
        <text x="32" y="44" textAnchor="middle" fontFamily="Rubik, Arial" fontWeight="700" fontSize="32" fill="#fff">
          {l}
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="14" fill={s.bg} stroke={INK} strokeWidth="3" />
      <rect x="4" y="4" width="56" height="56" rx="14" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" transform="translate(0 0) scale(.94) translate(2 2)" />
      {s.node}
    </svg>
  );
}
