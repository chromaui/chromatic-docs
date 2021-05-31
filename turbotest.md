---
layout: default
title: TurboTest
description: Speed up tests by detecting file changes with Git
---

# TurboTest (beta)

> TurboTest is in beta. Email [support](mailto:support@chromatic.com) if you want early access.

TurboTest is an advanced configuration that speeds up Chromatic tests using Git and the Webpack dependency graph. It identifies the components whose files change, then intelligently tests only the stories associated with those components.

Your tests complete in a fraction of the time which means you can expand test coverage while also economizing snapshot usage.

#### Prerequisites

- Storybook 6.2+
- You must use the `main.js:stories` field for stories, not require them in `.storybook/preview.js`

## Enable

Enable TurboTest by passing the CLI option `--only-changed`. That will test only the stories that may have been affected by the Git changes since the last build. Depending on how your project is setup, you may need [further configuration](#configure).

### How it works

1.  Chromatic considers the Git changes between the current commit and the commit of the [ancestor build](branching-and-baselines#calculating-the-ancestor-builds).
2.  Chromatic then use's Webpack's dependency graph to track those changes back up to the story files that depend on them.
3.  Chromatic only tests the stories defined in those story files.

Stories that have not changed will not be tested or snapshotted. They'll continue to appear in Chromatic's UI as if they were snapshotted. But won't affect your usage.

Certain circumstances could potentially affect all stories. We re-test everything in these cases to prevent false negatives.

- Changes to package versions in `package.json`, `yarn.lock`, `package-lock.json`
- Changes to your Storybook's configuration
- Changes in your static folder (e.g. fonts, images that aren't loaded via Webpack imports)
- [Infrastructure upgrades](infrastructure-upgrades)
- [UI Test in a new browser](browsers)

## Configure

#### Static Storybook builds

If you're manually building Storybook, pass `--webpack-stats-json path/to/sb/build` to the `build-storybook` script.

#### Specify which changes trigger a full re-test

TurboTest relies on Webpack's dependency graph. That means if you're using files that are processed externally to Webpack, with the output consumed by Webpack, you'll need to trigger a re-test when they change.

For example, if you use an external SASS compiler (not a `sass-loader`) to compile `.sass` files to `.css` files, which are then consumed by Webpack, then a change to a `.sass` file will not match any dependencies, and not trigger any stories to be captured.

To work around this, use the `--externals` flag to specify one or more globs of "externally processed" files. E.g. `yarn chromatic -t <token> --only-changed --externals "*.sass" --externals "*.mjml"`

#### Enable for specific branches

If you only want to follow this process on certain branches, pass a glob to `--only-changed`.

#### Skip tests entirely for monorepos

If you're working in a monorepo, there are some situations where you're certain no UI has changed. For instance, if you make a backend-only change. In such cases, you can [skip Chromatic entirely](monorepos#only-run-chromatic-when-changes-occur-in-a-subproject).

When `--only-changed` is setup, skipping testing happens automatically. You'll still build and upload your Storybook but Chromatic won't test it or take snapshots.

#### Only test subprojects of monorepos

If you are working in a monorepo, it may be possible to find situations where you know changes only affect a subproject. In such cases, you can [run Chromatic on a subset of your Storybook](monorepos#advanced-only-test-a-subset-of-stories).

When `--only-changed` is setup, running tests on subprojects that change happens automatically. You'll still build and upload your Storybook but Chromatic won't test it or take snapshots.

---

### Troubleshooting

<details>
<summary>Out of memory error</summary>

If you have a large dependency tree, the build process may crash with an out of memory error. To work around this, pass `NODE_OPTIONS=--max_old_space_size=4096` (or higher) as an environment variable to the Chromatic CLI.

</details>
