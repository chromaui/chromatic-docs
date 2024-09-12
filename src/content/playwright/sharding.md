---
layout: "../../layouts/Layout.astro"
title: Sharding
slug: playwright/sharding
description: Learn how to run Playwright tests in parallel across shared CI jobs
sidebar: { order: 3 }
---

# Sharded Playwright Runs

When running your Playwright tests over multiple shared CI jobs, you'll need to wait for all jobs to complete, ensuring the results are saved in either the default test results directory or a custom directory accessible by the next job as artifacts. You can then run Chromatic in a job that depends on all the shards.

## GitHub Actions

If you're working with GitHub Actions, you can configure a job [matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) to run Playwright tests in parallel across multiple instances. Enabling this option will run a separate job for every combination of the provided values, merge the test results as a single artifact, and make them available to the Chromatic job when it runs.

```yaml title=".github/workflows/chromatic.yml"
name: "UI Tests"

on: push

jobs:
  playwright:
    name: Run Playwright
    strategy:
      matrix:
        shard: [1, 2]
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.47.0-jammy
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.job-total }}
        env:
          HOME: /root
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.shard }}_${{ strategy.job-total }}
          path: ./test-results/chromatic-archives
          retention-days: 30

  chromatic:
    name: Run Chromatic
    needs: playwright
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci

      - name: Download all workflow run artifacts
        uses: actions/download-artifact@v4
        with:
          path: ./test-results/chromatic-archives
          pattern: playwright-report-*
          merge-multiple: true

      - name: Run Chromatic tests
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          playwright: true
```

## GitLab Pipelines

To run Playwright tests in parallel across shared CI jobs in GitLab, you can use the [`parallel`](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel) option in your GitLab CI workflow. The job will be split into multiple smaller jobs running in parallel sequentially named based on the values of the environment variables. The results will be saved as an artifact and accessible by the Chromatic job when it runs.

```yaml title=".gitlab-ci.yml"
image: node:iron

stages:
  - UI_Tests

cache:
  key: $CI_COMMIT_REF_SLUG-$CI_PROJECT_DIR
  paths:
    - .npm/

before_script:
  - npm ci

Playwright:
  stage: UI_Tests
  needs: []
  image: mcr.microsoft.com/playwright:v1.47.0-jammy
  parallel: 2
  script:
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  allow_failure: true
    when: always
    paths:
      - "test-results/"
    expire_in: 4 weeks
Chromatic:
  stage: UI_Tests
  needs: [Playwright]
  script:
    - npx chromatic --playwright --project-token=$CHROMATIC_PROJECT_TOKEN
```

## CircleCI

To run Playwright tests in parallel across shared CI jobs in CircleCI, you can use the `parallelism` option in your CircleCI workflow to set the number of parallel jobs to run. You'll also need to override the default parallelization environment variables to allow the Playwright test runner to split the tests across the instances. When finished, the test results will be saved as an artifact and accessible by the Chromatic job when it runs.

```yaml title=".circleci/config.yml"
version: 2.1

executors:
  pw-jammy-development:
    docker:
      - image: mcr.microsoft.com/playwright:v1.47.0-jammy
  chromatic-ui-testing:
    docker:
      - image: cimg/node:20.12.2

jobs:
  Playwright:
    executor: pw-jammy-development
    parallelism: 2
    working_directory: ~/repo
    steps:
      - checkout
      - restore_cache:
          name: Restore NPM cache
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies-
      - run:
          name: "Install Playwright dependencies"
          command: npm ci
      - run:
          name: "Run Playwright tests"
          command: SHARD="$((${CIRCLE_NODE_INDEX}+1))"; npx playwright test --shard=${SHARD}/${CIRCLE_NODE_TOTAL}
          when: always
      - store_artifacts:
          path: ./test-results
      - persist_to_workspace:
          root: .
          paths:
            - test-results
  Chromatic:
    executor: chromatic-ui-testing
    working_directory: ~/repo
    steps:
      - checkout
      - restore_cache:
          name: Restore NPM cache
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies-
      - run: npm ci
      - attach_workspace:
          at: .
      - run:
          name: "Run Chromatic"
          command: npx chromatic --playwright --project-token=${CHROMATIC_PROJECT_TOKEN}
workflows:
  UI_Tests:
    jobs:
      - Playwright
      - Chromatic:
          requires:
            - Playwright
```

## Jenkins

If you're working with Jenkins, you can configure your pipeline to run Playwright tests in parallel, distributed across multiple stages, save the test results as artifacts, and run Chromatic in a separate stage that depends on the test results from the previous job.

```groovy
// Jenkinsfile

pipeline {
  agent any
  tools {nodejs "node"}

  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }
     stage('Playwright'){
      environment {
        MAX_SHARDS = '2'
      }
      parallel {
        stage('Shard #1') {
          agent {
            docker {
              image 'mcr.microsoft.com/playwright:v1.47.0-jammy'
              reuseNode true
            }
          }
          environment {
            SHARD = '1'
          }
          steps {
            sh 'npm ci'
            sh "npx playwright test --shard=${SHARD}/${env.MAX_SHARDS}"
          }
          post {
            always {
              archiveArtifacts 'test-results/**'
            }
          }
        }
        stage('Shard #2') {
          agent {
            docker {
              image 'mcr.microsoft.com/playwright:v1.47.0-jammy'
              reuseNode true
            }
          }
          environment {
            SHARD = '2'
          }
          steps {
            sh 'npm ci'
            sh "npx playwright test --shard=${SHARD}/${env.MAX_SHARDS}"
          }
          post {
            always {
              archiveArtifacts 'test-results/**'
            }
          }
        }
      }
    }
    stage('Chromatic') {
      environment {
        CHROMATIC_PROJECT_TOKEN = credentials('chromatic-project-token')
      }
      steps {
        sh "npx chromatic --playwright"
      }
    }
  }
}
```

## Other CI providers

If you’re using a different CI provider, you’ll need to adapt your workflow to run Playwright tests in parallel across shared CI jobs and enable Chromatic to run after all instances have finished. Here’s an example of how you might do this in a generic CI provider.

```yml title="your-workflow.yml"
image: node:iron

- run:
    name: "Playwright"
    displayName: "Run Playwright tests"
    container: mcr.microsoft.com/playwright:v1.47.0-jammy
    options:
      parallel: 2
      artifacts:
        - test-results/**
    command: npx playwright test --shard=$CI_JOB_INDEX/CI_TOTAL_JOBS
- run:
    name: "Chromatic"
    displayName: "Run Chromatic"
    requires: [Playwright]
    command: npx chromatic --playwright --project-token=$CHROMATIC_PROJECT_TOKEN
```
