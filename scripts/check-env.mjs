/**
 * Validate build-time environment before Astro runs.
 *
 * An unset SITE_URL leaves Astro's `site` undefined, which emits
 * canonical and og:image as relative URLs. Social scrapers cannot
 * resolve those, and the build still exits 0.
 */
import { loadLocalEnv } from './load-env.mjs';

loadLocalEnv();
const env = process.env;

const problems = [];

const siteUrl = (env.SITE_URL ?? '').trim();
if (siteUrl === '') {
  problems.push(
    'SITE_URL is not set. Locally: copy .env.example to .env. ' +
      "On Cloudflare: add it under the project's build environment variables.",
  );
} else if (!/^https?:\/\//.test(siteUrl)) {
  problems.push(`SITE_URL must be absolute, received "${siteUrl}".`);
}

const indexable = env.INDEXABLE;
if (indexable === undefined || indexable === '') {
  problems.push(
    'INDEXABLE is not set. It must be the exact string "true" or "false". ' +
      'It gates whether placeholder business data reaches search engines.',
  );
} else if (indexable !== 'true' && indexable !== 'false') {
  problems.push(
    `INDEXABLE must be exactly "true" or "false", received "${indexable}". ` +
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
