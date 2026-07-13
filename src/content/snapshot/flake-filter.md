---
title: Flake filter
description: Flake filter detects unstable tests and automatically ignores them so they don't block your build.
sidebar: { order: 4 }
slug: 'flake-filter'
---

# Flake filter for unstable tests

Flake filter automatically detects and ignores unstable tests so they don't block your build. Chromatic also records a [trace](#fix-unstable-tests) of the rendering session so you can diagnose the root cause without rerunning the build.

## What is an unstable test?

An unstable test renders differently across repeated runs even when your code hasn't changed. Common causes include an animation caught mid-frame, a font that loads late, randomized or dynamic data, or a network request that doesn't finish in time.

## How flake filter works

Chromatic renders each test multiple times to determine whether a visual change is genuine or the test is unstable.

When Chromatic detects an unstable test, it ignores the test automatically so the build can pass without approval.When Chromatic detects an unstable test, it ignores the test automatically so the build can pass without approval. On the build page, actual changes appear at the top, while ignored tests are grouped separately in a collapsed section below.

![Chromatic test results page showing a list of tests with changes, and collapsed group at the bottom saying 4 unstable tests are auto-ignored.](../../images/unstable-tests-ignored-row.png)

Tests labeled as unstable and automatically ignored won't affect your [baselines](/docs/branching-and-baselines) unless you accept or deny them, and they won't surface changes in the [UI Review](/docs/review) workflow.

### Auto-ignores don't persist across builds

Flake filter runs on each build to reevaluate whether a test is still unstable. When a test becomes stable, it automatically returns to the test suite.

### Disable flake filter

You can turn off automatic ignoring for unstable tests from your project settings.

![Flake filter enabled in project settings, with a button to disable it.](../../images/disable-flake-filter.png)

## Fix unstable tests

Instability is a signal that a test needs attention. To help you diagnose it, every unstable test includes a [Playwright trace](https://playwright.dev/docs/trace-viewer) recorded during the snapshot process.

The trace includes network requests, console logs, and DOM snapshots from the test run, giving you the information you need to pinpoint what made the test unstable. Learn how to [read a trace](/docs/trace-viewer).

Once you've identified the cause, learn how to [debug unstable tests](/docs/troubleshooting-snapshots) with fixes such as pausing animations, preloading fonts, and seeding randomness.

![Chromatic Tests dashboard showing browser-specific trace links for unstable tests in the Traces column.](../../images/unstable-test-traces.png)

## Frequently asked questions

<details>
<summary>Do auto-ignored tests count toward my snapshot usage?</summary>

Yes. Chromatic has to capture a snapshot for a test to determine whether the test is stable, so ignored tests still count toward your snapshot usage. However, even when Chromatic [captures multiple snapshots](#how-flake-filter-works) for a test to detect instability, you are only billed for one snapshot per test.

</details>
