import { profile } from '@/data/profile';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SendResult =
  /** Delivered to the form service */
  | { ok: true; via: 'endpoint' }
  /** No service configured: the visitor's email app was opened with the message */
  | { ok: true; via: 'email' }
  | { ok: false; error: string };

/**
 * Integration point. Set VITE_CONTACT_ENDPOINT to any service that accepts a
 * JSON POST and answers 2xx on success, for example:
 *   Formspree   https://formspree.io/f/<form-id>
 *   Web3Forms   https://api.web3forms.com/submit (also set VITE_CONTACT_ACCESS_KEY)
 *   Your own serverless function, e.g. /api/contact
 * Without it, the form falls back to opening a pre-filled email draft.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();
const ACCESS_KEY = import.meta.env.VITE_CONTACT_ACCESS_KEY?.trim();
const TIMEOUT_MS = 15_000;

export const hasContactEndpoint = Boolean(ENDPOINT);

export function buildMailto({ name, email, subject, message }: ContactMessage) {
  const body = `${message}\n\n${name}\n${email}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject || `Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
}

/** A mailto: navigation hands off to the email app without leaving the page. */
function openMailDraft(msg: ContactMessage) {
  window.location.href = buildMailto(msg);
}

export async function sendContactMessage(msg: ContactMessage): Promise<SendResult> {
  if (!ENDPOINT) {
    openMailDraft(msg);
    return { ok: true, via: 'email' };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...msg,
        _subject: msg.subject,
        ...(ACCESS_KEY && { access_key: ACCESS_KEY }),
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return { ok: false, error: `The message service responded with an error (${res.status}).` };
    }
    return { ok: true, via: 'endpoint' };
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError';
    return {
      ok: false,
      error: timedOut ? 'The request timed out.' : 'The message could not be sent. Check your connection.',
    };
  } finally {
    window.clearTimeout(timer);
  }
}
