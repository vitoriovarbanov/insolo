export interface PostalAddress {
  readonly streetAddress: string;
  readonly addressLocality: string;
  readonly postalCode: string;
  readonly addressCountry: string;
}

export interface OpeningHours {
  readonly days: readonly string[];
  readonly opens: string;
  readonly closes: string;
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly scale: string;
}

export interface NavItem {
  readonly href: string;
  readonly label: string;
}

export interface Readout {
  readonly label: string;
  readonly value: string;
  readonly unit: string;
  /** Renders in the brand copper. At most one readout should carry it. */
  readonly emphasis?: boolean;
}

export interface SiteContent {
  readonly name: string;
  readonly legalName: string;
  readonly tagline: string;
  readonly description: string;
  readonly email: string;
  readonly telephone: string;
  readonly address: PostalAddress;
  readonly geo: { readonly latitude: number; readonly longitude: number };
  readonly openingHours: readonly OpeningHours[];
  readonly areaServed: readonly string[];
  readonly priceRange: string;
  readonly foundingYear: number;
  readonly services: readonly Service[];
  readonly nav: readonly NavItem[];
  readonly readouts: readonly Readout[];
}

export const site: SiteContent = {
  name: 'inSolo',
  legalName: 'inSolo EOOD', // TODO: real registered entity
  tagline: 'Nine hours of it lands on your roof.',
  description:
    'Design, installation and maintenance of solar photovoltaic systems for homes and businesses.',

  email: 'hello@example.com', // TODO
  telephone: '+35920000000', // TODO — E.164, no spaces

  address: {
    // TODO: all four fields
    streetAddress: '1 Placeholder Street',
    addressLocality: 'Sofia',
    postalCode: '1000',
    addressCountry: 'BG',
  },

  geo: { latitude: 42.6977, longitude: 23.3219 }, // TODO: real coordinates

  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],

  areaServed: ['Sofia'], // TODO
  priceRange: '$$',
  foundingYear: 2019, // TODO

  services: [
    {
      id: 'residential',
      name: 'Residential',
      summary:
        'Rooftop arrays sized against twelve months of metered consumption, not against the biggest system the roof will hold.',
      scale: '3–12 kWp',
    },
    {
      id: 'commercial',
      name: 'Commercial',
      summary:
        'Warehouse, agricultural and industrial installations with load-matched inverter design.',
      scale: '50 kWp+',
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      summary:
        'Panel cleaning, inverter servicing and continuous output monitoring with alerting on yield deviation.',
      scale: 'Annual contract',
    },
  ],

  nav: [
    { href: '#services', label: 'Services' },
    { href: '#projects', label: 'Projects' },
    { href: '#method', label: 'Method' },
    { href: '#contact', label: 'Contact' },
  ],

  // TODO: every figure below is invented. Replace before launch —
  // these are public performance claims, not decoration.
  readouts: [
    { label: 'Peak altitude', value: '70.8', unit: 'DEG' },
    {
      label: 'Annual irradiance',
      value: '1,420',
      unit: 'kWh/m²',
      emphasis: true,
    },
    { label: 'Systems fitted', value: '318', unit: '' },
    { label: 'Median payback', value: '6.4', unit: 'YR' },
  ],
};
