// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadLocalEnv } from './scripts/load-env.mjs';

loadLocalEnv();

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL,

  build: {
    format: 'file',
  },

  env: {
    schema: {
      SITE_URL: envField.string({ context: 'server', access: 'public' }),
      INDEXABLE: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
});
