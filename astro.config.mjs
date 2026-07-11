import { defineConfig } from "astro/config";

const publicSite = process.env.PUBLIC_SITE_URL ?? "https://aivel-ai-site.pages.dev";

export default defineConfig({
  site: publicSite,
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  build: {
    format: "directory"
  }
});
