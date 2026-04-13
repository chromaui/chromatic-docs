---
title: Sharding
slug: vitest/sharding
description: Learn how to run Vitest tests in parallel across shared CI jobs
sidebar: { order: 3 }
---

# Sharded Vitest Runs

When running your Vitest tests over multiple shared CI jobs, you'll need to wait for all jobs to complete, ensuring the results are saved in either the default test results directory or a custom directory accessible by the next job as artifacts. You can then run Chromatic in a job that depends on all the shards.

See Vitest documentation [Vitest | Improving Performance | Sharding](https://vitest.dev/guide/improving-performance.html#sharding) for example how to merge Vitest's own test reports.

## GitHub Actions

If you're working with GitHub Actions, you can configure a job [matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) to run Vitest tests in parallel across multiple instances. Enabling this option will run a separate job for every combination of the provided values, merge the test results as a single artifact, and make them available to the Chromatic job when it runs.

```yaml title=".github/workflows/chromatic.yml"
name: "UI Tests"

on: push

jobs:
  vitest:
    name: Run Vitest
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 24.14.0

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright binaries
        run: npx playwright install

      - name: Run tests
        run: npx vitest run --shard=${{ matrix.shard }}/${{ strategy.job-total }}

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: chromatic-archives-${{ matrix.shard }}_${{ strategy.job-total }}
          path: .vitest/chromatic
          retention-days: 1

  chromatic:
    name: Run Chromatic
    needs: vitest
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v6
        with:
          node-version: 24.14.0

      - name: Install dependencies
        run: npm ci

      - name: Download all workflow run artifacts
        uses: actions/download-artifact@v4
        with:
          path: .vitest/chromatic
          pattern: chromatic-archives-*
          merge-multiple: true

      - name: Run Chromatic tests
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          vitest: true
```

## GitLab Pipelines

To run Vitest tests in parallel across shared CI jobs in GitLab, you can use the [`parallel`](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel) option in your GitLab CI workflow. The job will be split into multiple smaller jobs running in parallel sequentially named based on the values of the environment variables. The results will be saved as an artifact and accessible by the Chromatic job when it runs.

```yaml title=".gitlab-ci.yml"
# TODO
```

## CircleCI

To run Vitest tests in parallel across shared CI jobs in CircleCI, you can use the `parallelism` option in your CircleCI workflow to set the number of parallel jobs to run. You'll also need to override the default parallelization environment variables to allow the Vitest test runner to split the tests across the instances. When finished, the test results will be saved as an artifact and accessible by the Chromatic job when it runs.

```yaml title=".circleci/config.yml"
# TODO
```

## Jenkins

If you're working with Jenkins, you can configure your pipeline to run Vitest tests in parallel, distributed across multiple stages, save the test results as artifacts, and run Chromatic in a separate stage that depends on the test results from the previous job.

```groovy title="Jenkinsfile"
// TODO
```

## Semaphore

To run Vitest tests in parallel across shared CI jobs in Semaphore, you can use the [`parallelism`](https://docs.semaphore.io/reference/pipeline-yaml#parallelism-in-jobs) option in your workflow. The job will be split into multiple smaller jobs running in parallel sequentially named based on the values of the environment variables. The results will be saved as an artifact and accessible by the Chromatic job when it runs.

```yml title=".semaphore/semaphore.yml"
# TODO
```

## Other CI providers

If you’re using a different CI provider, you’ll need to adapt your workflow to run Vitest tests in parallel across shared CI jobs and enable Chromatic to run after all instances have finished. Here’s an example of how you might do this in a generic CI provider.

```yml title="your-workflow.yml"
# TODO
```
