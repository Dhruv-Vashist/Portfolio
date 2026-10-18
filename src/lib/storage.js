import { supabase } from './supabase.js';

/* File storage + site settings (Supabase). All functions throw an Error with a readable message. */

const must = (client) => {
  if (!client) throw new Error('Supabase is not configured.');
  return client;
};

/** Blog picture (already downscaled JPEG blob) → public URL in the `blog-images` bucket. */
export async function uploadBlogImage(blob) {
  const sb = must(supabase);
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.jpg`;
  const { error } = await sb.storage.from('blog-images').upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);
  return sb.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
}

/**
 * Owner action: replace the resume. The PDF is stored in the public `site` bucket and its link
 * is saved in `site_settings`, so every visitor gets the new file right away. Returns the URL.
 */
export async function uploadResume(file) {
  const sb = must(supabase);
  if (file.type !== 'application/pdf') throw new Error('Please choose a PDF file.');
  if (file.size > 10 * 1024 * 1024) throw new Error('That PDF is over 10 MB.');

  const up = await sb.storage.from('site').upload('resume.pdf', file, {
    upsert: true,
    contentType: 'application/pdf',
    cacheControl: '60',
  });
  if (up.error) throw new Error(up.error.message);

  const { publicUrl } = sb.storage.from('site').getPublicUrl('resume.pdf').data;
  const url = `${publicUrl}?v=${Date.now()}`; // cache-buster so the new file shows immediately
  const saved = await sb.from('site_settings').upsert({ key: 'resume_url', value: url });
  if (saved.error) throw new Error(saved.error.message);
  return url;
}

/** Current uploaded resume link, or null when none has been uploaded yet. */
export async function fetchResumeUrl() {
  const sb = must(supabase);
  const { data, error } = await sb.from('site_settings').select('value').eq('key', 'resume_url').maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value || null;
}
