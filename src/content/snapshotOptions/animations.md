---
layout: "../../layouts/Layout.astro"
title: Animations
description: Learn how Chromatic pauses animations and how to control the behavior
sidebar: { order: 6 }
---

# Animations

Chromatic proactively pauses CSS animations/transitions, SVG animations, and videos to prevent false positives. We do this because multiple variables outside of our control make it impossible to guarantee consistent animation painting down to the millisecond.

## CSS animations

Chromatic will pause CSS animations at their end state (last frame). This is particularly helpful for animations that are used to "animate in" visible elements.

However, if you want to pause an animation at the first frame, set the `pauseAnimationAtEnd` [story parameter](https://storybook.js.org/docs/writing-stories/parameters#story-parameters) to `false`.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
};

export const StoryName = {
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for this specific story.
    chromatic: { pauseAnimationAtEnd: false },
  },
};
```

<div class="aside">

Note: Before Capture Stack [version 6](/docs/infrastructure-release-notes#version-6) (released in Feb 2024), the `pauseAnimationAtEnd` feature was disabled by default. If you depended on this functionality, make sure to update your stories by setting `pauseAnimationAtEnd` to `false`.

</div>

You can also use Storybook's [parameter](https://storybook.js.org/docs/writing-stories/parameters#global-parameters) inheritance if you want to set the behavior for your entire app:

```js
// .storybook/preview.js

const preview = {
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for all stories.
    chromatic: { pauseAnimationAtEnd: false },
  },
};

export default preview;
```

## JavaScript animations

Chromatic cannot disable JavaScript driven animations, so we advise disabling such animations manually for Chromatic builds. One way to do that is using [`isChromatic()`](/docs/ischromatic):

```js
// .storybook/preview.js

import isChromatic from "chromatic/isChromatic";

if (isChromatic()) {
  // The exact method to do this will depend on your animation techniques.
  AnimationLibrary.disable = true;
}
```

For example, to disable animations globally in framer-motion (v10.17.0 and up), you can set `MotionGlobalConfig.skipAnimations` to `true`. For better control, we recommend using this with `isChromatic()` to ensure it only activates in Chromatic builds.

```js
// .storybook/preview.js
import { MotionGlobalConfig } from "framer-motion";
import isChromatic from "chromatic/isChromatic";

MotionGlobalConfig.skipAnimations = isChromatic();
```

## GIFs and Videos

Chromatic automatically pauses videos and animated GIFs at their first frame, ensuring consistent visual tests without the need for custom workarounds. For videos, if you specify a poster, Chromatic will use that image instead.

## Animations that cannot be disabled

If you cannot disable animations (for example if disabling JS animations is difficult), you can use a [delay](/docs/delay) to allow the animation to complete before taking the snapshot.

Alternatively, [ignore an element](/docs/ignoring-elements) to omit a visible area of your component when comparing snapshots.
