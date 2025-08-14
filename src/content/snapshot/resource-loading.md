---
title: Resource loading
description: Learn how Chromatic loads resources and waits to screenshot.
sidebar: { order: 6 }
---

# Resource loading

Chromatic waits for resources like images and fonts to load before capturing a snapshot. When resources fail to load, this can lead to unintended UI changes.

Chromatic has a multistage timeout for capturing a snapshot: 15 seconds to render a story and an additional 15 seconds to execute interaction tests, if present. If the resources fail to load in time, Chromatic will retry. After several retries, the snapshot will be captured, and a warning message will be displayed.

## Avoid external resources

It's tough to predict network stability and third-party hosting reliability. These factors mean external resources might not load predictably and affect your snapshots.

If you're running tests with Storybook, we recommend adding [resources to your Storybook](https://storybook.js.org/docs/configure/integration/images-and-assets#serving-static-files-via-storybook-configuration) or using a reliable [placeholder service](https://placehold.co/). With Playwright or Cypress, resources should be provided by the local application server. However, if you need to load resources from external domains, you can enable the `assetDomains` option in the project configuration. Including these options will make your builds run faster.

<div class="callout">

For more best practices on loading images in Storybook, check out [**this guide**](https://github.com/yannbf/storybook-image-loading-best-practices).

</div>

## Asynchronous rendering

Our browsers monitor network activity while your tests are rendered. If your test renders after a delay (i.e., asynchronously), we cannot tell what happened. Thus, we can't reliably wait for subsequent resources to be loaded asynchronously.

If you know how long async rendering takes, you can add a [delay](/docs/delay) to avoid snapshotting until after that happens. However, it can be difficult to reliably set a time that network resources will load within, so you may have to add/subtract seconds to the delay.

We are investigating ways to add first-class support for asynchronous rendering to Storybook and Chromatic. Let us know if you need this feature by chat or [email](mailto:support@chromatic.com?Subject=Asynchronous%20Rendering).
