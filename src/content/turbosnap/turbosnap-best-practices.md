---
title: TurboSnap best practices
description: TurboSnap best practices to optimize your builds for faster testing
sidebar: { order: 3, label: "Best practices" }
slug: "turbosnap/best-practices"
---

# TurboSnap best practices

Most everyone agrees it's important to test your UI, but it's even more important to make sure you're testing the _right parts_ of your UI at the _right time_. Meet TurboSnap: one of Chromatic's most powerful tools for accelerating UI testing in CI. By using your git history and dependency graph to intelligently detect what's changed in your Storybook project so that Chromatic only tests components affected by your updates, saving time and CI resources while maintaining the value of your tests.

Whether you're working in a single-project repository or have a more complex setup (such as a monorepo), following best practices ensures TurboSnap works efficiently to help surface _meaningful_ visual regressions. Here are some essential tips to keep your TurboSnap running fast, reliably, and accurately.

## Confirm TurboSnap is enabled

Once you've met the [prerequisites](/docs/turbosnap/setup#prerequisites) and started using TurboSnap, it should show as enabled when you visit the "Manage" page of your project. TurboSnap is enabled through the `onlyChanged` option. You can make sure it's enabled for your builds by verifying it's listed within your Chromatic script:

```json title="package.json"
{
  "scripts": {
    "chromatic": "chromatic --only-changed"
  }
}
```

If you have a Chromatic configuration file (ex. `chromatic.config.json`), check the file to make sure `onlyChanged` is set to `true`:

```json title="chromatic.config.json"
{
  "$schema": "https://www.chromatic.com/config-file.schema.json",
  "projectId": "Project:...",
  "onlyChanged": true
}
```

Alternatively, it may be in your CI workflow directly:

```yaml title=".github/workflows/chromatic.yml"
jobs:
  chromatic:
    steps:
      # ... other steps

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          onlyChanged: true # 👈 Required option to enable TurboSnap
```

## Use accurate directory configuration

If your Storybook config or preview files don't live in the default `./.storybook` location, you'll need to explicitly tell Chromatic where to find them. Whether in a single-project repo or a monorepo, ensuring your directory configuration is accurate can prevent TurboSnap from tracing unnecessary files.

- `storybookBaseDir` sets the root for dependency tracing (what source files are considered part of the Storybook project)
- `storybookConfigDir` tells Chromatic where to find your Storybook configuration (the path where your `main.js|ts` and `preview.js|ts` live)

If your directories are not properly configured, changes to unrelated files—like your root `package.json` or backend utilities—can trigger full rebuilds.

<div class="aside">

✨ Use the TurboSnap Helper to set your config!
Run `npx @chromatic-com/turbosnap-helper` from the root of your repo to have the helper provide you with the accurate directories and even automatically update your config file—no more guess work!

</div>

## Run with caution when using the `pull_request` event

TurboSnap is not compatible with the `pull_request` event trigger. This is because the workflow runs against an ephemeral merge commit, which can result in issues with being able to properly track baselines and find earlier builds.

We recommend running Chromatic on `push` events. However, if you wish to trigger Chromatic with TurboSnap on `pull_request` events, we've had success with an alternative strategy outlined below.

Create a separate workflow for Chromatic using the following strategy for the checkout step:

```yaml
- uses: actions/checkout@v4
  with:
    # 👇 Ensures Chromatic can read your full git history
    fetch-depth: 0
    # 👇 Tells the checkout which commit hash to reference
    ref: ${{ github.event.pull_request.head.ref }}
```

In your workflow, how much of your git history is downloaded when you check out a repo is determined by `fetch-depth`. By default, it's set to `1`, which fetches only the latest commit. It's best to set this to `0` (or a very high number) to ensure Chromatic has access to your full git history. This is crucial for TurboSnap, as it relies on comparing the current commit to the base branch or previous commits. Without the full history, Chromatic may not be able to determine what's changed and could miscalculate what to test.

Setting `ref` is one of the most critical parts to using the `pull_request` event, as the `ref` parameter defines what gets checked out into the workspace, which in turn impacts how Chromatic analyses your build. By setting `ref` to `${{ github.event.pull_request.head.ref }}` ensures that GitHub checks out the correct branch and that Chromatic automatically detects accurate git information.

There are edge cases where it may be beneficial to include the git environment variables (`CHROMATIC_BRANCH`, `CHROMATIC_SHA`, `CHROMATIC_SLUG`) in your Chromatic step, for example:

- If you're using a monorepo with multiple projects and find that you need tighter control across builds.
- If you use `actions/checkout` in detached mode (not recommended), or with custom scripts that mutate the git state, and you want to guarantee that Chromatic receives a stable SHA.

Otherwise, if you're using `ref` correctly, Chromatic will pick up the right commit via git and optimize with TurboSnap as expected.

If you find yourself needing more fine-tuned control over your git environment variables, set all three of the git environment variables using the following env block strategy:

```yaml
- name: Publish to Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN}}
    onlyChanged: true
  env:
    # 👇 Set to the PR branch if it's a PR; otherwise, falls back to the pushed branch name
    CHROMATIC_BRANCH: ${{ github.event.pull_request.head.ref || github.ref_name }}
    # 👇 Set to the PR head commit if it's a PR; otherwise to the ref (which typically resolves to the latest commit SHA)
    CHROMATIC_SHA: ${{ github.event.pull_request.head.sha || github.ref }}
    # 👇 Makes sure this is always set to the corect owner/repo
    CHROMATIC_SLUG: ${{ github.repository }}
```

<div class="aside">

These values match what you'd want TurboSnap and Chromatic to see, but _only if the correct code is checked out_. If you're not using `ref` to ensure the correct commit is checked out, setting your git environment variables _will not help_. Without `ref`, your env variables could describle one commit, while the git workspace contains another, causing TurboSnap to have unpredictable results.

</div>

## Avoid excessive dynamic imports

Dynamic imports, such as `import()` or `require()` with variables or conditions, within your stories, decorators, preview files, or any files they import, can disrupt the chain TurboSnap uses to identify affected stories. This can lead to missed visual changes or unexpected rebuilds. To maintain full traceability, consider minimizing dynamic imports. If dynamic behavior is necessary, incorporate the logic into story-level decorators or within the component itself, and avoid using dynamic imports in the preview file.

When it's possible, convert dynamic imports to static imports:

- ❌ `const ThemeProvider = require('../themes/default/ThemeProvider');`
- ✅ `import { ThemeProvider } from '../themes/default/ThemeProvider';`

## Mind your package control files

TurboSnap relies on lockfiles to get actual version numbers rather than semver ranges to attempt to determine an exact set of changed dependencies for more accurate tracing. If your lockfile is missing or out of sync with `package.json`, this prevents TurboSnap from being able to compute the changes and results in a full rebuild.

Package file tips:

- Make sure you have a valid lockfile checked in and that it's not out of sync with your `package.json`
- Avoid unnecessary version bumps in unrelated dependencies
- Help reduce noise in lockfile changes by using exact versions

## Optimize shared configs and theming

Your Storybook preview file (`.storybook/preview.js|ts`), where you define global decorators, parameters, and theming, is crucial for TurboSnap rebuilds. Any change to this file or its imports can affect the rendering of stories in your project, even if only a single component is impacted. This means changes to theme object definitions, global decorators, context providers, mock setups, and global parameters will trigger a full rebuild.

While you **can’t avoid full rebuilds** when changing anything imported by `.storybook/preview.js|ts` (or changing the file itself), here are some best practices to reduce the impact of the preview file changes:

- Minimize imports in your preview file. Avoid importing large libraries or full theme objects, and move large objects (like your full theme config) to separate files that don't change often.
- Use stable, versioned theme objects. If your project has a design system or uses a component library with theming, import the theme object from a package or file that rarely changes. Importing the theme from a package means changes to the theme require a package release, encouraging discipline and reducing change noise.
- Split decorators and providers by scope. If all stories don't need the same decorators, consider moving the logic into story-level decorators when feasible.

## Catch changes that don't pass through your bundler with `externals`

TurboSnap depends on the files processed by your bundler. Therefore, it's crucial that files not processed by your bundler also trigger tests. This helps prevent accidental regressions that could have been caught during testing.

The `externals` feature was designed specifically for this purpose. It directs TurboSnap to monitor specified files or globs patterns for changes, triggering a rebuild whenever they are modified.

Follow these tips to help keep your testing meaningful:

- Be selective when using wild glob patterns unless you've audited all files that match the pattern. Having too many files listed in `externals` can lead to noisy or frequent rebuilds.
- Make sure the paths you specify are relative to your repository root (which may not be your project root).
- Ensure the files are tracked in version control. If the file is ignored by `.gitignore`, it won't trigger a rebuild even if it's listed in `externals`.

## Trace what matters, untrace what doesn't, and scope when possible

TurboSnap works by tracing all files that a story depends on, starting from that story's code and walking the import graph. You may find yourself in a situation where some files or folders are frequently updated, causing widespread rebuilds when changed, and not truly impactful to story behavior

In these cases, you can tell TurboSnap to exclude paths from being traced using the `untraced` option. You can safely untrace files that:

- Don't affect the rendering or logic of your components or stories.
- Are never imported (directly or indirectly) by your stories.
- Exist solely for documentation, CI scripts, metadata, or non-runtime assets.

That said, in some scenarios untracing is dangerous as it compromises your test coverage. You should avoid adding any files to `untraced` that:

- Are imported by story files, component files, or decorators.
- Contain theme definitions, configuration, or wrapper logic.
- Affect how components are rendered—whether directly or indirectly.

If a file or folder is frequently updated and has a broad but legitimate impact on your stories, consider scoping it into a dedicated package or a separate Storybook project to reduce its impact radius. This allows TurboSnap to trace only stories affected by the package, which can be tested through Storybook and Chromatic in isolation. Here are few basic guidelines to help you decide when to split:

- Theme file changing daily? Move it to it's own package and project.
- Global wrapper being used across stories? Extract and import only where needed.
- Have a provider that affects all stories? Modularize and apply via story-level decorators if possible.
- Preview file importing volatile code? Move it out of preview and apply it in stories or wrappers to keep preview stable.

## Use the `preview-stats.json` to analyze a file's blast radius

If you're unsure why a change to a file caused a full rebuild, analyzing your `preview-stats.json` file can help you trace the changes in your dependency graph. This gives you a better visualization of the rebuild scope and helps you determine which stories are affected by your changes. The file is generated locally during Storybook builds, so you can easily inspect it to debug before sending anything through CI.

Chromatic provides a [trace utility](/docs/turbosnap/troubleshooting#why-are-no-changes-being-detected) that reads your `preview-stats.json` file to trace changed file paths to their dependent story files. This can help you determine things like:

- Whether a small change to a theme file will trigger rebuilds in all stories.
- Whether changes to another package will impact your stories.
- The actual dependency footprint of a given file.

## How to know what to expect from performance

With TurboSnap configured appropriately, you should expect around 80-90% of your Chromatic builds to skip a full rebuild and test only what's changed. For large projects, this often translates to hundreds of files skipped per build, saving both time and snapshots. If you're still seeing 50% or more of your builds trigger a full rebuild of all stories, it's a sign that your configuration may need adjustments or you have shared code that's being modified too often.

| Optimization level   | Example                                                                                                | Expected full rebuilds (%) |
| -------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------- |
| No optimization      | Default config, shared preview file, barrel files, dynamic imports                                     | **~60-100%**               |
| Partial optimization | `baseDir` set but noisy preview file                                                                   | **~30-60%**                |
| Well-optimized       | Scoped preview file, proper externals & modular stories                                                | **5-25%**                  |
| Gold standard        | Monorepo with isolated apps, per-package Storybook projects, clean preview files & optimized externals | **1-5%**                   |

## Conclusion

TurboSnap can significantly reduce build times and snapshot volumes, but small configuration choices can greatly impact its performance. It's an advanced feature that requires proper setup and configuration.

The best practices outlined above will help you achieve consistent and fast builds with minimal overhead and without sacrificing test coverage.

In summary, limit changes to only necessary updates. Modularize global code, declare externals for non-bundled assets, and audit your `preview-stats.json` file using the [trace utility](/docs/turbosnap/troubleshooting#why-are-no-changes-being-detected).
