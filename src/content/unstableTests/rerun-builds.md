---
title: Rerun builds
description: Double-check whether a visual change is real or caused by inconsistent rendering by retaking snapshots with identical settings.
sidebar: { order: 4 }
slug: 'rerun-builds'
---

# Rerun builds to identify inconsistencies

Double-check whether a visual change is real or caused by inconsistencies in your app code by retaking snapshots. Click the "rerun" button to kick off a new build that uses identical settings and configuration as your original build. Only snapshots for denied, unreviewed, or errored changes will be captured. Any changes you accepted in the original build will not be snapshotted again in a rerun build.

![Rerun button](../../images/build-detail-rerun-button.png)

Debug inconsistent snapshots by looking at the set of changes between the original build and the rerun build. You might encounter these common scenarios:

- Identical changes between builds: This means the snapshots are accurately showing bonafide UI changes that need your verification. Continue the [UI Tests workflow](/docs/quickstart#4-review-changes) as usual.

- Different changes between builds: This means inconsistent snapshots are introducing false positives to your visual tests. Use the [trace viewer](/docs/trace-viewer) to identify the root cause and check out our recommendations for [improving snapshot consistency](/docs/troubleshooting-snapshots#improve-snapshot-consistency).

When there are potential rendering inconsistencies in a rerun build, Chromatic will call them out in a message.
![Inconsistent snapshot detection](../../images/build-detail-inconsistent-snapshot-detection.png)
