import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Prettier wraps long declarations across lines, so match on a
// whitespace-normalised copy rather than the raw source.
const rawCss = readFileSync('src/components/Contact.css', 'utf8');
const css = rawCss.replace(/\s+/g, ' ');
const astro = readFileSync('src/components/Contact.astro', 'utf8');
const footer = readFileSync('src/components/Footer.astro', 'utf8');

describe('contact section styling', () => {
  it('reaches no further than the semantic token layer', () => {
    const primitives = [
      ...css.matchAll(/var\(\s*(--(?:teal|copper|sea|red)-\d+)/g),
    ].map((m) => m[1]);

    expect(primitives, 'Contact.css uses primitives directly').toEqual([]);
  });

  it('authors no raw colour literals', () => {
    expect(css).not.toMatch(/oklch\(/);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it('sizes type with tokens, not pixels', () => {
    expect(css).not.toMatch(/font-size:\s*\d/);
  });
});

describe('contact sun arc', () => {
  it('drives the sun with offset-path, not SMIL', () => {
    expect(css).toContain('offset-path: path(');
    expect(astro).not.toContain('<animate');
  });

  it('gates the animation on prefers-reduced-motion: no-preference', () => {
    // Without the gate the global reset forces iteration-count 1, which
    // plays this once and strands the sun at 100% — sunset.
    const gate = css.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(gate, 'the sun animation is not gated').toBeGreaterThan(-1);

    const declaration = css.indexOf('animation: contact-sun');
    expect(declaration).toBeGreaterThan(gate);
    expect(css.slice(gate, declaration)).not.toContain('}');
  });

  it('keeps the sun at the path origin so offset-path can place it', () => {
    expect(astro).toMatch(/<circle[^>]*cx="0"[^>]*cy="0"/);
  });
});

describe('contact business data', () => {
  it('hardcodes no NAP value — everything reads from site.ts', () => {
    expect(astro).not.toMatch(/href="tel:\+/);
    expect(astro).not.toMatch(/href="mailto:[^{]/);
    expect(astro).not.toMatch(/@example\.com/);
    expect(astro).toContain("from '@/content/site'");
  });

  it('marks the visit row up as an address', () => {
    expect(astro).toContain('<address');
  });
});

describe('footer no longer duplicates the contact section', () => {
  it('renders no channel the contact section already owns', () => {
    expect(footer).not.toContain('tel:');
    expect(footer).not.toContain('mailto:');
    expect(footer).not.toContain('streetAddress');
    expect(footer).not.toContain('openingHours');
  });
});
