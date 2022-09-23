---
layout: default
title: Automate Chromatic with your custom CI provider
description: Learn how to configure Chromatic with a custom provider
---

# Automate Chromatic with a custom provider

Chromatic automation can be included as part of any CI provider with relative ease. We're here for you. Contact us through our in-app chat for further assistance.

### Setup

To integrate Chromatic with your existing CI provider, you'll need to add the following:

```yml
# your-workflow

- run:
    command: npm install # Installs dependencies
- run:
    command: npm test # Run your unit tests
- run:
    # 👇 Publish Storybook and run visual tests in Chromatic
    command: npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN
```

<div class="aside">
For extra security, add Chromatic's <code>project-token</code> as an environment variable. See your provider's documentation for reference.
</div>

### Run Chromatic on specific branches

Depending on the CI provider you're using, running Chromatic from a specific branch will not be a issue. Refer to your CI documentation for further details.

### Run Chromatic on large projects

Chromatic is prepared to handle large file uploads (with a limit of 5000 files, including stories and assets). If your project exceeds this limit, we recommend adjusting your workflow and run the `chromatic` command with the `--zip` flag to compress your build before uploading it. For example:

```yml
# your-workflow
- run:
    #👇Runs Chromatic with the flag to compress the build output.
    command: npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN --zip
```

### Run Chromatic on Monorepos

Chromatic can be run on monorepos that have multiple subprojects. Each subproject will need it's own project token stored as an environment variable.

```yml
# your-workflow
- run:
    #👇Runs Chromatic with the flag to compress the build output.
    command: cd pacakges/project_1 && npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN_1
- run:
    #👇Runs Chromatic with the flag to compress the build output.
    command: cd pacakges/project_2 && npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN_1
```

When running Chromatic for the subproject, you will need to ensure that you are in the correct working directory for the subproject along with either having a `build-storybook` npm script in the subproject's `package.json` file or explicitly naming the script using the `buildScriptName` parameter and making sure the script is listed in the subproject's `package.json` file. Alternatively, you could build the storybook in a separate step and then point the action at the build output using the `storybookBuildDir` parameter

### Overriding Chromatic's branch detection

If your worflow includes a set of rules for branches (e.g., renames the branch, creates ephemeral, or temporary branches) it can lead to unforeseen build errors.

In this case, you can adjust your workflow and include the `--branch-name` flag. This flag overrides Chromatic's default branch detection in favor of the specified branch:

```yml
# your-workflow
- run:
    # 👇 Runs the Chromatic CLI with the --branch-name flag to override the baseline branch
    command: npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN --branch-name=${YOUR_BRANCH}
```

Chromatic will now detect the correct branch and run your workflow. You can also apply this when fixing cross-fork UI comparisons.

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your build to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your job will continue in such cases. For example:

```yml
# your-workflow

# Your custom CI implementation

- run:
    # 👇 Runs Chromatic with the flag to prevent stage failure
    command: npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN --exit-zero-on-changes
```

<div class="aside">
Read our official <a href="/docs/cli#chromatic-options">CLI documentation</a>.
</div>

When using `--exit-zero-on-changes` your job will still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your job, you can use `npm run chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the workflow and the job will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "main" branch

A clean `main` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `main` branch are passing.

If the builds are a result of direct commits to `main`, you will need to accept changes to keep the main branch clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `main`.

#### Squash/rebase merge and the "main" branch

We use GitHub, GitLab, and Bitbucket APIs respectively to detect squashing and rebasing so your baselines match your expectations no matter your Git workflow (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the `chromatic` command and include the `--auto-accept-changes` flag. For example:

```yml
# your-workflow

# Your custom CI implementation

- run:
    # 👇 Checks if the current branch is not main and runs Chromatic
    if: branch != main
      command: npm run chromatic --project-token=CHROMATIC_PROJECT_TOKEN
    # 👇 Checks if the current branch is main and accepts all changes in Chromatic
    else:
      command: npm run chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --auto-accept-changes
```

<div class="aside">
Read our official <a href="/docs/cli#chromatic-options">CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally you'll maintain a clean `main` branch.

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or in the workflow).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

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
