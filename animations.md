---
layout: default
title: Animations
description: Learn how Chromatic pauses animations and how to control the behaviour
---

# Animations

As it is difficult to precisely set the time that a snapshot is taken, Chromatic makes
an effort to pause all video and disable animation. Chromatic does this for CSS animations and transitions, as well as SVG animations and video.

## CSS animations

Chromatic will pause CSS animations and reset them to their beginning state.

Some animations are used to "animate in" visible elements. To specify that Chromatic should pause the animation at the end, use the `pauseAnimationAtEnd` story parameter:

```js
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
};

export const StoryName = () => <MyComponent />;

StoryName.story = {
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
  },
};
```

You can use Storybook's parameter inheritance if you want to set the behaviour for your entire app:

```js
// In .storybook/config.js
import { addParameters } from '@storybook/react';

// This will apply the behaviour to all stories in your Storybook
addParameters({ chromatic: { pauseAnimationAtEnd: true } });
```

## JS animations

Chromatic cannot disable JavaScript driven animations, so we advise disabling such animations manually for Chromatic builds. One way to do that is using `isChromatic`:

```js
// In .storybook/config.js
import isChromatic from 'storybook-chromatic/isChromatic';

if (isChromatic()) {
  // The exact method to do this will depend on your animation techniques.
  AnimationLibrary.disable = true;
}
```

## Animations that cannot be disabled

If you cannot disable animations (for example if disabling JS animations is difficult), you can use a [delay](/delay) to allow the animation to complete before taking the snapshot.

Alternatively, use an [ignore region](/ignoring-elements) to stop Chromatic from considering such parts of your component.
