const DESKTOP = '(min-width: 40rem)';

export interface Menu {
  readonly close: () => void;
}

function focusable(root: ParentNode): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  ).filter((node) => node.offsetParent !== null);
}

export function initMenu(
  toggle: HTMLButtonElement,
  panel: HTMLElement,
  header: HTMLElement,
): Menu {
  const desktop = window.matchMedia(DESKTOP);
  let open = false;

  const applyDesktop = (): void => {
    /* On wide screens the panel is always a plain visible row: no
       inert, no scroll lock, no lingering open state. */
    panel.removeAttribute('inert');
    header.removeAttribute('data-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.removeProperty('overflow');
    open = false;
  };

  const setOpen = (next: boolean): void => {
    if (desktop.matches) {
      return;
    }
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    header.toggleAttribute('data-menu-open', next);
    if (next) {
      panel.removeAttribute('inert');
      document.documentElement.style.overflow = 'hidden';
      /* Wait a frame so the panel is painted and focusable before we
         try to move focus into it. */
      requestAnimationFrame(() => focusable(panel)[0]?.focus());
    } else {
      panel.setAttribute('inert', '');
      document.documentElement.style.removeProperty('overflow');
    }
  };

  const close = (): void => setOpen(false);

  toggle.addEventListener('click', () => setOpen(!open));

  document.addEventListener('keydown', (event) => {
    if (!open) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      toggle.focus();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const items = focusable(panel);
    const first = items[0];
    const last = items.at(-1);
    if (first === undefined || last === undefined) {
      return;
    }
    /* The toggle itself stays in the cycle so the menu can always be
       closed from the keyboard without leaving the panel. */
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      toggle.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      toggle.focus();
    } else if (event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (open && !header.contains(event.target as Node)) {
      close();
    }
  });

  /* Following a link jumps to a section; leaving the panel open would
     cover the thing the reader just asked to see. */
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) {
      close();
    }
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) {
      applyDesktop();
    } else {
      panel.setAttribute('inert', '');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  if (desktop.matches) {
    applyDesktop();
  } else {
    panel.setAttribute('inert', '');
  }

  return { close };
}
