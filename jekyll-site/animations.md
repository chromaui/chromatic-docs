---
layout: default
title: Animations
description: Learn how Chromatic pauses animations and how to control the behavior
---

# Animations

Chromatic proactively pauses CSS animations/transitions, SVG animations, and videos to prevent false positives. We do this because multiple variables outside of our control make it impossible to guarantee consistent animation painting down to the millisecond.

## CSS animations

Chromatic will pause CSS animations and reset them to their beginning state.

Some animations are used to "animate in" visible elements. To specify that Chromatic should pause the animation at the end, use the `pauseAnimationAtEnd` [story parameter](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters):

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  parameters: {
    // Notifies Chromatic to pause the animations when they finish for the specific story.
    chromatic: { pauseAnimationAtEnd: true },
  },
};
```

You can use Storybook's [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters) inheritance if you want to set the behavior for your entire app:

```js
// .storybook/preview.js

const preview = {
  parameters: {
    // Notifies Chromatic to pause the animations when they finish for all stories.
    chromatic: { pauseAnimationAtEnd: true },
  },
};

export default preview;
```

## JavaScript animations

Chromatic cannot disable JavaScript driven animations, so we advise disabling such animations manually for Chromatic builds. One way to do that is using [`isChromatic()`](isChromatic):

```js
// .storybook/preview.js

import isChromatic from 'chromatic/isChromatic';

if (isChromatic()) {
  // The exact method to do this will depend on your animation techniques.
  AnimationLibrary.disable = true;
}
```

## Animations that cannot be disabled

If you cannot disable animations (for example if disabling JS animations is difficult), you can use a [delay](delay) to allow the animation to complete before taking the snapshot.

Alternatively, [ignore an element](ignoring-elements) to omit a visible area of your component when comparing snapshots.
