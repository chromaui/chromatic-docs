---
layout: default
title: Setup
description: Learn how to setup Chromatic and publish Storybook
---

# Setup and publish Storybook

The Chromatic CLI builds then publishes Storybook to a secure workspace in the cloud. That allows your team to access all your stories at [chromatic.com](https://www.chromatic.com/start).

![Publish Storybook](/img/workflow-publish.png)

## Sign up

Before publishing, generate a unique `<app-code>` for your Storybook by logging in to [Chromatic](https://www.chromatic.com/start) and creating a project. Login via OAuth from GitHub, GitLab, or Bitbucket. If you require SSO or have on-premises Git hosting learn more about access control [here](access#authentication).

![Setup project](/img/setup.png)

## Install

Install the [storybook-chromatic](https://github.com/chromaui/chromatic-cli) package from Npm. Storybook 3.4 and above is required.

```bash
# Yarn
yarn add storybook-chromatic

# npm
npm install --save-dev storybook-chromatic
```

<details>

<summary>Learn how to add <code>chromatic</code> to your package.json</summary>

The `chromatic` command will also give you the option of adding an npm script to your `package.json` so you can run future builds with `npm run chromatic/yarn chromatic`. If you want to add it manually, it should look something like:

```json
{
  "scripts": {
    "chromatic": "chromatic"
  }
}
```

The above script command will pick up your app code by reading the `CHROMATIC_APP_CODE` environment variable. After adding the above, ensure you set `CHROMATIC_APP_CODE` when you run builds---such as in your CI config.

If you allowed `chromatic` to add the above line, it will also have written the environment variable to your `package.json`. This environment variable can also be set via your CI config for extra privacy.

</details>

## Run Chromatic

Once you've installed the `storybook-chromatic` package and have an `<app-code>`, run the following command in your project directory.

```bash
./node_modules/.bin/chromatic --app-code=<your-app-code>
```

<div class="aside">
We use the <code>build-storybook</code> script from your <code>package.json</code> by default. If you customized your <code>storybook</code> script (for example, adding a static directory with <code>-s</code>), specify them using our <a href="#command-options">options</a>.
</div>

When complete, you'll see the build status and a link to the published Storybook:

```bash
Build 1 published.

View it online at https://www.chromatic.com/build?appId=...&number=1.
```

## View published Storybook

Success! Every time you run the `chromatic` command you get a corresponding build in Chromatic's web app. You can now browse components, view [**UI Tests**](test) results (if enabled), and navigate to associated PR/MRs for [**UI Review**](review).

![Build for publish](img/build-publish-only.png)

## Get the PR check

Chromatic posts a "Publish Storybook" status check in pull/merge requests that links to the latest published Storybook. This gives teams secure, convenient access to browse components and stories. Get the PR check by [automating Chromatic with CI](ci).

![PR badge for publish](img/prbadge-publish.png)

<div class="aside">During setup we recommend running <code>chromatic</code> on the command line to make sure the configuration is correct. Run Chromatic in CI for production use.</div>

## Next: Catch UI bugs

📸 Now that you published Storybook, let's see how to automate [UI tests](test) to catch bugs.

<a class="btn primary round" href="/test">Read next chapter</a>

---

<details>
<summary><h3 id="command-options">Command options</h3></summary>

If you have customized the way your Storybook runs, you may need to pass additional options to the `chromatic` command. Learn more in the [package documentation](https://github.com/chromaui/chromatic-cli#main-options).

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

</details>

### Troubleshooting

<details>
<summary>Build failures</summary>

A build will _fail_ if any of the snapshots fail to render (i.e. in rendering the latest version of the component, the snapshot throws a JavaScript exception). You'll need to fix the code for errored components before we can pass the build.

</details>

<details>
<summary>Errored builds</summary>

Chromatic builds and runs Storybook flawlessly _most of the time_, but we're not perfect (we wish). Sometimes builds don't run due to rare infrastructure issues. If this happens, try to re-run the build in your CI provider. We keep track of these errors to improve the service.

</details>

<details>
<summary>Timed out</summary>

Chromatic takes snapshots very quickly. However, if we lose the connection to your server (for instance if you stop your server mid-build, or your internet connection goes down), builds can time out. Check your connection and try restarting the build.

</details>

<details>
<summary>Failed to evaluate your stories</summary>

We use [JSDOM](https://github.com/tmpvar/jsdom) to evaluate your stories in a simulated browser environment. JSDOM doesn't support every browser-specific construct or API. Our package provides shims for [common constructs](https://github.com/chromaui/chromatic-cli/blob/19751d87d950a2aecefb522e57c9a13c8c34fe54/bin/lib/jsdom-shims.js), but you may need mock them out yourself for extra coverage. Pass `--debug` to the script command to get extra info if it fails.

</details>

<details>
<summary>No Storybook specs found</summary>

To get a list of stories, we evaluate your Storybook with [JSDOM](https://github.com/tmpvar/jsdom). This is a slightly different environment to a normal browser and can sometimes have problems. We will try to output errors if we see them; using the `--debug` flag to `chromatic` may help if we didn't catch any errors.

</details>

<details>
<summary>Image size too large</summary>

We have a 25 million pixel size limit for image snapshots. This ensures fast and reliable performance for every build.

If your stories are larger than this, perhaps something has gone wrong? Let us know if you need this limit increased by chat or [email](mailto:support@hichroma.com).

</details>
