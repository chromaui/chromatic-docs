---
layout: default
title: Automate Chromatic with BitBucket
description: Learn how to configure Chromatic with BitBucket Pipelines
---

# Automate Chromatic with BitBucket Pipelines

Chromatic’s automation can be included as part of your BitBucket pipeline workflow with relative ease.

## Initial configuration

To integrate Chromatic with your existing pipeline, you'll need to add the following:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
    # Any other steps implemented in the pipeline

    # 👇 Adds Chromatic as a step in the pipeline
    - step:
        name: 'Chromatic deployment'
        caches:
          - node
        script:
          - yarn install
          # 👇 Runs Chromatic
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

For extra security you'll need to configure your own environment variables.

<div class="aside">
See the official BitBucket <a href="https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/">environment variables documentation</a> for more context.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your pipeline like so:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
    # Any other steps implemented in the pipeline

  branches:
    master:  # 👈 The example branch will display the message in the console as instead of running Chromatic.
      - step:
         script:
           - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

Now your pipeline will run Chromatic in the `main` branch and the example `branch` will show a message.

<div class="aside">
For more information on conditional pipeline execution, see the official BitBucket <a href="https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/">documentation</a>.
</div>

## UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your pipeline to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your step will continue in such cases.

When using `--exit-zero-on-changes` your pipeline execution still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your pipeline, you can use `yarn chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the build using your CI tool and the `chromatic` job will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "master" branch

A clean `master` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `master` branch are passing.

If the builds are a result of direct commits to `master`, you will need to accept changes to keep master clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `master`.

<details>
<summary><h4 class="no-anchor">BitBucket squash/rebase merge and the "master" branch</h4></summary>

BitBucket's squash/rebase merge functionality creates new commits that have no association to the branch being merged. If you are already using this option, then we will automatically detect this situation and bring baselines over (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

Otherwise, Chromatic would not know which changes accepted on that branch should be baselines on `master`. What's more, you would have to re-review snapshots on `master` even if you already accepted them elsewhere.

And update your BitBucket pipeline to maintain a clean `master` branch. For example:

```yml
pipelines:
  default:
    - step:
        name: 'Deploy to Chromatic and auto accept changes'
        caches:
          - node
        script:
          - yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}  --auto-accept-changes
  pull-requests:
    your-branch:
      - step:
          name: 'Deploy to Chromatic'
          script:
            - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN

```

</details>

<details>
<summary><h4 class="no-anchor">Run Chromatic on external forks of open source projects</h4></summary>

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or your CI config).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

</details>

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Renovate automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `master` or `develop` branch.

To skip builds for `renovate` branches, use the following:

```
chromatic --skip 'renovate/**'
```

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```
chromatic --skip '@(renovate/**|your-custom-branch/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
