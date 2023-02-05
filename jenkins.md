---
layout: default
title: Automate Chromatic with Jenkins
description: Learn how to configure Chromatic with Jenkins
---

# Automate Chromatic with Jenkins

Chromatic’s automation can be included as part of your Jenkins pipeline with relative ease.

### Setup

To integrate Chromatic with your existing [multistage pipeline](https://www.jenkins.io/doc/tutorials/build-a-multibranch-pipeline-project/), you'll need to add the following:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        /* 👇 Runs the Chromatic CLI */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}"
      }
    }
  }
}
```

<div class="aside">
For extra security, add Chromatic's <code>project-token</code> as an environment variable. See the official official Jenkins <a href="https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#using-environment-variables"> environment variables documentation</a>.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your `Jenkinsfile` like so:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {
      when {
        branch 'example' /* 👈 Filters the execution to run only on the main branch */
      }
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        /* 👇 Runs the Chromatic CLI */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}"
      }
    }
  }
}
```

<div class="aside">
Read the official Jenkins <a href="https://www.jenkins.io/doc/book/pipeline/syntax/"> conditional pipeline documentation</a>.
</div>

Now your pipeline will only run Chromatic in the `example` branch.

### Run Chromatic on large projects

Chromatic is prepared to handle large file uploads (with a limit of 5000 files, including stories and assets). If your project exceeds this limit, we recommend adjusting your workflow and run the `chromatic` command with the `--zip` flag to compress your build before uploading it. For example:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        /* 👇 Runs Chromatic with the flag to compress the build output. */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --zip"
      }
    }
  }
}
```

### Run Chromatic on monorepos

Chromatic can be run on monorepos that have multiple subprojects. Each subproject will need it's own project token stored as an environment variable.

#### Prerequisites

1. Ensure that you're in the correct working directory for the subproject.
2. Have `build-storybook` npm script in the subproject's `package.json` file OR explicitly name the script using the `buildScriptName` parameter and make sure the script is listed in the subproject's `package.json` file.

If you've already built your Storybook in a separate CI step, you can alternatively point the action at the build output using the `storybookBuildDir` parameter.

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN_1 = 'Chromatic project token'
        CHROMATIC_PROJECT_TOKEN_2 = 'Chromatic project token'
      }
      /* 👇 Runs Chromatic sequentially for each monorepo subproject. */
      steps {
        dir('packages/project_1/'){
          sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN_1}"
        }
        dir('packages/project_2/'){
          sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN_2}"}"
      }
    }
  }
}
```

If you want to run Chromatic in parallel for each subproject, you can use this snippet below.

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */
  stages {
     /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {

      /* 👇 Runs Chromatic in parallel for each monorepo subproject. */
      parallel {
        stage('Publish Project 1 to Chromatic') {
          environment {
            CHROMATIC_PROJECT_TOKEN_1 = 'Chromatic project token'
          }
          steps {
            dir('packages/project_1/'){
              sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN_1}"
            }
          }
        }
        stage('Publish Project 2 to Chromatic') {
          environment {
            CHROMATIC_PROJECT_TOKEN_2 = 'Chromatic project token'
          }
          steps {
            dir('packages/project_2/'){
              sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN_2}"
            }
          }
        }
      }
    }
}
```

### Enable TurboSnap

TurboSnap is an advanced Chromatic feature implemented to improve the build time for large projects, disabled by default once you add Chromatic to your CI environment. To enable it, you'll need to adjust your existing workflow and run the `chromatic` command with the `--only-changed` flag as follows:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        /* 👇 Enables Chromatic's TurboSnap feature. */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --only-changed"
      }
    }
  }
}
```

<div class="aside">

TurboSnap is highly customizable and can be configured to fit your requirements. For more information, read our [documentation](turbosnap).

</div>

### Overriding Chromatic's branch detection

If your Jenkins pipeline includes a set of rules for branches (e.g., renames the branch, creates ephemeral, or temporary branches) it can lead to unforeseen build errors.

In this case, you can adjust your workflow and include the `--branch-name` flag. This flag overrides Chromatic's default branch detection in favor of the specified branch:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
        YOUR_BRANCH='your-branch'
      }
      steps {
        /* 👇 Runs the Chromatic CLI --branch-name flag to override the baseline branch */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --branch-name=${YOUR_BRANCH}"
      }
    }
  }
}
```

Chromatic will now detect the correct branch and run your workflow. You can also apply this when fixing cross-fork UI comparisons.

### Recommended configuration for build events

Jenkins like CI systems offer the option of running builds for various types of events. For instance for commits pushed to a branch in a pull request. Or for "merge" commits between that branch and the base branch (main).

These specific types of commits (merge) don't persist in the history of your repository. That can cause Chromatic's baselines to be lost in certain situations.

If you're using the Jenkins [GitHub Pull Request plugin](https://github.com/jenkinsci/ghprb-plugin/blob/master/README.md), our recommendation for your pipeline is the following:

- Choose the `ghprbPullId` specifier for the `refspec`
- Ensure the Branch Specifier is set to `${ghprbActualCommit}`

If you're using other Jenkins plugins in your pipeline, refer to this [documentation](https://www.jenkins.io/doc/book/pipeline/multibranch/) for more information.

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your pipeline to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your pipeline will continue in such cases. For example:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage in the pipeline */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        /* 👇 Runs Chromatic with the flag to prevent stage failure */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --exit-zero-on-changes"
      }
    }
  }
}
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

When using `--exit-zero-on-changes` your pipeline will still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your pipeline, you can use `yarn chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the build and the `Publish to Chromatic` pipeline stage will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "main" branch

A clean `main` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `main` branch are passing.

If the builds are a result of direct commits to `main`, you will need to accept changes to keep the main branch clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `main`.

#### Squash/rebase merge and the "main" branch

We use GitHub, GitLab, and Bitbucket APIs respectively to detect squashing and rebasing so your baselines match your expectations no matter your Git workflow (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

If you’re using this functionality but notice the incoming changes were not accepted as baselines in Chromatic, then you'll need to adjust the pipeline and include a new Chromatic stage using the `--auto-accept-changes` flag. For example:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Checks if the current branch is not main and runs Chromatic */
    stage('Publish to Chromatic') {
      when {
        not {
          branch 'main'
        }
      }
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}"
      }
    }
    /* 👇 Checks if the current branch is main and runs Chromatic with the flag to accept all changes */
    stage('Publish to Chromatic and auto accept changes') {
      when {
        branch 'main'
      }
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --auto-accept-changes"
      }
    }
  }
}
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--auto-accept-changes` flag ensures all incoming changes will be accepted as baselines. Additionally, you'll maintain a clean `main` branch.

If you want to test the changes introduced by the rebased branch, you can adjust your workflow and include a new step with the `ignore-last-build-on-branch` flag. For example:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration. */

  stages {
    /* Other pipeline stages */

    /* 👇 Adds Chromatic as a stage in the pipeline */
    stage('Publish to Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
        /* 👇 Option to skip the last build on target branch */
        sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN} --ignore-last-build-on-branch=my-branch"
      }
    }
  }
}
```

<div class="aside">
Read our <a href="/docs/cli#chromatic-options"> CLI documentation</a>.
</div>

Including the `--ignore-last-build-on-branch` flag ensures the latest build for the specific branch is not used as a baseline.

#### Run Chromatic on external forks of open source projects

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or in the pipeline stage).

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
