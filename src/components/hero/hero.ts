import { site } from '@/content/site';
import { el } from '@/lib/dom';
import heroUrl from '@/assets/images/insolo-hero.webp';

/** Populates the static `.hero` shell in index.html from site content. */
export function renderHero(root: ParentNode = document): void {
  const hero = root.querySelector<HTMLElement>('.hero');
  if (hero === null) {
    return;
  }

  hero.prepend(
    el('div', { class: 'hero__media' }, [
      el('img', {
        src: heroUrl,
        alt: 'Rows of rooftop solar panels facing a city skyline.',
        width: '2400',
        height: '1600',
        fetchpriority: 'high',
        decoding: 'async',
      }),
    ]),
    el('div', { class: 'hero__scrim', 'aria-hidden': 'true' }),
  );

  const content = root.querySelector('.hero__content');
  if (content !== null) {
    content.append(
      el('p', { class: 'eyebrow' }, [
        `${site.address.addressLocality} · Est. ${String(site.foundingYear)}`,
      ]),
      el('h1', { class: 'hero__title' }, [site.tagline]),
      el('p', { class: 'hero__lead' }, [site.description]),
      el('div', { class: 'hero__actions cluster' }, [
        el('a', { class: 'button button--primary', href: '#contact' }, [
          'Get a quote',
        ]),
        el('a', { class: 'button button--ghost', href: '#projects' }, [
          'View projects',
        ]),
      ]),
    );
  }

  const panel = root.querySelector('.hero__panel');
  if (panel !== null) {
    panel.append(
      ...site.readouts.map((readout) =>
        el('div', { class: 'hero__readout' }, [
          el('p', { class: 'label' }, [readout.label]),
          el(
            'p',
            {
              class:
                readout.emphasis === true
                  ? 'readout readout--brand'
                  : 'readout',
            },
            [
              readout.value,
              ...(readout.unit === ''
                ? []
                : [el('span', { class: 'readout__unit' }, [readout.unit])]),
            ],
          ),
        ]),
      ),
    );
  }
}

export function initHero(): void {
  renderHero();
}
