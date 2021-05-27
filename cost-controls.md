---
layout: default
title: Cost Controls
description: Features to help you control the number of snapshots you use
---

# Cost controls

<div class="aside">This feature is currently in testing in <b>BETA</b>. Please reach out to <a href="mailto:support@chromatic.com">Support</a> if you want to join the beta.</div>

In order to reduce the number of unchanged snapshots taken by Chromatic, there are several features designed to avoid taking snapshots of stories that we know have not changed since the baseline.

## Detecting git changes

You can use the CLI option `--only-changed` to only test the stories that could have been affected by the git changes since the last build.

The way it works is as follows:

 1. Chromatic considers the git changes between the current commit and the commit of the [ancestor build](branching-and-baselines#calculating-the-ancestor-builds).
 2. Chromatic then use's webpack's dependency graph to track those changes back up to the Story files that depend on them.
 3. Chromatic only tests the stories defined in those story files.

*All other stories* will be copied unchanged. They continue to appear in Chromatic's UI as if they were snapshotted, but they will incur no costs.

Check your CLI output to see the number of snapshots taken and charged for.

<div class="aside">You can pass a glob to <code>--only-changed</code> if you only want to follow this process on certain branches.

### Prerequisites
  
-  You must be on Storybook 6.2+ to use `--only-changed`.
  
### Circumstances when a full build will be run

Certain changes could potentially affect all stories and we must re-test everything. They include:
  
- Changes to package versions in `package.json`, `yarn.lock`, `package-lock.json`.
- Changes to your Storybook's configuration.
- Changes in your static folder (e.g. fonts, images that aren't loaded via webpack `import`s).

Also there are some other rare circumstances when we must retest everything:
 
- When performing a [infrastructure upgrade](infrastructure-upgrades).
- When you [add a browser](browsers).

### Specifying changes that require a full rebuild.

If you are using files that are processed externally to webpack, with the output consumed by webpack, you will need to trigger a rebuild when they change.
  
For example, if you use an external SASS compiler (not a `sass-loader`) to compile `.sass` files to `.css` files, which are then consumed by Webpack, then a change to a `.sass` file will not match any dependencies, and not trigger any stories to be captured.
  
To work around this, use the `--externals` flag to specify one or more globs of "externally processed" files. E.g. `yarn chromatic -t <token> --only-changed --externals "*.sass" --externals "*.mjml"`
  
## Skipping testing entirely

If you are working in a monorepo, it may be possible to find situations where you know no UI has changed.

In such cases you can [skip Chromatic entirely](monorepos#only-run-chromatic-when-changes-occur-in-a-subproject).

Note that this will happen automatically with the `--only-changed` flag, when setup correctly, although it will still build and upload your Storybook.

## Only testing subprojects

If you are working in a monorepo, it may be possible to find situations where you know changes only affect a subproject. 

In such cases you can [run Chromatic on a subset of your Storybook](monorepos#advanced-only-test-a-subset-of-stories).

Note that this will happen automatically with the `--only-changed` flag, when setup correctly, although it will still build and upload your full Storybook.
