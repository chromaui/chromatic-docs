---
layout: default
title: Automate Chromatic with GitHub Actions
description: Learn how to configure Chromatic with GitHub Actions
---

# Automate Chromatic with GitHub Actions

Chromatic has a [GitHub Action](https://github.com/chromaui/action) to help you automate your visual regression tests and publish Storybook. 

## Initial configuration

In your `.github/workflows` directory, create a new file called `chromatic.yml` and add the following:

```yml
# .github/workflows/chromatic.yml

# name of our workflow
name: 'Chromatic Deployment'

# the event that will trigger the action
on: push

# list of jobs executed
jobs:
  chromatic-deployment:
    # Operating System
    runs-on: ubuntu-latest
    # steps that the action will go through
    steps:
      - name: Install dependencies
        run: yarn
        # 👇 Adds Chromatic as a step in the workflow
      - name: Deploy to Chromatic
        uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # Chromatic project token, refer to the manage page to obtain it.
          token: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
          projectToken: {% raw %}${{ secrets.CHROMATIC_PROJECT_TOKEN }}{% endraw %}
```

For extra security, you'll need to configure secrets. 

In a new browser window, navigate to your GitHub repository. Click the **Settings** tab, followed by **Secrets** and then **New secret**.

![GitHub Secrets workflow](img/secrets-workflow-optimized.png)

Fill in the form with the necessary information, as detailed below, replace `Value` with your own Chromatic project token.

![GitHub repository secret configured](img/github-repo-new-secret-filled.png)


Finish by clicking the **Add secret** button.

<div class="aside">
Read the official <a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets">GitHub secrets documentation</a>.
</div>

### Forked repositories

Secrets work at a repository level. Forked repositories will not have access to them. If you want to run Chromatic on cross-repository (forked) PRs, you'll need to make the `project-token` public in your `package.json` as part of a script:

```json
{
  scripts:{
    chromatic:"chromatic --project-token=CHROMATIC_PROJECT_TOKEN"
  }
}
```

<div class="aside">
Replace <code>CHROMATIC_PROJECT_TOKEN</code> with your own token obtained from Chromatic.
</div>

Or you could disable Chromatic on pull requests from forked repositories.

### Available options

Chromatic's GitHub Action includes additional options to customize your workflow. The table below lists what's currently available:


| Option                 | Description                                                                              | Type                  | Example value                              |
| ---------------------- | ---------------------------------------------------------------------------------------- | ----------------------| -------------------------------------------|
| **buildScriptName**    | The script that builds your Storybook                                                    | *String*              | <code>build-storybook</code>               |
| **storybookBuildDir**  | Provide a directory with your built Storybook.                                           | *String*              | <code>storybook-static</code>              |
| **allowConsoleErrors** | Do not exit when runtime errors occur in Storybook                                       | *N/A*                 | <code>N/A</code>                           |
| **autoAcceptChanges**  | Automatically accepts all changes in Chromatic                                           | *String* or *Boolean* | <code>my-branch</code> or <code>true</code>|
| **exitZeroOnChanges**  | Positive exit of action even when there are changes detected                             | *String* or *Boolean* | <code>my-branch</code> or <code>true</code>|
| **exitOnceUploaded**   | Exit with status 0 (OK) once the build has been sent to Chromatic                        | *String* or *Boolean* | <code>my-branch</code> or <code>true</code>|


### Support for `actions/checkout@v2` 

Version 2 of the `actions/checkout` is supported. But it comes with a caveat. It will only retrieve a single commit without any additional history. Chromatic needs the full Git history to keep track of changes in your repository. 

You'll need to make the following change to your workflow:

```yml
# .github/workflows/chromatic.yml

# Other configuration required

jobs:
  chromatic-deployment:
    steps:
        # 👇 version 2 of the action
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          fetch-depth: 0 # 👈  Required to retrieve git history
      - name: Install dependencies
        run: yarn
        # 👇 Adds Chromatic as a step in the workflow
      - name: Deploy to Chromatic
        uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # Chromatic project token, refer to the manage page to obtain it.
          projectToken: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
          token: {% raw %}${{ secrets.CHROMATIC_PROJECT_TOKEN }}{% endraw %}
```

<div class="aside">
 Read the official <a href="https://github.com/actions/checkout">GitHub Actions documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your workflow like so:

```yml
# .github/workflows/chromatic.yml

# Other necessary configuration

# 👇 Workflow event to be triggered when workflow executes
on:
  push:
    branches-ignore: 
      - 'example' # 👈  Excludes the example branch

# what the action will do
jobs:
  # The list of jobs and steps associated
```

<div class="aside">
Read the official <a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#example-ignoring-branches-and-tags">GitHub branch workflow documentation</a>.
</div>

Now Chromatic will run for any branch except `example`.

Other branches can also be included such as the ones created by the Renovate bot.


### Recommended configuration for build events

GitHub's Actions like other CI systems can run based on any type of event. Our recommendation is to run the Chromatic's step on `push` events. All other event types except `pull-request` will not work. 

The `pull-request` event requires special consideration. Like other CI systems, GitHub allows workflow execution on either commits pushed to a branch in a pull request. Or for "merge" commits between that branch and the base branch (master).

These specific types of commits (merge) don't persist in the history of your repository. That can cause Chromatic's baselines to be lost in certain situations. Hence why we recommend running Chromatic's step on `push`.

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your workflow step to fail if test snapshots render without errors (but with changes). To achieve this, pass the option `exitZeroOnChanges` to the `with` clause, and your workflow will continue in such cases. For example:

```yml
# .github/workflows/chromatic.yml

# Other necessary configuration

jobs:
  chromatic-deployment:
    steps:
        # 👇 Adds Chromatic as a step in the workflow
      - name: Deploy to Chromatic
        uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # Chromatic project token, refer to the manage page to obtain it.
          token: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
          projectToken: {% raw %}${{ secrets.CHROMATIC_PROJECT_TOKEN }}{% endraw %}
          exitZeroOnChanges: true # 👈  exitZeroOnChanges option to prevent the workflow from failing
```

<div class="aside">
Read about the <a href="#available-options">available options</a>.
</div>

When using `exitZeroOnChanges` your workflow will still stop and fail if your Storybook contains stories that error.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using the `exitZeroOnChanges` option. Once you accept all the changes, re-run the workflow and the `chromatic-deployment` job will pass.


If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new run) to get Chromatic to pass again.

#### Maintain a clean "master" branch

A clean `master` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `master` branch are passing.

If the builds are a result of direct commits to `master`, you will need to accept changes to keep master clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `master`.

#### GitHub squash/rebase merge and the "master" branch

GitHub's squash/rebase merge functionality creates new commits that have no association to the branch being merged. If you've enabled our GitHub application in the [UI Review](review) workflow, then we will automatically detect this situation and bring baselines over (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the workflow to include a new step with the `autoAcceptChanges` option. For example:

```yml
# .github/workflows/chromatic.yml

# Other necessary configuration for the action

jobs:
  chromatic-deployment:
    steps:
        # Other steps implemented in the GitHub Action
      
        # 👇 Checks if the current branch is not the master and runs Chromatic
      - name: Deploy to Chromatic
        if: github.ref != 'refs/heads/master' 
        uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # Chromatic project token, refer to the manage page to obtain it.
          token: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
          projectToken: {% raw %}${{ secrets.CHROMATIC_PROJECT_TOKEN }}{% endraw %}
        # 👇 Checks if the current branch is master and runs Chromatic with the autoAcceptChanges option
      - name: Deploy to Chromatic and auto accept changes
        if: github.ref == 'refs/heads/master' 
        uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          autoAcceptChanges: true
           # Chromatic project token, refer to the manage page to obtain it.
          token: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
          projectToken: {% raw %}${{ secrets.CHROMATIC_PROJECT_TOKEN }}{% endraw %}

```

<div class="aside">
Read about the <a href="#available-options">available options</a>.
</div>

Including the `autoAcceptChanges` option ensures all incoming changes will be accepted as baselines. Additionally you'll maintain a clean `master` branch.

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or in the workflow step).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Dependabot automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `master` or `develop` branch.

To skip builds for `dependabot` branches, use the following:

```
chromatic --skip 'dependabot/**'
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```
chromatic --skip '@(renovate/**|dependabot/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
