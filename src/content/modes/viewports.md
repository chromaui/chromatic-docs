---
layout: "../../layouts/Layout.astro"
title: Viewports
description: Configure Chromatic to test responsive components at various viewports
sidebar: { order: 2 }
---

# Viewports for responsive UIs

<div class="aside" style="margin-bottom: 2rem;">
<p>ℹ️&nbsp;&nbsp;This page documents viewports using the modes API. Learn how to <a href="/docs/modes">get started</a>.</p>

<p style="margin-bottom: 0;">If you are transitioning from the <code>chromatic.viewports</code> API to the modes API, please consult the <a href="#migration-from-viewports-legacy-to-modes">migration guide</a>.</p>
</div>

## Define viewport modes

Modes are defined in the `.storybook/modes.js` file. If your project doesn't have this file yet, go ahead and create it. To set viewport in a mode, specify the screen width and/or height using the `chromatic[<your-mode-name>].viewport` parameter.

The following are all acceptable viewport values:

- Integer (which defaults to width)
- Width & height (integer values only)
- String that is integer or string integer with `px` suffix, e.g.: `'1000px'`
- Only width (snapshot will be trimmed to the content height)
- Only height (snapshot will use the default width of 1200px, and be trimmed to the content width)

```jsx
// .storybook/modes.js

export const allModes = {
  default: {
    // integer is just width
    viewport: 1280,
  },
  specificBoth: {
    // object can specify both
    viewport: {
      height: 300,
      width: 800,
    },
  },
  specificWidth: {
    // object with width
    viewport: {
      width: 800,
    },
  },
  specificHeight: {
    // object with height
    viewport: {
      height: 800,
    },
  },
  specificString: {
    // string values
    viewport: {
      height: "600",
      width: "800px",
    },
  },
};
```

## Apply modes to set viewports

Modes can be applied at different levels: project, component, or story. When a mode includes a valid viewport parameter, Chromatic will adjust the viewport size to match the defined dimensions while capturing the snapshot.

For example, given the following set of modes in `.storybook/modes.js`.

```jsx
// .storybook/modes.js

export const allModes = {
  small: { name: "Small", styles: { width: "640px", height: "900px" } },
  medium: { name: "Medium", styles: { width: "768px", height: "900px" } },
  large: { name: "Large", styles: { width: "1024px", height: "900px" } },
};
```

We can apply the modes, like so:

```jsx
// ArticleCard.stories.js

import { allModes } from "../.storybook/modes";
import { ArticleCard } from "./ArticleCard";

export default {
  component: ArticleCard,
  title: "ArticleCard",
  parameters: {
    chromatic: {
      //🔶 Test each story for ArticleCard in two modes
      modes: {
        mobile: allModes["small"],
        desktop: allModes["large"],
      },
    },
  },
};

export const Base = {
  args: {
    //...
  },
};
export const MembersOnly = {
  args: {
    //...
  },
};
```

When Chromatic captures your story, it will create *two* snapshots on your build, with the browser set at each viewport. These modes will be treated separately, with independent baselines and distinct approvals.

## Combining modes with viewports addon

The Storybook [viewport addon](https://storybook.js.org/docs/react/essentials/viewport) enables you to adjust the dimensions of the story canvas. Developers use it to verify the responsive behavior of components when building UIs. With modes, you can easily reference the different viewport sizes that you have configured for the addon.

<video autoPlay muted playsInline loop width="600px" class="center">
  <source src="/docs/assets/addon-viewports-optimized.mp4" type="video/mp4" />
</video>

### Reference viewport by name

You start by configuring your desired set of viewports in `.storybook/preview.js`. For example:

<div class="aside">
⚠️&nbsp;&nbsp;While the viewport addon allows you to specify dimensions using any valid CSS unit (such as px, rem, calc, etc.), Chromatic modes only support whole numbers or strings with a "px" suffix.
</div>

```js
// .storybook/preview.js

const preview = {
  parameters: {
    viewport: {
      viewports: {
        xsm: { name: "XSmall", styles: { width: "320px", height: "900px" } },
        sm: { name: "Small", styles: { width: "640px", height: "900px" } },
        md: { name: "Medium", styles: { width: "768px", height: "900px" } },
        lg: { name: "Large", styles: { width: "1024px", height: "900px" } },
        xl: { name: "XL", styles: { width: "1280px", height: "900px" } },
        "2xl": { name: "2XL", styles: { width: "1536px", height: "900px" } },
      },
    },
  },
};

export default preview;
```

You can now refer to these viewports by their key in your modes definition. For example:

```jsx
// .storybook/modes.js

export const allModes = {
  xsm: {
    viewport: "xs",
  },
  md: {
    viewport: "md",
  },
  xl: {
    viewport: "xl",
  },
  // Note, you can still specify the more
  // specific options listed in the section above
  specific: {
    viewport: {
      height: 300,
      width: 800,
    },
  },
};
```

<details>
<summary>What if I set <code>defaultViewport</code> in my story?</summary>

You have the ability to configure the default viewport for stories at different levels: project, component, or story. This can be done by setting the `parameters.viewport` value. By adjusting this setting, you can control the dimensions of the story canvas when viewing it in the browser using Storybook.

However, it's important to note that when capturing snapshots, Chromatic will ignore `defaultViewport` and size the viewport based on the configuration within the mode.

In the example below, `MyStory` will use `md` viewport size when viewed in the browser. However, the two snapshots will use `lg` and `xl` viewport sizes respectively.

```jsx
// MyComponent.stories.jsx

import type { Meta, StoryObj } from '@storybook/react';
import { allModes } from '../.storybook/modes';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  title: 'MyComponent',
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const MyStory: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'md',
    },
    chromatic: {
      modes: {
        lg: allModes['lg'],
        xl: allModes['xl'],
      },
    },
  },
};
```

</details>

## Migration from viewports (legacy) to modes

The new [modes API](/docs/modes) is a successor to the [viewport feature](/docs/legacy-viewports) and takes it a step further. With Modes, you can test your stories in different viewports and any combination of global settings you define. Additionally, you can specify specific viewport heights for tests.

Currently, we will continue to support both APIs, but our plan is to deprecate the viewport feature. Behind the scenes, Chromatic will automatically convert viewports to modes when capturing a snapshot. If you are currently using the viewports feature, now is a good time to migrate to the new modes API.

### Can I use Viewports and Modes simultaneously?

No, Chromatic will throw an error if you use both. Additionally, if you include the "viewports" key, Chromatic will convert each entry in the array into a separate mode.

For example, the following will be converted into two modes: `320px` and `1200px`

```jsx
parameters: {
  chromatic: { viewports: [320, 1200] },
}
```

---

### Frequently asked questions

<details>
<summary>Are there any constraints on the viewport size that I can choose?</summary>

A width or height can be any whole number between 200 and 2560 pixels. The maximum number of pixels per snapshot is 25,000,000.

</details>

<details>
<summary>Can I control the height of the viewport?</summary>

Yes, you can control the height using the `viewport.height` property.

If no height is specified, Chromatic will capture a snapshot based on the intrinsic height of the root container.

```jsx
// MyComponent.stories.js

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
  parameters: {
    chromatic: {
      modes: {
        small: {
          viewport: {
            height: 300,
            width: 800,
          },
        },
      },
    },
  },
};
```

</details>

<details>
<summary>How do I assign viewports globally to all components in my Storybook?</summary>

We don’t recommend this in most cases because each viewport is treated independently and snapshots must be approved as such.

But if you really want to assign project level modes, you can do so by setting the `chromatic.modes` parameter in [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering):

```jsx
// .storybook/preview.js

import { allModes } from "../.storybook/modes";

const preview = {
  parameters: {
    chromatic: {
      modes: {
        light: allModes["light"],
        dark: allModes["dark"],
      },
    },
  },
};

export default preview;
```

</details>

<details>
<summary>What happens when I don’t specify a viewport?</summary>

Chromatic defaults to a viewport of width 1200px and height 900px.

</details>

</details>

<details>
<summary>How does snapshot cropping work with viewport width and height?</summary>

When you add a viewport, Chromatic will size the browser's viewport to the defined width and height. It will then take a snapshot and [crop](/docs/snapshots/#3-take-a-screenshot-and-crop-it-to-the-dimensions-of-the-ui) it to the bounding box of the component. This eliminates negative spaces around snapshots reducing the visual information you must review. 

If you haven't set a viewport height, Chromatic will captures the full height of the rendered UI. If you have set a viewport height, Chromatic will capture up to the specified height and not the rest of the UI that would be offscreen.

</details>