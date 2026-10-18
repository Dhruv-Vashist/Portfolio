# Personal Portfolio Website

A retro-desktop-style personal portfolio built with **React and Vite**, featuring an interactive desktop-inspired interface, personal profile, projects, achievements, social links, and an integrated blog.

The website includes an owner-only dashboard for publishing blog posts with rich text, images, charts, and links, as well as updating a resume PDF. **Supabase** handles cloud storage, authentication, and database management, allowing published content to be accessed by visitors across devices.

## Features

- **Retro desktop UI** — A desktop-inspired interface with interactive sections.
- **Personal portfolio** — Showcase your profile, skills, projects, experience, and achievements.
- **Integrated blog** — Publish, browse, and search blog posts.
- **Rich-text editor** — Create posts with formatted text, images, charts, and links.
- **Owner authentication** — Secure owner login for managing portfolio content.
- **Cloud database** — Store and retrieve blog posts using Supabase.
- **Image storage** — Upload and store blog images using Supabase Storage.
- **Resume management** — Replace your resume PDF without rebuilding the website when using Supabase.
- **Customizable theme** — Change colours, backgrounds, and profile information.
- **Responsive design** — Designed to provide a consistent experience across screen sizes.
- **Local-only mode** — Run the portfolio without Supabase using browser-local storage and the configured owner passcode.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| CSS | Styling and layout |
| Supabase | Database, authentication, and cloud storage |
| DOMPurify | Sanitizing rich-text HTML |
| Git & GitHub | Version control and source code hosting |
| Netlify | Website deployment |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Git (optional, for version control)
- A Supabase account (optional)

### 1. Clone the repository

```bash
git clone https://github.com/Dhruv-Vashist/Portfolio.git
cd Portfolio
```


### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file from the example file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Add your Supabase project credentials to `.env`:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_OWNER_EMAIL=your-email@example.com
```

If Supabase is not configured, the application can run in local-only mode, subject to the project's local configuration.

**Important:** Never commit your `.env` file or expose your Supabase `service_role` key.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

The optimized production files will be generated in the `dist/` directory.

## Customization

Personalize the portfolio using the files below.

| File | Purpose |
|---|---|
| `src/data/content.js` | Profile information, introduction, skills, projects, achievements, and social links |
| `src/data/theme.js` | Colour presets and background settings |
| `src/data/seedPosts.js` | Initial or sample blog posts |
| `index.html` | Browser tab title and page metadata |
| `public/profile.jpg` | Profile photo |
| `public/resume.pdf` | Local resume fallback |
| `public/background.jpg` | Optional background image |

You can customize the website without changing its core application logic.

## Supabase Setup

Supabase provides cloud database functionality, authentication, and file storage.

1. Create a project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Run the SQL script in `supabase/schema.sql` using the Supabase SQL Editor. Replace any example owner email with your own.
3. Create your owner account in Supabase Authentication.
4. Disable public user registration if the application is intended for a single owner.
5. Copy your project URL and anon/public key into `.env`.
6. Configure the appropriate database and storage permissions.
7. Restart the development server.

The application uses Supabase Row Level Security (RLS) to control access to database records. Review the policies in `supabase/schema.sql` before deploying.

## Deployment

The portfolio can be deployed using Netlify.

### Option 1: Manual deployment

1. Run `npm run build`.
2. Open [Netlify Drop](https://app.netlify.com/drop).
3. Upload the generated `dist/` directory.

### Option 2: GitHub integration

1. Push the project to GitHub.
2. Import the repository into Netlify.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Add the required environment variables in Netlify's site configuration.
6. Deploy the website.

Connect the deployed website to the appropriate Supabase authentication URL configuration.

## Project Structure

```text
├── public/
│   ├── profile.jpg
│   ├── resume.pdf
│   └── background.jpg
├── supabase/
│   └── schema.sql
├── src/
│   ├── components/
│   │   ├── Icons.jsx
│   │   ├── Window.jsx
│   │   ├── Taskbar.jsx
│   │   └── Editor.jsx
│   ├── data/
│   │   ├── content.js
│   │   ├── theme.js
│   │   └── seedPosts.js
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── admin.jsx
│   │   ├── blogStore.js
│   │   ├── storage.js
│   │   ├── useResume.js
│   │   ├── applyTheme.js
│   │   ├── chart.js
│   │   └── sanitize.js
│   ├── sections/
│   │   ├── Home
│   │   ├── Experience
│   │   ├── Projects
│   │   ├── Achievements
│   │   ├── Blog
│   │   └── Connect
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
└── README.md
```

## Future Improvements

- Expand the project showcase with technical case studies.
- Add more graphics programming and software development projects.
- Document technical experiments, development progress, and learnings through the blog.
- Improve accessibility and responsive behaviour.
- Continue refining the interface and user experience.

## License

Choose and add a license file if you intend to allow others to reuse, modify, or distribute this project.

---

**Built with React, Vite, and Supabase.**
