---
title: Resource loading
description: Learn how Chromatic loads resources and waits to screenshot.
sidebar: { order: 7 }
---

# Resource loading

Chromatic waits for resources like images and fonts to load before capturing a snapshot. When resources fail to load, this can lead to unintended UI changes.

Chromatic has a multistage timeout for capturing a snapshot: 15 seconds to render a story and an additional 15 seconds to execute interaction tests, if present. If the resources fail to load in time, Chromatic will retry. After several retries, the snapshot will be captured, and a warning message will be displayed.

## Avoid external resources

External resources depend on network stability and third-party hosting, so they may not load predictably. Whenever possible, serve resources alongside the UI you're testing to make builds faster and more stable.

| Integration | Recommendation                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storybook   | [Serve static files with Storybook](https://storybook.js.org/docs/configure/integration/images-and-assets#serving-static-files-via-storybook-configuration). If you can't include an image locally, use a reliable [placeholder service](https://placehold.co/). For more recommendations, see the [Storybook image loading guide](https://github.com/yannbf/storybook-image-loading-best-practices). |
| Playwright  | Serve resources from your local application server. If resources must come from another domain, add the domain to `assetDomains` in your [Chromatic configuration for Playwright](/docs/playwright/configure).                                                                                                                                                                                        |
| Cypress     | Serve resources from your local application server. If resources must come from another domain, add the domain to `assetDomains` in your [Chromatic configuration for Cypress](/docs/cypress/configure).                                                                                                                                                                                              |

## Asynchronous rendering

Our browsers monitor network activity while your tests are rendered. If your test renders after a delay (i.e., asynchronously), we cannot tell what happened. Thus, we can't reliably wait for subsequent resources to be loaded asynchronously.

If you know how long async rendering takes, you can add a [delay](/docs/delay) to avoid snapshotting until after that happens. However, it can be difficult to reliably set a time that network resources will load within, so you may have to add/subtract seconds to the delay.

We are investigating ways to add first-class support for asynchronous rendering to Storybook and Chromatic. Let us know if you need this feature by chat or [email](mailto:support@chromatic.com?Subject=Asynchronous%20Rendering).

## Resources could not be loaded

When Chromatic captures a story, it sometimes blocks or fails to load assets (e.g. images, fonts, stylesheets) that work fine locally. If this happens, you will see a warning on the comparison page:

<div class="aside">

Resources requested by the story could not be loaded. Snapshots may be affected. **Huh?**

</div>

Hovering over the **Huh?** link reveals a tooltip containing the specific URLs that failed to load. Use that list as your starting debugging point and try these suggestions:

1. Confirm the assets load locally when running Storybook.
2. Ensure all URLs are well‑formed and use valid public paths.
3. Confirm the assets are publicly available using `curl` (or `wget`) to fetch them directly.
4. If you use a VPN or a corporate network, try fetching them from outside that network to rule out access restrictions.
5. Ensure the URL uses `https://`. Using `http://` may result in a mixed‑content block.
6. Verify your server sends valid `Access-Control-Allow-Origin` headers.

If these suggestions don't help, please reach out to [us](mailto:support@chromatic.com) and share a link to the comparison page.

---

## Troubleshooting

<details>
<summary>Why does my story fail with an URL reload loop error?</summary>

The URL reload loop error is a safeguard that prevents **excessive network calls** to the same URL within a single story. It helps avoid performance issues during snapshot capture. If you are doing multiple calls to the same URL, try consolidating those calls.

</details>

<details>
<summary>Why does my story only time out during capture but works locally?</summary>

Too many steps in a play function (especially with programmatic delays), large re-renders of big components, or loading large data files/static assets can all cause the timeout to be exceeded. Storybook addons or unnecessary assets (that don't have any effect in your current test) may still be loaded with a story and cause performance issues and timeouts. We suggest conditionally disabling these addons or assets for Chromatic builds. For example:

```js title="./storybook/preview.js|ts"
export default {
  addons: [
    // ... your other addons
    !isChromatic && 'storybook-addon-pseudo-states',
  ].filter(Boolean),
};
```

</details>
