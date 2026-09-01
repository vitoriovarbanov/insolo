import './styles/index.css';
import { env } from '@/lib/env';
import { site } from '@/content/site';
import { buildLocalBusinessJsonLd, injectJsonLd } from '@/lib/structured-data';
import { initNav } from '@/components/nav/nav';
import { initScrollReveal } from '@/lib/observer';

/**
 * Emit noindex while the business is fictional.
 *
 * Runs first, before anything that could throw, so an error later in
 * this module cannot leave the page indexable.
 */
function applyRobotsPolicy(): void {
  if (env.indexable) {
    return;
  }
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  document.head.append(meta);
}

/** Resolve canonical and OG image against the real origin. */
function applyAbsoluteUrls(): void {
  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (canonical !== null) {
    canonical.href = `${env.siteUrl}/`;
  }

  const ogImage = document.querySelector<HTMLMetaElement>(
    'meta[property="og:image"]',
  );
  if (ogImage !== null) {
    ogImage.content = `${env.siteUrl}/og/default.png`;
  }
}

applyRobotsPolicy();
applyAbsoluteUrls();
injectJsonLd(buildLocalBusinessJsonLd(site, env));

initNav();
initScrollReveal();
