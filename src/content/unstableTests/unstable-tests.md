---
title: Unstable tests
description: Learn how Chromatic detects flaky tests, labels them as unstable, and automatically captures traces to help you debug them.
sidebar: { order: 1 }
slug: 'unstable-tests'
---

# Unstable tests

Flaky tests fail intermittently without any change to your code. In visual testing, flakiness shows up as snapshots that render differently on each test run: an animation caught mid-frame, a font that loads late, randomized or dynamic data, or a network request that doesn't finish in time.

Chromatic detects such tests automatically, labeling them as **Unstable**. These tests are [automatically ignored](/docs/flake-filter) so they don't require approval or block your build. Chromatic also records a [trace](#fix-unstable-tests) of the rendering session so you can diagnose the root cause without rerunning your build.

## Multiple snapshots to detect unstable tests

Chromatic verifies every visual change by capturing it multiple times to confirm whether it's a genuine change, a transient flake, or an unstable test. Under the hood, a single test may be captured two or three times, but you’re billed for only one snapshot per test.

<!-- TODO(screenshot): A test showing the Unstable label with its trace link -->

Here's a flowchart of the detection process:

![Flowchart of the detection flow: a snapshot that differs from the baseline is captured a second time. A second capture matching the baseline is a transient flake that auto-resolves; one matching the first capture is a consistent change reported for review; one matching neither triggers a third capture with tracing enabled. If the third capture still differs, the test is labelled Unstable with a trace attached.](../../images/diagrams/unstable-test-detection.svg)

## Fix unstable tests

Instability is a signal that a test needs attention. To help you diagnose it, every test that's labelled _unstable_ includes a [Playwright trace](https://playwright.dev/docs/trace-viewer) recorded during the snapshot process.

The trace includes network requests, console logs, and DOM snapshots from the test run, giving you the information you need to pinpoint why the test rendered inconsistently. Learn how to read a trace in [Debug snapshots with the Trace Viewer](/docs/troubleshooting-snapshots#debug-snapshots-with-the-trace-viewer).

Once you've identified the cause, the [Troubleshooting Snapshots](/docs/troubleshooting-snapshots#improve-snapshot-consistency) page covers common fixes, such as pausing animations, preloading fonts, and seeding randomness.
