---
title: PR comments (beta)
description: Chromatic posts a comment on your pull request with the UI test status, change counts, and a link to your published Storybook.
sidebar: { order: 8, label: "PR comments" }
---

# PR comments (beta)

When enabled, Chromatic posts a comment on the pull request with the number of visual and accessibility changes, the UI Review status, and a link to your published Storybook.

![A GitHub pull request comment from Chromatic showing UI Tests need review, with 2 visual and accessibility changes to accept, UI Review in progress comparing 365 stories, and Storybook Publish confirming 365 stories published](../../images/pr-comments-github-example.png)

## How it works

When a Chromatic build completes for a pull request, Chromatic posts a comment on that PR. The comment shows:

- **UI Tests:** the number of visual and accessibility changes that need to be accepted as baselines
- **UI Review:** the current review status
- **Storybook Publish:** a link to your published Storybook

The comment is created the first time a build posts results for a PR. From then on, it updates automatically with each new build on the same PR — no new comment is posted each time.

## Enable

PR comments require the [GitHub app to be installed and your project linked](/docs/access#linked-projects). Once that’s done, enable PR comments from your project’s Manage screen under _Notifications_.

![The Notifications section of the Chromatic project Manage screen, with the Pull request comments option highlighted and showing an Enable button](../../images/pr-comments-manage-screen.png)

<div class="aside">

ℹ️ PR comments are currently only supported for **GitHub**. Support for other Git providers is coming soon.

</div>

## Monorepo support

For monorepos linked to multiple Chromatic projects, each project posts its own comment. Consolidation into a single comment is coming soon.
