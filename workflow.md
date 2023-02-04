---
layout: default
title: Workflow
description: Learn the Chromatic workflow
---

# How to use Chromatic

Chromatic automates UI development so you can build more features, faster, and with less manual work. Here’s the recommended workflow that takes full advantage of everything we have to offer.

[![Chromatic workflow](img/chromatic-workflow.png)](img/chromatic-workflow.png)

### 1. Build in Storybook

Build UI components in isolation with Storybook. Implement [Component-driven development](https://www.componentdriven.org/), a process for building UIs from the “bottom up,” starting with atomic components and ending with pages.

In doing this, you’ll have captured all component states and variations as stories. Chromatic then uses these stories as test cases.

- [How to write stories?](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Simulate user interactions (e.g., clicks and inputs) in stories using a play function](https://storybook.js.org/docs/react/writing-stories/play-function)
- [Building pages with Storybook](https://storybook.js.org/docs/react/writing-stories/build-pages-with-storybook)
- [Stories are tests](https://storybook.js.org/blog/stories-are-tests/)

### 2. Run Chromatic

Once you've finished the first iteration of the implementation, open a pull request and run a Chromatic build.

We recommend [configuring your CI](ci) to run a Chromatic build whenever you push code to get the most out of Chromatic.

<details>
<summary>How often should I run Chromatic?</summary>

We recommend running Chromatic on every push. This ensures that Chromatic is regularly updating baselines and can catch unintentional changes.

Each snapshot is associated with a commit. That enables you to pinpoint the particular commit where a change was introduced.

It also allows you to [visualize baseline history](branching-and-baselines#visualize-baseline-history). You can review the commits to see how a component changes over time.

Not running Chromatic on every commit makes it harder to review diffs and increases the risk of missing changes.

Let's say you run Chromatic on a commit. Then skip it for four commits and then rerun it. The Chromatic build for that fifth commit will also include changes from all the previous four commits. That makes it much harder to discern what is an acceptable change vs a UI bug.

</details>

<details>
<summary>How do I budget snapshots?</summary>

Our main recommendation is to use Chromatic’s [TurboSnap](turbosnap#turbosnap) feature. It uses Git and your project’s dependency graph to identify component files that changed, then intelligently builds and snapshots only the stories associated with those components.

This enables you to run Chromatic regularly while reducing the snapshot count per build.

</details>

### 3. UI Test to catch bugs

Changes in development are inevitable, and bugs can easily slip in, especially with UIs. A small tweak to the CSS can cause a component or one of its states to break. Even worse, the bug can have a cascading effect cause other components and pages to break.

![visual bugs are inevitable](img/visual-bugs.gif)

Tests are typically used to verify logic. That makes sense; you run a function, get its output, and determine if it is correct or not. Computers are great at verifying data. But what about how something looks?

Chromatic’s UI tests are designed to catch changes in UI appearance aka visual bugs.

<details>
<summary>What are visual bugs?</summary>

Visual bugs are the unintentional errors in your UIs appearance that make it look untrustworthy. For example: cut-off elements, incorrect colors or font styles, broken layouts, and missing error states.

</details>

#### Use stories as test cases

You use Storybook to isolate UI components, mock their variations, and save the supported test cases as stories. Chromatic then captures a snapshot of each story in a cloud browser.

#### Developers verify UI changes

UI Tests are similar to other types of testing (unit, E2E, etc.), in that they enable developers to catch and fix regressions.

UI Tests compare the snapshot of a story commit with the previously accepted [baseline](branching-and-baselines#branches-and-baselines) in your git history (typically on the same branch). Upon completion, you can review the diff. If the changes are intentional, press the accept button to update the baselines.

<details>
<summary>How can I test user interaction with Chromatic?</summary>

In most cases you can supply props to a component to render a particular state as a story. But some component variations can not be reproduced with props alone; they require user interaction. For example drop-downs, modals, and form elements.

[Interactive stories](interactions) enable you to test how components respond to user input. You can then attach a [play function](https://storybook.js.org/docs/react/writing-stories/play-function) to the story to simulate user behavior (e.g., clicks and inputs) and run assertions.

Interaction tests run behind the scenes without you having to configure anything. You'll be notified of any test failures via the Chromatic UI.

These are designated as critical failures that need immediate attention. You won't be able to pass the build until the test is fixed.

To debug, you can launch the published Storybook to reproduce the exact state of your story when the test failed. Click the "View Storybook" button on the test page to open the failed story.

![Storybook with failed interaction test](img/interaction-test-screen-failed-test.png)

</details>

Once all changes are approved, the UI is considered “ready” and you can move to the review phase.

### 4. UI Review to get team sign off

![Assign reviewers to get feedback](img/ui-review.png)

On your Git provider (GitHub, Gitlab, Bitbucket, etc.) you assign other devs to review the code for a pull request. Chromatic allows you to assign designers, PMs, and other stakeholders to review the UI changes associated with that pull request. Review is the opportunity to get qualitative feedback on changes from your team and get a final sign off.

Developers often fill in edge cases and overcome technical hurdles while coding. These challenges may not be apparent just by looking at the code, and it can be difficult to manually click through the UI to ensure that all possible variations are reviewed. Chromatic's superpower is that it knows exactly which stories have changed, so it can show the reviewer precisely what they need to review, simplifying the approval process.

For [UI Review](review), Chromatic shows you a branch vs branch comparison. That is, what will change on the base branch when you merge this PR.

<details>
<summary>How do I invite collaborators to my project?</summary>

To add or remove collaborators, go to the Project > Collaborators screen. You can invite them by email or by sharing an invite link.

[More on inviting collaborators »](collaborators#external-collaborators)

</details>

<details>
<summary>How to assign designers and PMs to review?</summary>

Use the Assign Reviewers link on the PR Activity screen to choose reviewers from the project’s collaborators. Reviewers will be emailed a link to the PR screen to begin their review.

![assign reviewers by picking from your list of collaborators](img/assign-reviewers.gif)

</details>

<details>
<summary>How do I track requested changes?</summary>

Reviewers can request changes to the implementation via the comment box beneath each story. These get aggregated at the bottom of the PR screen’s activity tab. Developers can see a [list of tasks](review#ui-checklist) which must be completed before UI is ready to merge.

![UI Review checklist](img/prscreen-ui-checklist.png)

</details>

### 5. Merge with confidence with PR checks

Chromatic will badge PRs to notify you about publish, test, and review results. Once all checks are complete, you’re ready to merge!

![PR badges](img/prbadges.png)

### 6. Publish and share your Storybook

During the build process, Chromatic builds and publishes your Storybook to its secure workspace (CDN) accessible to your entire team. That keeps everyone in sync with the latest UI implementation. No fussing with dependencies, git, or local dev environments.

- [Share permalinks with collaborators](permalinks#share-permalinks-with-collaborators)
- [Custom domain for your Storybook](permalinks#custom-domain-for-your-storybook)

The published Storybook is a shared reference point for your entire team, making cross-discipline collaboration easier.

#### Document your components

Use the [Storybook Docs addon](https://storybook.js.org/docs/react/writing-docs/introduction) to automatically generate documentation pages for each component in your Storybook. These pages will contain stories rendered as live examples, as well as an interactive ArgsTable that visualizes the component API. You can also add additional prose or customize the documentation pages as your needs evolve.

![Autogenerated documentation for a Histogram component](img/storybook-docs.png)

#### Connect Storybook and Figma

[Storybook Connect](figma#figma-plugin) is a Figma plugin that allows you to link stories to Figma components. Once linked, you can view your live stories in the design workspace without leaving Figma.

![Embedded story and design side-by-side](img/sb-connect.gif)

#### Embed stories to showcase your work

[Embed](embed#embed-stories) stories in Medium articles, Notion pages, and countless other platforms that support oEmbed. You get to interact with live rendered components instead of static images.

![Embed stories in wikis, Markdown and custom sites](img/embed-stories.png)

---

## Conclusion

You finished setting up Chromatic. We look forward to the incredible UIs you'll build.

#### Our most popular guides and articles

- [Intro to Storybook](https://storybook.js.org/tutorials/intro-to-storybook/) is the essential guide to learning Storybook.
- [Design Systems for Developers](https://storybook.js.org/tutorials/design-systems-for-developers/) shares how to build production infrastructure for design systems.
- [Visual Testing Handbook](https://storybook.js.org/tutorials/visual-testing-handbook/) details how professional frontend teams visual test with Storybook.
- [Component-Driven Development](https://www.componentdriven.org/) is a "bottoms up" process for building modular UIs starting from components and ending with screens.
- [UI Testing Handbook](https://storybook.js.org/tutorials/ui-testing-handbook/) highlights testing strategies used by scaled front-end teams

#### How to get support

You're supported by the team behind Storybook. For the quickest response, [login](https://www.chromatic.com/start) and use the in-app chat or <a href="mailto:support@chromatic.com?Subject=Question">email</a>.
