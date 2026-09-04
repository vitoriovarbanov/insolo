export function trackActiveSection(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.site-nav__link'),
  );

  if (links.length === 0 || !('IntersectionObserver' in window)) {
    return;
  }

  const byId = new Map<string, HTMLAnchorElement>();
  for (const link of links) {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id !== undefined && id !== '') {
      byId.set(id, link);
    }
  }

  const setCurrent = (link: HTMLAnchorElement): void => {
    for (const other of links) {
      other.removeAttribute('aria-current');
    }
    link.setAttribute('aria-current', 'true');
  };

  let atFoot = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (atFoot) {
        return;
      }
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        const link = byId.get(entry.target.id);
        if (link !== undefined) {
          setCurrent(link);
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );

  for (const id of byId.keys()) {
    const section = document.getElementById(id);
    if (section !== null) {
      observer.observe(section);
    }
  }

  const lastLink = links.at(-1);
  if (lastLink === undefined) {
    return;
  }

  const makeSentinel = (position: 'start' | 'end'): HTMLElement => {
    const node = document.createElement('div');
    node.setAttribute('aria-hidden', 'true');
    node.style.cssText =
      position === 'end'
        ? 'height:1px;margin-block-start:-1px;'
        : 'height:1px;margin-block-end:-1px;';
    return node;
  };

  const foot = makeSentinel('end');
  document.body.append(foot);

  new IntersectionObserver(([entry]) => {
    if (entry === undefined) {
      return;
    }
    atFoot = entry.isIntersecting;
    if (atFoot) {
      setCurrent(lastLink);
    }
  }).observe(foot);

  const head = makeSentinel('start');
  document.body.prepend(head);

  let atHead = false;
  new IntersectionObserver(([entry]) => {
    if (entry === undefined) {
      return;
    }
    atHead = entry.isIntersecting;
    if (atHead) {
      for (const link of links) {
        link.removeAttribute('aria-current');
      }
    }
  }).observe(head);
}
