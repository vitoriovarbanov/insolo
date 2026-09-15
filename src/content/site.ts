import { z } from 'astro/zod';

const postalAddressSchema = z.object({
  streetAddress: z.string().min(1),
  addressLocality: z.string().min(1),
  postalCode: z.string().min(1),
  addressCountry: z.string().length(2),
});

const openingHoursSchema = z.object({
  days: z.array(z.string().min(1)).min(1),
  opens: z.string().regex(/^\d{2}:\d{2}$/),
  closes: z.string().regex(/^\d{2}:\d{2}$/),
});

const serviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  scale: z.string().min(1),
});

const navItemSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

const readoutSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  unit: z.string(),
  emphasis: z.boolean().optional(),
});

const siteSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  email: z.email(),
  telephone: z.string().regex(/^\+[1-9]\d{6,14}$/),
  address: postalAddressSchema,
  geo: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  openingHours: z.array(openingHoursSchema).min(1),
  areaServed: z.array(z.string().min(1)).min(1),
  priceRange: z.string().min(1),
  foundingYear: z.number().int().min(1800).max(2100),
  services: z.array(serviceSchema).min(1),
  nav: z.array(navItemSchema).min(1),
  readouts: z.array(readoutSchema),
});

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

// ---------------------------------------------------------------------------
// THE BUSINESS DETAILS BELOW ARE INVENTED, AND THEY NOW LOOK REAL.
//
//
// The remaining safety mechanism is the indexing gate, and it is now the only
// one. It MUST stay closed until these are real:
//
//   - INDEXABLE fails closed, so buildLocalBusinessJsonLd returns null and no
//     LocalBusiness markup is emitted. Never default it to true.
//   - public/robots.txt disallows all crawling.
//
// A fabricated address published as machine-readable LocalBusiness data is
// what Google feeds into local search and Maps, and is a manual-action risk
// for the domain. Verify every field below before opening either gate.
// ---------------------------------------------------------------------------
const content = {
  name: 'inSolo',
  legalName: 'inSolo EOOD', // TODO: unverified — no such registered entity
  // The hard part of solar is never the sunlight — it is the roof, the
  // fixings and the wiring. The whole voice of the site follows from that.
  tagline: 'Sunlight is the easy part.',
  description:
    'Solar photovoltaic design and installation in Sofia — sized to your roof and your own consumption, fitted by the same crew that designed it.',

  // TODO: unverified. The domain is not registered, so this mailbox does not
  // exist and enquiries sent to it are lost silently.
  email: 'hello@insolo.bg',
  // Deliberately unroutable: 359 + area code 2 + EIGHT subscriber digits,
  // where the Sofia plan takes seven. Reads as an ordinary Bulgarian number
  // at a glance but cannot be dialled, so it can belong to nobody.
  // TODO: replace with the real number before launch.
  telephone: '+359249901005',

  address: {
    // TODO: unverified. Iskarsko shose is a real Sofia industrial corridor;
    // this street number and the premises behind it are invented.
    streetAddress: 'Iskarsko shose 7',
    addressLocality: 'Sofia',
    postalCode: '1528',
    addressCountry: 'BG',
  },

  // TODO: approximate, derived from the invented address above.
  geo: { latitude: 42.672, longitude: 23.402 },

  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],

  areaServed: ['Sofia', 'Sofia Province'], // TODO: confirm real coverage
  priceRange: '$$',
  foundingYear: 2019, // TODO: unverified

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

  // Every figure here is a property of Sofia's location, not a claim about
  // this company — true whoever installs the panels. "Systems fitted" and
  // "Median payback" used to sit here and were invented track record.
  //
  // TODO: cite each against PVGIS (re.jrc.ec.europa.eu/pvg_tools) before
  // launch. They are stated from general knowledge, not measured.
  readouts: [
    // 90 − 42.70 latitude + 23.44 axial tilt, at the June solstice.
    { label: 'Peak sun altitude', value: '70.8', unit: 'DEG' },
    {
      label: 'Annual irradiance',
      value: '1,420',
      unit: 'kWh/m²',
      emphasis: true,
    },
    { label: 'Yield per kWp', value: '1,290', unit: 'kWh/YR' },
    { label: 'Sunshine hours', value: '2,100', unit: 'H/YR' },
  ],
} as const;

siteSchema.parse(content);

export const site: SiteContent = content;
