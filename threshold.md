---
layout: default
title: Threshold
description: Learn how to fine tune the amount of visual change between snapshots before they get marked as changes
---

# Threshold for changes

The `diffThreshold` parameter allows you to fine tune the threshold for visual change between snapshots before they're flagged by Chromatic. Sometimes you need assurance to the sub-pixel and other times you want to skip visual noise.

## Setting the threshold

Chromatic's default threshold is `.063` which balances high visual accuracy with low false positives (for example, from artifacts like anti-aliasing). `0` is the most accurate. `1` is the least accurate.

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
