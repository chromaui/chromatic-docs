---
layout: default
title: Overview
description: Chromatic is a cloud based toolchain built around Storybook to help teams develop robust UI components faster, together.
---

# Overview

![Chromatic Overview](img/overview.png){: .center }

## What is Chromatic?

Chromatic is a cloud based toolchain built around [Storybook](https://storybook.js.org) by the Storybook maintainers to help teams develop robust UI components faster, together. Once your storybook is published to Chromatic you can share it securely with colleagues for feedback, we'll run UI tests to find visual regressions, and we'll automatically detect what changed between commits so your team can review UI changes before they ship.

#### Publish

Publish Storybook to Chromatic automatically on every commit by integrating Chromatic into your CI workflow and Git hosting provider.

#### Test

Chromatic gives frontend engineers a fast, automated, low effort, cross browser, pixel-perfect regression test suite using the stories contained in their Storybook as test cases. [Learn more](test)

#### Review

Chromatic determines the set of visual changes occurring on any given feature branch and provides a rich, collaborative review process for all stakeholders -- think of it like code review for your UI. [Learn more](review)

#### Document

Chromatic maintains a shared, versionened, secure source of truth for components built in Storybook fully integrated with your Git provider of choice. Storybook can read components from Chromatic’s fast+secure CDN to provide app developers with rich, in-place documentation for their reusable components. [Learn more](document)

#### Merge

When regression tests pass and reviews are approved in Chromatic, UI components are ready to merge and ship to production.

## Why Storybook?

[Storybook](http://storybook.js.org) is an open source tool built for developing UI components in isolation and creating living, interactive component documentation. Storybook makes it trivial to reproduce hard to reach component states and ensuring those states are documented in code. Teams that have adopted Storybook benefit from automation (such as Chromatic) that is able to read component states from Storybook's standardized and open CSF format.

For those new to Storybook and isolated component development, we maintain rich guides at [learnstorybook.com](https://learnstorybook.com) for both app developers and Design System maintainers.

---

## Next: Setup Chromatic

🎉Setup Chromatic to publish your storybook (< 2 mins).

<a class="btn primary round" href="/setup">Read next chapter</a>
