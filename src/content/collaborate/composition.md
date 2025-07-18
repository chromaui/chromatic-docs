---
title: Composition
description: Learn to combine Storybooks through composition
sidebar: { order: 8 }
---

# Storybook Composition

Chromatic publishes your Storybook to a secure CDN. That means you can combine published Storybooks with your local Storybook using [Composition](https://storybook.js.org/docs/sharing/storybook-composition).

<div class="aside">Chromatic does not snapshot externally composed Storybooks for UI Tests or UI Review.</div>

## Compose published Storybooks

Chromatic generates a [permalink](/docs/permalinks) for published Storybooks to use with Composition that includes:

- Versioned endpoints, URLs that resolve to different published Storybooks depending on a version=x.y.z query parameter (where x.y.z is the released version of the package).
- Support for /stories.json
- Support for /metadata.json and the releases field.

### Setup

In your local Storybook, add a `refs` key to [`.storybook/main.js|ts`](https://storybook.js.org/docs/configure#configure-story-rendering). Paste the permalink in the `url` field.

```js title="storybook/main.ts"
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from "@storybook/your-framework";

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  refs: {
    // 👇 Upper-case characters not supported in the refs key
    "chromatic-published-storybook": {
      // The title of your Storybook
      title: "Design System",
      // The url provided by Chromatic when it was published
      url: "https://your-published-url.chromatic.com",
    },
  },
};

export default config;
```

When your local Storybook starts, it will auto detect the `refs` and compose your published Storybook. You'll see both sets of stories side-by-side.

![Multiple Storybooks combined through composition](../../images/reference-external-storybooks-composition.png)

### Compose Storybook by branch or commit

Depending on your use case, you may want to compose Storybook using a [permalink](/docs/permalinks) to a branch or a commit.

#### Branch: `https://<branch>--<appid>.chromatic.com`

If you want your local Storybook to compose the latest Storybook on `main`, use the branch permalink. This is useful for folks who work on multiple Storybooks simultaneously.

- Building a component library in React and Vue at the same time
- Monorepos with multiple inter-connected Storybook projects

#### Commit: `https://<commithash>--<appid>.chromatic.com`

If you want your local Storybook to compose a specific version of Storybook, use the commit permalink. This is useful for folks who depend on a fixed version of a component library package.

### Access control

Published Storybooks follow the [access rules](/docs/access) of your project. If you have a private project, you'll need sign in to Chromatic (via Storybook's UI) to load the private Storybook.

---

## Package Composition

Design system and component library authors can automatically compose their Storybook inside their consumer’s Storybooks.

Add a `storybook` property in the `package.json`. Use the [permalink to a commit](#compose-storybook-by-branch-or-commit) in the `url` field.

```json
{
  "storybook": {
    "url": "https://your-published-url.chromatic.com"
  }
}
```

Once the package is installed and Storybook starts, it scans for external Storybooks referenced by your packages and loads them into the UI.

### Versioning

Chromatic supports automatic versioning for the following Git providers.

| Git provider                                        | Support                                  |
| --------------------------------------------------- | ---------------------------------------- |
| GitHub                                              | Public projects only via GitHub Releases |
| GitLab                                              | Public and private projects              |
| Bitbucket                                           | Not supported                            |
| [Unlinked projects](/docs/access#unlinked-projects) | Not supported                            |

<details>
  <summary>How to manually query for versions?</summary>

If automatic versioning isn't supported for your Git provider, you can still get version information by manually updating your `package.json` with the permalink of the current published Storybook (e.g. `https://<commithash>--<appid>.chromatic.com`).

Use the `/metadata.json` endpoint to get additional information about the deployed Storybook version. It will output a response similar to the example below:

```json
{
  "versions": {
    "v0.1.1": "https://your-published-url.chromatic.com"
  }
}
```

</details>

---

### Resources

- [Storybook composition](https://storybook.js.org/docs/sharing/storybook-composition)
- [Package composition with Storybook](https://storybook.js.org/docs/sharing/package-composition)
