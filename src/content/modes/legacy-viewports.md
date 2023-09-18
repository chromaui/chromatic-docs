---
layout: "../../layouts/Layout.astro"
title: Viewports (legacy)
description: chromatic.viewports feature is now being replaced by the new Modes API
sidebar: { order: 5 }
---

# Viewports (legacy) for responsive UIs

<div class="aside" style="margin-bottom: 2rem;">

<p>🚨&nbsp;&nbsp;The <code>chromatic.viewports</code> feature is now replaced by the new <a href="modes">Modes API</a>. With Modes, you can test your stories in various viewports and customize global settings. Additionally, you have the flexibility to define specific viewport heights for testing purposes.</p>

<p style="margin-bottom: 0;">To transition to the new API, please consult the <a href="viewports#migration-from-viewports-legacy-to-modes">migration guide</a>.</p>
</div>

UI components can respond to device width. Chromatic makes it easy to visual test these cases with the `viewports` parameter. This helps you define one or more viewport sizes to capture. Using viewports requires Storybook 4.0 or later.

## Viewports for a story

To set a viewport, specify one or more screen _widths_ to the `chromatic.viewports` [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters):

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
};

export const StoryName = {
  args: {
    with: "props",
  },
  parameters: {
    //👇 Defines a list of viewport widths for a single story to be captured in Chromatic.
    chromatic: { viewports: [320, 1200] },
  },
};
```

When Chromatic captures your story, it will create _two_ snapshots on your build, with the browser set at each viewports. These viewports will be treated separately, with independent baselines and distinct approvals.

## Viewports for all stories of a component

Thanks to Storybook's built in [parameter](https://storybook.js.org/docs/react/writing-stories/parameters#component-parameters) API, you can also target viewport at a group of stories or even your entire Storybook. To apply a set of viewports to all component's stories, use:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
  parameters: {
    //👇 Defines a list of viewport widths applied to all stories of a component to be captured in Chromatic.
    // Note only widths are supported, to control width and height, use the modes api
    // https://www.chromatic.com/docs/viewports
    chromatic: { viewports: [320, 1200] },
  },
};

export const StoryName = {
  args: {
    with: "props",
  },
};

export const SecondStoryName = {
  args: {
    with: "other-props",
  },
};
```

---

### Frequently asked questions

<details><summary>What viewports can I choose?</summary>

A viewport can be any whole number between 200 and 2560 pixels. The maximum number of pixels per snapshot is 25,000,000.

</details>

<details><summary>Can I control the height of the viewport?</summary>

It is not possible to control height with this legacy API. However, you can achieve it using the <a href="viewports">Modes API</a>.

</details>

<details>

<summary>How do I assign viewports globally to all components in my Storybook?</summary>

Use modes and set a [project level mode](modes#stacking-modes).

If you’re still using the legacy API, then assign viewports for the entire Storybook using [`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters) in your [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering):

```js
// .storybook/preview.js

const preview = {
  parameters: {
    //👇 Defines a list of viewport widths applied globally to all stories.
    // Note only widths are supported, to control width and height, use the modes api
    // https://www.chromatic.com/docs/viewports
    chromatic: { viewports: [320, 1200] },
  },
};

export default preview;
```

</details>
