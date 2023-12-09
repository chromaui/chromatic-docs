---
layout: "../../layouts/Layout.astro"
title: Before pull request
description: How to prepare a pull request
sidebar: { order: 1 }
---

<!-- # The Chromatic workflow guide -->
<!-- ![Chromatic workflow](../../images/chromatic-workflow.png) -->

# Before pull request

This guide walks through the recommended Chromatic workflow. Since Chromatic automatically tests your stories, to get the most out of Chromatic let's take a look at how to best use Storybook.

### Develop UIs with Storybook

Every team is different and so is their workflow. Storybook is designed to be incrementally adoptable. Teams can start using Storybook to develop parts of their UI and expand as needed.

Most teams choose a [Component-Driven](https://componentdriven.org/) workflow. UIs are developed in isolation from the “bottom up” starting with basic components then progressively combined to assemble pages.

1. Build each component in isolation and write stories for its variations.
2. Compose small components together to enable more complex functionality.
3. Assemble pages by combining composite components.
4. Integrate pages into your project by hooking up data and business logic.

<details>
<summary>Also integrates with Playwright and Cypress</summary>

Developers test user flows end-to-end by navigating between pages with Playwright or Cypress. This methodology allows you to simulate how users behave. Chromatic uses these E2E tests as visual tests cases by automatically snapshotting key moments in the test.

[TK Learn how to setup Playwright](/docs/)
[TK Learn how to setup Cypress](/docs/)

</details>

### Analyze each story in multiple dimensions

Once key UI states are captured as stories, verify how each story renders in different environments and settings. This simulates how real users would experience the UI.

| Dimension      | What to test                              |
| -------------- | ----------------------------------------- |
| Browsers       | Chrome, Safari, Edge, Firefox             |
| Viewports      | Mobile, tablet, desktop                   |
| Themes         | Dark mode, light mode, and custom themes  |
| Locales        | Languages, text direction                 |
| Media features | `forced-colors`, `prefers-reduced-motion` |

### Create a library of test cases

In the steps above, you developed UI and manually verified each story's appearance and functionality. Chromatic helps you automate this manual process. It creates a library of test cases from your stories. Every time you push code, the library is tested for changes.

![Component library](../../images/library.png)

---

## Next: During pull request

See how Chromatic helps you get feedback, manage change requests, and get stakeholder sign off.

<a class="btn primary round" href="/docs/during-pull-request">Read next chapter</a>
