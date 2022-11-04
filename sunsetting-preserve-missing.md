---
layout: default
title: Sunsetting `--preserve-missing`
description: We are removing the --preserve-missing flag and will start to fail builds that use it
---

# Sunsetting `--preserve-missing`

<div class="aside">
⚠️ If you were linked here from the Chromatic webapp or CLI, this means your build was using `--preserve-missing` and action is required.
</div>

The `--preserve-missing` CLI flag (also known as the `preserveMissing` input to our GitHub Action) has been deprecated for a while and is soon to be removed entirely. We are removing the `--preserve-missing` behavior because it is incompatible with [infrastructure upgrade builds](infrastructure-upgrades#upgrade-builds) and makes it impossible to ever intentionally remove a story from Chromatic. Builds which still use this flag will eventually start to fail. If your Chromatic workflow is still configured with this flag, it must be updated.

## Rolling brownouts

🚦 Starting **January 1, 2023** we will gradually start to fail builds that still use `--preserve-missing`. These "brownouts" will occur for 10 minutes each hour. On **February 1, 2023** the flag will be removed completely and any builds that still use it will fail.

## Reducing snapshots

`--preserve-missing` is often used in an effort to reduce the amount of snapshots taken by Chromatic. We provide [TurboSnap](turbosnap) as a way to intelligently skip snapshots automatically. Alternatively, you can use `--only-story-names` or `--only-story-files` to [manually control](cli#chromatic-options) which stories are snapshotted.

## Migrating

The `--preserve-missing` flag is commonly used when publishing a _partial_ Storybook containing a subset of your stories. This means you can't just remove the flag, you must also update your Storybook build configuration to **always include all stories**. Otherwise the missing stories will be marked **removed** in Chromatic and baselines will be lost.

### 1. Update your Storybook build configuration

Most likely you will have a `.storybook/main.js` which contains something like this:

```js
const stories = {
  projectA: "../projectA/**.stories.js",
  projectB: "../projectB/**.stories.js",
  // etc
}

export default {
  stories: stories[process.env.STORYBOOK_PROJECT] || "**/*.stories.js",
}
```

In which case you'd set the `STORYBOOK_PROJECT` environment variable to control which stories get included in your Storybook. **Do not do this** unless you target a different Chromatic project for each Storybook project (e.g. in a [monorepo](monorepos) setup).

For the above, you might [configure your `stories`](https://storybook.js.org/docs/react/configure/overview#with-a-configuration-object) as follows:

```js
export default {
  stories: [
    { directory: "../projectA", files: "*.stories.*", titlePrefix: "Project Alpha" },
    { directory: "../projectB", files: "*.stories.*", titlePrefix: "Project Beta" },
  ],
}
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
