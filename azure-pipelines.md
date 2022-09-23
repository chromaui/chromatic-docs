---
layout: default
title: Automate Chromatic with Azure
description: Learn how to configure Chromatic with Azure
---

# Automate Chromatic with Azure Pipelines

Chromatic’s automation can be included as part of your [multistage Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/stages?view=azure-devops&tabs=yaml) workflow with relative ease.

### Setup

To integrate Chromatic with your existing pipeline, you'll need to add the following:

```yml
# azure-pipelines.yml

#👇Event to trigger pipeline execution
trigger:
  - main

#👇Environment variables created for Chromatic
variables:
  - group: chromatic-keys

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy
        displayName: Install packages and publishes to Chromatic
        variables:
          # Sets scoped environment variable to cache packages
          npm_config_cache: $(Pipeline.Workspace)/.npm
        # List of steps
        steps:
          #👇Installs and configures Node environment
          - task: NodeTool@0
            inputs:
              versionSpec: "12.x"
            displayName: "Install Node.js"
          - task: Cache@2
            displayName: Install and cache packages
            inputs:
              key: 'npm | "$(Agent.OS)" | package-lock.json'
              restoreKeys: |
                npm | "$(Agent.OS)"
              path: $(npm_config_cache)
          - script: npm ci
            condition: ne(variables.CACHE_RESTORED, 'true')
            #👇 Adds Chromatic as a step
          - task: CmdLine@2
            displayName: Publish to Chromatic
            inputs:
              #👇Runs Chromatic
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}
```

<div class="aside">
For extra security, add Chromatic's <code>project-token</code> as an environment variable. See the official Azure <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml">environment variables documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your pipeline like so:

```yml
# azure-pipelines.yml

#👇Event to trigger pipeline execution
trigger:
  branches:
    include:
      - main # 👈 Filters the execution to run only on the main branch
    exclude:
      - example

#👇Configures pipeline execution on pull requests
pr:
  branches:
    include:
      - main # 👈 Filters the execution to run only on the pull requests for the main branch
    exclude:
      - example
# Additional pipeline configurations
```

<div class="aside">
Read the official Azure <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/build/triggers?view=azure-devops">conditional pipeline documentation</a>.
</div>

Now your pipeline will only run Chromatic in the `main` branch.

### Run Chromatic on large projects

Chromatic is prepared to handle large file uploads (with a limit of 5000 files, including stories and assets). If your project exceeds this limit, we recommend adjusting your pipeline and run the `chromatic` command with the `--zip` flag to compress your build before uploading it. For example:

```yml
# azure-pipelines.yml

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy
        displayName: Publish to Chromatic
        steps:
          # Other steps in the pipeline

          #👇Adds Chromatic as a step in the pipeline
          - task: CmdLine@2
            displayName: Publish to Chromatic
            inputs:
              #👇Runs Chromatic with the flag to compress the build output.
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --zip
```

### Run Chromatic on Monorepos

Chromatic can be run on monorepos that have multiple subprojects. Each subproject will need its own project token stored as an environment variable.

```yml
# azure-pipelines.yml

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy_1
        displayName: Publish Project 1 to Chromatic
        steps:
          # Other steps in the pipeline

          #👇Adds Chromatic as a step in the pipeline
          - task: CmdLine@2
            displayName: Publish Project 1 to Chromatic
            inputs:
              #👇Runs Chromatic with the flag to compress the build output.
              script: cd pacakges/project_1 && npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN_1}
      - job: Chromatic_Deploy_2
        displayName: Publish Project 2 to Chromatic
        steps:
          # Other steps in the pipeline

          #👇Adds Chromatic as a step in the pipeline
          - task: CmdLine@2
            displayName: Publish Project 2 to Chromatic
            inputs:
              #👇Runs Chromatic with the flag to compress the build output.
              script: cd pacakges/project_2 && npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN_2}
```

Requirements for running Chromatic in a subproject: 

1. Ensure that you're in the correct working directory for the subproject. 
2. Have `build-storybook` npm script in the subproject's `package.json` file OR explicitly name the script using the `buildScriptName` parameter and make sure the script is listed in the subproject's `package.json` file. 

If you've already built your Storybook in a separate CI step, you can alternatively point the action at the build output using the `storybookBuildDir` parameter.

### Overriding Chromatic's branch detection

If your Azure pipeline includes a set of rules for branches (e.g., renames the branch, creates ephemeral, or temporary branches) it can lead to unforeseen build errors.

In this case, you can adjust your workflow and include the `--branch-name` flag. This flag overrides Chromatic's default branch detection in favor of the specified branch:

```yml
# azure-pipelines.yml

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy
        displayName: Publish to Chromatic
        steps:
          # Other steps in the pipeline

          #👇Adds Chromatic as a step in the pipeline
          - task: CmdLine@2
            displayName: Publish to Chromatic
            inputs:
              #👇Runs Chromatic with the --branch-name flag to override the baseline branch
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --branch-name=${YOUR_BRANCH}
```

Chromatic will now detect the correct branch and run your workflow. You can also apply this when fixing cross-fork UI comparisons.

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your pipeline to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your step will continue in such cases. For example:

```yml
# azure-pipelines.yml

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy
        displayName: Publish to Chromatic
        steps:
          # Other steps in the pipeline

          #👇Adds Chromatic as a step in the pipeline
          - task: CmdLine@2
            displayName: Publish to Chromatic
            inputs:
              #👇Runs Chromatic with the flag to prevent pipeline failure
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --exit-zero-on-changes
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

When using `--exit-zero-on-changes` your pipeline execution still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your pipeline, you can use `npx chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the pipeline and the `Publish to Chromatic` step will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "main" branch

A clean `main` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `main` branch are passing.

If the builds are a result of direct commits to `main`, you will need to accept changes to keep the main branch clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `main`.

#### Azure squash/rebase merge and the "main" branch

Azure's squash/rebase merge functionality creates new commits that have no association to the branch being merged. If you are already using this option, then we will automatically detect this situation and bring baselines over (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the pipeline and include the `--auto-accept-changes` flag. For example:

```yml
# azure-pipelines.yml

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy
        displayName: Publish to Chromatic
        steps:
          # Other steps in the pipeline

          #👇Checks if the branch is main and runs Chromatic with the flag to accept all changes.
          - task: CmdLine@2
            displayName: Publish to Chromatic and auto accept changes
            condition: and(succeeded(), eq(variables['build.sourceBranch'], 'refs/heads/main'))
            inputs:
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --auto-accept-changes
            #👇 Checks if the branch is not main and runs Chromatic
          - task: CmdLine@2
            displayName: Publish to Chromatic
            condition: eq(variables['Build.Reason'], 'PullRequest')
            inputs:
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally, you'll maintain a clean `main` branch.

If you want to test the changes introduced by the rebased branch, you can adjust your workflow and include a new step with the `ignore-last-build-on-branch` flag. For example:

```yml
# azure-pipelines.yml

# Other configurations

# Pipeline stages
stages:
  - stage: Test
    displayName: Chromatic Testing
    # Job list
    jobs:
      - job: Chromatic_Deploy
        displayName: Publish to Chromatic
        steps:
          # Other steps in the pipeline

          #👇 Option to skip the last build on target branch
          - task: CmdLine@2
            displayName: Publish to Chromatic
            inputs:
              script: npx chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --ignore-last-build-on-branch=my-branch
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
