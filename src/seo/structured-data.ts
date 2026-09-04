import type { SiteContent } from '@/content/site';

export interface SiteEnv {
  readonly siteUrl: string;
  readonly indexable: boolean;
}

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
