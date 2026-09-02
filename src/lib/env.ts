export interface SiteEnv {
  /** Absolute origin with no trailing slash, e.g. https://insolo.vitorio-0405.workers.dev */
  readonly siteUrl: string;
  /** When false, the site emits noindex and omits business structured data. */
  readonly indexable: boolean;
}

interface RawEnv {
  VITE_SITE_URL: string | undefined;
  VITE_INDEXABLE: string | undefined;
}

/**
 * Validate raw environment values into a typed shape.
 *
 * `indexable` fails closed: anything other than the exact string "true"
 * is false. That flag gates whether placeholder business data reaches
 * search engines, so ambiguity must resolve to "do not publish".
 */
export function readEnv(raw: RawEnv): SiteEnv {
  const url = (raw.VITE_SITE_URL ?? '').trim();

  if (url === '') {
    throw new Error('VITE_SITE_URL is required. Copy .env.example to .env.');
  }
  if (!/^https?:\/\//.test(url)) {
    throw new Error(
      `VITE_SITE_URL must be an absolute URL, received "${url}".`,
    );
  }

  return {
    siteUrl: url.replace(/\/+$/, ''),
    indexable: raw.VITE_INDEXABLE === 'true',
  };
}

export const env: SiteEnv = readEnv({
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  VITE_INDEXABLE: import.meta.env.VITE_INDEXABLE,
});
