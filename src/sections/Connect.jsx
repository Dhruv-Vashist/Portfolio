import { useState } from 'react';
import { profile, socials } from '../data/content.js';
import { SocialIcon } from '../components/Icons.jsx';
import { useAdmin } from '../lib/admin.jsx';
import { hasSupabase } from '../lib/supabase.js';
import { uploadResume } from '../lib/storage.js';
import { useResume } from '../lib/useResume.js';

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Connect() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const { isAdmin } = useAdmin();
  const [resumeUrl, setResumeUrl] = useResume();
  const [resumeMsg, setResumeMsg] = useState('');

  const onResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeMsg('Uploading…');
    try {
      setResumeUrl(await uploadResume(file));
      setResumeMsg('Resume updated — visitors now get the new file.');
    } catch (ex) {
      setResumeMsg(`Upload failed: ${ex.message}`);
    }
    e.target.value = '';
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please tell me your name.';
    if (!EMAIL_RE.test(form.email)) er.email = 'Please enter a valid email.';
    if (form.message.trim().length < 10) er.message = 'A few more words please (10+ characters).';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!ENDPOINT) {
      // No backend configured → hand off to the visitor's email app.
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setState('sent');
      return;
    }

    setState('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setState('error');
    }
  };

  return (
    <div>
      <h2 className="section-title">Connect</h2>
      <div className="connect">
        <div>
          <p className="card__text">
            Have a project, a question or just want to say hi? Send a note — I usually reply within two days.
          </p>
          <p className="connect__line">
            <strong>Email</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p className="connect__line">
            <strong>Based in</strong> {profile.location}
          </p>
          <ul className="connect__socials">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                  <SocialIcon name={s.id} color={s.color} letter={s.letter} label={s.label} />
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--ghost" href={resumeUrl} target="_blank" rel="noopener noreferrer">
            Download resume ↗
          </a>
          {isAdmin && (
            <div className="owner-box">
              {hasSupabase ? (
                <>
                  <label>
                    Owner: replace resume (PDF, max 10 MB)
                    <input type="file" accept="application/pdf" onChange={onResume} />
                  </label>
                  {resumeMsg && <p className="form__status" role="status">{resumeMsg}</p>}
                </>
              ) : (
                <p className="muted">Owner tip: replace <code>public/resume.pdf</code> to change your resume (or set up Supabase to upload from here).</p>
              )}
            </div>
          )}
        </div>

        <form className="form" onSubmit={submit} noValidate>
          <label>
            Name
            <input value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
            {errors.name && <span className="form__err">{errors.name}</span>}
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <span className="form__err">{errors.email}</span>}
          </label>
          <label>
            Message
            <textarea rows="5" value={form.message} onChange={set('message')} aria-invalid={!!errors.message} />
            {errors.message && <span className="form__err">{errors.message}</span>}
          </label>
          <button className="btn btn--primary" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className="form__status" role="status" aria-live="polite">
            {state === 'sent' && (ENDPOINT ? 'Thanks! Your message has been sent.' : 'Opening your email app…')}
            {state === 'error' && 'Something went wrong. Please try again or email me directly.'}
          </p>
        </form>
      </div>
    </div>
  );
}
