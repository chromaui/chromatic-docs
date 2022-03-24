---
layout: default
title: Resource loading
description: Learn how to Chromatic loads resources and waits to screenshot.
---

# Resource loading

Chromatic waits for resources like images and fonts to load before capturing a snapshot. When resources fail to load it leads to unintended UI changes.

The maximum time to capture a snapshot is 15 seconds. If the resources fail to load in the allotted time, Chromatic will retry. After several retries, the snapshot will be captured anyway and a warning message will be displayed.

## Avoid external resources

It's tough to predict network stability third-party hosting reliability. These factors mean external resources might not load predictably and affect your snapshots.

We recommend adding [resources to your Storybook](https://storybook.js.org/configurations/serving-static-files/) or using a reliable [placeholder service](https://placeholder.com/). This also makes your builds run faster.

## Asynchronous rendering

Our browsers monitor network activity that occurs while your story renders. If your story renders after a delay (i.e. asynchronously), there is no way for us to tell what happened. Thus, we can't reliably wait for subsequent resources to be loaded asynchronously.

If you know how long async rendering takes, you can add a [delay](delay) to avoid snapshotting until after that happens. But it can be difficult to reliably set a time that network resources will load within so you may have to add/subtract seconds to the delay.

We are investigating ways to add first-class support to Storybook and Chromatic for asynchronous rendering. Let us know if you need this feature by chat or [email](mailto:support@chromatic.com?Subject=Asynchronous%20Rendering).

## Browser differences

Chromatic attempts to render as consistently as possible across our supported browsers. But all browsers have different capabilities that are worth mentioning here.

Chrome gives us full access to network APIs. That means we can confirm when resources load with greater accuracy. In a nutshell, your snapshots are more consistent. In Chrome, we render your story via a Storybook JS API, and then watch network activity, waiting for quiescence (a period of no network activity) before capturing a snapshot.

Firefox and Internet Explorer have built in APIs to tell when assets are loaded. In practice, these APIs are less nuanced than Chrome which may affect your snapshots. In Firefox and IE11, we browse to a Storybook URL that renders your story, then wait for the browser ["load" event](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) in addition to our own heuristics to determine when the story finishes rendering.

The above can behave differently if your page loads resources (such as JS files) via techniques that aren't picked up by the load event (such as AJAX / background requests).

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

#### Solution B: Check fonts have loaded in a decorator

This alternate solution uses the browsers font load API and the [`isChromatic()`](ischromatic) helper function to verify that fonts load when in the Chromatic environment.

```js
// preview.js

import isChromatic from 'chromatic/isChromatic';

if (isChromatic() && document.fonts) {
  addDecorator((story) => {
    const [isLoadingFonts, setIsLoadingFonts] = useState(true);
    useEffect(() => {
      Promise.all([document.fonts.load("400 1em Font Name")]).then(() =>
        setIsLoadingFonts(false)
      );
    }, []);

    return isLoadingFonts ? null : story();
  });
}
```

#### Solution C: Don't load fonts

As a last resort, you can also disable custom fonts by setting `font-display: optional` in your CSS when running in Chromatic.
