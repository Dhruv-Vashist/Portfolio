// ─────────────────────────────────────────────────────────────
//  Your personal details live here. Replace the sample text
//  (name, tagline, about, email, links) with your own.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'DHRUV VASHIST',
  greeting: 'Hello! i’m',
  role: 'I’M A GRAPHICS ENGINEER',
  quote: '“Turning code into visuals.”',
  iconLetter: 'h',
  photo: '/profile.jpeg',
  email: 'dhruv15.vas@gmail.com',
  location: 'DELHI, INDIA',
  resume: '/resume.pdf', // drop your PDF into /public/resume.pdf
  about:
    'I am a passionate graphics engineer with a strong background in computer graphics, shader programming, and real-time rendering. With expertise in Vulkan, Direct3D 12, and OpenGL, I specialize in developing high-performance rendering pipelines and optimizing graphics applications. ',
};

/*
  Social links shown in the taskbar and on the Connect page — in this order.
  `id` picks the icon. Available: linkedin, github, behance, dribbble, youtube, reddit,
  discord, twitter, codeforces, leetcode, instagram.  Any other id shows a generic link icon.
  Add, remove or reorder lines freely (the taskbar fits about 6 icons on a phone).
*/
// Your links. The taskbar and Connect page show these in order.
//  • id picks the icon: linkedin, github, youtube, reddit, discord, twitter (or x),
//    codeforces, instagram, behance, dribbble, website, email.
//  • Any other id works too — add  color: '#hex'  and  letter: 'L'  for a custom badge.
//  • Delete a line to remove an icon; add a line to add one.
export const socials = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/dhruv-vashist-4190b9433' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/Dhruv-Vashist' },
  { id: 'youtube', label: 'YouTube', url: 'https://youtube.com/@dhruvv1506' },
  { id: 'reddit', label: 'Reddit', url: 'https://www.reddit.com/user/dhruvv1506' },
  { id: 'discord', label: 'Discord', url: 'https://discord.gg/DuFuyskrGM' },
  { id: 'twitter', label: 'X / Twitter', url: 'https://x.com/Dhruv03v' },
  { id: 'codeforces', label: 'Codeforces', url: 'https://codeforces.com/profile/przyjaciel' },
];

// ─────────────────────────────────────────────────────────────
//  TECHNICAL SKILLS — shown in the "skills" folder.
//  Edit the lines below; each group becomes one row.
// ─────────────────────────────────────────────────────────────
export const skills = [
  { group: 'Programming Languages', items: ['C++', 'C', 'Python'] },
  { group: 'Graphics APIs', items: ['Vulkan', 'Direct3D 12 (DX12)', 'OpenGL'] },
  {
    group: 'Shader Programming',
    items: ['HLSL', 'GLSL', 'Vertex and fragment shaders', 'Compute shaders'],
  },
  {
    group: 'Computer Graphics',
    items: [
      'Real-Time Rendering',
      'Rasterization',
      'Rendering Pipelines',
      'PBR',
      'Lighting and Shading',
      'Shadow Mapping',
      'Texture Mapping',
      'Post-Processing',
    ],
  },
  {
    group: 'Mathematics',
    items: [
      'Linear Algebra',
      '3D Transformations',
      'Coordinate Systems',
      'Projection Matrices',
      '3D Geometry',
      'Calculus',
    ],
  },
  {
    group: 'Systems Programming',
    items: ['Data Structures and Algorithms', 'Memory Management', 'Multithreading', 'CPU/GPU Architecture'],
  },
  {
    group: 'Tools and Build Systems',
    items: ['Visual Studio', 'CMake', 'Git', 'GitHub', 'RenderDoc', 'Vulkan SDK', 'GPU Profiling Tools'],
  },
  { group: 'Operating Systems', items: ['Windows', 'Linux'] },
];

// ─────────────────────────────────────────────────────────────
//  EXPERIENCE, PROJECTS, ACHIEVEMENTS
//  You do NOT need to edit code to add these. Log in as owner
//  (Blog page → "Owner login"), open the folder and click
//  "＋ Add …". They are saved online and appear for everyone.
//
//  The empty lists below are optional "built-in" entries that are
//  always shown (and can only be changed here in the code).
//  Format example for experience:
//   { role: 'Graphics Intern', company: 'Studio', location: 'Remote',
//     period: '2026 — Present', points: ['Did this', 'Did that'] }
// ─────────────────────────────────────────────────────────────
export const experience = [];
export const projects = [];
export const achievements = [];
