---
sidebar: { hide: true }
title: How can I automatically trigger a UI Review?
section: 'uiTestsAndReview'
sectionOrder: 1
---

# How can I automatically trigger a UI Review?

UI Reviews are triggered automatically when your project is [linked](/docs/access#linked-projects) to a Git provider like GitHub, GitLab, or Bitbucket. This connection enables Chromatic to track changes, compare them against the existing codebase, and automatically start a UI Review when a new pull/merge request is created.

One exception: [GitHub Enterprise Server connections](/docs/access#git-linked-accounts) don't trigger UI Reviews when a pull request opens; reviews are still created automatically when a build runs on the pull request branch.

Without linking to a Git provider, you will need to use the [manual UI Review](/docs/manual-ui-review) process.
