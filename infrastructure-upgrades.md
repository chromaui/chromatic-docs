---
layout: default
title: Infrastructure upgrades
description: Learn how Chromatic handles browser rendering changes to be minimally disruptive
---

# Infrastructure Upgrades

Chromatic's browser infrastructure is periodically upgraded. This can lead to changes in the way your stories are rendered due to underlying rendering engine upgrades or tweaks in how stories are executed and snapshotted.

Typically, infrastructure upgrades happen transparently without you needing to do anything. But more extensive upgrades may lead to noticeable rendering differences. Here's what we do in those cases.

## Auto-accepted changes after upgrades

When you run your first build on a branch after an infrastructure upgrade, you may find a subset of your stories have been flagged as changed but auto-accepted.

This happens when stories are different enough to trip our regular diffing threshold, but remain similar enough that the changes are likely resulting from the infrastructure upgrade.
You may want to look through these auto-accepted changes to make sure real changes haven't been accepted accidentally.

Changes that that have noticeable differences are marked "pending" and require review. These stories may have changed due to your usual code changes or are a result of rendering differences from the infrastructure upgrade. In either case, you'll need to accept the changes.

## Bring acceptance over from branches

Chromatic tracks baselines independently for reach branch. When infrastructure upgrades happen, you might have to verify changes on several branches. That's annoying.

The easiest way to avoid repetitive reviews is to do a thorough review on a trunk branch (say `master`), and then re-merge (or rebase) the reviewed commit into your feature branches.

As an example:

```
M1   <- previous `master` commit rendered with old infrastructure
| \
|  F1 <- `feature` branch commit rendered with old infrastructure
|  |
M2 |  <- new `master` commit rendered + reviewed with new infrastructure
 \ |
   F2 <- `master` merged into `feature`, rendered with new infrastructure, no extra review required.
```

In order to create a new commit on `master` (if there is no new build to review), you can create an empty commit with:

```js
git commit -m "Empty commit for Chromatic" --allow-empty
```
