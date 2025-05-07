---
layout: "../../layouts/Layout.astro"
title: Optimizing TurboSnap for Monorepos
description: Learn tips to optimize your TurboSnap configuration when working in a monorepo
sidebar: { order: 11, label: "TurboSnap for monorepos" }
---

# Optimizing TurboSnap for Monorepos: Smart Dependency Management Tips

For large teams working out of a monorepo, meaningful tests are vital to testing what matters, when it matters. When you're shipping changes across dozens of packages, it's not just about running _faster_ tests—it's about running the _right_ ones. If you're constantly triggering full rebuilds or skipping coverage on affected components, it becomes impossible to trust the results.

That’s where TurboSnap comes in. It’s one of the most powerful tools in Chromatic’s toolbox, helping teams test faster by only running visual tests on what’s actually changed. But to really take advantage of it—especially in a monorepo—you need to structure your dependencies carefully. One misplaced import or a poorly scoped `package.json` change can derail your whole setup.

In this guide, we’ll break down practical strategies for managing `dependencies`, `devDependencies`, dynamic imports, and `package.json` files in a way that keeps your TurboSnap builds snappy _and_ your coverage meaningful.

<div class="aside">

🎉 **Try TurboSnap Helper!**
Run our helper utility to accurately configure TurboSnap, even in monorepos—no more guess work! [Read how you can run the utility and get instant help with your config.](/docs/turbosnap/setup#update-your-configuration-using-turbosnap-helper)

</div>

## Prefer importing from built packages over `src`

Do you have components that are part of a design system or shared library? If so:

- import them from the built package (ex. from `node_modules/@your-org/ui`)
- avoid importing directly from `src` unless you _intend_ for the story to re-test when that imported file changes

Why make this consideration? TurboSnap uses git tracking to detect changes. Built packages are usually excluded from git (ex. `dist` is in `.gitignore`), so they won't trigger unnecessary story rebuilds unless the _consumer_ has actually rebuilt and re-imported them.

Some teams intentionally import from `src` for faster development. If this is the case, consider the tradeoffs and whether _faster development_ or _fewer unnecessary tests_ are more important to the team.

## Use project-specific lockfiles carefully in monorepos

If you're using tools like Nx or pnpm workspaces with project-specific lockfiles, then know that changes to a `package.json` (without a valid lockfile) or to lockfiles may trigger broad rebuilds.

If you're using Nx, you can use [`implicitDependencies`](https://nx.dev/reference/project-configuration#implicitdependencies) in your Nx project config to limit which story packages are affected when a package file changes. While TurboSnap doesn't have native awareness of `affected`, using `nx affected` (or equivalent) can help inform whether you need to rebuild, leading to more meaningful tests and fewer unnecessary full rebuilds.

## Avoid changes to shared or root-level package files unless necessary

Changing dependencies at the root or in shared `package.json` files will often trigger TurboSnap to retest all stories. When possible, limit root-level `package.json` changes to toolchains or devDeps. Keep shared runtime dependencies in leaf packages (a standalone UI component or package that isn’t imported by any other internal packages) so they're not a dependency for any other package.

## Understand the role of `dependencies` vs `devDependencies`

TurboSnap uses your bundler's dependency graph (Webpack, Vite, Rsbuild) to determine which stories are affected by changes. That means changes to runtime dependencies (`dependencies`) can ripple into the UI, while development-only tools (`devDependencies`) often don’t—unless they’re used in your Storybook config or components.

Best Practices:

- Keep runtime dependencies (like `react`, `styled-components`, `axios`) in `dependencies`.
- Use `devDependencies` for build tools (ex. `vite`, `eslint`, `typescript`, Storybook addons).
- Avoid using dev-only packages in `preview.ts` or inside components—if they’re needed at runtime, they should be in `dependencies`.

## Group and isolate high-churn utilities

If you have shared utility functions that frequently change, you may see more retests than expected. Every change to those utility files will cascade to every component that imports from the package, which can trigger TurboSnap to retest all related stories.

Instead, isolate those utilities into a clearly scoped package and avoid re-exporting them through your UI library or core package. Import the utilities in your app code and not your shared design system unless they're directly UI-related.

## Avoid dynamic imports in preview files

Dynamic imports can interfere with TurboSnap's static analysis of your dependency graph. Since the paths are resolved at runtime, it's best to avoid them in story files unless you have a clear reason to use them, as TurboSnap may struggle to properly trace changes. If you're using dynamic imports in your preview file, this can trigger unexpected rebuilds. Always use direct imports in your preview file and shared utility files to ensure full traceability.

Why does this happen? Dynamic imports break the chain TurboSnap relies on to determine which stories are affected. This can lead TurboSnap to either under-test or over-test. Using direct imports ensures the dependency graph can follow the file and see which components were affected, resulting in TurboSnap only retesting stories that directly or indirectly depend on that file.

## Avoid excessive wrapper indirection

You **can’t avoid full rebuilds** when changing anything imported by `preview.ts`, but you _can reduce the blast radius of changes_ and improve your team’s visibility by avoiding excessive wrapper indirection.

Excessive wrapper indirection may look like `withTheme()` wrapping stories with a provider theme, then being imported by `withGlobalProvider()` which wraps the stories in locale. Flattening this structure so `withTheme()` and `withLocale()` are individually defined makes it easier to see which dependencies are responsible when retesting. It also lets you bypass the preview file for some stories by importing the providers directly in specific stories, which would ensure only those files are tested when changes are made to the providers.

When possible, use direct imports and consider moving stable wrappers into `preview.ts`. If you're using frequently changing wrappers or features, try to keep them limited to **individual stories** to minimize their impact.

## Document your dependency graph

Larger teams working out of a monorepo can benefit from clearly identifying which packages depend on which. Tools like [Nx Graph](https://nx.dev/features/explore-graph) (or similar) can help your team visualize your dependency graph and avoid unintentional coupling between packages.

## Monitor `changedPackageFiles` in Chromatic builds

If you notice frequent rebuilds due to changes in package files, keep an eye on Chromatic's CLI output for `changedPackageFiles`. TurboSnap will list all package files that triggered a rebuild. Investigate whether the changes are necessary, if there are opportunities to better isolate your packages, or if you should consider using `--untraced` to ignore the packages.

### Use caution when marking package files as `--untraced`

Monorepos often include many `package.json` files, and some may trigger rebuilds unnecessarily.

✅ **It’s safe to mark `package.json` as `--untraced` when:**

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
