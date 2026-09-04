import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIST = 'dist';
const ASSETS = join(DIST, '_astro');

const MAX_ASSET_BYTES = 200 * 1024;

const built = existsSync(ASSETS);

if (!built && process.env.CI === 'true') {
  throw new Error(
    'dist/_astro is missing. CI must run `npm run build` before `npm test`.',
  );
}

describe.skipIf(!built)('image budget', () => {
  const pages = readdirSync(DIST).filter((f) => f.endsWith('.html'));
  const assets = readdirSync(ASSETS);

  it('finds built pages to check', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it('serves every processed image through a srcset', () => {
    const offenders: string[] = [];

    for (const page of pages) {
      const html = readFileSync(join(DIST, page), 'utf8');
      for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
        if (!tag.includes('/_astro/')) {
          continue;
        }
        if (!tag.includes('srcset=')) {
          offenders.push(`${page}: ${tag.slice(0, 120)}`);
        }
      }
    }

    expect(
      offenders,
      'Processed images must use <Picture> with widths, not a bare <img>.',
    ).toEqual([]);
  });

  it('emits no raster fallbacks outside webp', () => {
    /* <Picture> defaults fallbackFormat to png, which silently produces a
       fallback several times larger than the source. Always set
       fallbackFormat="webp". */
    const raster = assets.filter((f) => /\.(png|jpe?g)$/i.test(f));

    expect(
      raster,
      'Unexpected png/jpeg in dist/_astro — check fallbackFormat="webp".',
    ).toEqual([]);
  });

  it('keeps every processed image under the size ceiling', () => {
    const tooBig = assets
      .map((f) => ({ f, bytes: statSync(join(ASSETS, f)).size }))
      .filter((a) => /\.(webp|png|jpe?g|avif)$/i.test(a.f))
      .filter((a) => a.bytes > MAX_ASSET_BYTES)
      .map((a) => `${a.f} (${Math.round(a.bytes / 1024)} KB)`);

    expect(
      tooBig,
      `Images must stay under ${MAX_ASSET_BYTES / 1024} KB. Add widths, or lower quality.`,
    ).toEqual([]);
  });
});
