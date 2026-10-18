import { profile } from '../data/content.js';
import { useResume } from '../lib/useResume.js';

export default function Home({ go }) {
  const [resumeUrl] = useResume();
  return (
    <div className="home">
      <img className="home__photo" src={profile.photo} alt={profile.name} width="200" height="200" />
      <div className="home__text">
        <p className="home__hi">{profile.greeting}</p>
        <h1 className="home__name">{profile.name}</h1>
        <p className="home__role">{profile.role}</p>
        <p className="home__quote">{profile.quote}</p>
        <p className="home__about">{profile.about}</p>
        <div className="btn-row">
          <button className="btn btn--primary" onClick={() => go('projects')}>
            View my work
          </button>
          <button className="btn" onClick={() => go('connect')}>
            Get in touch
          </button>
          <a className="btn btn--ghost" href={resumeUrl} target="_blank" rel="noopener noreferrer">
            Resume ↗
          </a>
        </div>
      </div>
    </div>
  );
}
