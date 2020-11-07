---
layout: default
title: Automate Chromatic with CircleCI
description: Learn how to configure Chromatic with CircleCI
---

# Automate Chromatic with CircleCI

Chromatic's automation can be included as part of your CircleCI job with relative ease.

With a small change to your current implementation you'll get your Storybook published and visual testing up and running.

## Initial configuration

Assuming you have a similar configuration in your `.circleci/config.yml`:

```yml
# .circleci/config.yml

version: 2
jobs:
  build:
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
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{% raw %}{{ checksum "package.json" }}{% endraw %}
  test:
    docker:
      - image: circleci/node:12
    working_directory: ~/repo
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{% raw %}{{ checksum "package.json" }}{% endraw %}
            - v1-dependencies-
      - run: yarn test

workflows:
  version: 2
  build-and-test:
    jobs:
      - build
      - test
```

To integrate Chromatic with your existing workflow, you'll need to add the following:

```yml
# .circleci/config.yml

version: 2
jobs:
  build:
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
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{% raw %}{{ checksum "package.json" }}{% endraw %}
  test:
    docker:
      - image: circleci/node:12
    working_directory: ~/repo
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{% raw %}{{ checksum "package.json" }}{% endraw %}
            - v1-dependencies-
      - run: yarn test
  # Adds Chromatic as a job
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
  version: 2
  build-and-chromatic-deploy:
    jobs:
      - build
      - test
      - chromatic-deployment # Runs the Chromatic job implemented above
```

For extra security you'll need to configure your own environment variables. 

<div class="aside">
See the official CircleCI <a href="https://circleci.com/docs/2.0/env-vars/">documentation</a> for more context.
</div>

### Branch protection

If you need to customize your workflow to run only on specific branches, you can do so. Change your workflow to the following:

```yml
# .circleci/config.yml

version: 2
jobs:
  build:
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
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{% raw %}{{ checksum "package.json" }}{% endraw %}
  # Adds Chromatic as a job
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
      - run: yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}

workflows:
  version: 2
  build-and-chromatic-deploy:
    jobs:
      - build
      - test
      - chromatic-deployment:
          requires:
            - build
          filters: # filter the execution to run only on the main branch
            branches:
              only: main
```
Now Chromatic will only run in the `main` branch.


<div class="aside">
For more information on conditional job execution, see the official CircleCI <a href="https://circleci.com/docs/2.0/configuration-reference/#filters">documentation</a>.
</div>

### External Pull Requests

See this [documentation](https://circleci.com/blog/triggering-trusted-ci-jobs-on-untrusted-forks/) for workflows related to pull requests from forked repositories.

### Advanced configuration

For a more complex workflow configuration, checkout this [Chromatic CircleCI Orb](https://circleci.com/orbs/registry/orb/wave/chromatic) made by a customer.

In there you'll find various scenarios that you can use depending on  your needs.