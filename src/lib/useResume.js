import { useEffect, useState } from 'react';
import { profile } from '../data/content.js';
import { hasSupabase } from './supabase.js';
import { fetchResumeUrl } from './storage.js';

/** Current resume link: the owner-uploaded one from Supabase, else /resume.pdf from /public. */
export function useResume() {
  const [url, setUrl] = useState(profile.resume);

  useEffect(() => {
    if (!hasSupabase) return;
    fetchResumeUrl()
      .then((u) => u && setUrl(u))
      .catch(() => {
        /* keep the fallback */
      });
  }, []);

  return [url, setUrl];
}
