---
layout: "../../layouts/Layout.astro"
title: Resource loading
description: Learn how to Chromatic loads resources and waits to screenshot.
sidebar: { order: 2 }
---

# Resource loading

Chromatic waits for resources like images and fonts to load before capturing a snapshot. When resources fail to load it leads to unintended UI changes.

The maximum time to capture a snapshot is 15 seconds. If the resources fail to load in the allotted time, Chromatic will retry. After several retries, the snapshot will be captured anyway and a warning message will be displayed.

## Avoid external resources

It's tough to predict network stability third-party hosting reliability. These factors mean external resources might not load predictably and affect your snapshots.

We recommend adding [resources to your Storybook](https://storybook.js.org/configurations/serving-static-files/) or using a reliable [placeholder service](https://placehold.co/). This also makes your builds run faster.

## Asynchronous rendering

Our browsers monitor network activity that occurs while your story renders. If your story renders after a delay (i.e. asynchronously), there is no way for us to tell what happened. Thus, we can't reliably wait for subsequent resources to be loaded asynchronously.

If you know how long async rendering takes, you can add a [delay](delay) to avoid snapshotting until after that happens. But it can be difficult to reliably set a time that network resources will load within so you may have to add/subtract seconds to the delay.

We are investigating ways to add first-class support to Storybook and Chromatic for asynchronous rendering. Let us know if you need this feature by chat or [email](mailto:support@chromatic.com?Subject=Asynchronous%20Rendering).

## Loading custom fonts

Browsers can decide to render HTML in multiple passes when custom fonts are used. They do this to speed up the time-to-first-meaningful-paint.

Unfortunately, this behavior can cause your story to render without the custom font. Or worse, render inconsistently. That triggers font rendering changes that you have to accept again and again. Here are ways to prevent that.

#### Solution A: Preload fonts

We recommend that you ensure fonts are always loaded prior to rendering the story. Preload fonts in Storybook by specifying them in `./storybook/preview-head.html`.

```js
// ./storybook/preview-head.html

<link
  rel="preload"
  href="path/to/font.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

<div class="aside">
If you’re loading fonts from an external CDN service (like Google Fonts or Adobe Fonts), be careful that the font files you’re preloading match the fonts called for in your CSS.
</div>

#### Solution B: Check fonts have loaded in a loader

This alternate solution uses the browsers font load API and the [`isChromatic()`](/docs/ischromatic) helper function to verify that fonts load when in the Chromatic environment.

```js
// .storybook/preview.js

import isChromatic from "chromatic/isChromatic";

// Use the document.fonts API to check if fonts have loaded
// https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts API to
const fontLoader = async () => ({
  fonts: await Promise.all([document.fonts.load("400 1em Font Name")]),
  // or
  // fonts: await document.fonts.ready,
});

/* 👇 It's configured as a global loader
 * See https://storybook.js.org/docs/react/writing-stories/loaders
 * to learn more about loaders
 */
export const loaders = isChromatic() && document.fonts ? [fontLoader] : [];
```

#### Solution C: Don't load fonts

As a last resort, you can also disable custom fonts by setting `font-display: optional` in your CSS when running in Chromatic.

### A note on variable fonts in Safari

Due to [a known WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=177039), Safari is unable to load variable fonts correctly in our component snapshots. This issue only affects [variable fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) and results in any CSS adjustments made to variable fonts, such as `font-weight: bold`, to not be properly applied. Full support for variable fonts will be included in the next version of [Chromatic Capture Cloud](https://www.chromatic.com/docs/infrastructure-upgrades#release-notes-for-infrastructure-upgrades). In the meantime, we recommend using a static font fallback.
