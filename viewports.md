---
layout: default
title: Viewports
description: Configure Chromatic to test responsive components at various viewports
---

# Viewports for responsive UIs

UI components can respond to device width. Chromatic makes it easy to visual test these cases with the `viewports` parameter. This helps you define one or more viewport sizes to capture. Using viewports requires Storybook 4.0 or later.

## Viewports for a story

To set a viewport, specify one or more screen _widths_ to the `chromatic.viewports` [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters):

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from './MyComponent';

export default {
  component: MyComponent,
};

const Template = (args) => <MyComponent {...args} />;

export const StoryName = Template.bind({});
StoryName.args={
  with: 'props'
};
StoryName.parameters = {
  // Set the viewports in Chromatic at a story level.
  chromatic: { viewports: [320, 1200] },
};

```

When Chromatic captures your story, it will create _two_ snapshots on your build, with the browser set at each viewports. These viewports will be treated separately, with independent baselines and distinct approvals.

## Viewports for all stories of a component

Thanks to Storybook's built in [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#component-parameters) API, you can also target viewport at a group of stories or even your entire Storybook. To apply a set of viewports to all component's stories, use:

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    // Set the viewports in Chromatic at a component level.
    chromatic: { viewports: [320, 1200] },
  },
}

const Template = (args) => <MyComponent {...args} />;

export const StoryName = Template.bind({});
StoryName.args = {
  with: 'props'
};

export const SecondStoryName = (args) = Template.bind({});
SecondStoryName.args = {
  with: 'other-props'
};

```

---

### Frequently asked questions

<details><summary>What viewports can I choose?</summary>

A viewport can be any whole number between 320 and 1800 pixels.

</details>

<details><summary>Can I control the height of the viewport?</summary>

We take a full screenshot of the component even if it flows off the screen. It typically doesn't make a difference what height the browser is when taking screenshots. If this isn't the case for your application, please contact us via <a class="intercom-concierge-bot">in-app chat</a>

</details>

<details>
<summary>How do I assign viewports globally to all components in my Storybook?</summary>

We don't recommend this in most cases because each viewport is treated independently and snapshots must be approved as such. But if you really want to assign viewports for an entire Storybook use [`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters) in your [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering):

```js
// .storybook/preview.js

export const parameters = {
  // Set the viewports in Chromatic globally.
  chromatic: { viewports: [320, 1200] },
};
```

</details>
