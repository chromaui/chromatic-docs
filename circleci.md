---
layout: default
title: Automate Chromatic with CircleCI
description: Learn how to configure Chromatic with CircleCI
---

# Automate Chromatic with CircleCI

Chromatic's automation can be included as part of your CircleCI job with relative ease.

## Initial configuration

To integrate Chromatic with your existing workflow, you'll need to add the following:

```yml
# .circleci/config.yml

# Other configuration here

jobs:
  # Other jobs implemented in the workflow here
  # 👇 Adds Chromatic as a job
  chromatic-deployment: 
    docker:
      - image: circleci/node:12
    working_directory: ~/repo
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{% raw %}{{ checksum "package.json" }}{% endraw %}
            - v1-dependencies-
      - run: yarn install
        # Runs the Chromatic cli package
      - run: yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}


workflows:
   # 👇 Adds Chromatic to the workflow
  chromatic-deploy:
    jobs:
      - chromatic-deployment # 👈  Runs the Chromatic job implemented above
```

<div class="aside">
Read the official CircleCI <a href="https://circleci.com/docs/2.0/env-vars/">environment variables documentation</a>.
</div>

For extra security you'll need to configure your own environment variables. 


### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your workflow like so:

```yml
# .circleci/config.yml

# Other configuration here

jobs:
# Other jobs implemented in the workflow here

workflows:
  # 👇 Adds Chromatic to the workflow
  chromatic-deploy:
    jobs:
      - chromatic-deployment:
          filters: # 👈  filters the execution to run only on the main branch
            branches:
              only: main
```

<div class="aside">
Read the official CircleCI <a href="https://circleci.com/docs/2.0/configuration-reference/#filters">conditional job execution documentation</a>.
</div>

Now Chromatic will only run in the `main` branch.

### External Pull Requests

See this [CircleCI documentation](https://circleci.com/blog/triggering-trusted-ci-jobs-on-untrusted-forks/) for workflows related to pull requests from forked repositories.

### Advanced configuration

For a more complex workflow configuration, checkout this [Chromatic CircleCI Orb](https://circleci.com/orbs/registry/orb/wave/chromatic) made by a customer.

In there you'll find various scenarios that you can use depending on  your needs.


### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your Circle CI job to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your job will continue in such cases. For example:

```yml
# .circleci/config.yml

# Other configuration here

jobs:
  # Other jobs implemented in the workflow here
  # 👇 Adds Chromatic as a job
  chromatic-deployment: 
    # Other configuration here
    steps:
      # Other steps required for the job
      # 👇  --exit-zero-on-changes flag to prevent the workflow from failing
      - run: yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --exit-zero-on-changes

# Workflows here

```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

When using `--exit-zero-on-changes` your job will still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your job, you can use `yarn chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the workflow and the `chromatic-deployment` job will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "master" branch

A clean `master` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `master` branch are passing.

If the builds are a result of direct commits to `master`, you will need to accept changes to keep master clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `master`.

#### Squash/rebase merge and the "master" branch

We use GitHub, GitLab, and Bitbucket APIs respectively to detect squashing and rebasing so your baselines match your expectations no matter your Git workflow  (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the `chromatic` command and include the `--auto-accept-changes` flag. For example:

```bash
# .circleci/config.yml

# Other configuration and job here

# 👇 Checks if the current branch is not the master and runs Chromatic
if [ "${CIRCLE_BRANCH}" != "master" ];
then
  yarn chromatic --project-token=CHROMATIC_PROJECT_TOKEN
else
  # 👇 Checks if the current branch is master and runs Chromatic with the auto-accept-changes flag
  yarn chromatic --project-token=CHROMATIC_PROJECT_TOKEN --auto-accept-changes
fi
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally you'll maintain a clean `master` branch.

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or in the job).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Dependabot automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `master` or `develop` branch.

To skip builds for `dependabot` branches, use the following:

```bash
chromatic --skip 'dependabot/**'
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```bash
chromatic --skip '@(renovate/**|dependabot/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features