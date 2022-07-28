---
layout: default
title: Automate Chromatic with BitBucket
description: Learn how to configure Chromatic with BitBucket Pipelines
---

# Automate Chromatic with BitBucket Pipelines

Chromatic’s automation can be included as part of your BitBucket pipeline workflow with relative ease.

### Setup

To integrate Chromatic with your existing pipeline, you'll need to add the following:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
    # Other steps in the pipeline

      # 👇 Adds Chromatic as a step
    - step:
        name: 'Publish to Chromatic'
        caches:
          - node
        script:
          - yarn install
            # 👇 Runs Chromatic
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

<div class="aside">
For extra security, add Chromatic's <code>project-token</code> as an environment variable. See the official BitBucket <a href="https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/">environment variables documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your pipeline like so:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
  # Other steps in the pipeline

  branches:
    # 👇 The example branch will display the message in the console instead of running Chromatic.
    main:
      - step:
         script:
           - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

<div class="aside">
Read the official BitBucket <a href="https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/">conditional pipeline documentation</a>.
</div>

Now your pipeline will only run Chromatic in the `main` branch.

### Run Chromatic on large projects

Chromatic is prepared to handle large file uploads (with a limit of 5000 files, including stories and assets). If your project exceeds this limit, we recommend adjusting your pipeline and run the `chromatic` command with the `--zip` flag to compress your build before uploading it. For example:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
    # Other steps in the pipeline

    # 👇 Adds Chromatic as a step in the pipeline
    - step:
        name: "Publish to Chromatic"
        # Other pipeline configuration
        script:
          - yarn install
            #👇Runs Chromatic with the flag to compress the build output.
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --zip
```

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your pipeline to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your step will continue in such cases. For example:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
    # Other steps in the pipeline

      # 👇 Adds Chromatic as a step in the pipeline
    - step:
        name: 'Publish to Chromatic'
        # Other pipeline configuration
        script:
          - yarn install
            # 👇 Runs Chromatic with the flag to prevent pipeline failure
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --exit-zero-on-changes
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

When using `--exit-zero-on-changes` your pipeline execution still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your pipeline, you can use `yarn chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the pipeline and the `Publish to Chromatic` step will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "main" branch

A clean `main` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `main` branch are passing.

If the builds are a result of direct commits to `main`, you will need to accept changes to keep the main branch clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `main`.

#### BitBucket squash/rebase merge and the "main" branch

BitBucket's squash/rebase merge functionality creates new commits that have no association to the branch being merged. If you are already using this option, then we will automatically detect this situation and bring baselines over (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the pipeline and include the `--auto-accept-changes` flag. For example:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
      # 👇 Checks if the branch is main and runs Chromatic with the flag to accept all changes.
    - step:
        name: 'Publish to Chromatic and auto accept changes'
        caches:
          - node
        script:
          - yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --auto-accept-changes
  pull-requests:
    # 👇 Checks if the branch is not main and runs Chromatic
    your-branch:
      - step:
          name: 'Publish to Chromatic'
          script:
            - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally, you'll maintain a clean `main` branch.

If you want to test the changes introduced by the rebased branch, you can adjust your workflow and include a new step with the `ignore-last-build-on-branch` flag. For example:

```yml
# bitbucket-pipelines.yml

# A sample pipeline implementation
pipelines:
  default:
    # Other steps in the pipeline

      # 👇 Adds Chromatic as a step in the pipeline
    - step:
        name: 'Publish to Chromatic'
        # Other pipeline configuration
        script:
          - yarn install
            # 👇 Option to skip the last build on target branch
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --ignore-last-build-on-branch=my-branch
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--ignore-last-build-on-branch` flag ensures the latest build for the specific branch is not used as a baseline.

#### BitBucket pipelines and patch builds

If you're creating a [patch build](branching-and-baselines#patch-builds) in Chromatic to fix a missing pull request comparison, you'll need to adjust your existing pipeline to the following:

```yml
# bitbucket-pipelines.yml

pipelines:
  pull-requests:
    # 👇 Will run as default for any branch not elsewhere defined
    '**':
      - step:
          # 👇 Adds Chromatic as a step in the pipeline
          name: 'Publish to Chromatic'
          caches:
            - node
          script:
              # 👇 Brings over the changes from the BitBucket repo
            - git fetch origin main:main
              # 👇 Option to update the build based on the changes obtained
            - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --patch-build=$your-branch...main
```

Including the `git` command prior to running Chromatic prevents unwanted build errors when Chromatic retrieves the information from your BitBucket repo.

This is based on how BitBucket's pipeline infrastructure handles cloning and branching. By default when the pipeline runs it will not do a full repository clone. Instead it will only fetch the current branch and omit all other existing ones.

Now you'll be able to to see the UI changeset for PRs and perform [UI Review](review) as normal.

<div class="aside">
See the following <a href="https://community.atlassian.com/t5/Bitbucket-Pipelines-questions/pipeline-doesnt-recognize-origin-master/qaq-p/968614">BitBucket issue</a> for a detailed explanation.
</div>

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or in the pipeline step).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Renovate automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `main` or `develop` branch.

To skip builds for `renovate` branches, use the following:

```shell
chromatic --skip 'renovate/**'
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```shell
chromatic --skip '@(renovate/**|your-custom-branch/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
