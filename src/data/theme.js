// ─────────────────────────────────────────────────────────────
//  THEME — change the look of the whole site from this file.
//  Save the file and the browser updates instantly.
// ─────────────────────────────────────────────────────────────

export const theme = {
  // Pick a ready-made colour scheme:
  //   'olive' (default) | 'ocean' | 'rose' | 'lavender' | 'night'
  preset: 'olive',

  // Override any single colour on top of the preset. Example:
  //   custom: { orange: '#ff3366', taskbar: '#334455' }
  // Colour names you can use are listed in the presets below.
  custom: {},

  background: {
    // 'grid' (graph paper) | 'dots' | 'plain' | 'image'
    style: 'image',
    // Used only when style is 'image'. Put the picture in the /public folder,
    // for example public/background.jpg  →  '/background.jpg'
    image: '/background.jpg',
  },
};

// What each colour name controls:
//   cream      page background                 surface   window + dialog background
//   cream-2    cards and chips
//   field      form inputs                     olive     title bars, timeline, chips
//   olive-dark links, button text              taskbar   bottom bar
//   sage       big PORTFOLIO title             orange    accent (your name, primary buttons)
//   orange-dark button borders                 ink       main text
//   muted      secondary text                  line      card borders
//   frame      window borders                  grid      background grid lines
//   peach      highlights                      on-bar    text on title bars
//   on-accent  text on accent buttons          shadow    window shadow
export const presets = {
  olive: {
    cream: '#f5eedd', surface: '#f5eedd', 'cream-2': '#fbf7ec', field: '#ffffff',
    olive: '#636b3f', 'olive-dark': '#4a5230', taskbar: '#7f855f', sage: '#7d8c5a',
    orange: '#e8731a', 'orange-dark': '#9c4a0a',
    ink: '#2c2c24', muted: '#6f6c5c', line: '#3d3f31', frame: '#55564a',
    grid: 'rgba(112, 112, 88, 0.22)', peach: '#f3b27a',
    'on-bar': '#f5eedd', 'on-accent': '#ffffff', shadow: 'rgba(60, 64, 40, 0.22)',
  },
  ocean: {
    cream: '#eaf3f7', surface: '#eaf3f7', 'cream-2': '#f6fbfd', field: '#ffffff',
    olive: '#2f5d7c', 'olive-dark': '#1f4560', taskbar: '#4f86a8', sage: '#5b8fae',
    orange: '#ef7b45', 'orange-dark': '#a24a1c',
    ink: '#17262f', muted: '#5a6b75', line: '#26414f', frame: '#35566a',
    grid: 'rgba(60, 110, 140, 0.18)', peach: '#f7c59f',
    'on-bar': '#eaf3f7', 'on-accent': '#ffffff', shadow: 'rgba(30, 70, 96, 0.22)',
  },
  rose: {
    cream: '#fbeeee', surface: '#fbeeee', 'cream-2': '#fff8f7', field: '#ffffff',
    olive: '#8a4a5a', 'olive-dark': '#6a3243', taskbar: '#b97a89', sage: '#c08a97',
    orange: '#d9467a', 'orange-dark': '#8f2450',
    ink: '#2e1f24', muted: '#7a6168', line: '#4a2e37', frame: '#6a4450',
    grid: 'rgba(150, 90, 105, 0.18)', peach: '#f6c1b2',
    'on-bar': '#fbeeee', 'on-accent': '#ffffff', shadow: 'rgba(106, 50, 67, 0.22)',
  },
  lavender: {
    cream: '#f2eefb', surface: '#f2eefb', 'cream-2': '#faf8ff', field: '#ffffff',
    olive: '#5b4b8a', 'olive-dark': '#43366b', taskbar: '#8576b5', sage: '#8f82bd',
    orange: '#f08a3c', 'orange-dark': '#a2531a',
    ink: '#241f33', muted: '#6a6580', line: '#3a3355', frame: '#4f4672',
    grid: 'rgba(100, 85, 150, 0.16)', peach: '#f6c79a',
    'on-bar': '#f2eefb', 'on-accent': '#ffffff', shadow: 'rgba(67, 54, 107, 0.22)',
  },
  night: {
    cream: '#1a1d1b', surface: '#252926', 'cream-2': '#2a2e2b', field: '#161917',
    olive: '#3f4a2c', 'olive-dark': '#b4cf84', taskbar: '#2f3a24', sage: '#8fa66a',
    orange: '#f08a3c', 'orange-dark': '#b25a14',
    ink: '#ece6d4', muted: '#a8a591', line: '#5d6454', frame: '#6b7360',
    grid: 'rgba(200, 210, 170, 0.07)', peach: '#c98a52',
    'on-bar': '#ece6d4', 'on-accent': '#ffffff', shadow: 'rgba(0, 0, 0, 0.45)',
  },
};
