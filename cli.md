---
layout: default
title: CLI
description: Learn about the Chromatic CLI options
---

# Chromatic CLI

The [Chromatic CLI](https://www.npmjs.com/package/chromatic) builds and publishes your Storybook. Run `chromatic` in your project directory.

<video autoPlay muted playsInline loop width="560px" style="margin-bottom: 1em">
  <source src="img/chromatic-cli-optimized.mp4" type="video/mp4" />
</video>

<div class="aside">This package was previously named <code>storybook-chromatic</code>. See <a href="#migrating-to-the-new-cli-package">migrating to the new package</a> for details.</div>

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

<div class="aside">Note: <code>--project-token</code> was previously known as <code>--app-code</code>. If you encounter an error referring to this, you should upgrade to the latest version of the Chromatic CLI. See <a href="#migrating-to-the-new-cli-package">migrating to the new package</a>.</div>

### Storybook options

`chromatic` is zero-config if you have a `build-storybook` script in your `package.json`. Otherwise you might to specify one of these.

| CLI flag                          |                                                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--build-script-name <name>`      | The npm script that builds your Storybook we should take snapshots against. Use this if your Storybook build script is named differently. Defaults to `build-storybook`. Alias: `-b` |
| `--storybook-build-dir <dirname>` | If you have already built your Storybook, provide the path to the static build directory. Alias: `-d`                                                                                |

### Chromatic options

These options control how Chromatic behaves with regards to your stories and what to do with them. These might be needed in certain branching situations. See more in the [**branching docs**](branching-and-baselines).

| CLI flag                                  |                                                                                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-console-errors`                  | Continue running Chromatic even if there are errors logged to console in your Storybook.                                                                                              |
| `--auto-accept-changes [branch]`          | If there are any changes to the build, automatically accept them. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                             |
| `--only <storypath>`                      | Only run a single story or a subset of stories. Story paths typically look like `Path/To/Story`. Globs are supported via [picomatch]. This option implies `--preserve-missing`.       |
| `--patch-build <headbranch...basebranch>` | Create a patch build to fix a missing PR comparison.                                                                                                                                  |
| `--exit-once-uploaded [branch]`           | Exit with `0` once the built version has been published to Chromatic. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                         |
| `--exit-zero-on-changes [branch]`         | If all snapshots render but there are visual changes, exit with code `0` rather than the usual exit code `1`. Only for `[branch]`, if specified. Globs are supported via [picomatch]. |
| `--ignore-last-build-on-branch <branch>`  | Do not use the last build on this branch as a baseline if it is no longer in history (i.e. branch was rebased). Globs are supported via [picomatch].                                  |
| `--skip [branch]`                         | Skip Chromatic tests, but mark the commit as passing. Avoids blocking PRs due to required merge checks. Only for `[branch]`, if specified. Globs are supported via [picomatch].       |
| `--preserve-missing`                      | Treat missing stories as unchanged rather than deleted when comparing to the baseline.                                                                                                |

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

These options are still supported, but might be removed in a future version. Avoid them if possible. See "Uploading Storybook via the tunnel" below for details.

| CLI flag                  |                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--script-name [name]`    | The npm script that starts your Storybook. Defaults to `storybook`. Alias: `-s`                                                              |
| `--exec <command>`        | Alternatively, a shell command that starts your Storybook. Alias: `-e`                                                                       |
| `--do-not-start`          | Don't attempt to start or build Storybook. Use this if your Storybook is already running, for example when part of a larger app. Alias: `-S` |
| `--storybook-port <port>` | What port is your Storybook running on. Auto detected from the npm script when using `--script-name`. Alias: `-p`                            |
| `--storybook-https`       | Enable if Storybook is running on HTTPS (locally). Auto detected from the npm script when using `--script-name`.                             |
| `--storybook-cert <path>` | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                  |
| `--storybook-key <path>`  | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                  |
| `--storybook-ca <ca>`     | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                  |
| `--storybook-url <url>`   | Run against an online Storybook at some URL. This implies `--do-not-start`. Alias: `-u`                                                      |

<details>
<summary>Uploading Storybook via the tunnel (deprecated)</summary>

We changed the way that Chromatic CLI builds and uploads Storybook over time. Before we begin, make sure you're using the latest [**chromatic**](https://www.npmjs.com/package/chromatic) package.

#### Tunnel method (deprecated)

The original version of [**storybook-chromatic**](https://www.npmjs.com/package/storybook-chromatic) (deprecated) used a tunnelling mechanism in order to capture screenshots of your stories and create a hosted version of your Storybook. The CLI package would create a HTTPS tunnel between your CI server (running Storybook in development mode) and our capture cloud.

This technique worked well, but it relied on a stable network connection between your CI server and our tunnel's server while building. In some cases, this connection could be less than perfect for reasons outside of anyones control. This could lead to miscaptured stories when resources failed to load.

#### Build and publish method

As of `^2.0.0`, Chromatic CLI defaults to building a static Storybook then uploading it to our servers before starting the capture process. It relies on the Storybook command `build-storybook`.

In practice, this method is more predictable, reliable, and faster for creating builds. It also means you can pass the `--exit-once-uploaded` flag (as of `^3.4.0`) and not have to keep your CI server running while Chromatic is capturing.

We'll continue to support the tunnel, however it is officially deprecated. We urge you to switch to uploaded builds.

To start using uploaded builds, ensure you are on the latest version of [**chromatic**](https://www.npmjs.com/package/chromatic) and that you are not using the `-s` / `--script-name` flag in your "chromatic" script. If you use a custom npm script name to build Storybook, you'll need to pass the `-b` / `--build-script-name` flag to the Chromatic CLI.

</details>

## Usage in a GitHub Action

There are examples here: https://github.com/chromaui/chromatic-cli

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
- [Package on npm](https://www.npmjs.com/package/chromatic)

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
