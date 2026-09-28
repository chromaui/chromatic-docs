# chromatic-docs — Agent Guidance

Chromaui's documentation site for the Chromatic platform, published at
https://www.chromatic.com/docs/ (Astro v6 static site, Netlify-hosted, base path `/docs`).

## Stack

| Layer             | Detail                                                                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime           | Node.js ≥ 22.13 required (pnpm 11.17.0 uses `node:sqlite`). Sandbox: Node 22.22.0 installed at `/usr/local` (shadows system Node 20 at `/usr/bin/node`). |
| Package manager   | pnpm 11.17.0 (pinned via `packageManager`; lockfile `pnpm-lock.yaml`; CI uses `pnpm/action-setup`)                                                       |
| Framework         | Astro 6 + MDX + React 18 islands (Emotion, Radix UI, `@chromatic-com/tetra` design system)                                                               |
| Testing           | Vitest 4 (`unit` + `storybook` projects), Storybook 10, Playwright 1.57                                                                                  |
| External services | None required locally (no DB/Redis/env vars). Deploys to Netlify from `main` via CI.                                                                     |

## Commands

All commands run from the repo root:

| Command                    | Action                                                                      |
| -------------------------- | --------------------------------------------------------------------------- |
| `pnpm install`             | Install dependencies (lefthook git hooks installed via `prepare`)           |
| `pnpm dev`                 | Start dev server — **http://localhost:4321/docs** (port 4321, base `/docs`) |
| `pnpm build`               | Production build to `./dist/`                                               |
| `pnpm preview`             | Preview the production build                                                |
| `pnpm test`                | All tests (`test:unit` + `test:storybook`)                                  |
| `pnpm test:unit`           | Unit tests only — what CI runs                                              |
| `pnpm run diagrams:verify` | Verify `diagrams/*.mmd` are in sync with rendered SVGs                      |
| `pnpm run format:check`    | Prettier check                                                              |
| `pnpm storybook`           | Storybook dev server at localhost:6006                                      |

## Local dev notes

- Dev server URL is `http://localhost:4321/docs` — the site does not serve at `/` (Astro `base: '/docs'`); unknown routes return the custom 404 page.
- If `node_modules` exists but is root-owned, remove with `sudo rm -rf node_modules` before reinstalling.
- Browser automation needs Chromium: `pnpm exec playwright install chromium --only-shell` plus `sudo pnpm exec playwright install-deps chromium` (system libs, e.g. libnspr4).

## Local Verification Summary

Onboarding validation on 2026-09-28 (sandbox `cmp_gCClVEid`):

| Check                      | Result                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` (clean)     | ✅ success (5.2s, pnpm 11.17.0, Node 22.22.0)                                                                                                                                                                                                                                                                               |
| Dev server start           | ✅ `astro dev` ready in ~4s at http://localhost:4321/docs                                                                                                                                                                                                                                                                   |
| Primary user flow          | ✅ Browser: loaded `/docs` (title "Why Chromatic? • Chromatic docs"), navigated to `/docs/access` (h1 "Access control"), clicked visible sidebar link → `/docs/quickstart` (title "Quickstart • Chromatic docs"); zero console/page errors; 3 screenshots captured (`/tmp/screens/home.png`, `access.png`, `navigated.png`) |
| HTTP routes                | ✅ 200 for `/docs`, `/docs/access`, `/docs/access/collaborators`; correct 404 page for unknown routes                                                                                                                                                                                                                       |
| `pnpm run test:unit`       | ✅ 45/45 tests passed (5 files)                                                                                                                                                                                                                                                                                             |
| `pnpm run diagrams:verify` | ✅ diagrams in sync                                                                                                                                                                                                                                                                                                         |
| `pnpm run format:check`    | ✅ all files Prettier-clean                                                                                                                                                                                                                                                                                                 |

`dev_stack_healthy: true`

## Sandbox snapshot

- Snapshot ID: `uhupgfoorw39v6f1f11i:default`
- Captured: 2026-09-28T14:36:13.295Z
- State: clean git tree at `origin/main`, dependencies installed, dev tooling ready.

## Codebase map

See [codebase-map.md](./codebase-map.md) for the folder-level overview.
