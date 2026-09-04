export function initScrollReveal(selector = '[data-reveal]'): void {
  const targets = document.querySelectorAll<HTMLElement>(selector);
  if (targets.length === 0) {
    return;
  }

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    for (const target of targets) {
      target.setAttribute('data-revealed', 'true');
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        entry.target.setAttribute('data-revealed', 'true');
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );

  for (const target of targets) {
    observer.observe(target);
  }
}
