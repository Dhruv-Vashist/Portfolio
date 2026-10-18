import { SocialIcon } from './Icons.jsx';
import { socials } from '../data/content.js';

export default function Taskbar() {
  return (
    <footer className="taskbar">
      <ul className="taskbar__icons">
        {socials.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
              <SocialIcon name={s.id} color={s.color} letter={s.letter} label={s.label} />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
