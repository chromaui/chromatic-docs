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
