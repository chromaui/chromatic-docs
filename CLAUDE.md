# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Production build to ./dist/
pnpm preview          # Preview built site

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests only (vitest)
pnpm test:storybook   # Storybook component tests (vitest + Playwright)

# Other
pnpm storybook        # Storybook dev server at localhost:6006
pnpm check-links      # Check for broken links against prod
```

## Architecture

This is an **Astro v6 documentation site** for the Chromatic platform, hosted on Netlify. The base path is `/docs`.

### Content System

Content lives in `src/content/` as Markdown/MDX files, organized into collections (e.g., `visualTests/`, `ci/`, `configuration/`). Collections are defined in `src/content.config.ts`.

Each file's frontmatter controls its presence in the sidebar:

```yaml
title: "Page Title" # required
description: "..." # required
sidebar:
  label: "Short Label" # optional override for nav label
  order: 1 # controls sort order in sidebar
  hide: true # hide from sidebar
isHidden: true # hide from search
```

Files prefixed with `_` are excluded from collection discovery. The `notInNavigation/` collection is for pages that exist but shouldn't appear in the sidebar.

The `troubleshooting/` collection has extra fields (`section`, `sectionOrder`) for FAQ grouping.

### Routing

`src/pages/[...slug].astro` handles all dynamic content routing. It fetches all collection entries, maps them to slugs, and renders them through `src/layouts/BaseLayout.astro` (which includes the header, sidebar nav, table of contents, and footer).

### Components

- **Astro components** (`.astro`) — layout, navigation, static wrappers
- **React components** (`.tsx`) — interactive UI using Emotion for styling, Radix UI primitives, and the internal `@chromatic-com/tetra` design system. Use `client:load` or `client:only="react"` directives in Astro files to hydrate React components.

### Markdown Features

Shiki handles syntax highlighting with these special comment annotations:

- `[!code ++]` — mark added lines
- `[!code --]` — mark removed lines
- `[!code highlight]` — highlight lines

Code blocks support `title="filename"` via `remark-code-title`. Mermaid diagrams are rendered via `@beoe/rehype-mermaid`.

Reusable code snippets live in `src/shared-snippets/` and can be imported in MDX files.

### Testing

- Unit tests: `src/**/*.test.{ts,tsx}` and `chromatic-config/**/*.test.ts`
- Storybook tests: stories in `src/components/**/*.stories.tsx`, run via Playwright browser plugin
- Config: `vitest.config.mjs` with separate `unit` and `storybook` projects

### Key Config Files

| File                            | Purpose                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `astro.config.mjs`              | Astro config: site URL, markdown plugins, integrations             |
| `vitest.config.mjs`             | Vitest config with Storybook + Playwright setup                    |
| `chromatic-config/options.json` | Source of truth for CLI config option docs (auto-generates schema) |
| `.storybook/`                   | Storybook configuration                                            |
