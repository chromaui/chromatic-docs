---
layout: default
title: Automate Chromatic with Travis CI
description: Learn how to configure Chromatic with Travis CI
---

# Automate Chromatic with Travis CI

Chromatic's automation can be included as part of your Travis CI job with relative ease.

## Initial configuration

Assuming you have the following configuration in your `travis.yml`:

```yml
# travis.yml

language: node_js
os: linux
dist: xenial

node_js:
  - 12

before_script:
  - yarn install

cache: yarn

jobs:
  include:
   - name: 'test'
     script: yarn test
```

To integrate Chromatic with your workflow, add the following:

```yml
#travis.yml

language: node_js
os: linux
dist: xenial

node_js:
  - 12

before_script:
  - yarn install

cache: yarn

jobs:
  include:
  - name: 'test'
     script: yarn test
     # Run Chromatic 
   - name: 'Chromatic Deployment'
     script: yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}
```

For extra security you'll need to configure your own environment variables.

<div class="aside">
See the official Travis CI <a href="https://docs.travis-ci.com/user/environment-variables/"> environment variables documentation</a> for more context.
</div>

### Run Chromatic on specific branches

If you need to customize your workflow to run on specific branches, you can do so. Change your `travis.yml` to the following:

```yml
# travis.yml
language: node_js
os: linux
dist: xenial

node_js:
  - 12

before_script:
  - yarn install

cache: yarn


branches:
  only: main # 👈  filters the execution to run only on the main branch

jobs:
  include:
  - name: 'test'
     script: yarn test
     # Run Chromatic 
   - name: 'Chromatic Deployment'
     script: yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}
```

<div class="aside">
For more information on conditional builds, see the official Travis CI <a href="https://docs.travis-ci.com/user/conditional-builds-stages-jobs/">documentation</a>
</div>

### Recommended configuration for build events

Travis CI like other CI systems offer the option of running builds for various types of events. For instance for commits pushed to a branch in a pull request. Or for "merge" commits between that branch and the base branch (master).

These specific types of commits (merge) don't persist in the history of your repository. That can cause Chromatic's baselines to be lost in certain situations. 

For internal pull requests (ie. pull requests that aren't from forks) we recommend disabling Chromatic on `pr` build events. Also make sure you have `push` builds enabled in your settings. 

Once these conditions are met, add the following code to your `.travis.yml`:

```yml
# travis.yml

jobs:
  include:
  - name: 'test'
     script: yarn test
   - name: 'Chromatic Deployment'
     if: (type = push OR head_repo != repo )
     script: yarn chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}
```

For external pull requests (i.e forked repositories), the above code will ensure Chromatic runs with the `pr` build event, because Travis will not trigger `push` events for these cases.