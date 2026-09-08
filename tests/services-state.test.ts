import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { processSteps } from '@/content/process';

// Prettier wraps long selectors across lines, so match on a
// whitespace-normalised copy rather than the raw source.
const raw = readFileSync('src/components/Services.css', 'utf8');
const css = raw.replace(/\s+/g, ' ');

describe('services wheel selectors', () => {
  it.each(processSteps.map((step, i) => [step.id, i] as const))(
    'gives %s a needle index',
    (id) => {
      expect(css).toContain(`.services__wrap:has(.services__row--${id}:hover)`);
    },
  );

  it('assigns one needle index per step, in order', () => {
    const indices = [...css.matchAll(/--active:\s*(\d+);/g)].map((m) =>
      Number(m[1]),
    );
    expect(indices).toEqual(processSteps.map((_, i) => i));
  });

  it('references no step id the content does not define', () => {
    const known = new Set(processSteps.map((step) => step.id));
    const referenced = [
      ...css.matchAll(/services__(?:row|node)--([a-z-]+)/g),
    ].map((m) => m[1]);
    const orphans = [...new Set(referenced)].filter((id) => !known.has(id));

    expect(orphans, 'Services.css targets ids missing from process.ts').toEqual(
      [],
    );
  });

  it('never lets the panel diagram drive hover state', () => {
    expect(css).not.toMatch(/services__node[a-z-]*:hover/);
  });

  it('gives every step an icon, and every icon a file', () => {
    const astro = readFileSync('src/components/Services.astro', 'utf8');
    const map = astro.slice(astro.indexOf('const icons = {'));
    const mapped = new Map(
      [...map.slice(0, map.indexOf('};')).matchAll(/(\w+):\s*(\w+),/g)].map(
        (m) => [m[1], m[2]] as const,
      ),
    );

    for (const step of processSteps) {
      expect(mapped.has(step.id), `no icon mapped for "${step.id}"`).toBe(true);
    }

    for (const binding of mapped.values()) {
      const file = astro.match(
        new RegExp(`import ${binding} from '@/assets/icons/([\\w-]+\\.svg)'`),
      );
      expect(file, `${binding} is not imported from @/assets/icons`).not.toBe(
        null,
      );
      expect(existsSync(join('src/assets/icons', file![1]!))).toBe(true);
    }
  });

  it('ships no raw SVG in the component — every icon is a file', () => {
    const astro = readFileSync('src/components/Services.astro', 'utf8');
    expect(astro).not.toContain('set:html');
    expect(astro).not.toContain('<svg');
  });

  it('ships no radio inputs — the section is inert', () => {
    const astro = readFileSync('src/components/Services.astro', 'utf8');
    expect(astro).not.toContain('type="radio"');
    expect(astro).not.toContain('<fieldset');
  });
});
