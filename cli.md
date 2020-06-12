---
layout: default
title: CLI
description: Learn about the Chromatic CLI options
---

# Chromatic CLI

The [CLI](https://www.npmjs.com/package/chromatic) builds then publishes Storybook. Run `chromatic` in your project directory.

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

### Troubleshooting

<details>
<summary>Uploading Storybook via the tunnel (deprecated)</summary>

We changed the way that Chromatic CLI builds and uploads Storybook over time. Before we begin, make sure you're using the latest [**chromatic**](https://www.npmjs.com/package/chromatic) package.

#### Tunnel method (deprecated)

The original version of [**storybook-chromatic**](https://www.npmjs.com/package/storybook-chromatic) (deprecated) used a tunnelling mechanism in order to capture screenshots of your stories and create a hosted version of your Storybook. The CLI package would create a HTTPS tunnel between your CI server (running Storybook in development mode) and our capture cloud.

This technique worked well, but it relied on a stable network connection between your CI server and our tunnel's server while building. In some cases, this connection could be less than perfect for reasons outside of anyones control. This could lead to miscaptured stories when resources failed to load.

#### Build and upload method

As of `^2.0.0`, Chromatic CLI defaults to building a static Storybook then uploading it to our servers before starting the capture process. It relies on the Storybook command `build-storybook`.

In practice, this method is more predictable, reliable, and faster for creating builds. It also means you can pass the `--exit-once-uploaded` flag (as of `^3.4.0`) and not have to keep your CI server running while Chromatic is capturing.

We'll continue to support the tunnel, however it is officially deprecated. We urge you to switch to uploaded builds.

To start using uploaded builds, ensure you are on the latest version of [**chromatic**](https://www.npmjs.com/package/chromatic) and that you are not using the `-s` / `--script-name` flag in your "chromatic" script. If you use a custom npm script name to build Storybook, you'll need to pass the `-b` / `--build-script-name` flag to the Chromatic CLI.

</details>
