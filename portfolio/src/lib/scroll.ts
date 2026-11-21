/** Scroll to a section by id and move focus there for keyboard and screen reader users. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (history.replaceState) history.replaceState(null, '', id === 'home' ? ' ' : `#${id}`);
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
