---
layout: "../../layouts/Layout.astro"
title: Font loading
description: Learn how to preload fonts for the fast and consistent visual testing.
sidebar: { order: 2 }
---

# Loading custom fonts

Browsers can decide to render HTML in multiple passes when custom fonts are used. They do this to speed up the time-to-first-meaningful-paint.

Unfortunately, this behavior can cause your story to render without the custom font. Or worse, render inconsistently. That triggers font rendering changes that you have to accept again and again. Here are ways to prevent that.

### Solution A: Preload fonts

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

### Solution B: Point font-face declarations at static files

If you have global `@font-face` declarations that point to a CDN in your CSS, you may need to override them in order to ensure that your snapshots are always use assets that are loaded locally.

For example, you might have a font CDN referenced in your stylesheets like so.

```css
/* yourglobalstyles.css */
@font-face {
  font-display: optional;
  font-family: "YourFont";
  font-style: normal;
  font-weight: normal;
  src: url("https://cdn.yoursite.com/yourfont.woff2") format("woff2");
}
```

To serve the fonts statically, you first need to put your fonts in a static directory for Storybook.

<!-- TK João, can you fill this out -->

Next create a stylesheet `yourfontface.css` in the directory `./storybook` directory. We'll use the stylesheet to define a new local path for your font.

```css
/* ./storybook/yourfontface.css */
@font-face {
  font-display: optional;
  font-family: "YourFont";
  font-style: normal;
  font-weight: normal;
  /* 👇 Change this to point at the local font path */
  src: url("/yourfont.woff2") format("woff2");
}
```

Reference the stylesheet in your Storybook's `preview-head.html` configuration. When Storybook loads, it will load the font from the new local path.

```js
// ./storybook/preview-head.html

// 👇 Add this
<link rel="stylesheet" type="text/css" href="/yourfontface.css">
```

This technique loads a local font via Storybook's `preview-head.html` file during development and testing. Meanwhile your users still load the font from the CDN in production.

### Solution C: Check fonts have loaded in a loader

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
