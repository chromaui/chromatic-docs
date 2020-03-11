---
layout: default
title: Infrastructure Upgrades
description: Learn how Chromatic handles browser rendering changes to be minimally disruptive
---

# Infrastructure Upgrades

On occasion, Chromatic's Capture Cloud is upgraded, which can lead to changes in the way your stories are rendered.
These changes can be due to browser upgrades or tweaks in the way the stories are executed and screenshotted.

Typically such changes happen transparently without you noticing or needing to do anything. However, some upgrades can be more extensive and lead to noticeable rendering differences.

## Auto-accepted changes after upgrades

When you run your first build on a branch after the Capture Cloud is upgraded, you may find a subset of your stories have been flagged as changed but auto-accepted.

This is due to those stories rendering sufficiently differently to trip our regular diffing threshold, but still similar enough that we think it is likely they are simply due to the Capture Cloud's upgrade.
It's a good idea to take a look through such auto-accepted changes to make sure no real changes have been flagged in this way.

Some changes that are sufficiently different may be left marked "pending" and require review.
These stories may have changed due to your code changes as usual or may just require sign-off from you that the rendering differences are not a regression.

## Bring acceptance over from branches

As Chromatic tracks baselines one branch at a time, you may find you have to perform the above review on several branches.
The easiest way to avoid repetive reviews is to do a thorough review on a trunk branch (say `master`), and then re-merge (or rebase)
the reviewed commit into your feature branches.

As an example:

```
M1   <- previous `master` commit rendered with old pipeline
| \
|  F1 <- `feature` branch commit rendered with old pipeline
|  |
M2 |  <- new `master` commit rendered + reviewed with new pipeline
 \ |
   F2 <- `master` merged into `feature`, rendered with new pipeline, no extra review required.
```

In order to create a new commit on `master` (if there is no new build to review), you can create an empty commit with:

```js
git commit -m "Empty commit for Chromatic" --allow-empty
```
