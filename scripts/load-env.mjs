/**
 * Load .env into process.env without depending on Vite.
 *
 * Astro evaluates astro.config.mjs before it loads .env, so `site` would
 * otherwise be undefined and canonical/og:image would be emitted relative.
 * Values already in the environment win, so CI does not need a .env file.
 */
export function loadLocalEnv() {
  try {
    process.loadEnvFile();
  } catch {
    // No .env present. CI and Cloudflare supply real environment variables.
  }
}
