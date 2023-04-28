---
layout: default
title: Media Features
description: Learn how to use media features in Chromatic Capture
---

# Media Features

Sometimes you want to configure media features within the browser. Chromatic offers parameters to set these features for your stories at capture time.

## forced-colors

The [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) media feature is used to indicate that a user has opted-in to use a limited color palette.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  parameters: {
    // Sets the forced-colors media feature for a specific story.
    // Available options: 'active', 'none'
    chromatic: { forcedColors: 'active' },
  },
};
```

## prefers-reduced-motion

The [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media feature is used to indicate that a user has requested minimal non-essential motion.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  parameters: {
    // Sets the prefers-reduced-motion media feature for a specific story.
    // Available options: 'reduce', 'no-preference'
    chromatic: { prefersReducedMotion: 'reduce' },
  },
};
```
