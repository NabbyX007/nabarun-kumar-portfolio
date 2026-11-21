import { profile } from '@/data/profile';

/**
 * In the Vite app the resume is a static file in /public, so a normal
 * <a download> link handles it. Hosting environments that block plain
 * download links can swap this module for one that sets
 * `interceptResumeDownload` to true and implements `downloadResume`.
 */
export const interceptResumeDownload = false;

export async function downloadResume(): Promise<void> {
  const a = document.createElement('a');
  a.href = profile.resumeUrl;
  a.download = profile.resumeFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
