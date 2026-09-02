# inSolo

Marketing landing page for inSolo, a solar installation company.
Single-page scroller. No framework — TypeScript, CSS and HTML, built by Vite.

> **inSolo is currently fictional.** Business details in `src/content/site.ts`
> are placeholders, the site is served `noindex`, and structured data is
> suppressed. Read "Before launch" at the bottom before changing
> `VITE_INDEXABLE`.

## Requirements

Node 24 — `nvm use` reads `.nvmrc`.

## Setup

```bash
npm ci
cp .env.example .env
npm run dev
```

## Scripts

| Command             | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Vite dev server with HMR, opens on :5173 |
| `npm run build`     | Type-check, then build to `dist/`        |
| `npm run preview`   | Serve the built `dist/` locally          |
| `npm run typecheck` | `tsc --noEmit`                           |
| `npm test`          | Vitest, once                             |
| `npm run lint`      | ESLint and Prettier check                |
| `npm run format`    | Prettier write                           |

Run one test file: `npx vitest run tests/contrast.test.ts`

`build` runs `typecheck` first and short-circuits on failure. **This matters:**
Vite transpiles TypeScript with esbuild, which strips types without checking
them, so `vite build` alone emits working JavaScript from code that does not
type-check. Never remove the `typecheck &&` prefix.

## Pages

- `/` — the landing page
- `/styleguide.html` — every design token and component primitive. Internal:
  unconditionally `noindex` and absent from `sitemap.xml`. Components are built
  here so all their states get built, and palette changes get reviewed here.

## Styling

Plain CSS, no preprocessor. Everything is imported through
`src/styles/index.css`, which declares the cascade layer order:

```
@layer reset, base, layout, components, utilities;
```

Conflicts are resolved by **which layer a rule lives in**, not selector weight.
Do not reach for `!important` — move the rule to the correct layer. The one
sanctioned `!important` is the `prefers-reduced-motion` override in
`base/reset.css`, which must beat every component rule.

Tokens are three tiers and the direction is one-way:

```
tokens/primitives.css   raw values   --copper-500, --space-m, --step-2
tokens/semantic.css     roles        --color-action, --color-text-muted
components/*.css        usage        background: var(--color-action)
```

**Components reference semantic tokens only, never primitives.** Retuning the
entire brand colour to match the logo touched three files and zero component
CSS — that property is the point of the system, so don't break it.

Colours are authored in OKLCH. Contrast ratios are asserted in
`tests/contrast.test.ts`, which converts OKLCH to sRGB and checks WCAG AA.
**If you change a palette value, run that test.** It has already caught three
real failures.

Mobile-first: base styles are the small-screen case and every media query is
`min-width`. Breakpoints are tokens, and there are two.

## Assets

- `public/` — copied verbatim, filenames preserved. For anything referenced by
  a stable external URL: favicons, `robots.txt`, `sitemap.xml`, OG images
  (cached by third parties), `_headers`, `404.html`.
- `src/assets/` — imported from TS or CSS, content-hashed by Vite for permanent
  caching.

`src/assets/images/insolo-logo-master.webp` is the untouched original logo. It
is imported nowhere, so Vite never bundles it; it exists so the header lockup
can be re-cut without going back to the designer.

## Deployment

**Cloudflare Workers with static assets** — not Cloudflare Pages.

Cloudflare now directs new projects to Workers; Pages still runs but receives
no further feature investment. Workers serves static assets from the edge with
the same free unlimited static requests, and keeps the site and any future API
on one origin.

Builds run from `main`; pull requests get preview URLs.

### Configuration

`wrangler.toml` is the whole deploy config:

```toml
name = "insolo"
compatibility_date = "2026-09-01"

[assets]
directory = "./dist"
not_found_handling = "404-page"
```

`not_found_handling = "404-page"` serves the real `public/404.html`. Do **not**
change it to `single-page-application` — that returns `index.html` with a 200
for every bad URL, which hides broken links and lets search engines index
unlimited duplicate pages.

No `main` script is needed while the site is purely static.

### Dashboard settings

| Field            | Value                 |
| ---------------- | --------------------- |
| Build command    | `npm run build`       |
| Deploy command   | `npx wrangler deploy` |
| Output directory | `dist`                |

Build environment variables, for both Production and Preview:

| Name             | Value                                     |
| ---------------- | ----------------------------------------- |
| `VITE_SITE_URL`  | `https://insolo.vitorio-0405.workers.dev` |
| `VITE_INDEXABLE` | `false`                                   |
| `NODE_VERSION`   | `24`                                      |

`scripts/check-env.mjs` runs before Vite and **fails the build** if either
variable is missing or malformed. Without it the failure is silent and much
worse: Vite inlines the missing value as `undefined`, the build exits 0, and
the page renders blank in the visitor's browser with the `noindex` meta never
applied.

Deploy from your machine with `npm run deploy`, or check a config change
without shipping:

```bash
npx wrangler deploy --dry-run
```

### API routes

`functions/` is a placeholder. **Pages Functions do not apply here** — on
Workers, an API route means adding a Worker script and pointing `main` at it.
See `functions/README.md` for the shape. Run locally with `npm run cf:dev`.

### Caching

`public/_headers` is supported by Workers static assets exactly as it was by
Pages. It sets the split: hashed assets under `/assets/*` are immutable for a
year, HTML must revalidate. Caching HTML is the classic reason a deploy appears
not to have shipped.

## Before launch

- [ ] Replace every `TODO` in `src/content/site.ts` with real details
- [ ] Replace the invented figures in `site.ts` `readouts` — they are public
      performance claims, not decoration
- [ ] Get an **SVG** version of the logo; the PNG lockup is 45 kB
- [ ] Replace `public/og/default.png` with a designed 1200×630 image
- [ ] Set `VITE_INDEXABLE=true` in the Cloudflare dashboard
- [ ] Update `public/robots.txt` to allow crawling — instructions are in the file
- [ ] Point `VITE_SITE_URL`, `robots.txt` and `sitemap.xml` at the real domain
- [ ] Validate the JSON-LD with Google's Rich Results Test
- [ ] Decide where contact form submissions go, and add a privacy policy (GDPR)
- [ ] Run Lighthouse on mobile; Accessibility 100, Performance 95+
