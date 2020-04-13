---
layout: default
title: Viewports
description: Configure Chromatic to test responsive components at various viewports
---

# Viewports for responsive UIs

UI components can respond to device width. Chromatic makes it easy to visual test these cases with the `viewports` parameter. This helps you define one or more viewport sizes to capture. Using viewports requires Storybook 4.0 or later.

---

## Viewports for a story

To set a viewport, simply specify one or more screen _widths_ to the `chromatic.viewports` parameter:

```js
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
};

export const StoryName = () => <MyComponent with="props" />;

StoryName.story = {
  parameters: {
    chromatic: { viewports: [320, 1200] },
  },
};
```

When Chromatic captures your story, it will create _two_ snapshots on your build, with the browser set at each viewports. These viewports will be treated separately, with independent baselines and distinct approvals.

---

## Viewports for all stories of a component

Thanks to Storybook's built in parameter API, you can also target viewport at a group of stories or even your entire Storybook. To apply a set of viewports to all a component's stories, use:

```js
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    chromatic: { viewports: [320, 1200] },
  },
}

export const StoryName = () => <MyComponent with="props" />);
export const SecondStoryName = () => <MyComponent with="other-props" />;
```

---

## Frequently asked questions

#### What viewports can I choose?

A viewport can be any whole number between 320 and 1800 pixels.

#### Can I control the height of the browser?

As we take a full screenshot of the component (even if it flows off the screen), it typically doesn't make any difference what height the browser has when taking screenshots. If this isn't the case for you application, please <a href="mailto:support@hichroma.com">let us know</a>.

#### Why is my content being cut off vertically?

Make sure there are no elements inadvertantly cutting off content through the use of overflow or height styles.

For elements that have relative height styles based on the size of the viewport (such as `height: 100vh`), all content nested under that element will show up in a screenshot unless either `overflow: hidden` or `overflow: scroll` is used to hide what is outside of that element (and therefore outside of the viewport).

When Chromatic takes a screenshot for an element that has a viewport-relative height as well as styling to hide/scroll the overflow, a default viewport height of `900px` will be used.

#### How do I capture content inside scrollable divs?

Scrollable divs constrain the height of their children. Change the height of the scrollable div to ensure all content fits. It's not possible for Chromatic to infer how tall scrollable divs are intended to be.

#### What if I have a modal component that doesn't have a width or height?

If your component infers its dimensions from the layout of the surrounding DOM elements (e.g., it's a modal that uses `position:fixed`), you can set the height of that component's stories using a decorator.

```js
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

export const StoryWithDimensions = () => <MyComponent/>
```

#### How do I assign viewports to my entire Storybook?

We don't recommend this in most cases because each viewport is treated independently and snapshots must be approved as such. But if you really want to assign viewports for an entire Storybook use `addParameters()` in your `.storybook/config.js`:

```js
import { configure, addParameters } from '@storybook/react'; // <- substitute react with your app layer

// Be careful doing this!
addParameters({
  chromatic: { viewports: [320, 1200] },
});
```
