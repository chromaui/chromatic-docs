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

```shell
npx chromatic --project-token <your-project-token>
```

If you customize the way your Storybook runs, you may need to pass additional options.
After the first run, the CLI will automatically ask you to add a script to your `package.json`.

### Installing

Optionally, you can install `chromatic` as a dependency while using the same script above.

```shell
npm install -D chromatic
```

If you don't install `chromatic` as a dependency, `npx` will automatically download and run the latest version. This has pros and cons:

- 👍 You'll never be out of date, you'll use the latest version every time, never have to worry about upgrading Chromatic.
- 👍 You won't need to install the package during local development if you're only running it in continuous integration.
- 👎 It will be slower to run because the package has to be downloaded first.

## Configuration

The only required configuration is the project token. Get your project token from the Chromatic website during onboarding or on your project's Manage page. Store your project token as the `CHROMATIC_PROJECT_TOKEN` environment variable or secret.

### Storybook options

`chromatic` is zero-config if you have a `build-storybook` script in your `package.json`. Otherwise, you might specify one of these.

| CLI flag                          |                                                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--build-script-name <name>`      | The npm script that builds your Storybook we should take snapshots against. Use this if your Storybook build script is named differently. Defaults to `build-storybook`. Alias: `-b` |
| `--output-dir <dirname>`          | Relative path to target directory for building your Storybook, in case you want to preserve it. Otherwise, a temporary directory is used if possible. Alias: `-o`                    |
| `--storybook-build-dir <dirname>` | If you have already built your Storybook, provide the path to the static build directory. Alias: `-d`                                                                                |

<div class="aside">
A placeholder in <code>&lt;angled brackets&gt;</code> denotes a required value, while <code>[square brackets]</code> denotes an optional value. An optional flag value is interpreted as <code>true</code> when no value is provided.
</div>

### Chromatic options

These options control how Chromatic behaves concerning your stories and what to do with them. These might be needed in certain branching situations. See more in the [**branching docs**](branching-and-baselines).

| CLI flag                                  |                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--auto-accept-changes [branch]`          | If there are any changes to the build, automatically accept them. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                                                                                                                                                                                          |
| `--branch-name <branch>`                  | Override the branch name. Only meant to be used for unsupported CI integrations and fixing cross-fork PR comparisons. Also accepts `<owner>:<branch>` format.                                                                                                                                                                                                                                      |
| `--ci`                                    | Mark this build as a CI build. Alternatively, set the `CI` environment variable (present in most CI systems). This option implies `--no-interactive`.                                                                                                                                                                                                                                              |
| `--exit-once-uploaded [branch]`           | Exit with `0` once the built version has been published to Chromatic. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                                                                                                                                                                                      |
| `--exit-zero-on-changes [branch]`         | If all snapshots render, but there are visual changes, exit with code `0` rather than the usual exit code `1`. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                                                                                                                                             |
| `--externals <filepath>`                  | Disable TurboSnap when any of these files have changed since the baseline build. Globs are supported via [picomatch]. This flag can be specified multiple times. Requires --only-changed.                                                                                                                                                                                                          |
| `--ignore-last-build-on-branch <branch>`  | Do not use the last build on this branch as a baseline if it is no longer in history (i.e., the branch was rebased). Globs are supported via [picomatch].                                                                                                                                                                                                                                          |
| `--only-changed [branch]`                 | Enables TurboSnap: Only run stories affected by files and dependencies changed since the baseline build. Only for `[branch]`, if specified. Globs are supported via [picomatch]. All other snapshots will be inherited from the prior commit.                                                                                                                                                      |
| `--only-story-files <storypath>`          | Only run a single story or a subset of stories by their filename(s). Specify the full path to the story file relative to the root of your Storybook project. Globs are supported via [picomatch]. This flag can be specified multiple times.                                                                                                                                                       |
| `--only-story-names <storypath>`          | Only run a single story or a subset of stories by their name(s). Use the `title` from the story file's default export as the story path, followed by the desired story names. For example, if selecting all stories from a single story file with a `title` of `Example/Button`, this would be `Example/Button/*`. Globs are supported via [picomatch]. This flag can be specified multiple times. |
| `--patch-build <headbranch...basebranch>` | Create a patch build to fix a missing PR comparison.                                                                                                                                                                                                                                                                                                                                               |
| `--project-token <token>`                 | The unique code for your project. Prefer to use `CHROMATIC_PROJECT_TOKEN` instead if you can. Alias: `-t`                                                                                                                                                                                                                                                                                          |
| `--skip [branch]`                         | Skip Chromatic tests, but mark the commit as passing. It avoids blocking PRs due to required merge checks. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                                                                                                                                                                                                 |
| `--storybook-base-dir <dirname>`          | Relative path from repository root to Storybook project root. Use with `--only-changed` and `--storybook-build-dir` when your Storybook is located in a subdirectory of your repository.                                                                                                                                                                                                           |
| `--storybook-config-dir <dirname>`        | Relative path from where you run Chromatic to your Storybook config directory. Use with `--only-changed` and `--storybook-build-dir` when using a custom `--config-dir` (`-c`) flag for Storybook. Defaults to `.storybook`.                                                                                                                                                                       |
| `--untraced <filepath>`                   | Disregard these files and their dependencies when tracing dependent stories for TurboSnap. Globs are supported via [picomatch]. This flag can be specified multiple times. Requires --only-changed.                                                                                                                                                                                                |
| `--zip`                                   | Publish your Storybook to Chromatic as a single zip file instead of individual content files.                                                                                                                                                                                                                                                                                                      |

### Debug options

These options may help you debug problems or enable integration with other tools.

| CLI flag                    |                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--debug`                   | Output verbose debugging information. This option implies `--no-interactive`.                                                                            |
| `--diagnostics`             | Write process context information to `chromatic-diagnostics.json`.                                                                                       |
| `--dry-run`                 | Run without actually publishing to Chromatic.                                                                                                            |
| `--force-rebuild [branch]`  | Do not skip build when a rebuild is detected. Only for `[branch]`, if specified. Globs are supported via [picomatch].                                    |
| `--junit-report [filepath]` | Write build results to a JUnit XML file. Defaults to `chromatic-build-{buildNumber}.xml`. `{buildNumber}` will be replaced with the actual build number. |
| `--list`                    | List available stories. This requires running a full build.                                                                                              |
| `--no-interactive`          | Don't ask interactive questions about your setup, and don't overwrite output. `true` in non-TTY environments.                                            |
| `--trace-changed [mode]`    | Print dependency trace for changed files to affected story files. Set to "expanded" to list individual modules. Requires `--only-changed`.               |

See [diagnosing issues](#diagnosing-issues) for when to use these flags.

### Environment variables

Some options can be configured through environment variables. You will typically only need these when instructed to. Flags take precedence over environment variables. Environment variables are also read from a `.env` file if present.

| Environment variable             | Description                                                                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `CHROMATIC_PROJECT_TOKEN`        | Project token, see `--project-token`                                                                                                         |
| `CHROMATIC_SHA`                  | Git commit hash. See [troubleshooting guide for issues](#chromatic-git-options)                                                              |
| `CHROMATIC_BRANCH`               | Git branch name. See `--branch-name` for additional options and [troubleshooting guide for issues](#chromatic-git-options)                   |
| `CHROMATIC_SLUG`                 | Git repository slug (e.g., `chromaui/chromatic-cli`). See [troubleshooting guide for issues](#chromatic-git-options)                         |
| `CHROMATIC_POLL_INTERVAL`        | Polling interval when waiting for the build to finish (default: `1000`)                                                                      |
| `CHROMATIC_OUTPUT_INTERVAL`      | Frequency of progress output while polling or uploading (default: `10000`)                                                                   |
| `CHROMATIC_RETRIES`              | Number of times to retry file upload (default: `5`)                                                                                          |
| `CHROMATIC_STORYBOOK_VERSION`    | Overrides Storybook package/version detection (e.g. `@storybook/react@7.0.1-alpha.25`)                                                       |
| `CHROMATIC_TIMEOUT`              | Number of ms before giving up on `storybook dev` (default: `300000` (5 minutes))                                                             |
| `STORYBOOK_BUILD_TIMEOUT`        | Number of ms before giving up on `storybook build` (default: `600000` (10 minutes))                                                          |
| `CHROMATIC_DNS_SERVERS`          | Overrides the DNS server IP address(es) used by node-fetch, comma-separated. See [troubleshooting guide for issues](#chromatic-dns-options)  |
| `CHROMATIC_DNS_FAILOVER_SERVERS` | Fallback DNS server IPs (default: `1.1.1.1`, `8.8.8.8` (Cloudflare, Google)). See [troubleshooting guide for issues](#chromatic-dns-options) |
| `CI`                             | See `--ci`                                                                                                                                   |
| `LOG_LEVEL`                      | One of: `silent`, `error`, `warn`, `info`, `debug`                                                                                           |
| `DISABLE_LOGGING`                | Set to `true` to disable logging. Equal to `LOG_LEVEL=silent`                                                                                |
| `HTTPS_PROXY` or `HTTP_PROXY`    | Used to configure [https-proxy-agent]. See [troubleshooting guide for issues](#chromatic-dns-options)                                        |

### Exit codes

| Exit code | Key                          | Description                                            |
| --------- | ---------------------------- | ------------------------------------------------------ |
| `0`       | `OK`                         | Exited successfully                                    |
| `1`       | `BUILD_HAS_CHANGES`          | Chromatic build has (visual) changes                   |
| `2`       | `BUILD_HAS_ERRORS`           | Chromatic build has component errors                   |
| `3`       | `BUILD_FAILED`               | Chromatic build failed due to system error             |
| `4`       | `BUILD_NO_STORIES`           | Chromatic build failed because it contained no stories |
| `5`       | `BUILD_WAS_LIMITED`          | Chromatic build was limited                            |
| `6`       | `BUILD_WAS_CANCELED`         | Chromatic build was canceled                           |
| `11`      | `ACCOUNT_QUOTA_REACHED`      | Chromatic account reached its snapshot quota           |
| `12`      | `ACCOUNT_PAYMENT_REQUIRED`   | Chromatic account requires payment                     |
| `101`     | `GIT_NOT_CLEAN`              | Git repository workspace not clean                     |
| `102`     | `GIT_OUT_OF_DATE`            | Git repository not up-to-date with remote              |
| `103`     | `GIT_NO_MERGE_BASE`          | Git branch has no merge base                           |
| `104`     | `NPM_INSTALL_FAILED`         | npm or Yarn failed to install dependencies             |
| `105`     | `NPM_BUILD_STORYBOOK_FAILED` | npm or Yarn failed to run build-storybook script       |
| `201`     | `FETCH_ERROR`                | HTTP fetch error                                       |
| `202`     | `GRAPHQL_ERROR`              | GrahpQL API error                                      |
| `254`     | `INVALID_OPTIONS`            | Invalid options (flags) provided                       |
| `255`     | `UNKNOWN_ERROR`              | Unknown error                                          |

### Deprecated options

The following options are still supported but will be removed in a future version. If your project still uses them, we encourage you to remove them from your scripts or configuration at your earliest convenience.

| CLI flag                 |                                                                          |
| ------------------------ | ------------------------------------------------------------------------ |
| `--allow-console-errors` | Continue running Chromatic even if Storybook logs errors in the console. |
| `--app-code <token>`     | Renamed to `--project-token`.                                            |

### Unsupported options

The options listed below are no longer supported by our CLI and will not yield any result if you provide them in your project. We recommend removing them from your scripts and configuration.

| CLI flag                  |                                                                                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--script-name [name]`    | The npm script that starts your Storybook. Defaults to `storybook`. Alias: `-s`                                                               |
| `--exec <command>`        | Alternatively, a shell command that starts your Storybook. Alias: `-e`                                                                        |
| `--do-not-start`          | Don't attempt to start or build Storybook. Use this if your Storybook is already running, for example, when part of a larger app. Alias: `-S` |
| `--storybook-port <port>` | What port is your Storybook running on. Auto detected from the npm script when using `--script-name`. Alias: `-p`                             |
| `--storybook-https`       | Enable if Storybook runs on HTTPS (locally). Auto detected from the npm script when using `--script-name`.                                    |
| `--storybook-cert <path>` | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                   |
| `--storybook-key <path>`  | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                   |
| `--storybook-ca <ca>`     | Use with `--storybook-https`. Auto detected from the npm script when using `--script-name`.                                                   |
| `--storybook-url <url>`   | Run against an online Storybook at some URL. This implies `--do-not-start`. Alias: `-u`                                                       |

## Usage in a GitHub Action

There are examples here: https://github.com/chromaui/chromatic-cli

Do not run this based on a GitHub `pull_request` event. If you do, the commit and branch will get reported wrong. Use [our GitHub Action](https://github.com/marketplace/actions/publish-to-chromatic) instead.

## Diagnosing issues

Getting your Chromatic CI script configured _just right_ can take some trial and error. To help debug issues, you may want to consider using some of the debug flags:

- `--no-interactive`: When running the CLI locally, use this flag to get logs like you would in CI, which are more elaborate than the interactive logs. This is automatically enabled in CI, so adding it to a CI script is useless.
- `--diagnostics`: Before terminating the process, this dumps process context information to `chromatic-diagnostics.json`. This is the first place to look if you see things you didn't expect. In a CI system, you'll have to configure this file as a **build artifact** so you can download it. How to do this depends on your CI provider.
- `--dry-run`: Use this if you want to debug the CLI without actually publishing your Storybook or running a Chromatic build. Typically you'd pair this with `--diagnostics`.
- `--debug`: This enables verbose logging and `--no-interactive`. Use this if you want to see the nitty-gritty details. Primarily useful if you have issues publishing (uploading) your Storybook to Chromatic.
- `--trace-changed`: Specifically for TurboSnap, you can use this flag to get a printed tree view of the dependencies between changed files (according to Git) and your story files.
- `--only-story-names`: If you have some specific stories which are causing problems, you can use this flag to run a build for just those stories (one or more). If you don't know which stories are available, you can use `--list` to print a list of all stories in your Storybook, though it will require running a Chromatic build.

## Migrating to the new CLI package

This package was previously named `storybook-chromatic`. If you still have `storybook-chromatic` installed, you should remove it and install `chromatic` instead:

**With npm:**

```shell
npm uninstall --save-dev storybook-chromatic
npm install --save-dev chromatic
```

**With yarn:**

```shell
yarn remove storybook-chromatic
yarn add --dev chromatic
```

- [Source on GitHub](https://github.com/chromaui/chromatic-cli#main-options)
- [Package on npm](https://www.npmjs.com/package/chromatic)

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
[https-proxy-agent]: https://www.npmjs.com/package/https-proxy-agent

---

### Troubleshooting

<details>
<summary> I see "Chromatic: Failed to publish. Reason: self signed certificate in certificate chain" when running the CLI on my machine.</summary>

This isn't a Chromatic CLI issue. Check if your machine is using special security or network settings before running the CLI.

</details>

<details>
<summary id="chromatic-dns-options"> I see "ENOTFOUND" when running the CLI on my machine</summary>

By default, DNS resolution is handled by the environment system. If you are experiencing DNS issues (i.e. `ENOTFOUND`), the CLI will try and switch from the operating system DNS lookup (i.e., `dns.lookup`) to network DNS resolve (i.e., `dns.resolve`). If this also fails, the CLI will add `CHROMATIC_DNS_FAILOVER_SERVERS` to the list of available DNS servers and try again. For additional information regarding Node's DNS implementation, please refer to their [documentation](https://nodejs.org/docs/latest/api/dns.html#dns_implementation_considerations).

</details>

<details>
<summary id="chromatic-git-options">Why are Git environment variables not working with the CLI?</summary>

If you've configured the Chromatic CLI to run with one of the Git environment variables (i.e.,`CHROMATIC_SHA`, `CHROMATIC_BRANCH`, `CHROMATIC_SLUG`), you must configure all three. Otherwise, Chromatic will ignore them when running the build.

</details>