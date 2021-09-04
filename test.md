---
layout: default
title: Test
description: Learn how to run Chromatic UI Tests
---

# UI Tests

UI tests capture a visual [snapshot](snapshots) of every story in a cloud browser environment. Whenever you push code, Chromatic generates a new set of snapshots and compares them against [baselines](branching-and-baselines#baselines). If there are visual changes, you verify if they're intentional.

![UI test](img/workflow-uitest.png)

## Enable

Enable visual tests for your project on the manage screen. All snapshots are taken in Chrome by default. This is also where you expand test coverage to additional browsers.

![Enable UI Tests](img/uitests-for-docs.png)

## Establish baselines

Once visual tests are enabled, you can establish baselines by [running a Chromatic build](setup#run-chromatic) in a new project or on a branch without an ancestor. This captures a snapshot of each story in a cloud browser and sets it as the baseline. Subsequent builds will generate new snapshots that are compared against existing baselines to detect UI changes.

## View changes between baselines

Each build Chromatic compares new snapshots to existing baselines from previous builds. The list of changes are shown on the build page in the web app. The build will be marked "unreviewed" and the changes will be listed in the "Tests" table.

![Build with unreviewed tests](img/build-test-unreviewed.png)

<details>
<summary class="no-anchor">What about component errors?</summary>

When a story fails to render it will be badged with "Component Error". You will not be able to "pass" a build that has component errors. Fix story errors in Storybook and run tests again.

</details>

## Verify UI changes

Chromatic detects UI changes but it's still up to you to verify if changes are intentional. For intentional changes, you need to update the baseline so future tests will be compared to the _latest baseline_ for the story. If a change is unintentional it needs to be fixed.

- ✅**Accept change**: This updates the story baseline. When a snapshot is accepted it won’t need to be re-accepted until it changes, even through git branches or merges.

- ❌**Deny change**: This marks the change as "denied" indicating a regression and immediately fails the build. You can deny multiple changes per build.

![Snapshot that's unreviewed](img/snapshot-unreviewed.png)

<div class="aside">Tip: Speed up accept/deny using <a href="#keyboard-shortcuts">keyboard shortcuts</a> and batch actions.</div>

<details>
<summary>What about baselines on other branches?</summary>

Chromatic automatically changes the baseline snapshots that it uses for each build depending on your branch. Each branch has a separate set of baselines.

This means you can update UI components on multiple feature branches in parallel without conflicts. When you merge branches, the most recent baseline takes precedence. [Learn about branching and baselines »](branching-and-baselines)

</details>

<details>
<summary>How do I reproduce the snapshot?</summary>

Sometimes you need a closer look to determine why a snapshot is rendering as it does. Along with pixel and DOM diffs, Chromatic displays the interactive stories just as they appear in Storybook.

Click "Inspect snapshot" to open the Inspector. Switch between the "Canvas" and "Snapshot" tabs to compare the live component to the snapshot.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;">
  <source src="img/feature-component-inspect-optimized.mp4" type="video/mp4" />
</video>
</details>

<details>
<summary>How are changes on builds different from those listed on the PR Screen 'Changeset' tab?</summary>

UI tests (shown on the build screen) detect changes between builds, specifically, between the last accepted baseline and the latest build. This is useful for detecting defects during the development process and when merging to the main branch to ship.

In contrast, the PR screen shows the changeset between the latest commit on the PR branch (head) and the 'merge base' (base). Think of it like code review, but for UI.

</details>

#### Discussions

Reviewers can point out bugs or ask questions by creating discussions. Discussions are shown in situ of a UI change so all collaborators have the same reference point.

Pin discussions on a change to give precise feedback on what’s wrong. Pair discussions with denying a change to block merging until bugs are resolved.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;">
  <source src="img/testscreen-comment-pinned-optimized.mp4" type="video/mp4" />
</video>

## Merge

If you accept all the changes, the build will **🟢Pass**. Future builds whose stories have the same appearance will pass.

If you deny any of the changes, the build will **🔴Fail**. You will need to make code changes (and thus start a new build) to get the build to pass.

When your build is passed (all changes accepted), you're ready to merge visual changes with confidence knowing that your UI is bug free. Chromatic will update the PR check for "UI Tests" to reflect the build status.

After you merge your code, Chromatic will also apply accepted baselines to stories on the target branch. That means you'll only need to accept baselines a single time.

![Build with reviewed tests](img/build-test-reviewed.png)

## PR check for "UI Tests"

Chromatic adds a 'UI Tests' check within the status checks for your pull/merge requests. The badge shows errors or changes that need to be reviewed. Require the check in [GitHub](https://help.github.com/en/github/administering-a-repository/enabling-required-status-checks), [GitLab](https://docs.gitlab.com/ee/api/commits.html#post-the-build-status-to-a-commit), or [Bitbucket](https://confluence.atlassian.com/bitbucket/suggest-or-require-checks-before-a-merge-856691474.html) to prevent accidental UI bugs from being merged.

![PR for UI Tests](img/prbadge-test.png)

<div class="aside">CI setup: Chromatic will return an exit code 0 on the CLI which can be used in CI/CD systems to indicate success and unblock deployment. <a href="ci">Learn about CI.</a></div>

---

## Next: Learn about UI Review

Now that you can catch bugs during development, learn about how to invite stakeholders into Chromatic's UI Review workflow to get the team sign off before merging.

<a class="btn primary round" href="review">Read next chapter</a>

---

<details>
<summary><h3 class="no-anchor">Keyboard shortcuts</h3></summary>

Verify UI changes faster using keyboard shortcuts. Protip: Pressing 1 multiple times switches between the baseline and new snapshot in the 1up view.
![Keyboard shortcuts](img/keyboard-shortcuts.png)

</details>

<details>
<summary><h3 class="no-anchor">False positives</h3></summary>

It's essential that your components and stories render in a **consistent** fashion between tests to prevent false positives. Some reasons your stories might not render consistently and ways you can avoid this include:

- **Randomness in stories**: It's not uncommon to use random number generators to generate data for complex component inputs. To avoid this, you can hard-code the input data, but often a more convenient solution is to use a tool like [seedrandom](https://github.com/davidbau/seedrandom) which you can use to make your "random" number generator consistent.

- **Use of the current date/time**: Dates and times are a testers bane! To get consistency in components or tests that use the current time, you can use a tool to also "seed" the time, like [timemachine](https://github.com/schickling/timemachine) for the `Date` object.

- **Animations and video**: Chromatic will attempt to pause all animations and video. However, you may need to [configure](animations) Chromatic's exact behavior.

- **Unpredictable resource hosts**: Resources that load from unpredictable or flaky sources may not load in time (15s) to capture. Workaround this by serving resources as [static files in Storybook](https://storybook.js.org/configurations/serving-static-files/) or using a [placeholder service](https://placeholder.com/). Learn more about how we [load resources](resource-loading).

- **Iframes rendering out of the viewport**: Some browsers only visually render iframes when they are inside of the viewport, despite the fact that they have loaded with all of their resources. For this reason, if you have an iframe that is placed below the viewport of a tall story, it will appear blank. You may want to [ignore that element](ignoring-elements) and also test it in isolation so that it fits inside of the viewport.

- **Skip stories**: Some stories may render unpredictably intentionally. If this is the case you may want to [ignore the story](ignoring-elements) from testing and move on.

- **Introduce a delay**: As a last resort, you can try adding a [delay](delay). This will delay Chromatic's snapshot for a specified amount of time. The trouble with this technique whilst it may make the problem less common, it may not eliminate it completely.

If you want to utilize the above techniques to ensure consistency for Chromatic's tests, but you still want random elements for your local Storybook, you can use `isChromatic()` exported from [our package](isChromatic) to check for the Chromatic environment.

</details>

### Troubleshooting

<details>
<summary>Why are my builds failing because of component errors?</summary>

A build will _fail_ if any of the snapshots fail to render (i.e. in rendering the latest version of the component, the snapshot throws a JavaScript exception). You'll need to fix the code for errored components before we can pass the build.

</details>

<details>
<summary>Why is review disabled in my build screen?</summary>

If a build isn't the newest build on a branch, we disable reviewing the build; as any future builds will base themselves on the _newest_ build, making approvals to this build pointless.

Note that in the case that there is a descendent build of this build on _a different branch_ (for instance if the commit for this build was merged into that different branch), we do allow reviewing of this build. Future builds on this branch _will_ use approved changes from the build; however future builds on the different branch will notfor this reason it is best to review builds before merging them.

</details>

<details>
<summary>Why do I see <code>Didn't find any commits in this git repository in the last X builds</code>?</summary>

This means that across the last X unique commits across all builds in your app, we didn't find a single one that exists in the repository you ran this build against. Commits can go missing if you rebase or perform squash-merges, however, if all of the previous X builds' commits are missing, it is likely something has gone wrong.

If you've reached this situation and can't work out why, please contact us through our <a  class="intercom-concierge-bot">in-app chat</a> or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Why do I see <code>Failed to find common ancestors with most recent builds within X commits</code>?</summary>

This means that although we found recent builds that _were_ in your git repository history (see above), we couldn't find any _common_ history between your checked out build and those builds within X commits.

Unless you are doing something unusual with your git repository, this is extremely unlikely. Either way, please contact us through our in-app chat or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Why do I see <code>Build X is based on a commit without ancestor builds</code>? </summary>

When we create a build, we search your git history for a recent Chromatic build based on a commit that is an ancestor (i.e. a commit that is in the direct history of this commit). Unless this is the very first build, if we do not find one, we will show you this message.

This is typically unusual, because in order to run Chromatic on a commit, chances are the commit that added Chromatic to your app is an ancestor!

However, this situation can arise due to the following:

1. You switched branches and re-ran Chromatic, without checking-in the code changes that installed Chromatic. In this case you can safely ignore this message.

1. You rewrote history in merging the Chromatic installation code (e.g. using GitHub's "Squash and Merge" or "Rebase and Merge" buttons). [Learn how to resolve](ci#github-squash-rebase-merge-and-the-master-branch)

1. You are using a shallow clone of your repository when running Chromatic. Chromatic needs access to your full git history in order to find baselines (or at least the history until the previous Chromatic build, which depends on how often you push code/run builds). [Learn about how we use Git for baselines »](branching-and-baselines)

1. Something else happened, perhaps a bug at our end? Please contact us through our in app chat if this is the case.

</details>

<details>
<summary>Why am I seeing an error for large images?</summary>

We have a 25 million pixel size limit for image snapshots. This ensures fast and reliable performance for every build.

If your stories are larger than this, perhaps something has gone wrong? Let us know if you need this limit increased via our in-app chat or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Can I disable UI Tests if I prefer not to use them?</summary>

Yes. Go to the manage page for your project where you can disable UI Tests. Chromatic will no longer add status checks to your PRs for UI Tests once it is disabled.

</details>
