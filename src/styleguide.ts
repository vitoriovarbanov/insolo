import './styles/index.css';
import { el, qs } from '@/lib/dom';

const COPPER = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const TEAL = [50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950];
const SEA = [400, 500, 600];

const TYPE_STEPS = [
  ['--step-6', 'Display'],
  ['--step-5', 'Heading XL'],
  ['--step-4', 'Heading 1'],
  ['--step-3', 'Heading 2'],
  ['--step-2', 'Heading 3'],
  ['--step-1', 'Lead'],
  ['--step-0', 'Body'],
  ['--step--1', 'Small'],
  ['--step--2', 'Micro'],
] as const;

const SPACES = [
  '--space-3xs',
  '--space-2xs',
  '--space-xs',
  '--space-s',
  '--space-m',
  '--space-l',
  '--space-xl',
  '--space-2xl',
  '--space-3xl',
] as const;

function swatch(token: string): HTMLElement {
  return el('div', { class: 'sg-swatch' }, [
    el('div', {
      class: 'sg-swatch__chip',
      style: `background-color: var(${token})`,
    }),
    el('code', { class: 'sg-swatch__name' }, [token]),
  ]);
}

function swatchGrid(prefix: string, steps: readonly number[]): HTMLElement {
  return el(
    'div',
    { class: 'grid', style: '--grid-min: 7rem' },
    steps.map((step) => swatch(`--${prefix}-${step}`)),
  );
}

function typeSpecimen(): HTMLElement {
  return el(
    'div',
    { class: 'stack--tight stack' },
    TYPE_STEPS.map(([token, label]) =>
      el('div', { class: 'sg-row' }, [
        el('code', { class: 'sg-row__label' }, [token]),
        el('span', { style: `font-size: var(${token})` }, [label]),
      ]),
    ),
  );
}

function spacingSpecimen(): HTMLElement {
  return el(
    'div',
    { class: 'stack stack--tight' },
    SPACES.map((token) =>
      el('div', { class: 'sg-row' }, [
        el('code', { class: 'sg-row__label' }, [token]),
        el('div', { class: 'sg-bar', style: `width: var(${token})` }),
      ]),
    ),
  );
}

function buttonSpecimen(): HTMLElement {
  const variants = ['primary', 'secondary', 'ghost'] as const;

  const row = (disabled: boolean): HTMLElement =>
    el(
      'div',
      { class: 'cluster' },
      variants.map((variant) =>
        el(
          'button',
          {
            class: `button button--${variant}`,
            type: 'button',
            ...(disabled ? { disabled: '' } : {}),
          },
          [disabled ? `${variant} disabled` : variant],
        ),
      ),
    );

  return el('div', { class: 'stack' }, [
    row(false),
    row(true),
    el('p', { class: 'sg-note' }, [
      'Tab through the buttons above to check the focus ring. Every state is built here, not on the page that happens to need one.',
    ]),
  ]);
}

function labelSpecimen(): HTMLElement {
  return el('div', { class: 'stack sg-specimen' }, [
    el('p', { class: 'eyebrow' }, ['Sofia · 42.70° N · Est. 2019']),
    el('p', { class: 'label' }, ['Annual irradiance']),
    el('p', { class: 'readout readout--brand' }, [
      '1,420',
      el('span', { class: 'readout__unit' }, ['kWh/m²']),
    ]),
    el('p', { class: 'sg-note' }, [
      'Mono carries labels, eyebrows and readouts. Body copy stays in the display face — monospace punishes anyone actually reading a paragraph.',
    ]),
  ]);
}

function railSpecimen(): HTMLElement {
  const cells: readonly (readonly [string, string, string])[] = [
    ['Peak altitude', '70.8', 'DEG'],
    ['Annual irradiance', '1,420', 'kWh/m²'],
    ['Systems fitted', '318', ''],
    ['Median payback', '6.4', 'YR'],
  ];

  return el('div', { class: 'stack' }, [
    el(
      'dl',
      { class: 'rail' },
      cells.map(([label, value, unit]) =>
        el('div', { class: 'rail__cell' }, [
          el('dt', { class: 'label' }, [label]),
          el('dd', { class: 'readout' }, [
            value,
            ...(unit === ''
              ? []
              : [el('span', { class: 'readout__unit' }, [unit])]),
          ]),
        ]),
      ),
    ),
    el('p', { class: 'sg-note' }, [
      'Hover a cell — the copper underline wipes across. This is the signature data block.',
    ]),
  ]);
}

function cardSpecimen(): HTMLElement {
  return el('div', { class: 'grid' }, [
    el('article', { class: 'card' }, [
      el('h3', { class: 'card__title' }, ['Static card']),
      el('p', { class: 'card__body' }, [
        'Raised surface, hairline border, near-square corners.',
      ]),
      el('span', { class: 'card__tag' }, ['3–12 kWp']),
    ]),
    el('article', { class: 'card card--interactive' }, [
      el('h3', { class: 'card__title' }, ['Interactive card']),
      el('p', { class: 'card__body' }, [
        'Hover: the border takes the copper and the surface warms. No lift, no shadow — this is an instrument, not a tile.',
      ]),
      el('span', { class: 'card__tag' }, ['50 kWp+']),
    ]),
  ]);
}

function section(id: string, title: string, body: HTMLElement): HTMLElement {
  return el('section', { class: 'sg-section stack', id }, [
    el('h2', { class: 'sg-section__title' }, [title]),
    body,
  ]);
}

const root = qs('#sg-root');

root.append(
  section('copper', 'Copper — brand accent', swatchGrid('copper', COPPER)),
  section('teal', 'Teal — neutral', swatchGrid('teal', TEAL)),
  section('sea', 'Sea — secondary accent', swatchGrid('sea', SEA)),
  section('type', 'Type scale', typeSpecimen()),
  section('space', 'Spacing scale', spacingSpecimen()),
  section('labels', 'Labels and readouts', labelSpecimen()),
  section('buttons', 'Buttons', buttonSpecimen()),
  section('rail', 'Readout rail', railSpecimen()),
  section('cards', 'Cards', cardSpecimen()),
);
