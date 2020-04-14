---
layout: default
title: isChromatic
description: Learn how to control what executes in the Chromatic environment
---

# Check for Chromatic

`isChromatic()` gives you full control over what code is executed in the Chromatic environment. Use it in your Storybook to omit/include behavior that will be captured in Chromatic's snapshots.

## Use in .storybook/config.js

This is useful when you want to change behavior of all stories when rendered in Chromatic.

```js
// In .storybook/config.js
import isChromatic from "storybook-chromatic/isChromatic";

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
// In component.stories.js
import MyComponent from "./MyComponent";
import isChromatic from "storybook-chromatic/isChromatic";

export default {
  component: MyComponent,
};

export const StoryName = () => (
  <MyComponent>
    {isChromatic() && <div>I'm in Chromatic</div>}
    {!isChromatic() && <div>Not in Chromatic</div>}
  </MyComponent>
);
```
