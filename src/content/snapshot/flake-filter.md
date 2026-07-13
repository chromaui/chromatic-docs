---
title: Flake filter
description: Flake filter detects unstable tests and automatically ignores them so they don't block your build.
sidebar: { order: 14 }
slug: 'flake-filter'
---

# Flake filter for unstable tests

Flake filter automatically detects and ignores [unstable tests](/docs/unstable-tests#what-is-an-unstable-test) so they don't block your build. Each unstable test includes a [trace](/docs/trace-viewer) to help you identify what changed during capture.

## How flake filter works

Chromatic renders each test multiple times to determine whether a visual change is genuine or the test is unstable.

When Chromatic detects an unstable test, it ignores the test automatically so the build isn't blocked on a false positive. On the build page, actual changes appear at the top, while ignored tests are grouped separately in a collapsed section below.

![Chromatic test results page showing a list of tests with changes, and collapsed group at the bottom saying 4 unstable tests are auto-ignored.](../../images/unstable-tests-ignored-row.png)

Automatically ignored tests won't affect your [baselines](/docs/branching-and-baselines) unless you accept them, and they won't surface in the [UI Review](/docs/review) workflow. You can still deny an unstable test to force the build to fail.

### Auto-ignores don't persist across builds

Flake filter runs on each build to reevaluate whether a test is still unstable. When a test becomes stable, it automatically returns to the test suite.

### Disable flake filter

You can turn off automatic ignoring for unstable tests from your project settings.

![Flake filter enabled in project settings, with a button to disable it.](../../images/disable-flake-filter.png)

## Frequently asked questions

<details>
<summary>Do auto-ignored tests count toward my snapshot usage?</summary>

Yes. Chromatic has to capture a snapshot for a test to determine whether the test is stable, so ignored tests still count toward your snapshot usage. However, even though Chromatic may render a test multiple times to detect instability, you are only billed for one snapshot.

</details>
