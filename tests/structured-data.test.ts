import { describe, expect, it } from 'vitest';
import { site } from '@/content/site';
import { buildLocalBusinessJsonLd } from '@/seo/structured-data';

const VISIBLE = { siteUrl: 'https://example.test', indexable: true };
const HIDDEN = { siteUrl: 'https://example.test', indexable: false };

/* These are guardrails, not unit tests for their own sake: they are the
   executable form of "do not publish fabricated business data", so the
   rule cannot be regressed by an edit that looks harmless. */

describe('buildLocalBusinessJsonLd', () => {
  it('returns null when the site is not indexable', () => {
    expect(buildLocalBusinessJsonLd(site, HIDDEN)).toBeNull();
  });

  it('emits a LocalBusiness node when indexable', () => {
    const data = buildLocalBusinessJsonLd(site, VISIBLE);
    expect(data?.['@context']).toBe('https://schema.org');
    expect(data?.['@type']).toBe('LocalBusiness');
  });

  it('includes name and address, the two properties Google requires', () => {
    const data = buildLocalBusinessJsonLd(site, VISIBLE);
    expect(data?.name).toBe('inSolo');
    expect(data?.address).toMatchObject({
      '@type': 'PostalAddress',
      addressCountry: 'BG',
    });
  });

  it('uses the environment origin for the url, not a hardcoded domain', () => {
    const data = buildLocalBusinessJsonLd(site, {
      siteUrl: 'https://example.test',
      indexable: true,
    });
    expect(data?.url).toBe('https://example.test');
  });

  it('formats opening hours as OpeningHoursSpecification', () => {
    const data = buildLocalBusinessJsonLd(site, VISIBLE);
    expect(data?.openingHoursSpecification[0]).toMatchObject({
      '@type': 'OpeningHoursSpecification',
      opens: '09:00',
      closes: '18:00',
    });
  });

  it('never emits aggregateRating or review', () => {
    const data = buildLocalBusinessJsonLd(site, VISIBLE);
    expect(data).not.toHaveProperty('aggregateRating');
    expect(data).not.toHaveProperty('review');
  });

  it('serialises to valid JSON for the script tag', () => {
    const data = buildLocalBusinessJsonLd(site, VISIBLE);
    expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
  });
});
