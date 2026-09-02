/**
 * Validate build-time environment before Vite runs.
 *
 * Without this the failure mode is silent and severe: Vite inlines a
 * missing VITE_SITE_URL as `undefined`, the build exits 0, and
 * readEnv() throws at module scope in the visitor's browser — so the
 * page renders blank AND the noindex meta never gets applied.
 *
 * Better to fail here, where a human is reading a build log.
 */
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV ?? 'production';
const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };

const problems = [];

const siteUrl = (env.VITE_SITE_URL ?? '').trim();
if (siteUrl === '') {
  problems.push(
    'VITE_SITE_URL is not set. Locally: copy .env.example to .env. ' +
      "On Cloudflare: add it under the project's build environment variables.",
  );
} else if (!/^https?:\/\//.test(siteUrl)) {
  problems.push(`VITE_SITE_URL must be absolute, received "${siteUrl}".`);
}

const indexable = env.VITE_INDEXABLE;
if (indexable === undefined || indexable === '') {
  problems.push(
    'VITE_INDEXABLE is not set. It must be the exact string "true" or "false". ' +
      'It gates whether placeholder business data reaches search engines.',
  );
} else if (indexable !== 'true' && indexable !== 'false') {
  problems.push(
    `VITE_INDEXABLE must be exactly "true" or "false", received "${indexable}". ` +
      'Anything else is treated as false, which is probably not what was meant.',
  );
}

if (problems.length > 0) {
  console.error('\n  Build aborted — environment is not configured:\n');
  for (const p of problems) {
    console.error(`   - ${p}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `  env OK  site=${siteUrl}  indexable=${indexable}` +
    (indexable === 'true' ? '  << structured data WILL be published' : ''),
);
