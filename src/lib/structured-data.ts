import type { SiteContent } from '@/content/site';
import type { SiteEnv } from '@/lib/env';

export interface LocalBusinessJsonLd {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  legalName: string;
  description: string;
  url: string;
  email: string;
  telephone: string;
  priceRange: string;
  foundingDate: string;
  areaServed: readonly string[];
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: readonly {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: readonly string[];
    opens: string;
    closes: string;
  }[];
}

export function buildLocalBusinessJsonLd(
  content: SiteContent,
  env: SiteEnv,
): LocalBusinessJsonLd | null {
  if (!env.indexable) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: content.name,
    legalName: content.legalName,
    description: content.description,
    url: env.siteUrl,
    email: content.email,
    telephone: content.telephone,
    priceRange: content.priceRange,
    foundingDate: String(content.foundingYear),
    areaServed: content.areaServed,
    address: {
      '@type': 'PostalAddress',
      streetAddress: content.address.streetAddress,
      addressLocality: content.address.addressLocality,
      postalCode: content.address.postalCode,
      addressCountry: content.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: content.geo.latitude,
      longitude: content.geo.longitude,
    },
    openingHoursSpecification: content.openingHours.map((slot) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
  };
}

/** Inject the JSON-LD script tag, or do nothing when not indexable. */
export function injectJsonLd(data: LocalBusinessJsonLd | null): void {
  if (data === null) {
    return;
  }
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.append(script);
}
