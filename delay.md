---
layout: default
title: Delay
description: Learn how to make Chromatic wait before capturing a snapshot
---

# Delay snapshots

Components sometimes trigger custom interactions on render. For example, JavaScript-driven [animations](animations#javascript-animations) that cannot [otherwise be disabled](snapshots#improve-snapshot-consistency) or third-party functionality outside of your control.

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

export const StoryName = {
  args: {
    with: 'props',
  },
  parameters: {
    // Sets the delay (in milliseconds) for a specific story.
    chromatic: { delay: 300 },
  },
};
```

This technique is intended for interactions and animations that end after a certain period of time (e.g., "animate in"). If your animation is continuous and you cannot disable it, you may need to use an [ignore region](ignoring-elements) to stop Chromatic from considering such parts of your component.

### Use an assertion to delay snapshot capture

For finer-grained control over when a snapshot is captured, use [interactions](interactions) and the [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) function to write assertions that check for DOM elements or set timeouts. Chromatic waits for interactions to pass before capturing a snapshot.

Check for DOM elements using `getBy`, `findBy`, or `queryBy` (docs [here](https://testing-library.com/docs/dom-testing-library/cheatsheet/#queries)).

```javascript
// MyComponent.stories.js|jsx

import { userEvent, waitFor, within } from '@storybook/testing-library';

import { expect } from '@storybook/jest';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);
    //   Wait for the below assertion not throwing an error anymore (default timeout is 1000ms)
    //👇 This is especially useful when you have an asynchronous action or component that you want to wait for
    await waitFor(async () => {
      //👇 This assertion will pass if a DOM element with the matching id exists
      await expect(canvas.getByTestId('button')).toBeInTheDocument();
    });
  },
};
```

If your UI requires extra time to paint after the DOM loads, consider setting a timeout by adding this step to your `play` function:

```javascript
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);
    //👇 This sets a timeout of 2s
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },
};
```

## Delay all stories of a component

Chromatic uses Storybook’s built in [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#component-parameters) API to make it straightforward to set delay on a group of stories:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
  parameters: {
    // Sets a delay for the component's stories
    chromatic: { delay: 300 },
  },
};

export const StoryName = {
  args: {
    with: 'props',
  },
};
export const SecondStoryName = {
  args: {
    with: 'other-props',
  },
};
```
