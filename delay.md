---
layout: default
title: Delay
description: Learn how to make Chromatic wait before capturing a snapshot
---

# Delay snapshots

Components sometimes trigger custom interactions on render. For example, JavaScript-driven [animations](animations#javascript-animations) that cannot [otherwise be disabled](test#false-positives) or third-party functionality outside of your control.

You can delay capture for a fixed time to allow your story to get into the intended state. Using delay requires Storybook 4.0 or later.

<details>
<summary>How long can I set delay?</summary>

The maximum time for snapshot capture is 15s. Your story should finish loading resources and be ready to capture in 15s.

</details>

## Delay a story

Use [story-level](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters) delay to ensure a minimum amount of time (in milliseconds) has passed before Chromatic takes a screenshot.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

const Template = (args) => <MyComponent {...args} />;

export const StoryName = Template.bind({});
StoryName.args = {
  with: 'props',
};
StoryName.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 300 },
};
```

This technique is intended for interactions and animations that end after a certain period of time (e.g., "animate in"). If your animation is continuous and you cannot disable it, you may need to use an [ignore region](ignoring-elements) to stop Chromatic from considering such parts of your component.

## Delay all stories of a component

Chromatic uses Storybook’s built in [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#component-parameters) API to make it straightforward to set delay on a group of stories:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    // Sets a delay for the component's stories
    chromatic: { delay: 300 },
  },
  title: 'MyComponent',
};

const Template = (args) => <MyComponent {...args} />;

export const StoryName = Template.bind({});
StoryName.args = {
  with: 'props',
};

export const SecondStoryName = Template.bind({});
SecondStoryName.args = {
  with: 'other-props',
};
```
