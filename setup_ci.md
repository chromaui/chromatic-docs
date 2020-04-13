---
layout: default
title: Setup CI & PRs
description: Learn how to setup Chromatic in your continuous integration tool
---

# Setup CI and PR badging

Configure CI to publish your storybook and run Chromatic's automation whenever you push code. Badge your PRs to get notified about test and review results.

![Chromatic CI workflow](img/workflow-approve.png)

---

## Configure CI

Before we begin, make sure you set the `CHROMATIC_APP_CODE` environment variable when you run CI builds in your CI service's configuration.

Integration with popular CI tools is painless. Just run `npm run chromatic` as part of your regular CI process. It will return a non-zero exit code if there are changes to your UI. For example, with [CircleCI's](https://circleci.com) `.circleci/config.yml`, you might have:

```yml
- run:
    command: npm install # install dependencies
- run:
    command: npm lint # lint your code
- run:
    command: npm test # run your unit tests
- run:
    command: npm run chromatic # publish storybook and run visual tests
```

If any of those steps fails, your CI build will fail.

### Command exit code

If you are using pull request statuses to as required checks before merging, you may not want your CI job to fail if test snapshots render without errors (but with changes). To achieve this, pass the flag `--exit-zero-on-changes` to the `chromatic` command, and your CI job will continue in such cases.

### Re-run failed builds after reviewing test results

Builds that contain visual changes need to be [reviewed](/builds)--if you are not using `--exit-zero-on-changes` they will fail. Once you accept all the changes, re-run the build using your CI tool and the `chromatic` job will pass.

If you deny any change, you will need to make the necessary code changes to fix the test (and thus start a new CI build) to get Chromatic to pass again.

### Maintain a clean "master" branch

A clean `master` branch is a development **best practice** and **highly recommended** for Chromatic. In practice, this means ensuring that test builds in your `master` branch are passing.

If the builds are a result of direct commits to `master`, you will need to accept changes to keep master clean. If they're merged from `feature-branches`, you will need to make sure those branches are passing _before_ you merge into `master`.

**Note:** If you use GitHub's squash/rebase merge functionality, add the `--auto-accept-changes` flag to `chromatic`. This means you won't need to re-review snapshots on `master` if you're already accepted them elsewhere. For example:

```bash
if [ "${CIRCLE_BRANCH}" != "master" ];
then
  yarn chromatic
else
  # We know any changes that make it to master *must* have been approved
  yarn chromatic --auto-accept-changes
fi
```

### Pull Request builds

Several CI systems offer the option of running build on either the commit that was pushed to a branch for a PR, or on a "merge" commit between that branch and the base branch (typically `master`).

As that merge commit does not actually persist in the history of your git repository, running builds on the merge commit can cause Chromatic's baselines to be lost in certain situations. As such we advise not running Chromatic tests on such commits and instead running them on the regular "push" commits. How to do this differs depending on your CI provider:

- For Travis, ensure you run Chromatic on `push` builds. Read more [below](#travis).

- For GitHub Actions, choose the [`push` event](https://help.github.com/en/articles/events-that-trigger-workflows#webhook-events).

- For Jenkins' GitHub PR plugin, choose the [`ghprbPullId` specifier](https://github.com/jenkinsci/ghprb-plugin/blob/master/README.md).

---

### Configuring specific CI services

#### GitHub Actions

If you're using Github, it's easy to integrate Chromatic with our Github Action: https://github.com/chromaui/action

You can add it to a workflow like so:

```
- uses: chromaui/action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    appCode: ${{ secrets.CHROMATIC_APP_CODE }}
```

You'll need to configure secrets in the settings tab at `https://github.com/{YOUR_ORGANSATION}/{YOUR_REPOSITORY}/settings/secrets`

GitHub actions can run based on any github event, but we recommend to run the workflow containing the chromatic step on `push` event. The action will work on `pull-request` events too, although [it comes with some caveats](https://docs.chromatic.com/setup_ci#pull-request-builds). All other events will not.

For external PRs (PRs from forks of your repo) to receive the chromatic appCode, you'll have to make the appCode public by placing it in your `package.json`. Alternatively, you could disable Chromatic on external PRs or duplicate external PRs inside your repository.

#### Travis

Travis offers two type of builds for commits on pull requests: so called `pr` and `push` builds. It only makes sense to run Chromatic once per PR, so we suggest disabling Chromatic on `pr` builds for internal PRs (i.e. PRs that aren't from forks). You should make sure that you have `push` builds turned on, and add the following code:

```bash
if [[ $TRAVIS_EVENT_TYPE != 'pull_request' ||  $TRAVIS_PULL_REQUEST_SLUG != $TRAVIS_REPO_SLUG ]];
then
  npm run chromatic
fi
```

For external PRs (PRs from forks of your repo), the above code will ensure Chromatic does run on the `pr` build, because Travis does not trigger `push` builds in such cases.

<div class="aside">
<p><b>Note:</b> We recommend running Chromatic on <code>push</code> builds as <code>pr</code> builds can't always run and fall out of the normal git ancestry. For instance, if you change the base branch of a PR, you may find that you need to re-approve changes as some history may be lost.</p>

<p>Chromatic does work with Travis <code>pr</code> builds however!</p>
</div>

#### Hiding the persistent CI messages

Chromatic detects CI test runs for most services. But it's not possible for every system, which results in users seeing persistent "Setup CI / Automation" messages in the UI.

If this is happening to you, prepend `CI=true` to your test command like so `CI=true yarn chromatic...` to hide the "Setup CI" messages in Chromatic. [Learn more](/test#available-options)

#### GitHub's squash/rebase merge

GitHub's squash/rebase merge functionality creates new commits that have no association to branch being merged, so it is difficult for Chromatic to know that changes accepted on that branch should now be baselines on `master`.

To resolve this situation we suggest you maintain a clean `master` branch and use `--auto-accept-changes` as [mentioned here](/setup_ci#maintain-a-clean-master-branch)

---

## Pull Request statuses

When a test build runs it will automatically set a status on the current pull request or branch indicating the state of the build. This is supported out of the box for projects that are [linked to a repository](/access) on GitHub, Bitbucket, or GitLab.

![PR badge](/img/pull-request-badge.gif)

If there are errors or changes need to be reviewed, this will be indicated in the service's user interface:

![PR services](/img/pr-badges.png)

Depending on your policy, you may not want to block the rest of your CI script on the acceptance of visual changes, and simply rely on the above status, in which case you would write `npm run chromatic || true` in your CI build to ensure that CI completes. Learn more about [setting up CI](/setup_ci).

#### PR statuses for other services

Since Chromatic runs on CI, you can write a custom CI script to add statuses in any number of code hosting services.

---

## You're all set up!

🎊 You're all setup with Chromatic. Testing and review are essential to maintaining high quality UIs, but there's always more to learn. Checkout how to get the most out UI components with handy Storybook guides written by our team. Don't hesitate to ask us questions via [email](mailto:support@hichroma.com?Subject=Question) or our in-app chat.

- [Visual Testing Handbook](https://www.learnstorybook.com/visual-testing-handbook/) a free 31-page walkthrough for visual testing with Storybook
- [Design Systems for Developers](https://www.learnstorybook.com/design-systems-for-developers/) tools and best practices for building a Design System written for developers (rather than designers).
- [The Delightful Storybook Workflow](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) Learn how productive teams get the most out of Storybook. Featuring devs from Squarespace, Discovery Network, Major League Soccer, Apollo GraphQL, Storybook, and Chromatic.
- [UI Component Playbook](https://blog.hichroma.com/ui-component-playbook-fd3022d00590) a 5-step guide to designing and engineering frontends with components
- [Visual Test-Driven Development](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87) how visual testing helps your team build robust UIs faster.
