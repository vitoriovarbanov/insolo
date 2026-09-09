import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { methodLayers } from '@/content/method';

const PAGE = 'dist/index.html';
const built = existsSync(PAGE);

if (!built && process.env.CI === 'true') {
  throw new Error(
    'dist/index.html is missing. CI must run `npm run build` before `npm test`.',
  );
}

describe.skipIf(!built)('method accordion', () => {
  const html = readFileSync(PAGE, 'utf8');
  const rows = [...html.matchAll(/<details\b[^>]*data-method-row[^>]*>/g)].map(
    (m) => m[0],
  );

  it('renders one row per layer', () => {
    expect(rows).toHaveLength(methodLayers.length);
  });

  it('ships every layer as crawlable text', () => {
    const missing = methodLayers
      .filter(
        (layer) =>
          !html.includes(layer.title) ||
          !html.includes(layer.detail.slice(0, 40)),
      )
      .map((layer) => layer.id);

    expect(
      missing,
      'collapsed rows must still ship their copy in the static HTML',
    ).toEqual([]);
  });

  it('opens exactly the first row', () => {
    const open = rows.filter((row) => /\bopen\b/.test(row));
    expect(open).toHaveLength(1);
    expect(rows.indexOf(open[0]!)).toBe(0);
  });

  it('gives the diagram a layer for every row, and no others', () => {
    const diagram = html.slice(
      html.indexOf('method__diagram'),
      html.indexOf('method__rows'),
    );
    const drawn = [...diagram.matchAll(/data-layer="([a-z-]+)"/g)].map(
      (m) => m[1],
    );

    expect(drawn.sort()).toEqual(methodLayers.map((l) => l.id).sort());
  });

  it('marks the first layer active so the diagram is right without JS', () => {
    const active = [
      ...html.matchAll(
        /class="[^"]*is-active[^"]*"[^>]*data-layer="([a-z-]+)"/g,
      ),
    ].map((m) => m[1]);

    expect(active).toEqual([methodLayers[0]!.id]);
  });

  it('groups every row under one name', () => {
    const names = rows.map((row) => row.match(/name="([^"]+)"/)?.[1]);
    expect(new Set(names).size, 'a stray name breaks exclusivity').toBe(1);
    expect(names[0]).toBeTruthy();
  });
});
