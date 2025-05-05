---
layout: "../../layouts/Layout.astro"
title: TurboSnap Configuration Best Practices
description: Learn TurboSnap configuration best practices to optimize your builds for faster visual testing
sidebar: { order: 10, label: "Configuring TurboSnap" }
---

# TurboSnap Configuration Best Practices: Tips for Faster Visual Testing

Most everyone agrees it's important to test your UI, but it's even more important to make sure you're testing the _right parts_ of your UI at the _right time_. Meet TurboSnap: one of Chromatic's most powerful tools for accelerating visual testing in CI. By using your git history and dependency graph to intelligently detect what's changed in your Storybook project, it helps Chromatic better test the components impacted by your changes—saving you time and CI resources while keeping your tests valuable.

Whether you're working in a single-project repository or have a more complex setup (such as a monorepo), following best practices ensures TurboSnap works efficiently to help surface _meaningful_ visual regressions. Here are some essential tips to keep your TurboSnap running fast, reliably, and accurately.

## Confirm TurboSnap is enabled

Once you've met the [prerequisites](/docs/turbosnap/setup#prerequisites) and started using TurboSnap, it should show as enabled when you visit the "Manage" page of your project. TurboSnap is enabled through the `onlyChanged` option. You can make sure it's enabled for your builds by verifying it's listed within your Chromatic script:

```json
// package.json
{
	"scripts": {
		"chromatic": "chromatic --only-changed
	}
}
```

If you have a Chromatic configuration file (ex. `chromatic.config.json`), check the file to make sure `onlyChanged` is set to `true`:

```json
// chromatic.config.json
{
  "$schema": "https://www.chromatic.com/config-file.schema.json",
  "projectId": "Project:...",
  "onlyChanged": true
}
```

Alternatively, it may be in your CI workflow directly:

```yaml
# .github/workflows/chromatic.yml

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

## Avoid excessive dynamic imports

Dynamic imports (`import()` or `require()` with variables or conditions) inside your stories, decorators, preview file, or any of the files they import can break the chain TurboSnap relies on to determine which stories are affected, resulting in missed visual changes or unexpected rebuilds. To help ensure full traceability, consider reducing dynamic imports. If the behavior is _essential_, move the logic into story-level decorators or within the component and avoid dynamic behavior in the preview file.

When it's possible, convert dynamic imports to static imports:
❌ `const ThemeProvider = require('../themes/default/ThemeProvider');`
✅ `import { ThemeProvider } from '../themes/default/ThemeProvider';`

## Mind your package control files

TurboSnap relies on lockfiles to get actual version numbers rather than semver ranges to attempt to determine an exact set of changed dependencies for more accurate tracing. If your lockfile is missing or out of sync with `package.json`, this prevents TurboSnap from being able to compute the changes and results in a full rebuild.

📦 Package file tips:

- Make sure you have a valid lockfile checked in and that it's not out of sync with your `package.json`.
- Avoid unnecessary version bumps in unrelated dependencies.
- Help reduce noise in lockfile changes by using exact versions.
- If you're using multiple `package.json` files, only the one associated with the Storybook project should typically affect rebuilds. Excessive rebuilds from `package.json` files outside your project can be reduced by ensuring you scope TurboSnap with the correct `storybookBaseDir`.

## Optimize shared configs and theming

Your Storybook preview file—where you define global decorators, parameters, and theming—is one of the most sensitive files for TurboSnap rebuilds. Why? _Any change_ to the file _or anything it imports_ can impact any story in the project, even if only one component was affected. This means changes to theme object definitions, global decorators, context providers, mock setups, and global parameters will result in an _expected_ full rebuild.

While you **can’t avoid full rebuilds** when changing anything imported by `preview.js|ts` (or changing the file itself), here are some best practices to reduce the impact of `preview.js|ts` changes:

- Minimize imports in your preview file. Avoid importing large libraries or full theme objects, and move large objects (like your full theme config) to separate files that don't change often.
- Use stable, versioned theme objects. If your project has a design system or uses a component library with theming, import the theme object from a package or file that rarely changes. Importing the theme from a package means changes to the theme require a package release, encouraging discipline and reducing change noise.
- Split decorators and providers by scope. If all stories don't need the same decorators, consider moving the logic into story-level decorators when feasible.

## Catch changes that don't pass through your builder with `externals`

TurboSnap relies on what your bundler processes, not just what's in the codebase. Making sure impactful files processed externally to your bundler trigger tests is a critical, but often overlooked part of ensuring TurboSnap works correctly and efficiently. It also keeps you from accidentally introducing regressions that could have been caught during visual testing. That's where the `externals` option comes in: it tells TurboSnap to manually watch the specified files or globs for changes, and triggers a rebuild when they change.

Follow these tips to help keep your testing meaningful:

- Be selective when using wild glob patterns unless you've audited all files that match the pattern. Having too many files listed in `externals` can lead to noisy or frequent rebuilds.
- Make sure the paths you specify are relative to your repository root (which may not be your project root).
- Ensure the files are tracked in version control. If the file is ignored by `.gitignore`, it won't trigger a rebuild even if it's listed in `externals`.

## Trace what matters, untrace what doesn't, and scope when possible

TurboSnap works by tracing all files that a story depends on, starting from that story's code and walking the import graph. You may find yourself in a situation where some files or folders are:

- frequently updated
- causing widespread rebuilds when changed
- not truly impactful to story behavior

In these cases, you can tell TurboSnap to exclude paths from being traced using the `untraced` option. You can safely untrace files that:

- Don't affect the rendering or logic of your components or stories.
- Are never imported (directly or indirectly) by your stories.
- Exist solely for documentation, CI scripts, metadata, or non-runtime assets.

❌ There are times where it's dangerous to untrace as it compromises your test coverage. You should avoid adding any files to `untraced` that:

- Are imported by story files, component files, or decorators.
- Contain theme definitions, configuration, or wrapper logic.
- Affect how components are rendered—whether directly or indirectly.

If a file or folder is frequently updated and has a broad but legitimate impact on your stories, consider scoping it into a dedicated package or Storybook project to reduce blast radius and increase control. This allows TurboSnap to trace only stories affected by the package, which can be tested through Storybook and Chromatic in isolation. Consider these basic guidelines for when to split:

- Theme file changing daily? Move it to it's own package and project.
- Global wrapper being used across stories? Extract and import only where needed.
- Have a provider that affects all stories? Modularize and apply via story-level decorators if possible.
- Preview file importing volatile code? Move it out of preview and apply it in stories or wrappers to keep preview stable.

## Use the `preview-stats.json` to analyze a file's blast radius

If you're unsure why a change to a file caused a full rebuild, analyzing your `preview-stats.json` file can help you trace the changes in your dependency graph. This gives you a better visualization of the rebuild scope and helps you determine which stories are affected by your changes. The file is generated locally during Storybook builds, so you can easily inspect it to debug before sending anything through CI.

Chromatic provides a [`trace` utility](/docs/turbosnap/troubleshooting#why-are-no-changes-being-detected) that reads your `preview-stats.json` file to trace changed file paths to their dependent story files. This can help you determine:

- Whether a small change to a theme file will trigger rebuilds in all stories.
- Whether changes to another package will impact your stories.
- The actual dependency footprint or blast radius of a given file.

## How to know what to expect from performance

With proper TurboSnap configuration, you should expect around 80-90% of your Chromatic builds to skip a full rebuild and test only what's changed. For large projects, this often translates to hundreds of files skipped per build, saving both time and snapshot review overhead. If you're still seeing 50% or more of your builds trigger a full rebuild of all stories, it's a sign that your configuration may need tuning or you have shared code that's being modified too often.

| Optimization level   | Example                                                                                        | Expected full rebuilds (%) |
| -------------------- | ---------------------------------------------------------------------------------------------- | -------------------------- |
| No optimization      | default config, shared preview file, barrel files, dynamic imports                             | **~60-100%**               |
| Partial optimization | baseDir set but noisy preview file                                                             | **~30-60%**                |
| Well-optimized       | scoped preview file, proper externals, modular stories                                         | **5-25%**                  |
| Gold standard        | monorepo with isolated apps, per-package SB projects, clean preview files, optimized externals | **1-5%**                   |

TurboSnap can help reduce build time and snapshot volume substantially, but those gains _don't come automatically_. It's not just a feature you toggle on—it's an advanced feature that depends on your setup and proper configuration.

## Conclusion

TurboSnap is designed to help your builds be fast out of the box, but small configuration decisions can make a big difference in performance. Ultimately, performance is your responsibility, but we're here to give you the tools to help configure TurboSnap efficiently. Your actual results with TurboSnap depend on how your team:

- Structures shared configuration
- Handles themes and decorators
- Writes and organizes stories
- Audits and maintains the dependency graph

By following best practices like:

- Scoping changes to only what needs to change
- Modularizing global code
- Declaring externals for non-bundled assets
- Auditing your `preview-stats.json` file with the `trace` utility
  ...you can achieve consistent, super-fast builds with minimal overhead and without compromising your test coverage.

## Next: Optimizing TurboSnap for Monorepos

If you're working out of a monorepo or with a large, complex project, you can easily find yourself running the wrong tests at the wrong time. Learn practical strategies to help manage your dependencies and keep your tests meaningful!

<a class="btn primary round" href="/docs/turbosnap-for-monorepos">Read next chapter</a>
