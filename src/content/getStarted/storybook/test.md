---
layout: "../../../layouts/Layout.astro"
title: Test
description: Learn how to run Chromatic UI Tests
sidebar: { order: 3, label: "UI Tests" }
---

# UI Tests

UI Tests pinpoint visual changes and verify user [interactions](/docs/interactions). They capture a [snapshot](/docs/snapshots) of every story in a cloud browser environment. Whenever you push code, Chromatic generates a new set of snapshots and compares them against [baseline snapshots](/docs/branching-and-baselines#whats-a-baseline). If there are changes, you verify that they’re intentional. If there are test errors, you get notified to fix them.

![UI Tests](../../../images/workflow-uitest.png)

## Enable

Enable visual tests for your project on the manage page. If your stories have [interaction tests](/docs/interactions), they’ll run automatically when visual tests are enabled.

All snapshots are taken in Chrome by default. Select additional browsers to expand test coverage in 1-click.

![Enable UI Tests](../../../images/uitests-for-docs.png)

## Establish baselines

Once visual tests are enabled, you can establish baselines by [running a Chromatic build](/docs/setup#run-chromatic) in a new project or on a branch without an ancestor. This captures a snapshot of each story in a cloud browser and sets it as the baseline. Subsequent builds will generate new snapshots that are compared against existing baselines to detect UI changes.

## View changes between baselines

Each build, Chromatic compares new snapshots to existing baselines from previous builds. The list of changes are shown on the build page in the web app. The build will be marked “unreviewed” and the changes will be listed in the “Tests” table.

![Build with unreviewed tests](../../../images/build-test-unreviewed.png)

<details>
<summary class="no-anchor">What about component errors?</summary>

When a story fails to render it will be badged with “Component Error”. You will not be able to “pass” a build that has component errors. Fix story errors in Storybook and run the build again.

</details>

<details>
<summary class="no-anchor">What about failed tests?</summary>

When interaction tests fail, the story will be badged with “Failed test.” You will not be able to “pass” a build that has failed tests. Fix interaction tests in Storybook and run the build again.

</details>

<details>
<summary class="no-anchor">Why are my baselines inconsistent?</summary>

Here are common reasons baselines can be inconsistent and how to fix them.

If you’re not running Chromatic builds on your base branch (e.g., `main`) then Chromatic will not be able to track which baselines are associated with which commits and branches. We recommend that you always run Chromatic on your base branch to ensure reliable, consistent baselines.

If you’re not auto-accepting changes on your base branch (e.g., `main`) then Chromatic can't enforce that your trunk branch is clean and passing. We recommend you add the [`--auto-accept-changes`](/docs/cli/#configuration-options) flag when running on the trunk branch to ensure all incoming changes will be accepted as baselines.

If you're squash and rebase-merging, Chromatic will not be able to track baselines to commits accurately because squashing removes commits from git history. We recommend you enable Chromatic's GitHub App to [auto-detect](/docs/branching-and-baselines/#how-do-baselines-get-preserved-during-squash-and-rebase-merging) squash and rebase merges which maintains your baselines.

</details>

## Verify UI changes

Chromatic detects UI changes but it’s still up to you to verify if changes are intentional. For intentional changes, you need to update the baseline so future tests will be compared to the _latest baseline_ for the story. If a change is unintentional it needs to be fixed.

- ✅&nbsp;**Accept change**: This updates the story baseline. When a snapshot is accepted it won’t need to be re-accepted until it changes, even through git branches or merges.

- ❌&nbsp;**Deny change**: This marks the change as “denied” indicating a regression and immediately fails the build. You can deny multiple changes per build. Denying a change will force a re-capture on the next build, even if [TurboSnap](/docs/turbosnap) would otherwise skip it.

![Snapshot that’s unreviewed](../../../images/snapshot-unreviewed.png)

<details>
<summary>What&rsquo;s the difference between denied and unreviewed changes?</summary>

The purpose of denying is to mark changes you’ve looked at but not accepted. When you’ve finished reviewing the build, the list of denied changes helps you track what needs fixing.

When it comes to baselines, denying and leaving unreviewed have the same effect. In both cases, the original baseline is used for comparisons. This means in subsequent builds, Chromatic compares the latest build to the original baseline (not the previously denied snapshot).

Denied changes will be marked as unreviewed in subsequent builds for you to review again.

</details>

<details>
<summary>Speed up review with keyboard shortcuts</summary>

Verify UI changes faster using keyboard shortcuts. Protip: Pressing 1 multiple times switches between the baseline and new snapshot in the 1up view.
![Keyboard shortcuts](../../../images/keyboard-shortcuts.png)

</details>

<details>
<summary>What about baselines on other branches?</summary>

Chromatic automatically changes the baseline snapshots that it uses for each build depending on your branch. Each branch has a separate set of baselines.

This means you can update UI components on multiple feature branches in parallel without conflicts. When you merge branches, the most recent baseline takes precedence. [Learn about branching and baselines »](/docs/branching-and-baselines)

</details>

<details>
<summary>How do I reproduce the snapshot?</summary>

Sometimes you need a closer look to determine why a snapshot is rendering as it does. Along with pixel and DOM diffs, Chromatic displays the interactive stories just as they appear in Storybook.

Click “Inspect snapshot” to open the Inspector. Switch between the “Canvas” and “Snapshot” tabs to compare the live component to the snapshot. Learn more about snapshots [here](/docs/snapshots).

![Reproduce snapshot](../../../images/feature-component-inspect.png)

</details>

<details>
<summary>Can I retake a snapshot?</summary>

Yes, [rerun the latest build](/docs/snapshots#rerun-builds-to-retake-snapshots) on your branch to retake snapshots of unreviewed or denied changes.

![Rerun button](../../../images/build-detail-rerun-button.png)

</details>

<details>
<summary>How are changes on builds different from those listed on the Review page ‘Changeset’ tab?</summary>

UI tests (shown on the build screen) detect changes between builds, specifically, between the last accepted baseline and the latest build. This is useful for detecting defects during the development process and when merging to the main branch to ship.

In contrast, the Review page shows the changeset between the latest commit on the PR branch (head) and the ‘merge base’ (base). Think of it like code review, but for UI.

</details>

#### Discussions

Reviewers can point out bugs or ask questions by creating discussions. Discussions are shown in situ of a UI change so all collaborators have the same reference point.

Pin discussions on a change to give precise feedback on what’s wrong. Pair discussions with denying a change to block merging until bugs are resolved.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;">
  <source src="/docs/assets/testscreen-comment-pinned-optimized.mp4" type="video/mp4" />
</video>

## Merge

If you accept all the changes, the build will **🟢&nbsp;Pass**. Future builds whose stories have the same appearance will pass.

If you deny any of the changes, the build will **🔴&nbsp;Fail**. You will need to make code changes (and thus start a new build) to get the build to pass.

When your build is passed (all changes accepted), you’re ready to merge visual changes with confidence knowing that your UI is bug free. Chromatic will update the PR check for “UI Tests” to reflect the build status.

After you merge your code, Chromatic will also apply accepted baselines to stories on the target branch. That means you’ll only need to accept baselines a single time.

![Build with reviewed tests](../../../images/build-test-reviewed.png)

<details>
<summary>Why is review disabled in the build page?</summary>

Reviewing is only enabled for the latest build on a branch to ensure that only the most up-to-date UI gets accepted as baselines.

</details>

<details>
<summary>Why is commenting disabled on old builds?</summary>

Comments are disabled on old builds to ensure that discussions are always on topic and up to date with the latest UI. This prevents the situation where different reviewers comment on different versions of the code.

</details>

<details>
<summary>Can I review the same commit on separate branches?</summary>

Yes, but it‘s not a best practice.

Every branch has independent baselines for each story until the branch gets merged. If two builds reference the same commit hash but are on _different branches_ it will be possible to review those builds separately so long as they're the latest build on their respective branches. We don't recommend this because you'll have to review the same change multiple times.

Instead, we recommend you regularly review builds to keep feature branches 🟢&nbsp;passing.

</details>

## PR check for “UI Tests”

Chromatic adds a ‘UI Tests’ check within the status checks for your pull/merge requests. The badge shows errors or changes that need to be reviewed. Require the check in [GitHub](https://help.github.com/en/github/administering-a-repository/enabling-required-status-checks), [GitLab](https://docs.gitlab.com/ee/api/commits.html#post-the-build-status-to-a-commit), or [Bitbucket](https://confluence.atlassian.com/bitbucket/suggest-or-require-checks-before-a-merge-856691474.html) to prevent accidental UI bugs from being merged.

![PR for UI Tests](../../../images/prbadge-test.png)

<div class="aside">

CI setup: Chromatic will return an exit code 0 on the CLI which can be used in CI/CD systems to indicate success and unblock deployment. [Learn about CI](/docs/ci).

</div>

---

## Next: Learn about UI Review

Now that you can catch bugs during development, learn about how to invite stakeholders into Chromatic’s UI Review workflow to get the team sign off before merging.

<a class="btn primary round" href="/docs/review">Read next chapter</a>

---

### Troubleshooting

<div class="aside">

Snapshots don’t look right? Learn how to debug snapshots [here](/docs/snapshots).

</div>

<details>
<summary>Why are my builds failing because of component errors?</summary>

A build will _fail_ if any of the snapshots fail to render (i.e. in rendering the latest version of the component, the snapshot throws a JavaScript exception). You’ll need to fix the code for errored components before we can pass the build.

</details>

<details>
<summary>Why do I see “Didn’t find any commits in this git repository in the last X builds”?</summary>

This means that across the last X unique commits across all builds in your app, we didn’t find a single one that exists in the repository you ran this build against. Commits can go missing if you rebase or perform squash-merges, however, if all of the previous X builds’ commits are missing, it is likely something has gone wrong.

If you’ve reached this situation and can’t work out why, please contact us through our <a  class="intercom-concierge-bot">in-app chat</a> or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Why do I see “Failed to find common ancestors with most recent builds within X commits”?</summary>

This means that although we found recent builds that _were_ in your git repository history (see above), we couldn’t find any _common_ history between your checked out build and those builds within X commits.

Unless you are doing something unusual with your git repository, this is extremely unlikely. Either way, please contact us through our in-app chat or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Why do I see “Build X is based on a commit without ancestor builds”? </summary>

When we create a build, we search your git history for a recent Chromatic build based on a commit that is an ancestor (i.e. a commit that is in the direct history of this commit). Unless this is the very first build, if we do not find one, we will show you this message.

This is typically unusual, because in order to run Chromatic on a commit, chances are the commit that added Chromatic to your app is an ancestor!

However, this situation can arise due to the following:

1. You switched branches and re-ran Chromatic, without checking-in the code changes that installed Chromatic. In this case you can safely ignore this message.

1. You rewrote history in merging the Chromatic installation code (e.g. using GitHub’s “Squash and Merge” or “Rebase and Merge” buttons). [Learn how to resolve](/docs/github-actions#github-squashrebase-merge-and-the-main-branch)

1. You are using a shallow clone of your repository when running Chromatic. Chromatic needs access to your full git history in order to find baselines (or at least the history until the previous Chromatic build, which depends on how often you push code/run builds). [Learn about how we use Git for baselines »](/docs/branching-and-baselines)

1. Something else happened, perhaps a bug at our end? Please contact us through our in app chat if this is the case.

</details>

<details>
<summary>Can I disable UI Tests if I prefer not to use them?</summary>

Yes. Go to the manage page for your project where you can disable UI Tests. Chromatic will no longer add status checks to your PRs for UI Tests once it is disabled.

</details>

<details>
<summary>Why does my build have failed tests?</summary>

“Failed tests” happens when a story’s [play function](https://storybook.js.org/docs/react/writing-stories/play-function#gatsby-focus-wrapper) has an unexpected error that caused it to fail. You can learn more about interaction tests [here](https://storybook.js.org/docs/react/writing-tests/interaction-testing).

</details>

<details>
<summary>Can I rerun a build without running my whole CI workflow?</summary>

Yes you can [rerun the latest build on any branch](/docs/snapshots#rerun-builds-to-retake-snapshots) outside of your CI workflow. Go to the build page to kick off a new build that uses identical settings and configuration as your old build.

</details>
