---
title: Font loading
description: Learn how to preload fonts for fast and consistent visual testing.
sidebar: { order: 4 }
---

# Loading custom fonts

Browsers can decide to render HTML in multiple passes when custom fonts are used. They do this to speed up the time-to-first-meaningful-paint.

Unfortunately, this behavior can cause your tests to render without the custom font or, worse, render inconsistently. That triggers font rendering changes that you have to accept again and again. Here are ways to prevent that.

## Best practice: Fallback to web-safe fonts

Web font loading can vary between browsers, versions, and operating systems. Web-safe fonts are commonly installed by default on browsers and operating systems. We recommend you include a web-safe font in your font stack as a fallback in case your web font isn't available or doesn't load as expected.

```css title="src/index.css"
/* Fallback to "Courier New" for monospace fonts */

code {
  font-family: "Source Code Pro", "Courier New", monospace;
}
```

</details>

<details>
<summary>Which web-safe fonts do you recommend for Chromatic?</summary>

- Sans-serif: Arial, Verdana, Trebuchet MS
- Serif: Georgia, Times New Roman
- Monospace: Courier New, Courier

</details>

## Solution A: Preload fonts

We recommend that you always ensure fonts are loaded before your tests are executed. With Storybook, you can preload fonts by specifying them in [`./storybook/preview-head.html`](https://storybook.js.org/docs/configure/story-rendering#adding-to-head).

```js title="./storybook/preview-head.html"
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

## Solution B: Point font-face declarations at static files

If your CSS has global `@font-face` declarations that point to a CDN, you may need to override them to ensure that your snapshots always use assets loaded locally.

For example, you might have a font CDN referenced in your stylesheets like so.

```css title="src/index.css"
@font-face {
  font-display: optional;
  font-family: "YourFont";
  font-style: normal;
  font-weight: normal;
  src: url("https://cdn.yoursite.com/yourfont.woff2") format("woff2");
}
```

To serve the fonts statically, you first need to put your fonts in a static directory for Storybook. We recommend the `../public` directory.

Next, create a `yourfontface.css` CSS inside your Storybook configuration directory (i.e., `.storybook`). We'll use it to reference the local path for your font in the `../public` directory.

```css title="./storybook/yourfontface.css"
@font-face {
  font-display: optional;
  font-family: "YourFont";
  font-style: normal;
  font-weight: normal;
  /* 👇 Change this to point at the local font path */
  src: url("/yourfont.woff2") format("woff2");
}
```

Reference the stylesheet in Storybook's [`preview-head.html`](https://storybook.js.org/docs/configure/story-rendering#adding-to-head) configuration file to load the font from the local path.

```js title="./storybook/preview-head.html"
<link rel="stylesheet" type="text/css" href="/yourfontface.css">
```

This technique loads a local font file during development and testing in Storybook. Meanwhile, your users are still loading the font from the CDN in production.

## Solution C: Check fonts have loaded in a loader

This alternate solution uses the browser's font load API and the [`isChromatic()`](/docs/ischromatic) helper function to verify that fonts load when in the Chromatic environment.

```js title="./storybook/preview.js|ts"
import isChromatic from "chromatic/isChromatic";

// Use the document.fonts API to check if fonts have loaded
// https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts API to
const fontLoader = async () => ({
  fonts: await Promise.all([document.fonts.load("400 1em Font Name")]),
  // or
  // fonts: await document.fonts.ready,
});

/* 👇 It's configured as a global loader
 * See https://storybook.js.org/docs/writing-stories/loaders
 * to learn more about loaders
 */
export const loaders = isChromatic() && document.fonts ? [fontLoader] : [];
```

## Solution D: Don't load fonts

As a last resort, you can also disable custom fonts by setting `font-display: optional` in your CSS when running in Chromatic.
