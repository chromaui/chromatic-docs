---
name: docs-link-check
description: >-
  Write or edit Chromatic docs content AND verify every internal link and anchor
  it contains resolves against the real local build — before the change is
  committed. Use whenever you add, edit, move, or rename a page under
  src/content/**, add or change cross-references between docs pages, change a
  heading that other pages may link to (#anchors), or are asked to "check the
  links", "verify the links work", "did I break any links", or review a docs PR
  for broken links. Catches broken links in UNMERGED edits, which `pnpm
  check-links` (production-only) cannot.
---

# Docs link check

## What this skill is for

In this repo, internal links use **derived slugs**, not file paths:

- `src/content/ci/ci.mdx` → `/docs/ci`
- `src/content/playwright/configure.mdx` → `/docs/playwright/configure` (prefix kept to avoid a collision with `cypress/configure` and `configuration/configure`)

So "does `[Configure](/docs/configure#options)` resolve?" is **not** answerable by
eyeballing the prose. There are ~577 `/docs/` links and ~200 relative links across
~213 files, plus `#anchors` that depend on heading text. The existing
`pnpm check-links` runs `blc` against **production**, so it is blind to a link you
just wrote and have not deployed.

This skill closes that loop: it **generates/edits the content** and then
**verifies every internal link and anchor** against the actual build output, then
fixes or reports what is broken. Authoring and verification are one workflow.

## When to trigger — examples

- "Add a section to `turbosnap.mdx` linking to the Modes and TurboSnap setup pages."
  → write the section, then verify the new links/anchors resolve.
- "I renamed `setup-turbosnap.mdx`. Did I break anything?"
  → check every page that links to the old slug.
- "Review this docs PR for broken links before I merge."
  → run the verifier over the changed files.
- "Update the CI guide and make sure the cross-references still work."
- "Does `/docs/configure#options` still exist?"
- Any edit that adds, removes, or renames an `## Heading` other pages might anchor to.

Do **not** trigger for external URL health (that is `pnpm check-links` against prod)
or for prose-only edits that add no links and touch no headings.

## Workflow

### 1. Generate / edit the content

Make the requested content change normally. Follow repo conventions:

- Internal links use the slug route, e.g. `[Snapshots](/docs/snapshots)`,
  `[Options](/docs/configure#options)`. Anchors are the slugified heading text.
- Required frontmatter: `title`, `description` (see `src/content.config.ts`).
- Prefer `/docs/<slug>` absolute links over relative `../` links for cross-page
  references — they are what the corpus overwhelmingly uses and are slug-stable.

### 2. Verify (the build is handled for you)

```bash
# Default: only the files you changed (vs git HEAD)
node scripts/verify-internal-links.mjs --changed

# Or target specific files you just wrote:
node scripts/verify-internal-links.mjs src/content/turbosnap/turbosnap.mdx

# Or the whole corpus (e.g. after a rename):
node scripts/verify-internal-links.mjs --all
```

The verifier resolves links against `dist/`, the **authoritative** route + anchor
map. Astro's slug rules are not uniform, so re-deriving them by hand is unreliable;
instead each built page embeds its source path, giving an exact
`source file → route → anchors` mapping.

You do **not** need to run `pnpm build` yourself. The verifier compares the mtime of
your source (every `src/content/**`, `src/content.config.ts`, `astro.config.mjs`,
`chromatic-config/options.json`) against the last build and **auto-runs `pnpm build`
only when the build is missing or stale** — an unchanged build is reused, so you pay
for a rebuild only when your edits actually changed routes or anchors. Pass
`--no-build` to skip the auto-build (it then exits `2` if `dist/` is stale), e.g. in
CI where the build is a separate step.

The verification step reports four problem classes and exits non-zero if any
**broken** finding is present:

| Finding         | Meaning                                                            | Action                              |
| --------------- | ------------------------------------------------------------------ | ----------------------------------- |
| `BROKEN_LINK`   | `/docs/<slug>` route or relative file does not exist in the build  | **fix** — wrong slug / page missing |
| `BROKEN_ANCHOR` | Target page exists but the `#anchor` (heading/summary/id) does not | **fix** — wrong/renamed heading     |
| `BROKEN_FILE`   | Relative asset (image, etc.) not found on disk                     | **fix** — wrong path                |
| `OFF_SITE`      | Absolute path outside `/docs` — informational, not checked         | review manually                     |

Plus a `⚠ Not in current build` note for pages whose source isn't in the current
`dist/` (rebuild to confirm their own in-page `#anchors`).

### 3. Fix and re-verify

For every `BROKEN_*` finding:

- `BROKEN_LINK`: find the correct slug. The real slug for a file is its built
  route — `grep -rl "## Heading Text" src/content` or check `dist/<route>/`. Common
  mistake: assuming the slug is the filename when the route keeps a collection
  prefix (`/docs/playwright/configure`, not `/docs/configure`).
- `BROKEN_ANCHOR`: open the target page, confirm the exact heading, re-slugify
  (lowercase, spaces→`-`, punctuation stripped — github-slugger rules).
- `BROKEN_FILE`: correct the relative path to the asset in `src/images/` or `public/`.

Re-run the verifier until it exits 0. **Do not report the content change as done
until verification passes.** Report the final verifier summary line as evidence.

## Notes

- `--json` emits machine-readable output for use in other tooling or PR comments.
- Exit codes: `0` clean · `1` broken link(s) · `2` no `dist/` (build first).
- The verifier only judges **internal** links + on-disk assets. External
  `https://` links remain the job of `pnpm check-links` against production.
