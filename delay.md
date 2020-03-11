---
layout: default
title: Delay
description: Learn how to make Chromatic wait before capturing a snapshot
---

# Delay snapshots

Components sometimes trigger custom interactions on render. For example, JavaScript-driven animations that cannot [otherwise be disabled](test#ensure-test-consistency-to-prevent-false-positives) or third-party functionality outside of your control.

You can delay capture for a fixed time to allow your story to get into the intended state. Using delay requires Storybook 4.0 or later.

---

## Delay a story

Use story-level delay to ensure a minimum amount of time (in milliseconds) has passed before Chromatic takes a screenshot.

```js
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
};

export const StoryName = () => <MyComponent with="props" />;

StoryName.story = {
  parameters: {
    chromatic: { delay: 300 },
  },
};
```

This technique is intended for interactions and animations that end after a certain period of time (e.g., "animate in"). If your animation is continuous and you cannot disable it, you may need to use an [ignore region](ignoring-elements) to stop Chromatic from considering such parts of your component.

---

## Delay all stories of a component

Chromatic uses Storybook’s built in parameter API to make it straightforward to set delay on a group of stories:

```js
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    chromatic: { delay: 300 },
  },
};

export const StoryName = () => <MyComponent with="props" />;
export const SecondStoryName = () => <MyComponent with="other-props" />;
```

---

### Troubleshooting

#### How long can I set delay?

The maximum time for snapshot capture is 15s. Your story should finish loading resources and be ready to capture in 15s.
