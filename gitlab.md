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

#👇Adds Chromatic as a job
chromatic_publish:
  stage: test
  script:
    - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

<div class="aside">
For extra security, add Chromatic's <code>project-token</code> as an environment variable. See the official GitLab <a href="https://docs.gitlab.com/ce/ci/variables/README.html#predefined-variables-environment-variables">environment variables documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your pipeline like so:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

#👇Adds Chromatic as a job
chromatic_publish:
  stage: test
  script:
    - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
    
  #👇Filters the execution to run only on the main branch.
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: always
```

<div class="aside">
Read the official GitLab <a href="https://docs.gitlab.com/ee/ci/yaml/#rules">conditional pipeline documentation</a>.
</div>

Now your pipeline will only run Chromatic in the `main` branch.

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

#👇Adds Chromatic as a job
chromatic_publish:
  stage: test
  #👇Runs Chromatic with the flag to prevent pipeline failure 
  script:
    - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN  --exit-zero-on-changes
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

Azure's squash/rebase merge functionality creates new commits that have no association to the branch being merged. If you are already using this option, then we will automatically detect this situation and bring baselines over (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the pipeline and include the `--auto-accept-changes` flag. For example:

```yml
# .gitlab-ci.yml

# Additional pipeline configurations

# Sets the stages for the pipeline
stages:
  - test

 #👇Checks if the branch is main and runs Chromatic with the flag to accept all changes.
chromatic_publish_auto_accept_changes:
  stage: test
  script:
    - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --auto-accept-changes
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: always

 #👇Checks if the branch is not main and runs Chromatic
chromatic_publish:
  stage: test
  script:
    - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
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

#👇Adds Chromatic as a job
chromatic_publish:
  stage: test
  script:
    # 👇 Option to skip the last build on target branch
    - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --ignore-last-build-on-branch=my-branch

```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--ignore-last-build-on-branch` flag ensures the latest build for the specific branch is not used as a baseline.

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or in the pipeline step).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Renovate automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `main` or `develop` branch.

To skip builds for `renovate` branches, use the following:

```bash
chromatic --skip 'renovate/**'
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```bash
chromatic --skip '@(renovate/**|your-custom-branch/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features