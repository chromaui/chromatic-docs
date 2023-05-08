---
layout: default
title: Automate Chromatic with GitLab
description: Learn how to configure Chromatic with GitLab
---

# Automate Chromatic with GitLab Pipelines

Chromatic’s automation can be included as part of your GitLab pipeline workflow with relative ease.

### Setup

To integrate Chromatic with your existing pipeline, you'll need to add the following:

```yml
# .gitlab-ci.yml

# Sets the docker image for the job
image: node:latest

# Sets the stages for the pipeline
stages:
  - test

# Cache the dependencies
cache:
  key: $CI_COMMIT_REF_SLUG-$CI_PROJECT_DIR
  paths:
    - .yarn

# Installs the dependencies
before_script:
  - yarn install --frozen-lockfile --prefer-offline --cache-folder .yarn

# 👇 Adds Chromatic as a job
chromatic_publish:
  stage: test
  script:
    - yarn chromatic
```

<div class="aside">
For security, don't include the plaintext project token in your pipeline config file. Instead, store it as a secured environment variable named <code>CHROMATIC_PROJECT_TOKEN</code>. The <code>chromatic</code> script will automatically use <code>CHROMATIC_PROJECT_TOKEN</code>, no need to use the <code>--project-token</code> flag. See the official GitLab <a href="https://docs.gitlab.com/ee/ci/variables/index.html#predefined-variables-environment-variables">environment variables documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your pipeline like so:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

# 👇 Adds Chromatic as a job
chromatic_publish:
  stage: test
  script:
    - yarn chromatic

  #👇Filters the execution to run only on the main branch.
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: always
```

<div class="aside">
Read the official GitLab <a href="https://docs.gitlab.com/ee/ci/yaml/#rules">conditional pipeline documentation</a>.
</div>

Now your pipeline will only run Chromatic in the `main` branch.

### Run Chromatic on large projects

Chromatic is prepared to handle large file uploads (with a limit of 5000 files, including stories and assets). If your project exceeds this limit, we recommend adjusting your pipeline and run the `chromatic` command with the `--zip` flag to compress your build before uploading it. For example:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

# 👇 Adds Chromatic as a job
chromatic_publish:
  stage: test
  # 👇 Runs Chromatic with the flag to compress the build output.
  script:
    - yarn chromatic --zip
```

### Run Chromatic on monorepos

Chromatic can be run on monorepos that have multiple subprojects. Each subproject will need it's own project token.

#### Prerequisites

1. Ensure that you're in the correct working directory for the subproject.
2. Have `build-storybook` npm script in the subproject's `package.json` file OR explicitly name the script using the `buildScriptName` parameter and make sure the script is listed in the subproject's `package.json` file.

If you've already built your Storybook in a separate CI step, you can alternatively point the action at the build output using the `storybookBuildDir` parameter.

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

# 👇 Runs Chromatic in parallel for each monorepo subproject.
chromatic_publish_project_1:
  stage: test
  before_script:
    # Other steps
    - cd packages/project_1
  script:
    - yarn chromatic
  variables:
    CHROMATIC_PROJECT_TOKEN: $CHROMATIC_PROJECT_TOKEN_1

chromatic_publish_project_2:
  stage: test
  before_script:
    # Other steps
    - cd packages/project_2
  script:
    - yarn chromatic
  variables:
    CHROMATIC_PROJECT_TOKEN: $CHROMATIC_PROJECT_TOKEN_2
```

<div class="aside">
Additional paralellization can be achieved when configuring your workflow to run Chromatic on multiple subprojects. Read the official GitLab <a href="https://docs.gitlab.com/ee/ci/jobs/job_control.html#parallelize-large-jobs"> documentation</a>.
</div>

### Enable TurboSnap

TurboSnap is an advanced Chromatic feature implemented to improve the build time for large projects, disabled by default once you add Chromatic to your CI environment. To enable it, you'll need to adjust your existing workflow and run the `chromatic` command with the `--only-changed` flag as follows:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

# 👇 Adds Chromatic as a job
chromatic_publish:
  stage: test
  # 👇 Enables Chromatic's TurboSnap feature.
  script:
    - yarn chromatic --only-changed
```

<div class="aside">

TurboSnap is highly customizable and can be configured to fit your requirements. For more information, read our [documentation](turbosnap).

</div>

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your pipeline to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your step will continue in such cases. For example:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

# 👇 Adds Chromatic as a job
chromatic_publish:
  stage: test
  # 👇 Runs Chromatic with the flag to prevent pipeline failure
  script:
    - yarn chromatic --exit-zero-on-changes
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

#### GitLab squash/rebase merge and the "main" branch

GitLab's squash/rebase merge functionality creates new commits that have no association to the branch being merged. If you are already using this option, then we will automatically detect this situation and bring baselines over (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the pipeline and include the `--auto-accept-changes` flag. For example:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

  # 👇 Checks if the branch is main and runs Chromatic with the flag to accept all changes.
chromatic_publish_auto_accept_changes:
  stage: test
  script:
    - yarn chromatic --auto-accept-changes
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: always

  # 👇 Checks if the branch is not main and runs Chromatic
chromatic_publish:
  stage: test
  script:
    - yarn chromatic
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
      allow_failure: true
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally, you'll maintain a clean `main` branch.

If you want to test the changes introduced by the rebased branch, you can adjust your workflow and include a new step with the `ignore-last-build-on-branch` flag. For example:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

# 👇 Adds Chromatic as a job
chromatic_publish:
  stage: test
  script:
    # 👇 Option to skip the last build on target branch
    - yarn chromatic --ignore-last-build-on-branch=my-branch
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
