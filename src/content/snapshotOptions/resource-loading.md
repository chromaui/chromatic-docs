---
layout: "../../layouts/Layout.astro"
title: Resource loading
description: Learn how to Chromatic loads resources and waits to screenshot.
sidebar: { order: 3 }
---

# Resource loading

Chromatic waits for resources like images and fonts to load before capturing a snapshot. When resources fail to load it leads to unintended UI changes.

The maximum time to capture a snapshot is 15 seconds. If the resources fail to load in the allotted time, Chromatic will retry. After several retries, the snapshot will be captured anyway and a warning message will be displayed.

## Avoid external resources

It's tough to predict network stability third-party hosting reliability. These factors mean external resources might not load predictably and affect your snapshots.

We recommend adding [resources to your Storybook](https://storybook.js.org/configurations/serving-static-files/) or using a reliable [placeholder service](https://placehold.co/). This also makes your builds run faster.

## Asynchronous rendering

Our browsers monitor network activity that occurs while your story renders. If your story renders after a delay (i.e. asynchronously), there is no way for us to tell what happened. Thus, we can't reliably wait for subsequent resources to be loaded asynchronously.

If you know how long async rendering takes, you can add a [delay](/docs/delay) to avoid snapshotting until after that happens. But it can be difficult to reliably set a time that network resources will load within so you may have to add/subtract seconds to the delay.

We are investigating ways to add first-class support to Storybook and Chromatic for asynchronous rendering. Let us know if you need this feature by chat or [email](mailto:support@chromatic.com?Subject=Asynchronous%20Rendering).
