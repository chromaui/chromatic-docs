---
layout: default
title: Setup
description: Learn how to setup Chromatic and publish Storybook
---

# Setup

Chromatic's CLI tool is used to build and publish Storybooks to the cloud which are then access via the [web interface](https://www.chromatic.com/start). The CLI tool also returns an exit code based on the result of running UI tests (if enabled) which can be used to block builds in CI when tests fail.

## Signup

Before publishing, you'll need to obtain an `<app-code>` by logging in to [Chromatic](https://www.chromatic.com/start) and creating a project. The `<app-code>` is a unique token used by the CLI tool and generated for each Storybook that you'll be publishing.

Chromatic supports oAuth login via all major Git providers (Github, Gitlab, Bitbucket). Chromatic will mirror permissions from your Git provider meaning that if you link a project to a Git repository, only the people who have access to that repository will have access to the project in Chromatic. It's also possible to create an 'Unlinked' project and manage the list of collaborators manually.

Enterprise plans come with support for Single Sign On (SSO) and on-prem Git hosting from all supported providers. Read more about Chromatic's access control on our [reference page](access).

## Installation

Install the [storybook-chromatic](https://github.com/chromaui/chromatic-cli) package from Npm. Storybook 3.4 and above is required.

```bash
# Yarn
yarn add storybook-chromatic

# Npm
npm install --save-dev storybook-chromatic
```

The `chromatic` command will also give you the option of adding an npm script to your `package.json` so you can run future builds with `npm run chromatic/yarn chromatic`. If you want to add it manually, it should look something like:

```json
{
  "scripts": {
    "chromatic": "chromatic"
  }
}
```

The above script command will pick up your app code by reading the `CHROMATIC_APP_CODE` environment variable. After adding the above, ensure you set `CHROMATIC_APP_CODE` when you run builds---such as in your CI config.

If you allowed `chromatic` to add the above line, it will also have written the environment variable to your `package.json`. Depending on your level of trust of your code hosting provider, you should consider removing the environment variable and setting via your CI config.

## Running

Once you've installed the `storybook-chromatic` package and have an `<app-code>`, run the following command in your project directory.

```bash
./node_modules/.bin/chromatic --app-code=<your-app-code>
```

<div class="aside">
Chromatic uses the `build-storybook` script from your `package.json` by default but you can specify a different name (see <a href="#available-options">options</a>). You may need to update the `build-storybook` script if you customized your `storybook` script (for example if you added a static directory with `-s`). Whilst it's possible for Chromatic to run against a development Storybook, we strongly recommend you use a built Storybook. 
</div>

If everything worked, you'll see some informational output followed by

```bash
Build 1 published.

View it online at https://www.chromatic.com/build?appId=59c5a73849dd100364e1d57&number=1.
```

What this did:

1. Ran `storybook-build` and published the output static Storybook to Chromatic resulting in a new 'Build'.
2. Updated the Build with local Git history so that Chromatic can associate Git commits with published Storybooks.
3. A 'Snapshot' was created for every Story by rendering it and capturing the output on Chromatic's cloud infrastrcture.
4. The Snapshots were used to run UI Tests and create visual comparisons to power UI Review.
5. Pull Requests that are affected by the commit were updated with links to the published Storybook and UI Review along with UI Test results.

![Build Page](img/xxx-page.png)

Each time you run the `chromatic` command, we'll create a corresponding artifact within Chromatic's web interface and show details on the Build screen. Here, you can:

- Confirm your build worked and directly access the Storybook that Chromatic indexed.
- Review UI test results and see which browsers are enabled for UI tests.
- Browse the components that are included in the Storybook and access your library.
- If the Storybook commit is part of a PR, access Chromatic's UI Review page.

## Configure CI

During setup we recommend running `chromatic` on the command line (as shown above) to make sure everything is configured correctly. In order to complete setup, Chromatic must be integrated into your CI environment to ensure your Storybook is published every time you push and we can detect UI changes between commits.

We support all major CI providers. If you're using Github and don't yet have CI, we've built a [Github Action](https://github.com/chromaui/action) that makes it trivial to run Chromatic on every push. Read our [XXX CI reference page](ci) for help on setting up CI.

![PR Status Checks](https://via.placeholder.com/300x150.png?text=PR Status Checks){: .center }

When running inside CI, Chromatic will update pull request status checks for every push. You'll get links to your published Storybook for the latest commit on the branch, UI test results (optional) and UI review approvals (optional).

---

## Next: Catch UI bugs

📸 Now that you're publishing your Storybook, learn about Chromatic's visual regression [testing](test).

<a class="btn primary round" href="/test">Read next chapter</a>

---

### Available options

If you have customized the way your Storybook runs, you may need to pass additional options to the `chromatic` command.

| Option                   | Use case                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--app-code`             | The unique code for your app -- note you can just pass this via the `CHROMATIC_APP_CODE` environment variable.                                                                 |
| `--build-script-name`    | The npm script that builds your Storybook we should take snapshots against (defaults to `build-storybook`). Use this if your Storybook build script is named differently.      |
| `--storybook-build-dir`  | If you have already built your Storybook, provide the path to the built Storybook.                                                                                             |
| `--auto-accept-changes`  | If there are any changes to the build, automatically accept them. This is useful in some branching situations. See more in the [**branching docs**](/branching-and-baselines). |
| `--exit-zero-on-changes` | If all snapshots render but there are visual changes, exit with a 0 exit code, rather than the usual 1.                                                                        |
| `--preserve-missing`     | Treat missing stories as unchanged rather than deleted.                                                                                                                        |
| `--no-interactive`       | Don't ask interactive questions about your setup.                                                                                                                              |
| `--debug`                | Output extra debugging information.                                                                                                                                            |
| `CI=true`                | Tell Chromatic that you're running in CI. This will hide the "Setup CI / Automation" messages in the UI. Add _before_ the test command like so: `CI=true yarn chromatic...`    |

Additional options and more documentation are available in the `storybook-chromatic` package [documentation](https://github.com/chromaui/chromatic-cli).

---

## Troubleshooting

#### Test build failures

A build will _fail_ if any of the snapshots fail to render (i.e. in rendering the latest version of the component, the snapshot throws a JavaScript exception). You'll need to fix the code for errored components before we can pass the build.

#### Errored builds

Chromatic builds and runs Storybook flawlessly _most of the time_, but we're not perfect (we wish). Sometimes builds don't run due to rare infrastructure issues. If this happens, try to re-run the build. Rest assured, we keep track of errors and continue to work to improve the service every day.

#### Timed out

Chromatic takes snapshots very quickly. However, if we lose the connection to your server (for instance if you stop your server mid-build, or your internet connection goes down), builds can time out. Simply restart the build---perhaps with a more stable connection.

#### Failed to evaluate your stories

To make a list of Chromatic specs from your Storybook stories, we evaluate your story code from a node script, using JSDOM to simulate a browser environment. We don't render your stories but just gather a list of them by including your story files. You may need to avoid calling various browser-only constructs at the top-level or mock them out. Pass `--debug` to the script command to get extra info if it fails.

#### No Storybook specs found

To get a list of stories, we evaluate your Storybook with [JSDOM](https://github.com/tmpvar/jsdom). This is a slightly different environment to a normal browser and can sometimes have problems. We will try to output errors if we see them; using the `--debug` flag to `chromatic` may help if we didn't catch any errors.

#### Image size too large

We have a 25 million pixel size limit for image snapshots. This ensures fast and reliable performance for every build.

If your stories are larger than this, perhaps something has gone wrong? Let us know if you need this limit increased by chat or [email](mailto:support@hichroma.com?Subject=Image Size Limit).
