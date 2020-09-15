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
// MyComponent.stories.js

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
// MyComponent.stories.js

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

<details><summary>Can I control the height of the browser?</summary>

As we take a full screenshot of the component (even if it flows off the screen), it typically doesn't make any difference what height the browser has when taking screenshots. If this isn't the case for you application, please <a href="mailto:support@chromatic.com">let us know</a>.

</details>

<details><summary>Why is my content being cut off vertically?</summary>

Make sure there are no elements inadvertently cutting off content through the use of overflow or height styles.

For elements that have relative height styles based on the size of the viewport (such as `height: 100vh`), all content nested under that element will show up in a screenshot unless either `overflow: hidden` or `overflow: scroll` is used to hide what is outside of that element (and therefore outside of the viewport).

When Chromatic takes a screenshot for an element that has a viewport-relative height as well as styling to hide/scroll the overflow, a default viewport height of `900px` will be used. This default is only used when we can't detect a "natural" height for the outermost DOM element (root ancestor), for instance, in the case of scrollable divs.

To set the height, you can add a decorator for stories that wraps them in a container with a fixed height:

```js
decorators: [storyFn => <div style="height: '1000px'">{storyFn()}</div>]
```

</details>

<details><summary>How do I capture content inside scrollable divs?</summary>

Scrollable divs constrain the height of their children. Change the height of the scrollable div to ensure all content fits. It's not possible for Chromatic to infer how tall scrollable divs are intended to be.

</details>

<details><summary>What if I have a modal component that doesn't have a width or height?</summary>

If your component infers its dimensions from the layout of the surrounding DOM elements (e.g., it's a modal that uses `position:fixed`), you can set the height of that component's stories using a <a href="https://storybook.js.org/docs/react/writing-stories/decorators#component-decorators">decorator</a>.

```js
// MyComponent.stories.js

import MyComponent from './MyComponent'

export default {
  component: MyComponent,
  decorators: [
    storyFn => (
      {% raw %}<div style={{ width: '1200px', height: '800px' }}>{% endraw %}
        This is a decorator for modals and such {storyFn()}
      </div>
    ),
  ],
}

const Template = (args) => <MyComponent/>;

export const StoryWithDimensions = Template.bind({});
StoryWithDimensions.args = {};
```

</details>

<details><summary>How do I assign viewports to my entire Storybook?</summary>

We don't recommend this in most cases because each viewport is treated independently and snapshots must be approved as such. But if you really want to assign viewports for an entire Storybook use [`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters) in your [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering):

```js
// .storybook/preview.js

export const parameters={
    // Set the viewports in Chromatic globally.
  chromatic: { viewports: [320, 1200] },
}
```

</details>
