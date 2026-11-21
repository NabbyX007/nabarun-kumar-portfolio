import { useCallback, useEffect, useRef, useState } from 'react';

/** Copies text with the Clipboard API, falling back to execCommand where it is blocked. */
export function useCopyToClipboard(resetAfterMs = 2200) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand('copy');
        } catch {
          ok = false;
        }
        ta.remove();
      }
      setCopied(ok);
      window.clearTimeout(timer.current);
      if (ok) timer.current = window.setTimeout(() => setCopied(false), resetAfterMs);
      return ok;
    },
    [resetAfterMs],
  );

  return { copied, copy };
}
