---
layout: default
title: Setup
description: Learn how to setup Chromatic and publish Storybook
---

# Setup and publish Storybook

The Chromatic CLI builds then publishes Storybook to a secure workspace in the cloud. That allows your team to access all your stories at [chromatic.com](https://www.chromatic.com/start).

![Publish Storybook](img/workflow-publish.png)

## Sign up

Before publishing, generate a unique `<project-token>` for your Storybook by logging in to [Chromatic](https://www.chromatic.com/start) and creating a project. Login via OAuth from GitHub, GitLab, or Bitbucket.

<details>
<summary id="demo-chromatic-unlinked">How to continue setup if you require SSO, on-premises, or have a different Git provider.</summary>

These instructions will teach you how to setup Chromatic with an ["unlinked" project](access#unlinked-projects). This can be useful in these situations:

- You need an enterprise plan but want to trial Chromatic in your project first
- You use an OAuth provider that we don't support right now
- You use Git hosting that we don't support right now

Start by signing in using your _personal_ account via any of the supported providers. We'll use this to authenticate you as a user only so the account doesn't have to be associated with your work.

Select "Create a project" and type your project name to create an unlinked project.

<video autoPlay muted playsInline loop width="560px" style="margin-bottom: 1em">
  <source src="img/chromatic-setup-unlinked-project.mp4" type="video/mp4" />
</video>
 
Nice! You created an unlinked project. This will allow you to get started with [UI Testing](test) workflow regardless of the underlying git provider. You can then configure your CI system to automatically run a Chromatic build on push.

The Chromatic CLI provides the option to generate a JUnit XML report of your build, which you can use to handle commit / pull request statuses yourself. See [debug options](cli#debug-options) for details.

Unlinked projects have certain drawbacks:

- You won't get automatic PR checks, so pull requests will not be marked with our status messages. You'll need to set this up manually via your CI provider.
- You won't have access to our UI Review workflow, because it relies on retrieving pull requests from your Git provider.
- Authentication and access control must be handled manually through user invites.

Now continue setting up Chromatic [as usual](setup#install).

</details>

![Setup project](img/setup.png)

## Install

Install the [**chromatic**](https://www.npmjs.com/package/chromatic) package from npm.

```bash
# Yarn
yarn add --dev chromatic

# npm
npm install --save-dev chromatic
```

<div class="aside">Storybook 3.4 or later is required.</div>

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

The above script command will pick up your project token by reading the `CHROMATIC_PROJECT_TOKEN` environment variable. After adding the above, ensure you set `CHROMATIC_PROJECT_TOKEN` when you run builds---such as in your CI config.

If you allowed `chromatic` to add the above line, it will also have written the environment variable to your `package.json`. This environment variable can also be set via your CI config for extra privacy.

</details>

## Run Chromatic

Once you installed the `chromatic` package and have a `<project-token>`, run the following command in your project directory.

```bash
npx chromatic --project-token <your-project-token>
```

<div class="aside">
We use the <code>build-storybook</code> script from your <code>package.json</code> by default. If you have customized the <code>storybook</code> script (for example, adding a static directory with <code>-s</code>), check that you've done the same for <script>build-storybook</script>.
</div>

When complete, you'll see the build status and a link to the published Storybook:

```bash
Build 1 published.

View it online at https://www.chromatic.com/build?appId=...&number=1.
```

## View published Storybook

You published Storybook online! Every time you run the `chromatic` command you get a corresponding build in Chromatic's web app. You can now browse components, view [**UI Tests**](test) results (if enabled), and navigate to associated PR/MRs for [**UI Review**](review).

![Build for publish](img/build-publish-only.png)

## Get the PR check

Chromatic posts a "Storybook Publish" status check in your pull/merge request that links to the latest published Storybook. This gives teams secure, convenient access to browse components and stories. Get the PR check by [automating Chromatic with CI](ci).

![PR badge for publish](img/prbadge-publish.png)

<div class="aside">During setup we recommend running <code>chromatic</code> on the command line to make sure the configuration is correct. For production use run Chromatic in CI.</div>

---

## Next: Catch UI bugs

📸 Now that you published Storybook, let's see how to automate [UI tests](test) to catch bugs.

<a class="btn primary round" href="test">Read next chapter</a>

---

<details>
<summary><h3 class="no-anchor">Command options</h3></summary>

If you have customized the way your Storybook runs, you may need to pass additional options to the `chromatic` command. Learn more in the [package documentation](https://github.com/chromaui/chromatic-cli#main-options).

</details>
