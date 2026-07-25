import { defineConfig } from 'astro/config';

// CHANGE `site` TO YOUR OWN DOMAIN BEFORE DEPLOYING.
// Everything else can stay as it is.
export default defineConfig({
  site: 'https://andolfatto.co.uk',

  markdown: {
    shikiConfig: {
      // 'css-variables' makes code blocks use the colours defined in
      // src/styles/global.css instead of a hard-coded editor theme.
      theme: 'css-variables',
      wrap: false,
    },
  },
});
