---
layout: default
title: Workflow
description: Learn the Chromatic workflow
---

# Chromatic workflow

Chromatic automates maintaining a UI component library so you can develop more features with less manual work. Here's the recommended workflow that takes full advantage of everything we have to offer.

### 1. Build in Storybook

Build UI components in isolation with Storybook. Use [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), a process for building UIs from the "bottom up" starting with components and ending with screens.

### 2. Publish on Chromatic

Publish Storybook to a secure workspace (CDN) that's accessible to your entire team. That keeps everyone in sync with the latest UI implementation. No fussing with dependencies, `git`, or local dev environments.

### 3. UI Test to catch bugs

Once Storybook is published in the cloud, Chromatic's cloud infrastructure can automate UI tests to catch regressions. Developers find and fix UI bugs during development. When the tests pass, the UI is considered "ready" and moves on to review.

### 4. UI Review to get team sign off

Now that the UI has no obvious flaws, bring in designers, PMs, and other stakeholders to confirm that the UI meets specifications. Developers often fill in edge cases and overcome technical hurdles while coding. Review is the opportunity to sync those updates with teammates to get a final sign off before merging.

### 5. Document to reuse later

When the UI is production-ready, document it so future developers don't have to rebuild the same thing. This is automatic with Chromatic. Every component is documented, versioned, and searchable in the cloud.

<div class="aside">Tip: Use <a href="https://github.com/storybookjs/storybook/tree/next/addons/docs" target="_blank">Storybook Docs</a> to auto-generate minimum viable docs which can be further customized as your needs grow.</div>

### 6. Merge with confidence

🚀 You're ready to merge! When you build components in Storybook you also unlock Chromatic's automated cloud services for testing, review, and documentation.

---

## Conclusion

You're ready to get the most out of Chromatic. As Chromatic customers, you'll be supported by from the team behind Storybook. Don't hesitate to ask questions via our in-app chat or [email](mailto:support@chromatic.com?Subject=Question). Continue learning about UI component best practices by reading our in-depth guides and articles.

- [Intro to Storybook](https://www.learnstorybook.com/intro-to-storybook/) is the essential guide to learning Storybook.
- [Design Systems for Developers](https://www.learnstorybook.com/design-systems-for-developers/) shares how to build production infrastructure for design systems.
- [Visual Testing Handbook](https://www.learnstorybook.com/visual-testing-handbook/) is a detailed walkthrough about visual testing with Storybook.
- [The Delightful Storybook Workflow](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) Learn how productive teams get the most out of Storybook. Featuring devs from Squarespace, Discovery Network, Major League Soccer, Apollo GraphQL, Storybook, and Chromatic.
- [UI Component Playbook](https://blog.hichroma.com/ui-component-playbook-fd3022d00590) a 5-step guide to designing and engineering frontends with components
- [Visual Test-Driven Development](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87) how visual testing helps your team build robust UIs faster.
