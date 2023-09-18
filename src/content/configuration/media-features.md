---
layout: "../../layouts/Layout.astro"
title: Media Features
description: Learn how to use media features in Chromatic Capture
sidebar: { order: 7 }
---

# Media Features

CSS media features enable developers to create responsive designs and adapt layouts based on device characteristics, enhancing user experiences. With Chromatic, developers can test and refine CSS media features to ensure consistent and visually appealing designs across different devices and screen sizes.

## Test high-contrast color schemes

The [`forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) CSS media feature enables developers to create accessible websites for users with visual impairments. It detects high-contrast mode and color preferences ensuring that websites and applications are legible and accessible. To test it in Chromatic, add the `forcedColors` option to the `chromatic` parameter:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
};

export const WithForcedColors = {
  parameters: {
    // Sets the forced-colors media feature for a specific story.
    chromatic: { forcedColors: "active" },
  },
};
```

The `forcedColors` option supports the following values:

- `none` - Indicating that the user has not enabled a forced color mode or does not have a preference for high-contrast colors.
- `active` - Indicating that the user has enabled a forced color mode or prefers high-contrast colors.

## Verify reduced motion animations

The [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) CSS media feature enables developers to check whether the user enabled a preference for reduced motion animations. Primarily used to create a more inclusive user experience for people who may experience discomfort or nausea when viewing animations that involve rapid movement. To test it in Chromatic, add the `prefersReducedMotion` option to the `chromatic` parameter:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
};

export const WithReducedMotion = {
  parameters: {
    // Sets the prefers-reduced-motion media feature for a specific story.
    chromatic: { prefersReducedMotion: "reduce" },
  },
};
```

The `prefersReducedMotion` option supports the following values:

- `reduce` - Indicating that the user has defined a preference for reduced motion,
- `no-preference` - Indicating that the user has not preferred reduced motion, and animations display normally.
