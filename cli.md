---
layout: default
title: CLI
description: Learn about the Chromatic CLI options
---

# Chromatic CLI

The CLI builds then publishes Storybook. Run `chromatic` in your project directory.

```bash
./node_modules/.bin/chromatic --project-token=<your-project-token>
```

If you customized the way your Storybook runs, you may need to pass additional options.

| Main options      | Use case                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `--project-token` | The unique code for your project -- note you can pass this via the `CHROMATIC_PROJECT_TOKEN` environment variable. |

| Storybook options       | Use case                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--build-script-name`   | The npm script that builds your Storybook we should take snapshots against (defaults to `build-storybook`). Use this if your Storybook build script is named differently. |
| `--storybook-build-dir` | If you have already built your Storybook, provide the path to the built Storybook.                                                                                        |

| Chromatic options                        | Use case                                                                                                                                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-console-errors`                 | Continue running Chromatic even if some there are errors logged during Storybook initialization                                                                                                                         |
| `--auto-accept-changes [branch]`         | If there are any changes to the build, automatically accept them. This is useful in some branching situations. See more in the [**branching docs**](branching-and-baselines). This is only for `<branch>` if specified. |
| `--exit-zero-on-changes [branch]`        | If all snapshots render but there are visual changes, exit with a 0 exit code, rather than the usual 1. This is only for `<branch>` if specified.                                                                       |
| `--exit-once-uploaded [branch]`          | Exit with 0 once the built version has been published to Chromatic. This is only for `<branch>` if specified.                                                                                                           |
| `--ignore-last-build-on-branch [branch]` | Do not use the last build on this branch as a baseline if it is no longer in history (i.e. branch was rebased). This is only for `<branch>` if specified.                                                               |
| `--preserve-missing`                     | Treat missing stories as unchanged rather than deleted.                                                                                                                                                                 |
| `--no-interactive`                       | Don't ask interactive questions about your setup.                                                                                                                                                                       |

| Debug options              | Use case                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `--debug`                  | Output more debugging information.                                                          |
| `--only <component:story>` | Only run a single story or a glob-style subset of stories for debugging purposes.           |
| `--skip`                   | Skip Chromatic tests (mark as passing)                                                      |
| `--list`                   | List available stories for debugging purposes                                               |
| `--ci`                     | Tell Chromatic that you're running in CI, non-interactively. Alternatively, pass `CI=true`. |

Are you using an older package? [View deprecated options »](https://github.com/chromaui/chromatic-cli/#storybook-options)

- [Source on GitHub](https://github.com/chromaui/chromatic-cli#main-options)
- [Package on NPM](https://www.npmjs.com/package/chromatic)
