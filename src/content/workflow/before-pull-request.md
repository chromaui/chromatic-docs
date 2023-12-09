---
layout: "../../layouts/Layout.astro"
title: Before pull request
description: How to prepare a pull request
sidebar: { order: 1 }
---

# Before a pull request

Chromatic helps you prepare a pull request by verifying the appearance and functionality of a UI in different browsers, viewports, themes, and global settings.

TK new diagram for before PR workflow

### Build in Storybook, Playwright, or Cypress

Chromatic reuses your existing Storybook stories and Playwright or Cypress end-to-end tests for visual testing.

![Chromatic workflow](../../images/chromatic-workflow.png)

In Storybook, developers build UI components in isolation using [component-driven development](https://www.componentdriven.org/), a process for building UIs from the “bottom up,” starting with atomic components and ending with pages. This methodology allows you to naturally capture all component states and variations as stories as you flesh out the UI.

Chromatic uses these stories as visual test cases automatically.

TK Describe building from the component up

— show continuum of component to page » storybook helps you build

- continuum of states for each UI » viewports, themes, browsers, locales, media features, etc.

<details>
<summary>Playwright and Cypress integrations</summary>

Developers test user flows end-to-end by navigating between pages with Playwright or Cypress. This methodology allows you to simulate how users behave. Chromatic uses these E2E tests as visual tests cases by automatically snapshotting key moments in the test.

[TK Learn how to setup Playwright](/docs/)
[TK Learn how to setup Cypress](/docs/)

</details>

---

## Next: During pull request

See how Chromatic helps you get feedback, manage change requests, and get stakeholder sign off.

<a class="btn primary round" href="/docs/during-pull-request">Read next chapter</a>
