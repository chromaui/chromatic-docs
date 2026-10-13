---
title: Reset baselines
description: Escape hatch to reset a branch’s baselines when it ends up with an incorrect baseline from the wrong ancestor build.
---

# Reset baselines

Chromatic picks baselines for a build by looking at its [ancestor builds](/docs/branching-and-baselines#find-the-ancestor-builds) in your git history. Complex CI setups and git workflows can occasionally point it at the wrong ancestor. When that happens, your build shows changes you didn’t make, and rebasing won’t fix it. Reset the baselines to give your build a clean start.

## How to reset a build's baselines

The option appears on the newest build on a branch. It doesn't appear on builds on the base branch itself.

1. Go to the build's UI Tests page.
2. Click the rerun button and select **Reset baselines**.
3. Confirm in the browser dialog.

![The rerun menu on the build screen, with the Reset baselines option outlined.](../../images/reset-baselines-menu.png)

## Resetting restarts your branch from the base branch

Chromatic creates a new build for the same commit and compares it against the base branch, so you see only the changes your branch introduces. There’s no need to close the pull request and reopen it under a new branch name.

- **Chromatic makes the original build read-only.** The build shows a message that reviewing is disabled because there's a newer build on the branch, with a link to the new build.
- **The new build marks every change on your branch as unreviewed.** You review again any changes you accepted on the original build. Comments on the original build's tests don't carry over.
- **Your UI Review keeps its history.** If the branch has a UI Review, the review shows the new build as its latest build and keeps its comments and approvals.

![The original build after a reset, with a message that reviewing is disabled because there's a newer build on the branch.](../../images/reset-baselines-read-only-build.png)

### How a reset picks baselines

A reset uses the [merge base](/docs/branching-and-baselines#how-is-merge-base-calculated) build as the ancestor of the new build. That's the build on the base branch that your branch started from. Chromatic captures visual snapshots for your stories and compares them with the baselines from that build.

If your branch has a [UI Review](/docs/review), the base branch is the one the review merges into. Otherwise, it's the project's default branch.

## Troubleshooting

<details>
<summary>Why don't I see the Reset baselines option?</summary>

The option only appears on the newest build on a branch. It never appears on builds on the base branch itself.

</details>

<details>
<summary>Why does the menu say "Baseline reset is not available"?</summary>

Chromatic couldn't find a merge base build to reset to. This happens when there's no Chromatic build on the base branch that your branch started from. For example, Chromatic doesn't run on your base branch, your CI checks out a partial git history, or your branch shares no git history with the base branch.

</details>

<details>
<summary>Why can't I reset a build when Chromatic doesn't run on my base branch?</summary>

If there are no Chromatic builds on the base branch, there's nothing to reset the build to. Run Chromatic on every push to the base branch.

</details>

<details>
<summary>Why can't I reset a build when my CI checks out a partial git history?</summary>

Chromatic needs enough git history to find where your branch started from the base branch. Without it, the build can't be reset. Fetch the full commit history in CI, for example with `fetch-depth: 0` in [GitHub Actions](/docs/github-actions).

</details>

<details>
<summary>Why can't I reset a build on a branch with no shared history?</summary>

A branch that shares no git history with the base branch, such as one created with `git checkout --orphan`, has no merge base. There's no build for Chromatic to reset to.

</details>
