---
layout: default
title: Threshold
description: Learn how to fine tune the amount of visual change between snapshots before they get marked as changes
---

# Diff threshold

The `diffThreshold` parameter allows you to fine tune the threshold for visual change between snapshots before they're flagged by Chromatic. A value of 0 means that pixels must have the exact same color value to be treated the same (which is unlikely when things like images and fonts are rendered by the browser) and 1 means pixels can have any color values.

## Setting the threshold

Chromatic's out-of-the-box threshold was battle-tested to be ideal for most cases. But sometimes you need assurance to the sub-pixel. And other times you want to skip visual noise.

Configure the `diffThreshold` with a Storybook parameter like so:

```js
import MyComponent from "./MyComponent";

export default {
  component: MyComponent,
};

export const StoryName = () => <MyComponent />;

StoryName.story = {
  parameters: {
    chromatic: { diffThreshold: 0.2 },
  },
};
```

The default value is `.063` which balances high visual accuracy with low false positives (e.g., from artifacts like anti-aliasing). The lower the value the higher the accuracy. `0` is the most accurate.
