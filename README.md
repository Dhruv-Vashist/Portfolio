# Elaine Paula Hernandez — Portfolio

A retro-desktop portfolio (React + Vite) with a built-in blog. Visitors search public posts; the owner logs in to write rich-text posts with images, charts and links, and to swap the resume PDF. Posts, images and the resume are stored in **Supabase** (free tier), so everyone sees them.

```bash
npm install
cp .env.example .env     # fill in your Supabase keys (see below)
npm run dev              # http://localhost:5173
npm run build            # production build → dist/
```
Requires Node 18+. On Windows, run `npm run dev` in PowerShell or Command Prompt.

Without Supabase keys the site still works in **local-only mode** (posts live in your browser, owner passcode from `.env`).

---

## 1. Make it yours (no coding needed)

| What | Where |
| --- | --- |
| Name, tagline, about text, email, jobs, projects, tools, achievements | `src/data/content.js` |
| **Colour scheme + background** | `src/data/theme.js` |
| **Profile photo** | replace `public/profile.jpg` (square, ≥ 400 px) — same filename, or change `photo:` in `content.js` |
| **Social icons / links** | `socials` list in `src/data/content.js` |
| Tab title / description | `index.html` |

### Colours and background — `src/data/theme.js`
```js
export const theme = {
  preset: 'olive',          // 'olive' | 'ocean' | 'rose' | 'lavender' | 'night'
  custom: { orange: '#ff3366' },   // override any single colour
  background: { style: 'grid', image: '/background.jpg' },  // 'grid' | 'dots' | 'plain' | 'image'
};
```
For a photo background, put the file in `public/` (e.g. `public/background.jpg`) and set `style: 'image'`. The comment block in the file explains what every colour name controls.

### Social icons — `socials` in `src/data/content.js`
Built-in icon ids: `linkedin github youtube reddit discord twitter` (alias `x`) `codeforces instagram behance dribbble website email`.
```js
{ id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@you' },
{ id: 'leetcode', label: 'LeetCode', url: 'https://leetcode.com/u/you', color: '#f89f1b', letter: 'L' }, // any other site
```
Delete a line to remove an icon, add a line to add one. They appear in the taskbar and the Connect page, in list order. (Discord has no public profile page — use your user link `https://discord.com/users/<your numeric id>` or a server invite.)

### Resume
- **Easiest, any time:** log in as owner → open **Connect** → *Owner: replace resume* → pick a PDF (max 10 MB). Visitors get the new file immediately, no redeploy.
- **Without Supabase:** replace `public/resume.pdf` and redeploy.

---

## 2. Supabase setup (one time, ~10 minutes)

1. Go to <https://supabase.com> → sign up → **New project** (any name; choose a region near you; save the database password).
2. **SQL Editor → New query**: open `supabase/schema.sql`, change `YOUR_EMAIL@example.com` to **your** email, paste the whole file, **Run**. This creates the tables, file buckets and security rules (visitors can read only *public* posts; only you can write).
3. **Authentication → Users → Add user → Create new user**: use that same email + a strong password; tick **Auto Confirm User**.
4. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up” (so nobody else can create accounts).
5. **Project Settings → API**: copy the **Project URL** and the **anon public** key (never the `service_role` key).
6. Put them in `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_OWNER_EMAIL=you@example.com
   ```
7. Restart `npm run dev`. Blog → **🔒 Owner login** → your email + password.

**Security model:** the anon key is meant to be public. What protects your data is row-level security in `schema.sql` — private/draft posts are never sent to visitors, and writes need your login.

## 3. Publish on Netlify

**A. Drag-and-drop (fastest)**
1. `npm run build` (the build reads your `.env`, so the Supabase keys are included).
2. Open <https://app.netlify.com/drop> and drag the **`dist`** folder in. You get a `*.netlify.app` link.
3. To update later: rebuild and drag `dist` onto *Deploys* in your site.

**B. From GitHub (auto-redeploys on every push — recommended)**
1. Create an empty repo on GitHub, then in the project folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
   git push -u origin main
   ```
   (`.env` is git-ignored, so your keys are not uploaded.)
2. Netlify → **Add new site → Import an existing project → GitHub** → pick the repo. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
3. **Site configuration → Environment variables**: add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_OWNER_EMAIL` (and optionally `VITE_FORMSPREE_ENDPOINT`), then **Deploys → Trigger deploy**.
4. Optional: *Domain management* to rename the site or add your own domain.
5. In Supabase → **Authentication → URL Configuration**, set **Site URL** to your Netlify address.

---

## Folder structure
```
├─ index.html  netlify.toml  package.json  .env.example
├─ supabase/schema.sql          database + storage + security rules
├─ public/                      profile.jpg, resume.pdf (fallback), background.jpg (optional)
└─ src/
   ├─ App.jsx  main.jsx  styles.css
   ├─ data/    content.js (your info) · theme.js (colours/background) · seedPosts.js
   ├─ lib/     supabase.js · admin.jsx (login) · blogStore.js (posts) · storage.js (images, resume)
   │           useResume.js · applyTheme.js · chart.js · sanitize.js
   ├─ components/  Icons.jsx · Window.jsx · Taskbar.jsx · Editor.jsx
   └─ sections/    Home · Experience · Projects · Achievements · Blog · Connect
```

## Notes
- Blog search runs in the browser over the posts it receives (fine for a personal blog).
- Rich text is sanitised with DOMPurify on save and on display.
- Images you insert in posts are resized to ≤ 1400 px and uploaded to Supabase Storage.
