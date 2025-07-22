---
sidebar: { hide: true }
title: How does TurboSnap work with UI Tests and UI Review?
section: "uiTestsAndReview"
---

# How does TurboSnap work with UI Tests and UI Review?

TurboSnap is a feature that's part of [**UI Tests**](/docs), not UI Review. Understanding this distinction is crucial to avoid confusion about which files are being analyzed.

## TurboSnap and UI Tests
- **[TurboSnap](/docs/turbosnap) operates within UI Tests** to optimize which stories need to be captured
- **Comparison method**: Compares your current commit against its parent build in your Chromatic build history
- **File analysis**: Analyzes all files that changed between these two specific commits in git history
- **Purpose**: Ensures visual regression testing catches any changes that might affect your stories

## Why TurboSnap might analyze files not in your PR

A common source of confusion occurs when TurboSnap analyzes files that don't appear in your current PR. This happens because:

- **TurboSnap compares commits, not PR contents**
- The parent build TurboSnap uses for comparison might be from days or weeks ago
- All files changed between those two points in git history will be analyzed
- Your PR only shows changes between your branch and the current head of your base branch

### Example scenario

1. You create a feature branch from `main`
2. While you work, other commits are merged into `main` 
3. When you run Chromatic, TurboSnap compares against an older build
4. TurboSnap analyzes files that changed since that older build, which may include files not in your PR

## UI Review vs UI Tests with TurboSnap

| Feature | UI Review | UI Tests (with TurboSnap) |
|---------|-----------|---------------------------|
| **Purpose** | Shows visual changes that will be merged into your base branch | Detects visual regressions between builds |
| **Comparison** | Your branch vs current head of base branch (like code review) | Current commit vs parent build in Chromatic history |
| **Files analyzed** | Based on PR diff | Based on git history between two builds |
| **When to use** | Before merging to see what will change | Continuous testing to catch regressions |

## Aligning TurboSnap with your PR changes

If you want TurboSnap to compare against the current head of your base branch:
- **Rebase your branch** to make it based on the latest version of your base branch
- This helps TurboSnap find a more recent parent build for comparison
- The files analyzed will more closely match your PR contents