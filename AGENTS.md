<!-- BEGIN:nextjs-agent-rules -->
# Next.js project rule

This project uses Next.js 16. Read the relevant local guide under `node_modules/next/dist/docs/`
before changing framework APIs or build configuration.
<!-- END:nextjs-agent-rules -->

# Aivel AI Site

## Purpose

This repository is the source of the public Aivel communication website. The primary audiences are:

- owners and executives who need timely, verifiable business signals and reliable accounting;
- enterprise finance teams buying individual AI agents and the work-control platform;
- owners of accounting companies considering partnership with Aivel.

## Product language

- Write final customer-facing copy in Russian and avoid unnecessary anglicisms.
- Lead with a recognizable job or outcome, then explain the mechanism and evidence.
- Distinguish confirmed implementation results from product intent or future capability.
- Do not publish confidential customer data, internal financial information, credentials, or
  unreviewed customer-visible claims.

## Technical stack

- Next.js 16 App Router;
- React 19 and TypeScript strict mode;
- global CSS in `src/app/globals.css`;
- static GitHub Pages export with `/aivel-ai-site` as the base path.

## Commands

- `npm run dev` — local development;
- `npm run lint` — ESLint;
- `npm run typecheck` — TypeScript;
- `npm run build` — production build;
- `npm run check` — lint, typecheck, and build.

## Implementation rules

- Preserve the established black, white, and blue visual system.
- Keep navigation, desktop, tablet, and mobile behavior consistent across all page families.
- Use `assetPath` for files in `public` so GitHub Pages base-path builds remain valid.
- Use `absoluteUrl` for public metadata and structured-data URLs.
- Keep one visible H1 per page and maintain canonical metadata.
- Verify interactions, console errors, broken assets, and horizontal overflow after UI changes.

## Publication

- `main` contains source code.
- `gh-pages` contains only the generated static artifact.
- Never copy `.env*`, source maps, local QA screenshots, `node_modules`, `.next`, or server-only API
  output into `gh-pages`.
- GitHub Pages has no server runtime. The partner form must retain its static `mailto:` fallback.
