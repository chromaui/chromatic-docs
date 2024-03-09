## Establish baselines

Once visual tests are enabled, you can establish baselines by [running a Chromatic build](/docs/setup#run-chromatic) in a new project or on a branch without an ancestor. This captures a snapshot of each story in a cloud browser and sets it as the baseline. Subsequent builds will generate new snapshots that are compared against existing baselines to detect UI changes.

## View changes between baselines

Each build, Chromatic compares new snapshots to existing baselines from previous builds. The list of changes are shown on the build page in the web app. The build will be marked “unreviewed” and the changes will be listed in the “Tests” table.

![Build with unreviewed tests](../../../images/build-test-unreviewed-e2e.png)

<details>
<summary class="no-anchor">Why are my baselines inconsistent?</summary>

Here are common reasons baselines can be inconsistent and how to fix them.

If you’re not running Chromatic builds on your base branch (e.g., `main`) then Chromatic will not be able to track which baselines are associated with which commits and branches. We recommend that you always run Chromatic on your base branch to ensure reliable, consistent baselines.

If you’re not auto-accepting changes on your base branch (e.g., `main`) then Chromatic can't enforce that your trunk branch is clean and passing. We recommend you add the [`--auto-accept-changes`](/docs/cli/#configuration-options) flag when running on the trunk branch to ensure all incoming changes will be accepted as baselines.

If you're squash and rebase-merging, Chromatic will not be able to track baselines to commits accurately because squashing removes commits from git history. We recommend you enable Chromatic's GitHub App to [auto-detect](/docs/branching-and-baselines/#how-do-baselines-get-preserved-during-squash-and-rebase-merging) squash and rebase merges which maintains your baselines.

</details>
