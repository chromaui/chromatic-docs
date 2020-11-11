---
layout: default
title: Automate Chromatic with Jenkins
description: Learn how to configure Chromatic with Jenkins
---

# Automate Chromatic with Jenkins

Chromatic’s automation can be included as part of your Jenkins pipeline with relative ease.

## Initial configuration

To integrate Chromatic with your existing [multistage pipeline](https://www.jenkins.io/doc/tutorials/build-a-multibranch-pipeline-project/), you'll need to add the following:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration here. */

  stages {
    /* Other stages implemented in the pipeline */

    /* 👇 Adds Chromatic as a stage in the pipeline */
    stage('Chromatic Deployment') {
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

For extra security you'll need to configure your own environment variables.

<div class="aside">
See the official Jenkins <a href="https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#using-environment-variables"> environment variables documentation</a> for more context.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your `Jenkinsfile` like so:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration here. */

  stages {
    /* Other stages implemented in the pipeline */
    
    /* 👇 Adds Chromatic as a stage in the pipeline */
    stage('Chromatic Deployment') {
      when {
        branch 'example' /* 👈  filters the execution to run only on the main branch */
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

Now your pipeline will only run Chromatic in the `example` branch.

<div class="aside">
For more information on conditional pipeline execution, see the official Jenkins <a href="https://www.jenkins.io/doc/book/pipeline/syntax/"> documentation</a>.
</div>

### Recommended configuration for build events

Jenkins like CI systems offer the option of running builds for various types of events. For instance for commits pushed to a branch in a pull request. Or for "merge" commits between that branch and the base branch (master).

These specific types of commits (merge) don't persist in the history of your repository. That can cause Chromatic's baselines to be lost in certain situations.

If you're using the Jenkins [GitHub pr plugin](https://github.com/jenkinsci/ghprb-plugin/blob/master/README.md), our recommendation for your pipeline is the following:

- Choose the `ghprbPullId` specifier for the `refspec`
- Ensure the Branch Specifier is set to `${ghprbActualCommit}`

If you're using other Jenkins plugins in your pipeline, refer to this [documentation](https://www.jenkins.io/doc/book/pipeline/multibranch/) for more information.

### UI Test and UI Review

[UI Tests](test) and [UI Review](review) rely on [branch and baseline](branching-and-baselines) detection to keep track of [snapshots](snapshots). We recommend the following configuration.

#### Command exit code for "required" checks

If you are using pull request statuses as required checks before merging, you may not want your pipeline to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your pipeline will continue in such cases.

When using `--exit-zero-on-changes` your pipeline will still stop and fail if your Storybook contains stories that error. If you'd prefer Chromatic _never_ to block your pipeline, you can use `yarn chromatic || true`.

#### Re-run failed builds after verifying UI test results

Builds that contain visual changes need to be [verified](test#verify-ui-changes). They will fail if you are not using `--exit-zero-on-changes`. Once you accept all the changes, re-run the build and the `chromatic` job will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new build) to get Chromatic to pass again.

#### Maintain a clean "master" branch

A clean `master` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `master` branch are passing.

If the builds are a result of direct commits to `master`, you will need to accept changes to keep master clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `master`.

<details>
<summary><h4 class="no-anchor">Squash/rebase merge and the "master" branch</h4></summary>

We use GitHub, GitLab, and Bitbucket APIs respectively to detect squashing and rebasing so your baselines match your expectations no matter your Git workflow (see [Branching and Baselines](branching-and-baselines#squash-and-rebase-merging) for more details).

Otherwise, Chromatic would not know which changes accepted on that branch should be baselines on `master`. What's more, you would have to re-review snapshots on `master` even if you already accepted them elsewhere.

And update your Jenkins pipeline to maintain a clean `master` branch. For example:

```groovy
/* JenkinsFile */

pipeline {
  /* Other pipeline configuration here. */

  stages {
    /* Other stages implemented in the pipeline */
    
    /* 👇 Checks if the current branch is not the master and runs Chromatic */
    stage('Deploy to Chromatic') {
      when { 
        not { 
          branch 'master' 
        } 
      }
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
         sh "yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}" 
      }
    }
     /* 👇 Checks if the current branch is master and runs Chromatic with the auto-accept-changes flag */
    stage('Deploy to Chromatic and auto accept changes') {
      when { 
         branch 'master'
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

</details>

<details>
<summary><h4 class="no-anchor">Run Chromatic on external forks of open source projects</h4></summary>

You can enable PR checks for external forks by sharing your `project-token` where you configured the Chromatic command (often in `package.json` or your CI config).

There are tradeoffs. Sharing `project-token`'s allows _contributors_ and others to run Chromatic. They'll be able to use your snapshots. They will not be able to get access to your account, settings, or accept baselines. This can be an acceptable tradeoff for open source projects who value community contributions.

</details>

#### Skipping builds for certain branches

Sometimes you might want to skip running a build for a certain branch, but still have Chromatic mark the latest commit on that branch as "passed". Otherwise pull requests could be blocked due to required checks that remain pending. To avoid this issue, you can run `chromatic` with the `--skip` flag. This flag accepts a branch name or glob pattern.

One use case for this feature is skipping builds for branches created by a bot. For instance, Dependabot automatically updates a projects dependencies. Although some dependencies can result in UI changes, you might not find it worthwhile to run Chromatic for every single dependency update. Instead, you could rely on Chromatic running against the `master` or `develop` branch.

To skip builds for `dependabot` branches, use the following:

```
chromatic --skip 'dependabot/**'
```

To apply this to multiple branches, use an "extended glob". See [picomatch] for details.

```
chromatic --skip '@(renovate/**|dependabot/**)'
```

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
