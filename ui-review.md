---
layout: default
title: UI Review
description: Learn how to review changes for your component library
---

# UI Review

UI tests protect your project from accidental regressions. However, before you're ready to ship, you'll want to invite developers, designers, PMs, and stakeholders to help review the changes to make sure they're correct. This closes the feedback loop between disciplines and helps you find the answer to "does this look right?".

Chromatic's UI review workflow pinpoints the exact visual changes introduced by a PR. It gives you the ability to assign reviewers and in turn those reviewers can comment and ask for tweaks on changes which aren't quite right. Chromatic compiles a 'UI checklist' which must be completed before a feature is ready to merge. Think of it like a code review for your UI.

## Assign Reviewers

Find the PR you'd like reviewed, either by navigating to the 'PRs' link in the sidebar or following the 'UI Review' link from the PR status checks in your Git provider. Use the Assign Reviewers link on the PR Activity screen to choose reviewers from the project's collaborators. Reviewers will be emailed a link to the PR screen to begin their review.

<img src="/img/assign-reviewers.gif" alt="Assign Reviewers" width="300px"/>

## Review UI Changes

The PR screen includes a 'UI Changes' tab showing a side-by-side view of all visual changes introduced by the code in the PR. You can toggle between viewing a highlighted diff or simply showing the component before/after this PR would be applied.

![UI Changes](/img/ui-changes.png)

#### Discussions

Reviewers can request updates to the implementation via the comment box beneath each change. Discussions are threaded and attached to the specific story represented by the change.

![UI Changes Comments](/img/ui-changes-comments.png)

## UI Checklist

Chromatic builds a list of tasks that need to be completed before a PR is considered safe to merge from a UI review perspective. This is the UI checklist and is shown at the bottom of the activity tab of the PR screen. Once all items are completed the status light will turn green and the PR is ready to merge.

![UI Checklist](/img/ui-checklist.png)

In order to complete the checklist, the following must be completed:

1. All outstanding discussions must be resolved. This can be done by clicking 'Resolve' on the comments UI.
2. All reviewers must have approved their review. They can do so by clicking 'Approve' button in the top right of the activity tab.

#### Git provider status checks

Chromatic will include a 'UI Review' badge within the status checks for each PR on your Git provider. The badge will show a summary of the state of the UI Checklist. Every PR for which Chromatic detects UI changes will initially start in the unreviewed state, ensuring that every impactful change has been noticed and considered before hitting production.

![UI Review Status Check](/img/ui-review-status-check.png)

<div class="aside">
Before you can begin using UI Review, you must <a href="/setup_ci">setup CI</a> so that Chromatic is able to run builds for each commit on the PR branch. If you're using GitHub, you must also add our GitHub App so that Chromatic has permission to access a list of your PRs (if you're using GitLab or Bitbucket, this will be a webhook). We will guide you through the setup on the PRs screen.
</div>

## Frequently Asked Questions

#### How is UI review different from testing?

Testing is done primarily by developers, most often iteratively during development. The focus is on preventing UI regressions (bugs) and maintaining a clean set of baselines to test against.

Review is usually performed by designers, PMs, customers, and other stakeholders. The focus is not on finding bugs (this should have already happened through testing) but rather to find cases where the implementation is not quite as was intented by the design or specifications. The modern development process moves quickly and often developers are filling in gaps according to their best guess. UI review is an opportunity for developers to sync with other teammates to get a final OK before shipping with confidence.

#### When should I ask for UI Review?

You can initiate a UI review at any time. However, we recommend doing it later in the development cycle, once baselines have been approved and UI Tests are green.

#### What commits does Chromatic use to calculate UI changes?

Just like GitHub, Chromatic compares between the latest commit on the PR branch and the 'merge base' commit, that is the commit that is the shared ancestor between the PR branch and the branch it was created from. It is important that Chromatic has run a build on both commits outlined above. If you've just enabled CI and have existing PRs that you would like to review, ensure Chromatic has run in CI for both branches of that PR.

The process might look something like:

1. Create a new PR to `master` adding Chromatic to CI
2. Merge that PR when everything works well.
3. Update your existing feature PR(s) w/ the latest from `master` (either merge or rebase from master).

#### Can I disable UI Review if I'd prefer not to use it?

Yes. Go to the manage page for your project where you can disable UI Review. Chromatic will no longer add status checks to your PRs for UI Review once it is disabled.

---

## You're all set up!

🎊 You're all setup with Chromatic. Testing and review are essential to maintaining high quality UIs, but there's always more to learn. Checkout how to get the most out UI components with handy Storybook guides written by our team. Don't hesitate to ask us questions via [email](mailto:support@hichroma.com?Subject=Question) or our in-app chat.

- [Visual Testing Handbook](https://www.chromaticqa.com/book/visual-testing-handbook) a free 31-page walkthrough for visual testing with Storybook
- [The Delightful Storybook Workflow](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) Learn how productive teams get the most out of Storybook. Featuring devs from Squarespace, Discovery Network, Major League Soccer, Apollo GraphQL, Storybook, and Chroma.
- [UI Component Playbook](https://blog.hichroma.com/ui-component-playbook-fd3022d00590) a 5-step guide to designing and engineering frontends with components
- [Visual Test-Driven Development](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87) - how visual testing helps your team build robust UIs faster.
