# Codebase Map — chromatic-docs

Single Astro app. Content-driven documentation site: Markdown/MDX collections in
`src/content/` are routed through `src/pages/[...slug].astro` and rendered by
`src/layouts/BaseLayout.astro` (header, sidebar, TOC, footer). The sidebar is
auto-generated from frontmatter (`title`, `description` required; `sidebar: { label, order, hide }`).

| Path                   | Purpose                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `.github/`             | CI: `run-tests.yml` (diagrams:verify + test:unit), `prettier.yml` (format:check), broken-link-checker, chromatic           |
| `.storybook/`          | Storybook config (`main.ts`, `preview.tsx`, vitest browser setup)                                                          |
| `chromatic-config/`    | Source of truth for Chromatic CLI config option docs; `generate-schema.ts` builds the JSON schema (with unit tests)        |
| `diagrams/`            | Mermaid `.mmd` sources, pre-rendered to SVG via Kroki with `pnpm diagrams`                                                 |
| `public/`              | Static assets served under the `/docs` prefix (CNAME, favicon, assets)                                                     |
| `scripts/`             | Node scripts: generate/verify diagrams, verify internal links, diagrams manifest                                           |
| `src/content/`         | Markdown/MDX collections: access, account, ci, configuration, guides, … (`notInNavigation/` = pages excluded from sidebar) |
| `src/components/`      | Astro layout/nav components + React islands (Emotion, Radix, Tetra); stories next to components                            |
| `src/layouts/`         | `BaseLayout.astro` — page shell with header, sidebar nav, TOC, footer                                                      |
| `src/pages/`           | `[...slug].astro` dynamic content routing                                                                                  |
| `src/utils/`           | Shared TS utilities (e.g. `llms.ts` for llms.txt generation)                                                               |
| `src/shared-snippets/` | Reusable code snippets imported in MDX files                                                                               |
| `src/images/`          | Images including rendered diagram SVGs (output of `pnpm diagrams`)                                                         |
| `src/styles/`          | Global styles                                                                                                              |
| `_site_deploy/`        | Netlify deploy extras (`_headers`, `_redirects`, `robots.txt`)                                                             |

## Key files

| File                    | Purpose                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `astro.config.mjs`      | Site URL `https://chromatic.com/docs`, `base: '/docs'`, markdown plugins, integrations |
| `src/content.config.ts` | Content collection definitions                                                         |
| `vitest.config.mjs`     | Vitest with separate `unit` and `storybook` (Playwright browser) projects              |
| `pnpm-workspace.yaml`   | pnpm settings incl. `allowBuilds` and `sharp` override                                 |
| `AGENTS.md`             | Repo guidance for coding agents (referenced by `CLAUDE.md`)                            |
