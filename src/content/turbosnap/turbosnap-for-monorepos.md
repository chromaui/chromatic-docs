---
title: Optimizing TurboSnap for monorepos
description: Tips to optimize your TurboSnap configuration when working with a monorepo
sidebar: { order: 8, label: "Monorepo usage" }
slug: "turbosnap/monorepo-usage"
---

# Optimizing TurboSnap for Monorepos

For large teams using a monorepo and managing changes across dozens of packages, it's crucial not just to run tests faster but to run the right ones. TurboSnap excels in these scenarios by accelerating test runs, executing UI tests only on what has actually changed. However, poorly structured dependencies can derail your whole setup. Constantly triggering full rebuilds or skipping coverage on affected components makes it impossible to trust the results.

In this guide, we’ll break down practical strategies for managing `dependencies`, `devDependencies`, dynamic imports, and `package.json` files in a way that keeps your TurboSnap builds snappy _and_ your coverage meaningful.

<div class="aside">

✨ **Try TurboSnap Helper!**
Run our helper utility to accurately configure TurboSnap, even in monorepos—no more guess work! [Read how you can run the utility and get instant help with your config.](/docs/turbosnap/setup#update-your-configuration-using-turbosnap-helper)

</div>

## Prefer importing from built packages over `src`

Do you have components that are part of a design system or shared library? If so, import them from the built package (ex. from `node_modules/@your-org/ui`). Avoid importing directly from `src` unless you want the story to retest when the imported file changes. This is because TurboSnap uses git tracking to detect changes. Built packages are usually excluded from git (ex. `dist` is in `.gitignore`), so they won't trigger unnecessary story rebuilds unless the _consumer_ has actually rebuilt and re-imported them.

Some teams intentionally import from `src` for faster development. If this is the case, consider the tradeoffs and whether _faster development_ or _fewer unnecessary tests_ are more important to the team.

## Use project-specific lockfiles carefully in monorepos

When using tools like Nx or pnpm workspaces with project-specific lockfiles, be aware that changes to a `package.json` file (without a valid lockfile) or modifications to lockfiles can trigger full rebuilds.

With Nx, you can mitigate this by using `implicitDependencies` in your Nx project configuration. This allows you to specify which stories are affected when a package file changes, reducing the scope of rebuilds.

Although TurboSnap doesn't have native awareness of affected files, you can use `nx affected` (or an equivalent tool) to determine the need to rebuild. This approach leads to more targeted tests and minimizes unnecessary full rebuilds.

## Avoid changes to shared or root-level package files unless necessary

Changing dependencies at the root or in shared `package.json` files will often trigger TurboSnap to retest all stories. When possible, limit root-level `package.json` changes to toolchains or devDependencies. Keep shared runtime dependencies in leaf packages (a standalone UI component or package that isn’t imported by any other internal packages) so they're not a dependency for any other package.

## Use `devDependencies` to avoid unnecessary rebuilds

TurboSnap uses your bundler's (Webpack, Vite, Rsbuild, etc.) dependency graph to determine which stories are affected by changes. That means changes to runtime dependencies (`dependencies`) can ripple into the UI, while development-only tools (`devDependencies`) often don’t, unless they’re used in your Storybook config or components.

We recommend:

- Keeping runtime dependencies (like `react`, `styled-components`, `axios`) in `dependencies`.
- Using `devDependencies` for build tools (ex. `vite`, `eslint`, `typescript`, Storybook addons).
- Avoid using dev-only packages in `preview.ts` or inside components—if they’re needed at runtime, they should be in `dependencies`.

## Group and isolate high-churn utilities

If you have shared utility functions that frequently change, you may see more retests than expected. Every change to those utility files will cascade to every component that imports from the package, which can trigger TurboSnap to retest all related stories.

Instead, isolate those utilities into a clearly scoped package and avoid re-exporting them through your UI library or core package. Import the utilities in your app code and not your shared design system unless they're directly UI-related.

## Avoid dynamic imports in preview files

Dynamic imports can disrupt TurboSnap's static analysis of your dependency graph. Since paths are resolved at runtime, it's best to avoid them in story files unless absolutely necessary. That's because it prevents TurboSnap from accurately tracing changes, and using dynamic imports in your preview file can trigger unexpected rebuilds.

To ensure full traceability, always use direct imports in your preview and shared utility files.

**Why does this happen?** Dynamic imports break the chain TurboSnap relies on to identify affected stories. This can lead to either under-testing or over-testing. Direct imports ensure that the dependency graph can follow the file, identifying which components are affected. As a result, TurboSnap only retests stories that directly or indirectly depend on the modified file.

## Avoid excessive wrapper indirection

You **can’t avoid full rebuilds** when changing anything imported by `preview.ts`, but you reduce how often it happens and improve your team’s visibility by avoiding excessive wrapper indirection.

Excessive wrapper indirection may look like `withTheme()` wrapping stories with a provider theme, then being imported by `withGlobalProvider()` which wraps the stories in locale. Flattening this structure so `withTheme()` and `withLocale()` are individually defined makes it easier to see which dependencies are responsible when retesting. It also lets you bypass the preview file for some stories by importing the providers directly in specific stories, which would ensure only those files are tested when changes are made to the providers.

When possible, use direct imports and consider moving stable wrappers into `preview.ts`. If you're using frequently changing wrappers or features, try to limit them to individual story files to minimize their impact.

## Document your dependency graph

Larger teams working out of a monorepo can benefit from clearly identifying which packages depend on which. Tools like [Nx Graph](https://nx.dev/features/explore-graph) (or similar) can help your team visualize your dependency graph and avoid unintentional coupling between packages.

## Monitor `changedPackageFiles` in Chromatic builds

If you notice frequent rebuilds due to changes in package files, keep an eye on Chromatic's CLI output for `changedPackageFiles`. TurboSnap will list all package files that triggered a rebuild. Investigate whether the changes are necessary, if there are opportunities to better isolate your packages, or if you should consider using `--untraced` to ignore the packages.

### Use caution when marking `package.json` files as untraced

Monorepos often include multiple `package.json` files, and some may trigger rebuilds unnecessarily. You can use `--untraced` to ignore these files. Use the following guidelines to determine if it's safe to mark a `package.json` file as untraced:

✅ **It’s safe to mark `package.json` as untraced when:**

- The package is not consumed by Storybook or preview files
- The file does not affect the runtime or build output (ex. purely backend or tooling packages)
- You use a shared lockfile (`pnpm-lock.yaml`, `yarn.lock`), ensuring consistent resolution
- You rely on `Nx affected` or similar tooling

❌ **Do not untrace if:**

- The package includes components, themes, or utilities used in stories
- The package influences global configuration or decorators in `preview.js|ts`
- Changes to it could result in different builds or runtime behavior

## Conclusion

Smart dependency management in a monorepo can drastically improve TurboSnap performance and confidence, making it easier and faster to test changes before pushing them to production. By being intentional with how you structure `dependencies`, avoiding dynamic imports in shared config, and tracing changes clearly, you’ll strike the perfect balance between speed and reliability in your visual testing pipeline.

Ready to optimize your builds? Start by auditing your most frequently rebuilt packages!

Looking to get more details on dependency tracing with TurboSnap? Head over to our docs to read more about [TurboSnap dependency tracing](/docs/turbosnap/dependency-tracing/).
