---
title: PR comments
description: Chromatic posts a comment on your pull request with the UI test status, change counts, and a link to your published Storybook.
sidebar: { order: 11, label: 'PR comments' }
---

# PR comments

When enabled, Chromatic posts a comment on the pull request with the number of visual and accessibility changes, the UI Review status, and a link to your published Storybook.

![A GitHub pull request comment from Chromatic showing UI Tests need review, with 2 visual and accessibility changes to accept, UI Review in progress comparing 365 stories, and Storybook Publish confirming 365 stories published](../../images/pr-comments-github-example.png)

## How it works

When a Chromatic build completes for a pull request, Chromatic posts a comment on that PR. The comment shows:

- **UI Tests:** the number of visual and accessibility changes that need to be accepted as baselines
- **UI Review:** the current review status
- **Storybook Publish:** a link to your published Storybook

The comment is created the first time a build posts results for a PR. From then on, it updates automatically with each new build on the same PR — no new comment is posted each time.

## Enable

PR comments require:

- [UI Review enabled](/docs/manual-ui-review#enable-ui-review) for the project.
- The project [linked to a GitHub repository](/docs/access#linked-projects).
- The Chromatic GitHub App (`chromatic-com`) installed with access to that repository.

Then enable PR comments from your project’s Manage screen under **Notifications**.

![The Notifications section of the Chromatic project Manage screen, with the Pull request comments option highlighted and showing an Enable button](../../images/pr-comments-manage-screen.png)

<div class="aside">

ℹ️ PR comments are currently only supported for **GitHub**. Support for other Git providers is coming soon.

</div>

## Monorepo support

For monorepos linked to multiple Chromatic projects, each project posts its own comment. Consolidation into a single comment is coming soon.

## Frequently asked questions

<details>
<summary>Why is the Enable button for PR comments disabled?</summary>

The **Enable** button is disabled and shows the message "Install the GitHub app to enable GitHub comments." when the Chromatic GitHub App (`chromatic-com`) does not have access to the repository linked to the project.

The Chromatic GitHub App is separate from the Chromatic OAuth App. Approving the OAuth App for your GitHub organization does not install the GitHub App. [Learn what each GitHub app controls »](/docs/faq/org-not-appearing#oauth-app-and-github-app)

Ask a GitHub organization owner to open **Settings » GitHub Apps » Chromatic** in the organization:

- If `chromatic-com` is installed on selected repositories, add the project’s repository under **Repository access**.
- If `chromatic-com` is not installed, [install it or request installation](/docs/faq/org-not-appearing#request-github-app-approval).

Reload the Manage screen after the owner grants access.

</details>
