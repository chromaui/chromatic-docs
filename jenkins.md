---
layout: default
title: Automate Chromatic with Jenkins
description: Learn how to configure Chromatic with Jenkins
---

# Automate Chromatic with Jenkins

Chromatic’s automation can be included as part of your Jenkins pipeline with relative ease.

## Initial configuration

Assuming you have configured a [multistage pipeline](https://www.jenkins.io/doc/tutorials/build-a-multibranch-pipeline-project/) and you have a similar configuration in your `Jenkinsfile`:

```groovy
/* JenkinsFile */

pipeline {
  agent any
  /* See plugin documentation (https://plugins.jenkins.io/nodejs/) */
  tools {nodejs "node"}

  stages {
    stage('Install dependencies') {
      steps {
        sh 'yarn install'
      }
    }
    stage('Run tests') {
      steps {
        sh 'yarn test'
      }
    }
}
```

To integrate Chromatic with your existing pipeline, you'll need to add the following:

```groovy
/* JenkinsFile */

pipeline {
  agent any
  /* See plugin documentation (https://plugins.jenkins.io/nodejs/) */
  tools {nodejs "node"}

  stages {
    stage('Install dependencies') {
      steps {
        sh 'yarn install'
      }
    }
    stage('Run tests') {
      steps {
        sh 'yarn test'
      }
    }
    /* Adds Chromatic as a stage in the pipeline */
    stage('Chromatic Deployment') {
      environment {
        CHROMATIC_PROJECT_TOKEN = 'Chromatic project token'
      }
      steps {
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
pipeline {
  agent any
   /* See plugin documentation (https://plugins.jenkins.io/nodejs/) */
  tools {nodejs "node"}

  stages {
    stage('Install dependencies') {
      steps {
        sh 'yarn install'
      }
    }

    stage('Chromatic Deployment') {
      when {
        branch 'example' /* 👈  filters the execution to run only on the main branch */
      }
      environment {
        CHROMATIC_PROJECT_TOKEN = '84svyadsh4w'
      }
      steps {
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
