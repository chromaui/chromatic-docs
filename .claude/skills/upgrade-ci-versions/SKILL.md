---
name: upgrade-ci-versions
description: Upgrade container images, Node.js versions, and package versions in CI code examples, then open a PR
---

Upgrade all versioned references in CI code examples under `src/content/ci/`, `src/content/playwright/` and `src/content/vitest`. Then open a PR with the changes.

## What to upgrade

Scan every `.md` and `.mdx` file in `src/content/ci/` for the following patterns and upgrade each to its latest stable/LTS version:

| Pattern                       | Example                                                                                | Where to look up latest                                      |
| ----------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Node.js version number        | `node-version: 24.13.0`, `cimg/node:24.13.0`                                           | https://nodejs.org/en/download/ — use latest **LTS** release |
| Node.js Docker image codename | `node:krypton` (GitLab)                                                                | https://hub.docker.com/_/node/tags — use latest LTS codename |
| Playwright Docker image       | `mcr.microsoft.com/playwright:v1.58.0-noble`                                           | https://playwright.dev/docs/docker                           |
| Cypress Docker image          | `cypress/browsers:node-24.15.0-chrome-148.0.7778.96-1-ff-150.0.3-edge-148.0.3967.54-1` | https://hub.docker.com/r/cypress/browsers/tags               |
| `actions/checkout`            | `actions/checkout@v4`                                                                  | https://github.com/actions/checkout/releases                 |
| `actions/setup-node`          | `actions/setup-node@v4`                                                                | https://github.com/actions/setup-node/releases               |
| `actions/upload-artifact`     | `actions/upload-artifact@v4`                                                           | https://github.com/actions/upload-artifact/releases          |
| `actions/download-artifact`   | `actions/download-artifact@v4`                                                         | https://github.com/actions/download-artifact/releases        |

## Steps

1. **Check current versions** — grep `src/content/ci/`, `src/content/playwright/`, and `src/content/vitest/` to find every pinned version. Note each unique value and which files it appears in.

2. **Look up latest versions** — for each type above, fetch the latest stable version from the authoritative source. Use `WebFetch` or `WebSearch` to resolve current versions.
   2.1 Skip updating the Jenkins node version in `src/content/ci/jenkins.md` because the node version is configured in the Jenkins application not in the CI code examples.
   2.2 Skip updating the Travis documentation in `src/content/ci/travis.md` because Travis CI node and Playwright are lacking official support and the documentation is outdated.
   2.3 Cypress Docker images are versioned with a combination of Node.js, Chrome, Firefox, and Edge versions. Update image to match the Node.js version you are upgrading to and always use the one with the browsers.

3. **Update all files** — make the replacements consistently across all CI files. A version like `24.13.0` will appear in multiple files; update every occurrence. Keep the surrounding syntax unchanged (only the version string changes).

4. **Summarize the changes** — list every substitution made: old value → new value, and which files were affected.

5. **Open a PR** — follow the `create-pr` skill to push the branch and open a draft PR. Title format: `chore: upgrade CI code example versions (<date>)`. The PR body summary should list the version bumps as bullet points.
