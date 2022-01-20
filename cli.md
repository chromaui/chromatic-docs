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

<div class="aside">
Note: <code>--project-token</code> was previously known as <code>--app-code</code>. If you encounter an error referring to this, you should upgrade to the latest version of the Chromatic CLI. See <a href="#migrating-to-the-new-cli-package">migrating to the new package</a>.
</div>

### Storybook options

`chromatic` is zero-config if you have a `build-storybook` script in your `package.json`. Otherwise you might to specify one of these.

| CLI flag                          |                                                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--build-script-name <name>`      | The npm script that builds your Storybook we should take snapshots against. Use this if your Storybook build script is named differently. Defaults to `build-storybook`. Alias: `-b` |
| `--output-dir <dirname>`          | Relative path to target directory for building your Storybook, in case you want to preserve it. Otherwise a temporary directory is used if possible. Alias: `-o`                     |
| `--storybook-build-dir <dirname>` | If you have already built your Storybook, provide the path to the static build directory. Alias: `-d`                                                                                |

<div class="aside">
A placeholder in <code>&lt;angled brackets&gt;</code> denotes a required value, while <code>[square brackets]</code> denote an optional value. An optional flag value is interpreted as <code>true</code> when no value is provided.
</div>

### Chromatic options

These options control how Chromatic behaves with regards to your stories and what to do with them. These might be needed in certain branching situations. See more in the [**branching docs**](branching-and-baselines).

| CLI flag                                  |                                                                                                                                                                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--auto-accept-changes [branch]`          | If there are any changes to the build, automatically accept them. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                    |
| `--branch-name <branch>`                  | Override the branch name. Only meant to be used for unsupported CI integrations and fixing cross-fork PR comparisons. Also accepts `<owner>:<branch>` format.                                                                |
| `--ci`                                    | Mark this build as a CI build. Alternatively, set the `CI` environment variable (present in most CI systems). This option implies `--no-interactive`.                                                                        |
| `--exit-once-uploaded [branch]`           | Exit with `0` once the built version has been published to Chromatic. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                |
| `--exit-zero-on-changes [branch]`         | If all snapshots render but there are visual changes, exit with code `0` rather than the usual exit code `1`. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                        |
| `--externals <filepath>`                  | Disable TurboSnap when any of these files have changed since the baseline build. Globs are supported via picomatch. This flag can be specified multiple times. Requires --only-changed.                                      |
| `--ignore-last-build-on-branch <branch>`  | Do not use the last build on this branch as a baseline if it is no longer in history (i.e. branch was rebased). Globs are supported via [picomatch].                                                                         |
| `--only-changed [branch]`                 | Enables TurboSnap: Only run stories affected by files changed since the baseline build. Only for `[branch]`, if specified. Globs are supported via [picomatch]. All other snapshots will be inherited from the prior commit. |
| `--patch-build <headbranch...basebranch>` | Create a patch build to fix a missing PR comparison.                                                                                                                                                                         |
| `--preserve-missing`                      | Treat missing stories as unchanged rather than deleted when comparing to the baseline.                                                                                                                                       |
| `--skip [branch]`                         | Skip Chromatic tests, but mark the commit as passing. Avoids blocking PRs due to required merge checks. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                              |
| `--storybook-base-dir <dirname>`          | Relative path from repository root to Storybook project root. Use with `--only-changed` and `--storybook-build-dir` when your Storybook is located in a subdirectory of your repository.                                     |
| `--storybook-config-dir <dirname>`        | Relative path from where you run Chromatic to your Storybook config directory. Use with `--only-changed` and `--storybook-build-dir` when using a custom `--config-dir` (`-c`) flag for Storybook. Defaults to `.storybook`. |
| `--untraced <filepath>`                   | Disregard these files and their dependencies when tracing dependent stories for TurboSnap. Globs are supported via picomatch. This flag can be specified multiple times. Requires --only-changed.                            |
| `--zip`                                   | Publish your Storybook to Chromatic as a single zip file instead of individual content files.                                                                                                                                |

### Debug options

These options may help you debug problems or enable integration with other tools.

| CLI flag                    |                                                                                                                                                                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--debug`                   | Output verbose debugging information. This option implies `--no-interactive`.                                                                                                                                                                |
| `--diagnostics`             | Write process context information to `chromatic-diagnostics.json`.                                                                                                                                                                           |
| `--dry-run`                 | Run without actually publishing to Chromatic.                                                                                                                                                                                                |
| `--force-rebuild [branch]`  | Do not skip build when a rebuild is detected. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                                                        |
| `--junit-report [filepath]` | Write build results to a JUnit XML file. Defaults to `chromatic-build-{buildNumber}.xml`. `{buildNumber}` will be replaced with the actual build number.                                                                                     |
| `--list`                    | List available stories. This requires running a full build.                                                                                                                                                                                  |
| `--no-interactive`          | Don't ask interactive questions about your setup and don't overwrite output. `true` in non-TTY environments.                                                                                                                                 |
| `--only <storypath>`        | Only run a single story or a subset of stories. Use the `title` from the story's default export as the story path. This typically looks like `Path/To/Story`. Globs are supported via [picomatch]. This option implies `--preserve-missing`. |
| `--trace-changed [mode]`    | Print dependency trace for changed files to affected story files. Set to "expanded" to list individual modules. Requires `--only-changed`.                                                                                                   |

See [diagnosing issues](#diagnosing-issues) for when to use these flags.

### Exit codes

| Exit code | Key                        | Description                                            |
| --------- | -------------------------- | ------------------------------------------------------ |
| 0         | OK                         | Exited successfully                                    |
| 1         | BUILD_HAS_CHANGES          | Chromatic build has (visual) changes                   |
| 2         | BUILD_HAS_ERRORS           | Chromatic build has component errors                   |
| 3         | BUILD_FAILED               | Chromatic build failed due to system error             |
| 4         | BUILD_NO_STORIES           | Chromatic build failed because it contained no stories |
| 5         | BUILD_WAS_LIMITED          | Chromatic build was limited                            |
| 6         | BUILD_WAS_CANCELED         | Chromatic build was canceled                           |
| 11        | ACCOUNT_QUOTA_REACHED      | Chromatic account reached its snapshot quota           |
| 12        | ACCOUNT_PAYMENT_REQUIRED   | Chromatic account requires payment                     |
| 101       | GIT_NOT_CLEAN              | Git repository workspace not clean                     |
| 102       | GIT_OUT_OF_DATE            | Git repository not up-to-date with remote              |
| 103       | GIT_NO_MERGE_BASE          | Git branch has no merge base                           |
| 104       | NPM_INSTALL_FAILED         | npm or Yarn failed to install dependencies             |
| 105       | NPM_BUILD_STORYBOOK_FAILED | npm or Yarn failed to run build-storybook script       |
| 201       | FETCH_ERROR                | HTTP fetch error                                       |
| 202       | GRAPHQL_ERROR              | GrahpQL API error                                      |
| 254       | INVALID_OPTIONS            | Invalid options (flags) provided                       |
| 255       | UNKNOWN_ERROR              | Unknown error                                          |

### Deprecated options

These options are still supported, but might be removed in a future version. Avoid them if possible. See "Uploading Storybook via the tunnel" below for details.

| CLI flag                  |                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-console-errors`  | Continue running Chromatic even if there are errors logged to console in your Storybook.                                                     |
| `--app-code <token>`      | Renamed to `--project-token`.                                                                                                                |
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

This technique worked well, but it relied on a stable network connection between your CI server and our tunnel's server while building. In some cases, this connection could be less than perfect for reasons outside of anyone's control. This could lead to miscaptured stories when resources failed to load.

#### Build and publish method

As of `^2.0.0`, Chromatic CLI defaults to building a static Storybook then uploading it to our servers before starting the capture process. It relies on the Storybook command `build-storybook`.

In practice, this method is more predictable, reliable, and faster for creating builds. It also means you can pass the `--exit-once-uploaded` flag (as of `^3.4.0`) and not have to keep your CI server running while Chromatic is capturing.

We'll continue to support the tunnel, however it is officially deprecated. We urge you to switch to uploaded builds.

To start using uploaded builds, ensure you are on the latest version of [**chromatic**](https://www.npmjs.com/package/chromatic) and that you are not using the `-s` / `--script-name` flag in your "chromatic" script. If you use a custom npm script name to build Storybook, you'll need to pass the `-b` / `--build-script-name` flag to the Chromatic CLI.

</details>

## Usage in a GitHub Action

There are examples here: https://github.com/chromaui/chromatic-cli

Do not run this based on a GitHub `pull_request` event. If you do, the commit and branch will get reported wrong, use [our GitHub Action](https://github.com/marketplace/actions/publish-to-chromatic) instead.

## Diagnosing issues

Getting your Chromatic CI script configured _just right_ can take some trial and error. To help debug issues, you may want to consider using some of the debug flags:

- `--no-interactive`: When running the CLI locally, use this flag so you'll get logs like you would in CI, which are more elaborate than the interactive logs. This is automatically enabled in CI, so it's useless to add it in a CI script.
- `--diagnostics`: Before terminating the process, this dumps process context information to `chromatic-diagnostics.json`. This is the first place to look if you're seeing things you didn't expect. In a CI system, you'll have to configure this file as a **build artifact** so you can download it. How to do this depends on your CI provider.
- `--dry-run`: Use this if you just want to debug the CLI without actually publishing your Storybook or running a Chromatic build. Typically you'd pair this with `--diagnostics`.
- `--debug`: This enables verbose logging and `--no-interactive`. Use this if you want to see the nitty gritty details. Mostly useful if you have issues with publishing (uploading) your Storybook to Chromatic.
- `--trace-changed`: Specifically for TurboSnap, you can use this flag to get a printed tree view of the dependencies between changed files (according to Git) and your story files.
- `--only`: If you have some specific stories which are causing problems, you can use this flag to run a build for just those stories (one or more). If you don't know which stories are available, you can use `--list` to print a list of all stories in your Storybook, though it will require running a Chromatic build.

## Migrating to the new CLI package

This package was previously named `storybook-chromatic`. If you still have `storybook-chromatic` installed, you should remove it and install `chromatic` instead:

**With npm:**

```sh
npm uninstall --save-dev storybook-chromatic
npm install --save-dev chromatic
```

**With yarn:**

```sh
yarn remove storybook-chromatic
yarn add --dev chromatic
```

- [Source on GitHub](https://github.com/chromaui/chromatic-cli#main-options)
- [Package on npm](https://www.npmjs.com/package/chromatic)

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features

---

### Troubleshooting

<details>
<summary> I see "Chromatic: Failed to publish. Reason: self signed certificate in certificate chain" when running the CLI on my machine.</summary>

This isn't a Chromatic CLI issue. Check if your machine is using special security or network settings before running the CLI.

</details>
