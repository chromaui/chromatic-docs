---
layout: default
title: Update baselines
description: Learn how to review test builds for your component library
---

# Update baselines

Visual testing ensures components dont change by accident. It’s still up to you to decide if changes are intentional.

If a change is intentional you need to update the baseline so future tests will be compared to the _latest version_ of the story. And if a change is unintentional it needs to be fixed.

![Review visual diffs](img/workflow-component-review.png)

---

## Review builds

<video autoPlay muted playsInline controls width="560px">
  <source src="/img/website-workflow-review-merge-optimized.mp4" type="video/mp4" />
</video>

Each build new snapshots of your components are created and compared to the baselines. If there are visual changes the build will be marked "unreviewed".

Visual changes will need to be reviewed for the build to be "passed" or "failed". You can review changes 1-by-1 or in batches.

- ✅**Accept change**: This updates the story baseline. When a snapshot is accepted, it won’t need to be re-accepted until it changes, even through git branches, and merges.

- ❌**Deny change**: This badges the change as "denied" indicating a regression and immediately fails the build. You can deny multiple changes per build.

![Snapshot review](img/snapshot-review.png)

If you accept all the changes, the build will be marked "passed", and future builds of the same components will pass.

If you deny any of the changes, the build will be "failed" and you will need to make code changes (and thus start a new build) to get the build to pass.

#### Feature branches

Chromatic automatically changes the baseline snapshots that it uses for each build depending on your branch. This means you can update UI components on multiple feature branches in parallel without conflicts. Read more about the details [here](/branching-and-baselines).

#### Collaboration

Invite developers, designers, PMs, and stakeholders to help review changes. This closes the feedback loop between disciplines and helps you find the answer to "does this look right?".

If you've linked your project to GitHub, Bitbucket, or GitLab, your team can start accessing and reviewing right away. If your project is unlinked, use the project invite code to add collaborators. [Learn more](/access)

#### Live View for reproductions

Chromatic securely indexes your components and their stories in a [component library](/library). This makes reviewing the look and feel even more true-to-life. Click to the component screen and enable **Live View** to access the fully interactive and clickable version of the story.

<video autoPlay muted playsInline controls width="560px">
  <source src="/img/feature-component-inspect-optimized.mp4" type="video/mp4" />
</video>

#### Component errors

When a story fails to render it will be badged with "Component Error". You will not be able to "pass" a build that has component errors. Fix story errors in Storybook and test again.

#### Keyboard shortcuts

Review more efficiently from your natural hand position on the keyboard.
![Keyboard shortcuts](img/keyboard-shortcuts.png)

<div class="aside">
Protip: Pressing 1 multiple times switches between the baseline and new snapshot in the 1up view.
</div>

---

## Merge

![Build passed](img/build-passed.png)

When your build is "passed" (all changes accepted) Chromatic will return an exit code for you to [script workflow behavior](/setup_ci). You can now merge visual changes with confidence knowing that your UI will look exactly as intended.

---

## Next: Setup the workflow

🔄Now that you know how testing and review works, let's see how to integrate Chromatic into your workflow. You'll learn how to get notified of changes in your PR and automate testing with CI.

<a class="btn primary round" href="/setup_ci">Read next chapter</a>

---

### Troubleshooting

#### Reviewing disabled

If a build isn't the newest build on a branch, we disable reviewing the build; as any future builds will base themselves on the _newest_ build, making approvals to this build pointless.

Note that in the case that there is a descendent build of this build on _a different branch_ (for instance if the commit for this build was merged into that different branch), we do allow reviewing of this build. Future builds on this branch _will_ use approved changes from the build; however future builds on the different branch will not---for this reason it is best to review builds before merging them.

#### "Didn't find any commits in this git repository in the last 100 builds."

This means that across the last 100 unique commits across all builds in your app, we didn't find a single one that exists in the repository you ran this build against. Commits can go missing if you rebase or perform squash-merges, however, if all of the previous 100 builds' commits are missing, it is likely something has gone wrong.

If you've reached this situation and can't work out why, please <a href="mailto:support@hichroma.com">let us know</a>.

#### "Failed to find common ancestors with most recent builds within 1000 commits"

This means that although we found recent builds that _were_ in your git repository history (see above), we couldn't find any _common_ history between your checked out build and those builds within 1000 commits.

Unless you are doing something unusual with your git repository, this is extremely unlikely. Either way, please <a href="mailto:support@hichroma.com">let us know</a>.

#### "Build X is based on a commit without ancestor builds."

When we create a build, we search your git history for a recent Chromatic build based on a commit that is an ancestor (i.e. a commit that is in the direct history of this commit). Unless this is the very first build, if we do not find one, we will show you this message.

This is typically unusual, because in order to run Chromatic on a commit, chances are the commit that added Chromatic to your app is an ancestor!

However, this situation can arise due to the following:

1. You switched branches and re-ran Chromatic, without checking-in the code changes that installed Chromatic. In this case you can safely ignore this message.

2. You rewrote history in merging the Chromatic installation code (e.g. using GitHub's "Squash and Merge" or "Rebase and Merge" buttons). Please <a href="mailto:support@hichroma.com">let us know</a> if this is the case.

3. You are using a shallow clone of your repository when running Chromatic. Chromatic needs access to your full git history in order to find baselines (or at least the history until the previous Chromatic build, which depends on how often you push code/run builds). <a href="/branching-and-baselines">Learn more</a>

4. Something else happened---perhaps a bug at our end? Please <a href="mailto:support@hichroma.com">let us know</a> if this is the case.
