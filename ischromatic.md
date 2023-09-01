---
layout: default
title: isChromatic
description: Learn how to control what executes in the Chromatic environment
---

# Check for Chromatic

`isChromatic()` gives you full control over what code is executed in the Chromatic environment. Use it in your Storybook to omit/include behavior that will be captured in Chromatic's snapshots.

## Use in .storybook/preview.js

This is useful when you want to change behavior of all stories when rendered in Chromatic.

```js
// .storybook/preview.js

import isChromatic from "chromatic/isChromatic";

// Disable animation
if (isChromatic()) {
  // The exact method to do this will depend on your animation techniques.
  AnimationLibrary.disable = true;
}

// Disable lazyloading
LazyLoad.disabled = isChromatic();
```

## Use in \*.stories.js

This is useful when you want to change behavior of one component's stories when rendered in Chromatic.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

import isChromatic from "chromatic/isChromatic";

export default {
  component: MyComponent,
  title: "MyComponent",
};

export const StoryName = {
  args: {
    label: isChromatic() ? `I'm in Chromatic` : `Not in Chromatic`,
  },
};
```

## Usage in Node Environments

In Node Environments, this is useful if you want to change the behavior of Storybook files (main.js or preview.js) based on whether Storybook is being ran via Chromatic.

```json
//package.json
{
  ...,
  scripts: {
    "chromatic": "IS_CHROMATIC=true chromatic",
    ...
  }
}
...
```

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
};

export const StoryName = {
  args: {
    label: process.env.IS_CHROMATIC ? `I'm in Chromatic` : `Not in Chromatic`,
  },
};
```
