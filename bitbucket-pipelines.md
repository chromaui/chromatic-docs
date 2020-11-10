---
layout: default
title: Automate Chromatic with BitBucket
description: Learn how to configure Chromatic with BitBucket Pipelines
---

# Automate Chromatic with BitBucket Pipelines

Chromatic’s automation can be included as part of your BitBucket pipeline workflow with relative ease.

## Initial configuration

Assuming you have a similar configuration in your `bitbucket-pipelines.yml`:

```yml
# bitbucket-pipelines.yml

# pipeline image type
image: node:12.0.0 

# A sample pipeline implementation
pipelines:
  default:
    - step:
        name: 'Build and test'
        caches:
          - node
        script:
          - yarn install
          - yarn test
```

To integrate Chromatic with your existing pipeline, you'll need to add the following:

```yml
# bitbucket-pipelines.yml

# pipeline image type
image: node:12.0.0

# A sample pipeline implementation
pipelines:
  default:
    - step:
        name: 'Chromatic deployment'
        caches:
          - node
        script:
          - yarn install
          - yarn test
          # Runs Chromatic
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

For extra security you'll need to configure your own environment variables.

<div class="aside">
See the official BitBucket <a href="https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/">environment variables documentation</a> for more context.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run Chromatic on specific branches, adjust your pipeline like so:

```yml
# bitbucket-pipelines.yml

# pipeline image type
image: node:12.0.0

# A sample pipeline implementation
pipelines:
  default:
    - step:
        name: 'Chromatic Deployment'
        caches:
          - node
        script:
          - yarn install
          - yarn test
          - yarn chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
  branches:
    example:  # 👈  The example branch will display the message in the console as instead of running Chromatic.
      - step:
         script:
           - echo "Skipping Chromatic deployment"
```

Now your pipeline will run Chromatic in the `main` branch and the example `branch` will show a message.

<div class="aside">
For more information on conditional pipeline execution, see the official BitBucket <a href="https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/">documentation</a>.
</div>
