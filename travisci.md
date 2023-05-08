---
layout: default
title: Automate Chromatic with Travis CI
description: Learn how to configure Chromatic with Travis CI
---

# Automate Chromatic with Travis CI

Chromatic's automation can be included as part of your Travis CI job with relative ease.

### Setup

To integrate Chromatic with your existing workflow, you’ll need to add the following:

```yml
# travis.yml

language: node_js
node_js:
  - 16

# Other required configuration

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      script: yarn chromatic
```

<div class="aside">
For security, don't include the plaintext project token in your pipeline config file. Instead, store it as a secured environment variable named <code>CHROMATIC_PROJECT_TOKEN</code>. The <code>chromatic</code> script will automatically use <code>CHROMATIC_PROJECT_TOKEN</code>, no need to use the <code>--project-token</code> flag. See the official Travis CI <a href="https://docs.travis-ci.com/user/environment-variables/"> environment variables documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run on specific branches, you can do so. Change your `travis.yml` to the following:

```yml
# travis.yml

# Other required configuration

branches:
  only: main # 👈 Filters the execution to run only on the main branch

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      script: yarn chromatic
```

<div class="aside">
Read the official Travis CI <a href="https://docs.travis-ci.com/user/conditional-builds-stages-jobs/"> conditional build documentation</a>.
</div>

### Run Chromatic on large projects

Chromatic is prepared to handle large file uploads (with a limit of 5000 files, including stories and assets). If your project exceeds this limit, we recommend adjusting your workflow and run the `chromatic` command with the `--zip` flag to compress your build before uploading it. For example:

```yml
# travis.yml

# Other required configuration

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      #👇Runs Chromatic with the flag to compress the build output.
      script: yarn chromatic --zip
```

### Run Chromatic on monorepos

Chromatic can be run on monorepos that have multiple subprojects. Each subproject will need it's own project token stored as an environment variable.

#### Prerequisites

1. Ensure that you're in the correct working directory for the subproject.
2. Have `build-storybook` npm script in the subproject's `package.json` file OR explicitly name the script using the `buildScriptName` parameter and make sure the script is listed in the subproject's `package.json` file.

If you've already built your Storybook in a separate CI step, you can alternatively point the action at the build output using the `storybookBuildDir` parameter.

```yml
# travis.yml

# Other required configuration

# 👇 Runs Chromatic in parallel for each monorepo subproject
jobs:
  include:
    # Other jobs
    - name: "Publish Project 1 to Chromatic"
      before_script:
        # Other steps
        - cd packages/project_1
      script: yarn chromatic
      env: CHROMATIC_PROJECT_TOKEN=$CHROMATIC_PROJECT_TOKEN_1
    - name: "Publish Project 2 to Chromatic"
      before_script:
        # Other steps
        - cd packages/project_2
      script: yarn chromatic
      env: CHROMATIC_PROJECT_TOKEN=$CHROMATIC_PROJECT_TOKEN_2
```

<div class="aside">
Additional parallelization can be achieved when configuring your workflow to run Chromatic on multiple subprojects. Read the official Travis CI <a href="https://docs.travis-ci.com/user/build-matrix/"> build matrix documentation</a>
</div>

### Enable TurboSnap

TurboSnap is an advanced Chromatic feature implemented to improve the build time for large projects, disabled by default once you add Chromatic to your CI environment. To enable it, you'll need to adjust your existing workflow and run the `chromatic` command with the `--only-changed` flag as follows:

```yml
# travis.yml

# Other required configuration

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      # 👇 Enables Chromatic's TurboSnap feature.
      script: yarn chromatic --only-changed
```

<div class="aside">

TurboSnap is highly customizable and can be configured to fit your requirements. For more information, read our [documentation](turbosnap).

</div>

### Recommended configuration for build events

Travis CI like other CI systems offer the option of running builds for various types of events. For instance for commits pushed to a branch in a pull request. Or for "merge" commits between that branch and the base branch (main).

These specific types of commits (merge) don't persist in the history of your repository. That can cause Chromatic's baselines to be lost in certain situations.

For internal pull requests (ie. pull requests that aren't from forks) we recommend disabling Chromatic on `pr` build events. Also make sure you have `push` builds enabled in your settings.

Once these conditions are met, add the following code to your `.travis.yml`:

```yml
# travis.yml

# Other required configuration

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      # 👇 Verifies the build event type or a if it's a forked repository
      if: (type = push OR head_repo != repo )
      script: yarn chromatic
```

For external pull requests (i.e forked repositories), the above code will ensure Chromatic runs with the `pr` build event, because Travis will not trigger `push` events for these cases.

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your Travis build to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your job will continue in such cases. For example:

```yml
# travis.yml

# Other required configuration

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      # 👇 Runs Chromatic with the flag to prevent workflow failure
      script: yarn chromatic --exit-zero-on-changes
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

When using `--exit-zero-on-changes` your build will still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block the build, you can use `yarn chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the build and the `Publish to Chromatic` job will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "main" branch

A clean `main` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `main` branch are passing.

If the builds are a result of direct commits to `main`, you will need to accept changes to keep the main branch clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `main`.

#### Squash/rebase merge and the "main" branch

We use GitHub, GitLab, and Bitbucket APIs respectively to detect squashing and rebasing so your baselines match your expectations no matter your Git workflow (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the workflow and include a new Chromatic job with the `--auto-accept-changes` flag. For example:

```yml
# travis.yml

# Other configuration here

jobs:
  include:
    # 👇 Checks if the branch is not main and runs Chromatic
    - name: "Publish to Chromatic"
      if: branch != main
      script: yarn chromatic
      # 👇 Checks if the branch is main and runs Chromatic with the flag to accept all changes
    - name: "Publish to Chromatic and auto accepts changes"
      if: branch = main
      script: yarn chromatic --auto-accept-changes
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally, you'll maintain a clean `main` branch.

If you want to test the changes introduced by the rebased branch, you can adjust your workflow and include a new step with the `ignore-last-build-on-branch` flag. For example:

```yml
# travis.yml

# Other required configuration

jobs:
  include:
    # Other jobs

    # 👇 Adds Chromatic as a job
    - name: "Publish to Chromatic"
      # 👇 Option to skip the last build on target branch
      script: yarn chromatic --ignore-last-build-on-branch=my-branch
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--ignore-last-build-on-branch` flag ensures the latest build for the specific branch is not used as a baseline.

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your project token where you configured the Chromatic command (often in `package.json` or in the pipeline step).

Sharing project tokens allows contributors and others to run Chromatic builds on your project, consuming your snapshot quota. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects that value community contributions.

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Dependabot automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `main` or `develop` branch.

To skip builds for `dependabot` branches, use the following:

```shell
chromatic --skip 'dependabot/**'
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```shell
chromatic --skip '@(renovate/**|dependabot/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
