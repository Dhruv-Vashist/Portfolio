import { hasSupabase } from './supabase.js';
import { uploadBlogImage } from './storage.js';

/** Downscale a picture to a JPEG blob (smaller pages, faster loading). */
async function resizeToBlob(file, max) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / bmp.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/jpeg', 0.82),
  );
}

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/** Supabase on → uploads and returns a public URL. Off → returns an embedded data URL. */
export async function prepareImage(file) {
  if (hasSupabase) return uploadBlogImage(await resizeToBlob(file, 1200));
  return blobToDataUrl(await resizeToBlob(file, 800));
}
