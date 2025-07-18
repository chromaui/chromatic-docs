---
title: Sunsetting `--preserve-missing`
description: We are removing the --preserve-missing flag and will start to fail builds that use it
---

# Sunsetting `--preserve-missing`

<div class="aside" style="margin-bottom: 2rem;">
🚨&nbsp;&nbsp;Support for the <code>--preserve-missing</code> CLI flag has been removed completely as of May, 2023. If you were linked here from the Chromatic webapp or CLI, this means your build is still using <code>--preserve-missing</code> and action is required. Please follow the steps outlined below to resolve your issue. If you need assistance, please <a href="mailto:support@chromatic.com?Subject=preserve-missing%20flag">contact support</a>.
</div>

The `--preserve-missing` CLI flag (also known as the `preserveMissing` input to our GitHub Action) has been deprecated for a while and is soon to be removed entirely. We are removing the `--preserve-missing` behavior because it is incompatible with [infrastructure upgrade builds](/docs/infrastructure-upgrades#upgrade-builds) and makes it impossible to ever intentionally remove a story from Chromatic. Builds which still use this flag will eventually start to fail. If your Chromatic workflow is still configured with this flag, it must be updated. The upcoming "Version 5" [capture infrastructure](/docs/infrastructure-upgrades) will not support `--preserve-missing`.

## Rolling brownouts

🚦 Starting **January 1, 2023** we will gradually start to fail builds that still use `--preserve-missing` even if they are still on Version 4 capture infrastructure. These "brownouts" will occur for 10 minutes each hour. Eventually you will be automatically upgraded to the latest capture infrastructure, at which point you will no longer be able to use `--preserve-missing` (all builds that still use it will fail).

## Reducing snapshots

`--preserve-missing` is often used in an effort to reduce the amount of snapshots taken by Chromatic. We provide [TurboSnap](/docs/turbosnap) as a way to intelligently skip snapshots automatically. Alternatively, you can use `--only-story-names` or `--only-story-files` to [manually control](/docs/configure#options) which stories are snapshotted.

## Migrating

The `--preserve-missing` flag is commonly used when publishing a _partial_ Storybook containing a subset of your stories. This means you can't just remove the flag, you must also update your Storybook build configuration to **always include all stories**. Otherwise the missing stories will be marked **removed** in Chromatic and baselines will be lost.

### 1. Update your Storybook build configuration

Most likely you will have a `.storybook/main.js` which contains something like this:

```js
// .storybook/main.js

const stories = {
  projectA: "../projectA/**.stories.js",
  projectB: "../projectB/**.stories.js",
  // etc
};

const config = {
  stories: stories[process.env.STORYBOOK_PROJECT] || "**/*.stories.js",
};

export default config;
```

In which case you'd set the `STORYBOOK_PROJECT` environment variable to control which stories get included in your Storybook. **Do not do this** unless you target a different Chromatic project for each Storybook project (e.g. in a [monorepo](/docs/monorepos) setup).

For the above, you might [configure your `stories`](https://storybook.js.org/docs/configure#with-a-configuration-object) as follows:

```js
// .storybook/main.js

const config = {
  stories: [
    {
      directory: "../projectA",
      files: "*.stories.*",
      titlePrefix: "Project Alpha",
    },
    {
      directory: "../projectB",
      files: "*.stories.*",
      titlePrefix: "Project Beta",
    },
  ],
};

export default config;
```

This will load stories from both projects, but prefix story paths with the project name so that each has a section in the sidebar.

After updating your Storybook configuration, run a Storybook build and check that all stories are there:

```bash
npm run build-storybook
npx http-server storybook-static -o
```

You may have to replace `build-storybook` (package script) or `storybook-static` (target directory) if your setup uses different names.

### 2. Remove the CLI flag or GitHub Action input

Depending on your setup, you may have a `chromatic` script in your `package.json`, use `npx chromatic` in your CI script(s) or use the `chromaui/action` GitHub Action.

<div class="aside">

While updating your Chromatic configuration, be on the lookout for that `STORYBOOK_PROJECT` environment variable (or whatever it's called in your case). If you're no longer using it after step 1, you should probably remove it.

</div>

#### `chromatic` script

In `package.json`, check your `"scripts"` block for usage of `chromatic`. If it has a `--preserve-missing` flag, remove the flag.

#### CI workflows

Depending on your CI provider, you likely have a workflow configuration file which invokes `chromatic` at some point. Make sure it does not receive the `--preserve-missing` flag anymore.

#### GitHub Action

If you use GitHub Actions, you're likely using `chromaui/action`. Look for `uses: chromaui/action@v1` and check the `with:` block right below it (if any). If it specifies `preserveMissing`, remove it.

### 3. Enable TurboSnap or manually specify stories to snapshot

To avoid snapshotting irrelevant stories, you have several options. You can add `--only-changed` to enable [TurboSnap](/docs/turbosnap), or use either the `--only-story-files` or `--only-story-names` [CLI flag](/docs/configure#options) to manually define which stories to snapshot. These flags are also available as inputs to our GitHub Action (using camelCase).

#### `--only-story-files` (`onlyStoryFiles`)

To run only stories from "Project Alpha" described above, you can specify `--only-story-files="./projectA/**/*"` (note this path is relative to your Storybook project, not the `.storybook` config dir). You can specify this flag multiple times to test multiple projects/directories, or use globs to do complex matching.

<div class="aside">
This is the most straightforward replacement to the behavior illustrated in step 1, but it is also a relatively blunt weapon because you're still testing an entire subdirectory.
</div>

#### `--only-story-names` (`onlyStoryNames`)

Depending on your Storybook setup and hierarchy, it may be convenient to filter stories by their story path/name instead of their filename. For example: `--only-story-names="Atoms/Button/*"`. You can specify the flag multiple times to test multiple stories, or use globbing to do complex matching.

<div class="aside">

This flag used to be called `--only`. If you happen to be using `--only`, you should change it to `--only-story-names`.

</div>

#### `--only-changed` (`onlyChanged: true`)

Unless you already have a reliable and fine-grained way to determine which stories to test, you're probably better off using [TurboSnap](/docs/turbosnap). TurboSnap is a way to automatically skip snapshots for stories that are known to not have been affected by any code changes introduced since the previous Chromatic build. It does this by cross-referencing the list of changed files in your Git repository against the Webpack dependency graph. It effectively traces source code changes to story files, and sets `--only-story-files` accordingly.
