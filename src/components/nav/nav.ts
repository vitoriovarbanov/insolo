import { site } from '@/content/site';
import { el } from '@/lib/dom';
import logoUrl from '@/assets/images/insolo-logo.png';
import { initMenu } from '@/components/nav/menu';

const LOGO_W = 540;
const LOGO_H = 133;

export function renderNav(root: ParentNode = document): void {
  const brand = root.querySelector<HTMLAnchorElement>('.site-header__brand');
  if (brand !== null) {
    brand.replaceChildren(
      el('img', {
        src: logoUrl,
        alt: site.name,
        width: String(LOGO_W),
        height: String(LOGO_H),
        class: 'site-header__logo',
        fetchpriority: 'high',
        decoding: 'async',
      }),
    );
  }

  const nav = root.querySelector('nav[aria-label="Primary"]');
  if (nav === null) {
    return;
  }

  nav.append(
    el(
      'ul',
      { class: 'site-nav__list' },
      site.nav.map((item) =>
        el('li', {}, [
          el('a', { class: 'site-nav__link', href: item.href }, [item.label]),
        ]),
      ),
    ),
  );

  const header = root.querySelector<HTMLElement>('.site-header');
  const inner = root.querySelector<HTMLElement>('.site-header > .container');
  if (header === null || inner === null || !(nav instanceof HTMLElement)) {
    return;
  }

  nav.id = 'site-menu';

  const toggle = el('button', {
    type: 'button',
    class: 'site-menu-toggle',
    'aria-controls': 'site-menu',
    'aria-expanded': 'false',
    'aria-label': 'Menu',
  });
  toggle.append(
    el('span', { class: 'site-menu-toggle__bars', 'aria-hidden': 'true' }),
  );
  inner.append(toggle);

  initMenu(toggle, nav, header);
}

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

export function initNav(): void {
  renderNav();
  trackActiveSection();
}
