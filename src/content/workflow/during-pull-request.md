---
layout: "../../layouts/Layout.astro"
title: During pull request
description: How to review a pull request
sidebar: { order: 6 }
---

# During pull request review

Chromatic automates UI development so you can build more features, faster, and with less manual work. Here’s the recommended workflow that takes full advantage of everything we have to offer.

![Chromatic workflow](../../images/chromatic-workflow.png)

### 4. UI Review to get team sign off

![Assign reviewers to get feedback](../../images/ui-review.png)

In tools like GitHub, Gitlab, and Bitbucket you assign other devs to review the code for a pull request. Chromatic complements this workflow by allowing you to assign designers, PMs, and other stakeholders to review UI changes in that pull request.

Review is the opportunity to discuss changes and get final team sign off. In the past, teams had to manually click through the UI to review all possible variations. Chromatic's superpower is that it knows exactly which stories have changed. It generates a changeset for your reviewers that shows precisely what they need to review. This speeds up the sign off process.

[UI Review](/docs/review) is essential because developers often run into edge cases or technical hurdles that your team didn't consider.

For UI Review, Chromatic shows you a branch vs branch comparison. That is, what will change on the base branch when you merge this PR.

<details>
<summary>How do I invite collaborators to my project?</summary>

To add or remove collaborators, go to the collaborate tab on your project's Manage page. You can invite them by email or by sharing an invite link.

[More on inviting collaborators »](/docs/collaborators#external-collaborators)

</details>

<details>
<summary>How to assign designers and PMs to review?</summary>

Use the Assign Reviewers link on the PR Activity page to choose reviewers from the project’s collaborators. Reviewers will be emailed a link to the PR screen to begin their review.

![assign reviewers by picking from your list of collaborators](../../images/prscreen-assign-reviewers.png)

</details>

<details>
<summary>How do I track requested changes?</summary>

Reviewers can request changes to the implementation via the comment box beneath each story. These get aggregated at the bottom of the PR screen’s activity tab. Developers can see a [list of tasks](/docs/review#ui-checklist) which must be completed before UI is ready to merge.

![UI Review checklist](../../images/prscreen-ui-checklist.png)

</details>

### 5. Merge with confidence with PR checks

Chromatic will badge PRs to notify you about publish, test, and review results. Once all checks are complete, you’re ready to merge!

![PR badges](../../images/prbadges.png)

### 6. Publish and share your Storybook

During the build process, Chromatic builds and publishes your Storybook to its secure workspace (CDN) accessible to your entire team. That keeps everyone in sync with the latest UI implementation. No fussing with dependencies, git, or local dev environments.

- [Share permalinks with collaborators](/docs/permalinks#share-permalinks-with-collaborators)
- [Custom domain for your Storybook](/docs/permalinks#custom-domain-for-your-storybook)

The published Storybook is a shared reference point for your entire team, making cross-discipline collaboration easier.

#### Document your components

Storybook can automatically [generate UI documentation](https://storybook.js.org/docs/react/writing-docs/introduction) for components. These pages will contain stories rendered as live examples, as well as an interactive "args" table that showcases the component API. Customize the generated docs with additional prose. With Chromatic, you'll get shareable docs URL for your team to reference.

---

## How to get stakeholders involved in review

See how Chromatic works from the reviewer point of view. See how easy it is to keep teams in the loop. Learn about comments, notifications, and integrations with tools like Figma or Slack.

<a class="btn primary round" href="/docs/during-pull-request">Read next chapter</a>
