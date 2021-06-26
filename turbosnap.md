---
layout: default
title: TurboSnap
description: Speed up tests by detecting file changes with Git
---

# TurboSnap (beta)

> TurboSnap is in beta. Email [support](mailto:support@chromatic.com) for early access.

TurboSnap is an advanced Chromatic feature that speeds up builds for faster [UI testing](test) and [review](review) using Git and Webpack's [dependency graph](https://webpack.js.org/concepts/dependency-graph/). It identifies component files that change, then intelligently builds and snapshots only the stories associated with those components.

⚠️ When using TurboSnap, your builds may complete in less time using fewer snapshots. However, we don't recommend using TurboSnap immediately when starting out with Chromatic since the configuration is more complicated and can lead to difficult to debug scenarios or UI changes being missed. Instead, become familiar with Chromatic's out of the box behavior and once your project has been running smoothly for some time consider trying out TurboSnap.

#### Prerequisites

- Storybook 6.2+
- Webpack
- Stories correctly [configured](https://storybook.js.org/docs/react/configure/overview#configure-story-loading) in Storybook's `main.js`

## Enable

Run Chromatic's CLI with the `--only-changed` option to enable TurboSnap. Alternatively, you can use the `onlyChanged` option to the Chromatic GitHub action.

It will build and test stories that may have been affected by the Git changes since the last build. Depending on how your project is setup, you may need [additional configuration](#configure).

### How it works

1.  Chromatic considers the Git changes between the current commit and the commit of the [ancestor build](branching-and-baselines#calculating-the-ancestor-builds).
2.  Chromatic then uses Webpack's dependency graph to track those changes back up to the story files that depend on them.
3.  Chromatic only tests the stories defined in those story files.

Stories that have not changed will not be tested (i.e., snapshotted), despite appearing in Chromatic's UI as if they were. In many cases this will lead to much decreased snapshot usage and faster build times.

Certain circumstances could potentially affect all stories. To prevent false positives, we re-test everything if any of the following requirements are met:


- Changes to package versions in `package.json`, `yarn.lock`, `package-lock.json`
- Changes to your Storybook's configuration
- Changes in files that are imported by your [`preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering) (as this could affect any story)
- Changes in your static folder (e.g., fonts, images that aren't loaded via Webpack imports)
- Changes to files specific by the `--externals` option (see below)
- [Infrastructure upgrades](infrastructure-upgrades)
- [UI Test in a new browser](browsers)

## Configure

#### Static Storybook builds

If you're using `--storybook-build-dir` to provide a prebuilt Storybook, adjust your `build-storybook` script to include the `--webpack-stats-json` option. If Chromatic builds your Storybook for you, this is not necessary, it will take care of it for you.

For example:

```json
{
  "scripts": {
    "build-storybook": "build-storybook --webpack-stats-json storybook-static"
  }
}
```

In Storybook 6.2, `--webpack-stats-json` must be set to the value of `--output-dir` (`storybook-static` by default). In Storybook 6.3+, the value can be omitted as it will use the value of `--output-dir` automatically. Note that `--webpack-stats-json` is not supported before Storybook 6.2, and therefore cannot be used with TurboSnap.

#### Specify which changes trigger a full re-test

TurboSnap relies on Webpack's dependency graph. That means if you're using files that are processed externally to Webpack, with the output consumed by Webpack, you'll need to trigger a re-test when they change.

For example, if you use an external SASS compiler (not `sass-loader`) to compile `.sass` files to `.css` files (which are then consumed by Webpack), then a change to a `.sass` file will not match any dependencies, preventing stories from being captured (i.e., snapshotted).

To work around this, run Chromatic's CLI with the `--externals` option (or `externals` action option) to specify one or more globs of "externally processed" files. For example:

```bash
chromatic --only-changed --externals "*.sass" --externals "*.mjml"`
```

#### Enable for specific branches

To enable this feature for specific branches, pass a glob to `--only-changed` (e.g. `chromatic --only-changed "feature/*"`).

#### Support for monorepos

If you're working in a monorepo, there are some situations where you're certain no UI has changed. For instance, if you make a backend-only change. In such cases, you can [skip Chromatic entirely](monorepos#only-run-chromatic-when-changes-occur-in-a-subproject).

With TurboSnap enabled, you'll be able to publish your Storybook to Chromatic, but UI testing will be automatically skipped. So there is no need to skip manually.

#### Only test subprojects of monorepos

If you're working in a monorepo, there are situations where you know changes only affect a subproject. In those cases, you can [run Chromatic on a subset of your Storybook](monorepos#advanced-only-test-a-subset-of-stories).

With TurboSnap enabled, running tests on subprojects that change happens automatically. You'll be able to build and publish your Storybook, but Chromatic won't test unchanged subprojects or take snapshots. So there is no need to build a subset of your Storybook manually.

---

### Troubleshooting

<details>
<summary>Why is my build failing with an <code>Out of memory error</code>?</summary>

If you have a large dependency tree, the build process may fail due to an out of memory error. Re-run Chromatic's CLI with the `NODE_OPTIONS=--max_old_space_size=4096` (or higher) environment variable to increase the amount of available memory. Your CI provider may require additional configuration to allow more memory usage.

</details>
