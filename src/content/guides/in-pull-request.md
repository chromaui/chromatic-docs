---
title: In pull request workflow
description: How Chromatic helps you test and review pull requests
sidebar: { order: 2, label: PR workflow }
---

# In pull request workflow

Chromatic serves as a single hub that allows you to test, approve PRs, and share feedback. During the pull request, Chromatic automatically runs in CI when you push code. There are two key workflows: UI Tests and UI Review.

![Chromatic workflow](../../images/chromatic-during-pull-request.jpg)

### UI Tests catch bugs automatically

[UI Tests](/docs#test-how-uis-look--function) prevent visual and functional bugs. They're similar to other types of testing (unit, E2E, etc.), in that they enable developers to catch and fix regressions. UI Tests run in CI automatically when you push code so you can see the impact of code changes on the user interface while you develop.

| UI Tests     | What dimensions are tested                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual       | [Browsers](/docs/browsers), [Viewports](/docs/viewports), [Themes](/docs/themes), [Locales](/docs/custom-decorators), [CSS Media Features](/docs/media-features) |
| Interactions | [Click, type, hover](/docs/interactions)                                                                                                                         |

![Build with unreviewed tests](../../images/build-test-unreviewed.png)

UI Tests compare the snapshot of a story with the previously accepted [baseline](/docs/branching-and-baselines#whats-a-baseline) in your git history (typically on the same branch). If there are changes, you'll get a diff of the changes. If the changes are intentional, press the accept button to update the baselines. Once all changes are approved, UI Tests will pass, signaling that it's “ready” for review from stakeholders.

![Snapshot that’s unreviewed](../../images/snapshot-unreviewed.png)

### UI Review to get team sign off

After UI Tests pass, the workflow progresses to UI Review. In tools like GitHub, GitLab, and Bitbucket, you assign other developers to review the code for a pull request. Chromatic complements this workflow by allowing you to assign designers, product managers, and other stakeholders to review UI changes in that pull request.

<div class="aside">

UI Review is different than UI Tests because it shows you what will change on the base branch when you merge a pull request. This is identical to the difference between code review and testing in CI.

</div>

![Activity tab](../../images/prscreen-activity.png)

<details>
<summary>How to invite reviewers to a project?</summary>

Invite reviewers by going to the project's Manage page » Collaborate tab. You can invite collaborators by email or by sharing an invite link. SSO is also an option for Enterprise plans, which enables all teams to access Chromatic easily.

[More on inviting collaborators »](/docs/collaborators#external-collaborators)

</details>

<details>
<summary>How to assign designers and product managers to review?</summary>

Click on Assign Reviewers on the review's Activity tab to choose reviewers from the project’s collaborators. Reviewers will be emailed a link to the review page to begin their review.

![assign reviewers by picking from your list of collaborators](../../images/prscreen-assign-reviewers.png)

</details>

UI Review is the opportunity to discuss changes and get final team sign off. In the past, teams had to manually click through the UI to review all possible variations. Chromatic's superpower is that it knows exactly which stories have changed. It generates a changeset for reviewers that shows precisely what they need to sign off on.

![Changeset tab](../../images/prscreen-changes.png)

<details>
<summary>Why UI Review when all the edge cases should be addressed in the spec?</summary>

UI Review acknowledges that even the best laid plans lack fidelity. Developers often run into edge cases or technical hurdles that are impossible for teams to predict ahead of time.

</details>

Reviewers leave feedback and request changes by starting discussions. Chromatic helps developers gather discussions in one place that every participant can follow. Resolve a discussion to signal that the work is done. Once all discussions are resolved and stakeholders approve, the UI Review will pass.

![UI Checklist](../../images/prscreen-ui-checklist.png)

### Merge with confidence when pull request checks pass

The status of UI Tests and UI Review appears on your pull request as a check. This keeps your team abreast of any changes to the user interface that need attention. When all checks pass, you’re ready to merge!

![PR badges](../../images/prbadges.png)

<details>
<summary>How to make UI Tests and UI Review a required pull request check?</summary>

You have flexibility to control whether UI Tests and UI Review are required checks in your Git provider settings.

Make UI Tests a required check if you want to ensure that you're 100% protected from visual and functional regressions. Make UI Review a required check to ensure that all feedback gets resolved and every change is signed-off.

You can change whether each check is required separately.

</details>

---

## Conclusion

You finished touring all the ways Chromatic contributes to your UI development workflow. We look forward to the incredible UIs you’ll build. Continue exploring with our most popular guides and articles:

- [Intro to Storybook](https://storybook.js.org/tutorials/intro-to-storybook/) is the essential guide to learning Storybook.
- [Visual Testing Handbook](https://storybook.js.org/tutorials/visual-testing-handbook/) details how professional frontend teams visual test with Storybook.
- [Component-Driven Development](https://www.componentdriven.org/) is a "bottoms up" process for building modular UIs starting from components and ending with screens.
- [UI Testing Handbook](https://storybook.js.org/tutorials/ui-testing-handbook/) highlights testing strategies used by scaled front-end teams

#### How to get support

[Sign in](https://www.chromatic.com/start) to use the in-app chat or <a href="mailto:support@chromatic.com?Subject=Question">email support</a>.
