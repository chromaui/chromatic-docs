---
title: Mastering Chromatic's Trace Utility
description: Learn how to use the trace utility to to analyze your dependency graph. Identify and remove unnecessary imports, diagnose false positives from build tools, and understand the real propagation of changes for optimized bundles and confident refactoring.
sidebar: { order: 12, label: "Trace utility" }
---

# Mastering Chromatic's Trace Utility

[🎬 Debugging TurboSnap with the Chromatic Trace Utility](https://www.youtube.com/watch?v=TZKIlqLF_Xk)

When working with Chromatic's TurboSnap, you might notice that changing one component triggers snapshots for multiple unrelated stories. This happens when changes propagate through your dependency graph in unexpected ways. The chromatic **trace** utility helps you visualize these connections and optimize your project structure.

Modern applications have complex import relationships. A simple utility function might be used by dozens of components, and a change to that function could potentially affect many stories. Chromatic's trace utility maps these relationships so you can understand the impact of your changes. Let's review an example of how you can use the trace utility:

```bash
# Change a button component in your code and confirm how many files are affected
npx chromatic trace ./src/stories/Atoms/Button.jsx

```

Trimmed results:

```bash
ℹ Traced 1 changed file to 5 affected story files:

— src/stories/Atoms/Button.js [changed]
  ∟ src/stories/Atoms/Button.stories.js
    ∟ [story index]

— src/stories/Atoms/Button.js [changed]
  ∟ src/stories/Atoms/Button.stories.js
    ∟ src/stories/Atoms/Composed.stories.js
      ∟ [story index]

— src/stories/Atoms/Button.js [changed]
  ∟ src/stories/Pages/SecondPage.jsx
    ∟ src/stories/Pages/SecondPage.stories.js
      ∟ [story index]

— src/stories/Atoms/Button.js [changed]
  ∟ src/stories/Components/UserProfile.js
    ∟ src/stories/Components/UserProfile.stories.js
      ∟ [story index]

— src/stories/Atoms/Button.js [changed]
  ∟ src/stories/Components/ProfileSummary.jsx
    ∟ src/stories/Components/ProfileSummary.stories.jsx
      ∟ [story index]
```

For comparison, you can run the same command for the stories or styles files and see if there's any difference:

```bash
npx chromatic trace ./src/stories/Atoms/Button.css
```

Perhaps you'll find that the Button styles have a direct impact on a component that doesn't use the Button but reuses some of the Button's styles. Reusing styles isn't recommended because it creates hidden dependencies—changing a button's padding could unexpectedly break a card component that happened to import those same styles. The trace utility exposes these **architectural anti-patterns**, showing you exactly how styling changes ripple through your application.

## Getting started with trace

1. **First, build your Storybook with dependency tracking**

```bash
# Build with stats.json
npm run build-storybook -- --stats-json

# Create a trimmed version
npx chromatic trim-stats-file
```

The `stats.json` file contains your complete dependency graph, while the trimmed version removes noise like `node_modules` dependencies for clearer analysis.

2. **Trace a single file to see affected stories**

```bash
npx chromatic trace ./src/utils/dateFormatter.js
```

3. **Trace multiple files**

```bash
npx chromatic trace ./src/components/Button.js ./src/hooks/useButton.js

# Files with different extensions
npx chromatic trace ./src/utils/helpers.js ./src/utils/constants.ts ./src/styles/main.css
```

4. **Trace directories**

```bash
# ❌ WON'T WORK
npx chromatic trace src/components/Button/
npx chromatic trace src/components/

# ✅ WORKS
npx chromatic trace src/components/Button/*
npx chromatic trace src/components/*

```

5. **Custom stats file location**

```bash
# Use a custom stats file name
npx chromatic trace -s storybook-static/custom-stats.json src/components/Button/Button.jsx

# Stats file in different directory
npx chromatic trace -s build-artifacts/preview-stats.json src/components/Modal/Modal.jsx

# With multiple files
npx chromatic trace -s my-stats.json src/components/Button/Button.jsx src/components/Modal/Modal.jsx
```

6. **Monorepo structure**

```bash
# Storybook in packages/storybook directory
npx chromatic trace -b packages/storybook src/components/Button/Button.jsx

# Multiple packages structure
npx chromatic trace -b apps/web src/components/Button/Button.jsx
```

7. **File exclusion**

```bash
# Ignore a specific utility file
npx chromatic trace src/components/Button/Button.jsx -u src/utils/helpers.js

# Ignore a CSS file
npx chromatic trace src/components/Button/Button.jsx -u src/styles/shared.css

# Multiple specific files
npx chromatic trace src/components/Button/Button.jsx -u src/utils/helpers.js -u src/styles/theme.css
```

8. **Expanded mode**

```bash
npx chromatic trace -m expanded src/components/Button/Button.jsx
```

Results:

```json
  — src/components/Button/Button.js [changed]
    ∟ src/components/Button/Button.stories.js
      ∟ [story index]
    ∟ src/components/Header/Header.js
      ∟ src/components/Header/Header.stories.js
        ∟ [story index]
```

9. **Compact mode**

```bash
# See only affected story files
npx chromatic trace -m compact src/components/Button/Button.jsx
```

Results:

```json
  src/components/Button/Button.stories.js
  src/components/Header/Header.stories.js
  src/components/App/App.stories.js
```

## Debugging examples

### 1. Barrel files

You observe that changing one component affects many unrelated stories. Let's say this is your estructure:

```txt
 src/
   components/
      index.js  # exports * from './Button', './Modal', etc.
      Button/
      Modal/
```

You identify that changing the Button affects Modal stories. Try this:

```bash
# First run to confirm Button affects Modal
npx chromatic trace ./src/components/Button/Button.jsx

# Test if the barrel file is the culprit
npx chromatic trace ./src/components/Button/Button.jsx --untraced=./src/components/index.js
```

If the second command shows fewer affected stories, you've identified the barrel file as the culprit. The solution is to use direct imports:

```Javascript
# Replace
import { Button } from './components'
# with
import Button from './components/Button/Button'
```

### 2. Shared utility dependencies

A utility function change affects multiple components unexpectedly. Let's say you have a currency utility:

```bash
# You updated a formatting function
npx chromatic trace ./src/utils/formatCurrency.js
```

The output shows it affects:

```txt
- ProductPrice.jsx
- CartSummary.jsx
- InvoiceTable.jsx
- AdminDashboard.jsx (unexpected!)
```

It's necessary to review how the currency utility is being imported by the admin component and other components being imported into admin. If you discover a third file cascading the changes to `AdminDashboard.jsx`, you may test ignoring it:

```bash
# Trace without the third file to see if they're truly needed
npx chromatic trace ./src/utils/formatCurrency.js --untraced=./src/components/ThirdFile.jsx
```

This helps you distinguish between direct dependencies (components that actually use the utility) and transitive dependencies (components that import other components that use the utility).

## Confirm changes on git

To confirm what files have changed, run:

```bash
# Trace only files changed in the most recent commit
npx chromatic trace $(git diff --name-only HEAD~1 HEAD)

# Trace files changed between two specific branches
npx chromatic trace $(git diff --name-only develop main)

# Trace uncommitted changes
npx chromatic trace $(git diff --name-only)
```

## Summary

### 1. Unused imports in dependency graph

**Problem:** Trace utility reveals dependencies that aren't actually used.<br />
**Solution:** Remove the unnecessary imports entirely.<br />
**Why:** Projects accumulate unused imports over time, silently increasing bundle size and dependency complexity, making it difficult to understand how changes propagate.

### 2. Broad import patterns

**Problem:** Components import entire libraries or barrel files.<br />
**Solution:** Replace with specific, targeted imports.<br />
**Why:** Broad imports create hidden dependencies — changing one part of a library can unexpectedly affect many unrelated components.

### 3. Monolithic utility files

**Problem:** Large files combine multiple responsibilities.<br />
**Solution:** Split into focused, single-responsibility modules.<br />
**Why:** This allows components to import only what they actually need, reducing the impact radius of changes and making dependencies explicit.

### 4. False positive dependencies

**Problem:** Trace shows dependencies that shouldn't logically exist.<br />
**Solution:** Tweak project configuration and advance options.<br />
**Why:** Misconfigured optimization settings (like `sideEffects`) prevent accurate dependency analysis. The trace won't identify what specific option must be changed, but can help identify the issue.

### 5. Widespread but necessary dependencies

If dependencies are genuinely used across many components, document them to create institutional knowledge so your team can assess ripple effects before making modifications.
