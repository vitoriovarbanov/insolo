import { describe, expect, it } from 'vitest';

/** Convert OKLCH to linear sRGB. */
function oklchToLinearSrgb(
  L: number,
  C: number,
  hDeg: number,
): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** WCAG 2.1 relative luminance. */
function relativeLuminance(L: number, C: number, h: number): number {
  const channels = oklchToLinearSrgb(L, C, h);
  const clamp = (v: number): number => Math.min(1, Math.max(0, v));
  return (
    0.2126 * clamp(channels[0]) +
    0.7152 * clamp(channels[1]) +
    0.0722 * clamp(channels[2])
  );
}

type Oklch = readonly [number, number, number];

function contrast(fg: Oklch, bg: Oklch): number {
  const l1 = relativeLuminance(fg[0], fg[1], fg[2]);
  const l2 = relativeLuminance(bg[0], bg[1], bg[2]);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

/** Mirrors src/styles/tokens/primitives.css. Keep in sync. */
const INK: Oklch = [0.148, 0.016, 188]; // --teal-950, page surface
const RAISED: Oklch = [0.222, 0.033, 171]; // --teal-850, card surface
const TEXT: Oklch = [0.916, 0.012, 178]; // --teal-100
const MUTED: Oklch = [0.705, 0.028, 181]; // --teal-400
const LABEL: Oklch = [0.61, 0.035, 184]; // --teal-500
const COPPER: Oklch = [0.656, 0.132, 50]; // --copper-500
const SEA: Oklch = [0.61, 0.065, 184]; // --sea-500

describe('Horizon palette contrast (dark-first)', () => {
  it('body text on the page surface meets WCAG AA', () => {
    expect(contrast(TEXT, INK)).toBeGreaterThanOrEqual(4.5);
  });

  it('muted text on the page surface meets WCAG AA', () => {
    expect(contrast(MUTED, INK)).toBeGreaterThanOrEqual(4.5);
  });

  it('mono labels meet AA on BOTH surfaces (they are set at 9px)', () => {
    expect(contrast(LABEL, INK)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(LABEL, RAISED)).toBeGreaterThanOrEqual(4.5);
  });

  it('copper accent text meets AA on the page surface', () => {
    expect(contrast(COPPER, INK)).toBeGreaterThanOrEqual(4.5);
  });

  it('button label on the copper surface meets AA', () => {
    expect(contrast(INK, COPPER)).toBeGreaterThanOrEqual(4.5);
  });

  it('sea secondary action meets AA on BOTH surfaces', () => {
    expect(contrast(SEA, INK)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(SEA, RAISED)).toBeGreaterThanOrEqual(4.5);
  });

  it('muted text stays legible on raised cards', () => {
    expect(contrast(MUTED, RAISED)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('measured ratios', () => {
  it('reports actual values', () => {
    const report = {
      'text on ink': contrast(TEXT, INK).toFixed(2),
      'muted on ink': contrast(MUTED, INK).toFixed(2),
      'label on ink': contrast(LABEL, INK).toFixed(2),
      'label on raised': contrast(LABEL, RAISED).toFixed(2),
      'copper on ink': contrast(COPPER, INK).toFixed(2),
      'ink on copper': contrast(INK, COPPER).toFixed(2),
      'sea on ink': contrast(SEA, INK).toFixed(2),
      'sea on raised': contrast(SEA, RAISED).toFixed(2),
    };
    console.warn(JSON.stringify(report, null, 2));
    expect(report).toBeTruthy();
  });
});
