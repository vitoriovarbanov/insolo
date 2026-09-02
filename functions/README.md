# functions/

Reserved for API routes. Empty by design.

**Note on shape:** this project deploys as a **Worker with static assets**,
not as Cloudflare Pages. Pages Functions — where a file at
`functions/api/contact.ts` automatically became `POST /api/contact` — do not
apply here.

On Workers, an API route means adding a Worker script and pointing
`wrangler.toml` at it:

```toml
main = "src/worker.ts"

[assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "404-page"
```

```ts
// src/worker.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request);
    }
    // everything else falls through to the static assets
    return env.ASSETS.fetch(request);
  },
};
```

Same origin as the site, so no CORS and no second host. Run it locally with:

```bash
npm run build
npx wrangler dev
```

Nothing is here yet because no decision has been made about where contact form
submissions go. There is deliberately no custom Node or Express server.
