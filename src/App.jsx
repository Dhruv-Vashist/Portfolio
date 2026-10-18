import { useCallback, useEffect, useState } from 'react';
import { LetterIcon, FolderIcon } from './components/Icons.jsx';
import Window from './components/Window.jsx';
import Taskbar from './components/Taskbar.jsx';
import Home from './sections/Home.jsx';
import Experience from './sections/Experience.jsx';
import Skills from './sections/Skills.jsx';
import Projects from './sections/Projects.jsx';
import Achievements from './sections/Achievements.jsx';
import Blog from './sections/Blog.jsx';
import Connect from './sections/Connect.jsx';
import { profile } from './data/content.js';

const SECTIONS = {
  home: { label: 'profile', full: 'Home', path: 'portfolio', Comp: Home, side: 'left' },
  experience: { label: 'experience', full: 'Work Experience', path: 'experience', Comp: Experience, side: 'left' },
  skills: { label: 'skills', full: 'Technical Skills', path: 'skills', Comp: Skills, side: 'left' },
  projects: { label: 'works', full: 'Projects', path: 'works', Comp: Projects, side: 'left' },
  achievements: { label: 'achievement', full: 'Achievement', path: 'achievement', Comp: Achievements, side: 'right' },
  blog: { label: 'blog', full: 'Blog', path: 'blog', Comp: Blog, side: 'right', wide: true },
  connect: { label: 'contact', full: 'Connect', path: 'contact', Comp: Connect, side: 'right' },
};

const fromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '');
  return SECTIONS[id] ? id : 'home';
};

export default function App() {
  const [active, setActive] = useState(fromHash);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onHash = () => {
      setActive(fromHash());
      setClosed(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((id) => {
    if (id === fromHash() && window.location.hash) setClosed(false);
    window.location.hash = `#/${id}`;
  }, []);

  const section = SECTIONS[active];
  const { Comp } = section;

  const renderNav = (side) => (
    <nav className={`icons icons--${side}`} aria-label={`${side} navigation`}>
      {Object.entries(SECTIONS)
        .filter(([, s]) => s.side === side)
        .map(([id, s]) => (
          <button
            key={id}
            className={`desk-icon${active === id && !closed ? ' is-active' : ''}`}
            onClick={() => go(id)}
            aria-label={s.full}
            aria-current={active === id ? 'page' : undefined}
          >
            {id === 'home' ? <LetterIcon letter={profile.iconLetter} /> : <FolderIcon />}
            <span>{s.label}</span>
          </button>
        ))}
    </nav>
  );

  return (
    <div className="desktop">
      <div className="desktop__main">
        {renderNav('left')}
        {renderNav('right')}

        <main className="stage" id="main">
          {(active === 'home' || closed) && (
            <p className="stage__title" aria-hidden="true">
              PORTFOLIO
            </p>
          )}
          {!closed && (
            <Window
              key={active}
              title={`C:\\DHRUV\\${section.path}`}
              wide={section.wide}
              onClose={() => setClosed(true)}
            >
              {active === 'home' ? <Home go={go} /> : <Comp go={go} />}
            </Window>
          )}
        </main>
      </div>
      <Taskbar />
    </div>
  );
}
