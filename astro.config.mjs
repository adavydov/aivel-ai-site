import { defineConfig } from "astro/config";

const publicSite = process.env.PUBLIC_SITE_URL ?? "https://adavydov.github.io";

export default defineConfig({
  site: publicSite,
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  redirects: {
    "/rezultaty": "/buhgalterskoe-soprovozhdenie/"
  },
  build: {
    format: "directory"
  }
});
