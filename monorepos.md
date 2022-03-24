---
layout: default
title: Monorepos
description: Chromatic's support for monorepos
---

# Monorepos

A common pattern in modern web development is monorepos -- having a single repository that contains multiple distinct projects. As a Chromatic project is associated with a single repository in a one-to-one way, there are a few tips that can help with using Chromatic with a monorepo.

## Running Chromatic from a subproject

Chromatic doesn't assume anything about how you run the CLI, so there is no reason that you cannot run it from inside a sub-project. Ensure you pass the correct project token and it will work fine.

## Running Chromatic for more than one subproject's Storybook

You can only have one linked project in Chromatic for any given repository, so if you want to run Chromatic for more than one subproject, you have two options:

### Combine multiple projects into a single Storybook

A common approach that works well for many teams is to combine multiple subproject's Storybooks into a single Storybook. When you run Chromatic on the principal Storybook you test all stories in a singe Chromatic project.

For example, you could write in your `.storybook/main.js`:

```js
// .storybook/main.js

module.exports = {
  stories: ['../project-1/**/*.stories.js', '../project-2/**/*.stories.js'],
};
```

Often teams find a single Storybook for all their development works quite well, also!

### Run Chromatic more than once in a second Chromatic project

In Chromatic a project is typically linked to a repository and will synchronize permissions from the permissions of that repository as well as post build status messages to the repository's Pull (Merge) Requests.

You can currently only have a single project linked to a given repository. That means if you want to run Chromatic more than once for a given repository's commit, you can only get a single commit status on your PRs (MRs).

However, you can still create a second project in Chromatic, linked to a dummy repository created in your organization/team for this purpose. If you mirror the repository membership from the "real" repository to the dummy repository, access to the Chromatic project will work fine.

You would then use the token of the second project to run the second `chromatic` test command in the second subproject. The big downside of this approach is the lack of a Pull (Merge) Request status based on the result of the second test run. You can however wait for and use the exit code of the `chromatic` CLI run (don't use the `--exit-zero-on-changes` flag in this case!)

---

## Only run Chromatic when changes occur in a subproject

If your monorepo consists of both UI subprojects and backend subprojects, it may be common to have commits that do not touch UI at all. In such cases it makes little sense to run Chromatic on those commits.

You can use tools like [`lerna changed`](https://github.com/lerna/lerna/tree/master/commands/changed#readme) to detect such situations (depending on how you've setup your monorepo).

If you want to get a Chromatic PR badge for such commits (for instance if you block merging on Chromatic builds), you can use the `--skip` CLI flag to indicate that this commit does not need to be built and tested.

## Advanced: Only test a subset of stories

If you are combining your Storybooks into a single Storybook (see above), but you have detected only a subset of projects have changed, in order to avoid unnecessarily capturing unchanged stories, you can build a Storybook with a subset of your projects' stories.

Ordinarily when you run a build that is missing a set of stories, Chromatic will treat those stories as deleted and the next build that includes them will have no baseline for them, and treat them as new. You can pass the `--preserve-missing` flag to your build to avoid this behavior. What this means is Chromatic will pass the baselines forward and treat all missing stories as "preserved" without re-capturing them.

### Building a subset of your stories

In order to build a Storybook with a subset of your stories, you can use an environment variable in `.storybook/main.js`:

```js
// .storybook/main.js

const storiesForProject = {
  projectA: './projectA/**.stories.js',
  projectB: './projectB/**.stories.js',
  // etc
};

export default {
  stories: storiesForProject[process.env.ONLY_STORYBOOK_PROJECT] || '**/*.stories.js',
};
```
