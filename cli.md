---
layout: default
title: CLI
description: Learn about the Chromatic CLI options
---

# Chromatic CLI

The CLI builds then publishes Storybook. Run `chromatic` in your project directory.

```bash
npx chromatic --project-token <your-project-token>
```

If you customized the way your Storybook runs, you may need to pass additional options.

| Required options  | Use case                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--project-token` | The unique code for your project. You can also pass this via the `CHROMATIC_PROJECT_TOKEN` environment variable. |

| Storybook options       | Use case                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `--build-script-name`   | The npm script that builds your Storybook we should take snapshots against. Use this if your Storybook build script is |
|                         | named differently. Defaults to `build-storybook`.                                                                      |
| `--storybook-build-dir` | If you have already built your Storybook, provide the path to the built Storybook.                                     |

| Chromatic options                        | Use case                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `--allow-console-errors`                 | Continue running Chromatic even if some there are errors logged during Storybook initialization.        |
| `--auto-accept-changes [branch]`         | If there are any changes to the build, automatically accept them. This is useful in some branching      |
|                                          | situations. See more in the [**branching docs**](branching-and-baselines). This is only for `<branch>`  |
|                                          | if specified. Globs are supported via [picomatch].                                                      |
| `--exit-zero-on-changes [branch]`        | If all snapshots render but there are visual changes, exit with a 0 exit code, rather than the usual 1. |
|                                          | This is only for `<branch>` if specified. Globs are supported via [picomatch].                          |
| `--exit-once-uploaded [branch]`          | Exit with 0 once the built version has been published to Chromatic. This is only for `<branch>` if      |
|                                          | specified. Globs are supported via [picomatch].                                                         |
| `--ignore-last-build-on-branch [branch]` | Do not use the last build on this branch as a baseline if it is no longer in history (i.e. branch was   |
|                                          | rebased). This is only for `<branch>` if specified. Globs are supported via [picomatch].                |
| `--preserve-missing`                     | Treat missing stories as unchanged rather than deleted.                                                 |
| `--no-interactive`                       | Don't ask interactive questions about your setup and don't overwrite output.                            |

| Debug options              | Use case                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--debug`                  | Output more debugging information.                                                                                  |
| `--ci`                     | Tell Chromatic that you're running in CI, non-interactively. Alternatively, pass `CI=true`.                         |
| `--list`                   | List available stories. Note this requires running a build.                                                         |
| `--only <component:story>` | Only run a single story or a glob-style subset of stories.                                                          |
| `--skip [branch]`          | Skip Chromatic tests, but mark the commit as passing. This is only for `<branch>` if specified. Globs are supported |
|                            | via [picomatch].                                                                                                    |
| `--report [filepath]`      | Write build results to a JUnit XML file. Defaults to `chromatic-build-{buildNumber}.xml`. `{buildNumber}` will be   |
|                            | replaced with the build number.                                                                                     |

Are you using an older package? [View deprecated options »](https://github.com/chromaui/chromatic-cli/#storybook-options)

- [Source on GitHub](https://github.com/chromaui/chromatic-cli#main-options)
- [Package on NPM](https://www.npmjs.com/package/chromatic)

[picomatch]: https://www.npmjs.com/package/picomatch#globbing-features
