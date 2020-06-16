---
layout: default
title: CLI
description: Learn about the Chromatic CLI options
---

# Chromatic CLI

The CLI builds and publishes your Storybook. Run `chromatic` in your project directory.

## Quick Start

```sh
npx chromatic --project-token <your-project-token>
```

If you customized the way your Storybook runs, you may need to pass additional options.
After the first run, the CLI will automatically ask you to add a script to your `package.json`.

### Installing

Optionally, you can install `chromatic` as a dependency, while using the same script above.

```sh
npm install -D chromatic
```

If you don't install `chromatic` as a dependency, `npx` will download and run the latest version automatically. This has pros and cons:

- 👍 You'll never be out of date, you'll use the latest version every time, never have to worry about upgrading Chromatic.
- 👍 You won't need to install the package during local development if you're only running it in continuous integration.
- 👎 It will be slower to run because the package has to be downloaded first.

## Configuration

### Required options

| CLI flag                  |                                               |
| ------------------------- | --------------------------------------------- |
| `--project-token <token>` | The unique code for your project. Alias: `-t` |

Get your project token from the Chromatic website during onboarding or on your project's Manage page.
This option can also be configured by setting the `CHROMATIC_PROJECT_TOKEN` environment variable.
Environment variables are also read from a `.env` file, if present.

> Note: `--project-token` was previously known as `--app-code`. If you encounter an error referring to this, you should upgrade to the latest version of the Chromatic CLI. See [Migrating to the new CLI package](#migrating-to-the-new-cli-package).

### Storybook options

`chromatic` is zero-config if you have a `build-storybook` script in your `package.json`. Otherwise you might to specify one of these.

| CLI flag                          |                                                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--build-script-name <name>`      | The npm script that builds your Storybook we should take snapshots against. Use this if your Storybook build script is named differently. Defaults to `build-storybook`. Alias: `-b` |
| `--storybook-build-dir <dirname>` | If you have already built your Storybook, provide the path to the built Storybook. Alias: `-d`                                                                                       |

### Chromatic options

These options control how Chromatic behaves with regards to your stories and what to do with them. These might be needed in certain branching situations. See more in the [**branching docs**](branching-and-baselines).

| CLI flag                                 |                                                                                                                                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-console-errors`                 | Continue running Chromatic even if there are errors logged to console in your Storybook.                                                                                                |
| `--auto-accept-changes [branch]`         | If there are any changes to the build, automatically accept them. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                               |
| `--exit-zero-on-changes [branch]`        | If all snapshots render but there are visual changes, exit with code `0` rather than the usual exit code `1`. Only for `[branch]`, if specified. Globs are supported via [picomatch].   |
| `--exit-once-uploaded [branch]`          | Exit with `0` once the built version has been published to Chromatic. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                           |
| `--ignore-last-build-on-branch [branch]` | Do not use the last build on this branch as a baseline if it is no longer in history (i.e. branch was rebased). Only for `[branch]`, if specified. Globs are supported via [picomatch]. |
| `--skip [branch]`                        | Skip Chromatic tests, but mark the commit as passing. Avoids blocking PRs due to required merge checks. Only for `[branch]`, if specified. Globs are supported via [picomatch].         |
| `--preserve-missing`                     | Treat missing stories as unchanged rather than deleted.                                                                                                                                 |

### Debug options

These options may help you debug problems or enable integration with other tools.

| CLI flag                    |                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--no-interactive`          | Don't ask interactive questions about your setup and don't overwrite output. `true` in non-TTY environments.                                             |
| `--debug`                   | Output verbose debugging information. This option implies `--no-interactive`.                                                                            |
| `--ci`                      | Mark this build as a CI build. Alternatively, set the `CI` environment variable (present in most CI systems). This option implies `--no-interactive`.    |
| `--list`                    | List available stories. This requires running a full build.                                                                                              |
| `--only <storypath>`        | Only run a single story or a subset of stories. Story paths typically look like `Path/To/Story`. Globs are supported via [picomatch].                    |
| `--junit-report [filepath]` | Write build results to a JUnit XML file. Defaults to `chromatic-build-{buildNumber}.xml`. `{buildNumber}` will be replaced with the actual build number. |

### Deprecated options

These options are still supported, but might be removed in a future version. Avoid them if possible.

| CLI flag                  |                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--script-name [name]`    | The npm script that starts your Storybook. Defaults to `storybook`. Alias: `-s`                                                              |
| `--exec <command>`        | Alternatively, a shell command that starts your Storybook. Alias: `-e`                                                                       |
| `--do-not-start`          | Don't attempt to start or build Storybook. Use this if your Storybook is already running, for example when part of a larger app. Alias: `-S` |
| `--storybook-port <port>` | What port is your Storybook running on. Auto detected from the npm script when using `--script-name`. Alias: `-p`                            |
| `--storybook-https`       | Enable if Storybook is running on https (locally). Auto detected from the npm script when using `--script-name`.                             |
| `--storybook-cert <path>` | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                  |
| `--storybook-key <path>`  | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                  |
| `--storybook-ca <ca>`     | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                  |
| `--storybook-url <url>`   | Run against an online Storybook at some URL. This implies `--do-not-start`. Alias: `-u`                                                      |

## Usage in a GitHub Action

There are examples here: [/.github/workflows](/.github/workflows).

Do not run this based on a github pull_request event. If you do, the commit and branch will get reported wrong, use [https://github.com/chromaui/action](https://github.com/chromaui/action) instead.

## Migrating to the new CLI package

This package was previously named `storybook-chromatic`. If you still have `storybook-chromatic` installed, you should remove it and install `chromatic` instead:

**With npm:**

```
npm uninstall --save-dev storybook-chromatic
npm install --save-dev chromatic
```

**With yarn:**

```
yarn remove storybook-chromatic
yarn add --dev chromatic
```

- [Source on GitHub](https://github.com/chromaui/chromatic-cli#main-options)
- [Package on NPM](https://www.npmjs.com/package/chromatic)

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
