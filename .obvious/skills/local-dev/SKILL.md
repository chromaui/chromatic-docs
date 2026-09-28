---
name: local-dev
description: Durable record of how to bring chromaui/chromatic-docs local dev up from scratch
---

# Local dev — chromaui/chromatic-docs

Recorded during automated onboarding on 2026-09-28. Steps below produced a fully
verified dev environment from a fresh checkout.

## Prerequisites

1. **Node.js ≥ 22.13** — pnpm 11.17.0 (pinned in `packageManager`) imports `node:sqlite`,
   which does not exist in Node 20. If `pnpm --version` dies with
   `ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite`, the runtime is too old. Fix used:
   `curl -fsSL https://nodejs.org/dist/v22.22.0/node-v22.22.0-linux-x64.tar.xz | tar -xJ -C /usr/local --strip-components=1`
   (`/usr/local/bin` precedes `/usr/bin` on PATH; system Node stays intact).
2. **pnpm** — after Node 22, `corepack enable --install-directory /usr/local/bin`
   activates the pinned pnpm 11.17.0.
3. No `.env` or secrets are needed — the site has no runtime external services.

## Install

```bash
pnpm install   # ~5s from pnpm store; runs `lefthook install` via prepare
```

If `node_modules` is root-owned and immutable (pre-provisioned box):
`sudo rm -rf node_modules` first.

## Run

```bash
pnpm dev   # → http://localhost:4321/docs
```

- Parse the URL/port from startup output (`astro v6 ready … Local: http://localhost:4321/docs`).
- The site lives under `/docs` (Astro `base`); `http://localhost:4321/` is not the app.
- Unknown routes return a styled 404 page (expected behavior, not a failure).

## Verify (what CI checks plus browser flow)

```bash
pnpm run test:unit        # 45 tests across 5 files, ~0.5s
pnpm run diagrams:verify  # diagrams/*.mmd in sync with rendered SVGs
pnpm run format:check     # Prettier
```

Browser flow (screenshots + console-error check) used Playwright, already a devDependency:

```bash
pnpm exec playwright install chromium --only-shell
sudo pnpm exec playwright install-deps chromium   # system libs (libnspr4, …)
```

Then drive: goto `/docs` → assert title "Why Chromatic? • Chromatic docs"; goto
`/docs/access` → assert h1 "Access control"; click a visible sidebar
`a[href^="/docs/"]` link → assert navigation + title; collect console errors
(expected: none). Note homepage links like `/docs/access` exist in HTML but can be
hidden (accordion) — click only `:visible` links or navigate directly.
