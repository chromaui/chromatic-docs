---
name: upgrade-ci-versions
description: Upgrade container images, Node.js versions, and package versions in CI code examples, then open a PR
---

Upgrade all versioned references in CI code examples under `src/content/ci/`. Then open a PR with the changes.

## What to upgrade

Scan every `.md` and `.mdx` file in `src/content/ci/` for the following patterns and upgrade each to its latest stable/LTS version:

| Pattern                       | Example                                      | Where to look up latest                                                                                                                              |
| ----------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js version number        | `node-version: 24.13.0`, `cimg/node:24.13.0` | https://nodejs.org/en/download/ — use latest **LTS** release                                                                                         |
| Node.js Docker image codename | `node:krypton` (GitLab)                      | https://hub.docker.com/_/node/tags — use latest LTS codename                                                                                         |
| Playwright Docker image       | `mcr.microsoft.com/playwright:v1.58.0-noble` | https://playwright.dev/docs/docker or https://hub.docker.com/_/microsoft-playwright — match the version to the latest `@playwright/test` npm release |
| `actions/checkout`            | `actions/checkout@v4`                        | https://github.com/actions/checkout/releases                                                                                                         |
| `actions/setup-node`          | `actions/setup-node@v4`                      | https://github.com/actions/setup-node/releases                                                                                                       |
| `actions/upload-artifact`     | `actions/upload-artifact@v4`                 | https://github.com/actions/upload-artifact/releases                                                                                                  |

## Steps

1. **Check current versions** — grep `src/content/ci/` to find every pinned version. Note each unique value and which files it appears in.

2. **Look up latest versions** — for each type above, fetch the latest stable version from the authoritative source. Use `WebFetch` or `WebSearch` to resolve current versions.

3. **Update all files** — make the replacements consistently across all CI files. A version like `24.13.0` will appear in multiple files; update every occurrence. Keep the surrounding syntax unchanged (only the version string changes).

4. **Summarize the changes** — list every substitution made: old value → new value, and which files were affected.

5. **Open a PR** — follow the `create-pr` skill to push the branch and open a draft PR. Title format: `chore: upgrade CI code example versions (<date>)`. The PR body summary should list the version bumps as bullet points.
