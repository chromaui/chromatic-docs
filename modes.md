---
layout: default
title: Story Modes
description: Configure Chromatic to test themes, viewports, locales and more simultaneously
---

# Modes for testing themes, viewports, locales & more

Global-level configurations (globals) such as viewport size, theme (light/dark), and locale impact how a component renders. Chromatic simplifies the process of visually testing your stories with different global configs.

You can save combinations of globals as a unique "mode" and apply one or multiple modes to a story using the `chromatic.modes` parameter. When Chromatic tests your story, it will capture a snapshot for each applied mode. These modes are treated separately, with independent baselines and distinct approvals.

Using modes requires Storybook 6.0 or later.

<details><summary>Modes are powered by Storybook globals & decorators</summary>

Consider this card component. It supports both light and dark variants, and its layout adjusts based on the viewport size. To switch between themes and viewport sizes, we click on the Storybook toolbar.

<video autoPlay muted playsInline loop width="600px">
  <source src="img/addons.mp4" type="video/mp4" />
</video>

This functionality is made possible by two features:

- **Globals** is a built-in mechanism that enables users to configure and track global settings. In the context of modes, globals are used to define different configurations that a mode can have. For example, theme: light & dark or locale: en, fr, es & kr .
- **Decorators** wrap stories to provide extra rendering functionality. They can read the global value and provide the necessary context to render a specific mode. For example, if your global state indicates "dark mode," a decorator can wrap your component with the appropriate theme provider and load the dark theme CSS.

**Addons** combine globals and decorators. Under the hood, many addons like [@storybookjs/addon-themes](https://github.com/storybookjs/storybook/tree/next/code/addons/themes?ref=chromaticblog.ghost.io) and [storybook-i18n](https://github.com/stevensacks/storybook-i18n/tree/main?ref=chromaticblog.ghost.io) use globals & decorators to provide the rendering context for stories.

![Modes configure global settings, which are then utilized by addons to control how a story is rendered.](img/modes-flow.png)

</details>

## Table of contents:

- [Using modes](#using-modes)
- [Stacking modes](#stacking-modes)
- [Baselines for modes](#baselines-for-modes)

## Using modes

A mode is a combination of different settings that determine the appearance of a UI. It can be as straightforward as displaying the component in light or dark mode, or it can involve more complex combinations like viewport, theme, and locale settings.

Example modes:

- `dark desktop spanish`
- `light tablet korean`
- `mobile english`
- `high-contrast`

### 1. Configure addons

Addons offer the ability to control various global settings within Storybook. For instance, you can use viewports, styling, and background addons to manage the theme, dimensions, and background color of a story.

Make sure to configure the addons in `.storybook/preview.ts` for each global setting you want to test.

```jsx
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        small: { name: 'Small', styles: { width: '640px', height: '800px' } },
        large: { name: 'Large', styles: { width: '1024px', height: '1000px' } },
      },
    },
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#1E293B' },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
```

### 2. Define modes

To define all your modes, create a file called `.storybook/modes.js|ts`. Each mode should specify the values for the global settings it wants to control. This can be limited to a single global or can group multiple globals together.

```jsx
// .storybook/modes.js|ts
export const allModes = {
  mobile: {
    viewport: 'small',
  },
  desktop: {
    viewport: 'large',
  },
  dark: {
    backgrounds: 'dark',
    theme: 'dark',
  },
  light: {
    backgrounds: 'light',
    theme: 'light',
  },
  'dark desktop': {
    backgrounds: 'dark',
    theme: 'dark',
    viewport: 'large',
  },
  'light mobile': {
    backgrounds: 'light',
    theme: 'light',
    viewport: 'small',
  },
};
```

### 3. Apply modes using the chromatic parameter

To apply the modes to a component, import them into a CSF (`*.stories.js|ts`) file and use the `chromatic` parameter.

```jsx
// ArticleCard.stories.js
import { allModes } from '../.storybook/modes';
import { ArticleCard } from './ArticleCard';

export default {
  component: ArticleCard,
  title: 'ArticleCard',
  parameters: {
    chromatic: {
      //🔶 Test each story for ArticleCard in two modes
      modes: {
        'light mobile': allModes['light mobile'],
        'dark desktop': allModes['dark desktop'],
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

### 4. Auto-generate a test for every mode

When you run a Chromatic build, it will create a test for each mode. If you have two stories with two modes, you’ll get four tests. Each test will be badged with the mode’s name and have separate baselines and approvals.

When reviewing a build, the mode-specific tests will be grouped together.

![The chromatic build screen displays two snapshots for both the Base and MemberOnly stories. There is one snapshot per mode.](img/modes-buildscreen.png)

---

## Stacking modes

You have the flexibility to apply modes at the project, component level, or the story level. Instead of overriding modes defined at a higher level, Chromatic combines them all into a stack and tests the story against each mode in the stack.

### Project level modes

For instance, at the project level, we apply modes by setting the `chromatic` parameter in `.storybook/preview.ts`:

```jsx
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { allModes } from '../.storybook/modes';

const preview: Preview = {
  parameters: {
    chromatic: {
      modes: {
        light: allModes['light'],
        dark: allModes['dark'],
      },
    },
  },
};

export default preview;
```

### Component and Story level modes

Then in the CSF file we set modes at the component level and/or the story level:

```jsx
// ArticleCard.stories.js
import { allModes } from '../.storybook/modes';
import { ArticleCard } from './ArticleCard';

export default {
  component: ArticleCard,
  title: 'ArticleCard',
  parameters: {
    chromatic: {
      //🔶 Test each story for ArticleCard in two modes
      modes: {
        desktop: allModes['desktop'],
      },
    },
  },
};

export const Base = {
  args: {
    //...
  },
  parameters: {
    chromatic: {
      //🔶 Test only the Base story with this mode
      modes: {
        mobile: allModes['mobile'],
      },
    },
  },
};
export const MembersOnly = {
  args: {
    //...
  },
};
```

In the example above (`.storybook/preview.ts` combined with `ArticleCard.stories.js`), Chromatic will generate the following tests:

1. For `ArticleCard.Base`, there will be 4 snapshots: light, dark, desktop, and mobile.
2. For `ArticleCard.MembersOnly`, there will be 3 snapshots: light, dark, and desktop.

### Disable a higher-level mode

In some situations, you might want to disable a mode defined at higher level for a specific story. You can do this by setting `disable: true` on the mode.

In the example below, `desktop` mode is applied at the component level. But we’re disabling it for the Base story.

```jsx
// ArticleCard.stories.js
import { allModes } from '../.storybook/modes';
import { ArticleCard } from './ArticleCard';

export default {
  component: ArticleCard,
  title: 'ArticleCard',
  parameters: {
    chromatic: {
      modes: {
        desktop: allModes['desktop'],
      },
    },
  },
};

export const Base = {
  args: {
    //...
  },
  parameters: {
    chromatic: {
      //🔶 Disable desktop mode for the Base Story
      modes: {
        desktop: { disable: true },
      },
    },
  },
};
export const MembersOnly = {
  args: {
    //...
  },
};
```

---

## Baselines for modes

Chromatic treats each mode as an individual entity, with its own unique baselines and specific approvals. The baselines for each mode are dependent solely on the name, rather than the type or value of globals defined within that mode.

Let’s look at an example, this Storybook uses the following set of modes:

```jsx
// .storybook/modes.js|ts
export const allModes = {
  'dark desktop': {
    backgrounds: 'dark',
    theme: 'dark',
    viewport: 'large',
  },
  'light mobile': {
    backgrounds: 'light',
    theme: 'light',
    viewport: 'small',
  },
};
```

We then apply some of those modes to a component, like so:

```jsx
// ArticleCard.stories.js
import { allModes } from '../.storybook/modes';
import { ArticleCard } from './ArticleCard';

export default {
  component: ArticleCard,
  parameters: {
    chromatic: {
      //🔶 Test each story for ArticleCard in two modes
      modes: {
        'light mobile': allModes['light mobile'],
        'dark desktop': allModes['dark desktop'],
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

With the above configuration, Chromatic will capture the following snapshots:

1. For `ArticleCard.Base`, 2 snapshots: `light mobile` and `dark desktop`
2. For `ArticleCard.MembersOnly`, 2 snapshots: `light mobile` and `dark desktop`

Now, let's consider a scenario where we modify the definition of the mode. Even if the viewport size changes, Chromatic will continue to compare the new snapshot for `dark desktop` against the previously accepted baseline for `dark desktop`.

```jsx
// .storybook/modes.js|ts
export const allModes = {
  'dark desktop': {
    backgrounds: 'dark',
    theme: 'dark',
    // Using a different viewport size now
    viewport: 'extra-large',
  },
  'light mobile': {
    backgrounds: 'light',
    theme: 'light',
    viewport: 'small',
  },
};
```

---

### Frequently asked questions

<details><summary>What happens if I remove a mode?</summary>

Each mode has its own independent baselines and distinct approvals. Therefore, if you remove a mode, Chromatic will not capture a snapshot for that mode.

Other modes set on your stories will not be affected because each mode has its own independent baselines with distinct approvals. We treat removing modes in the same way as we treat removing stories.

If you rename the mode, a new snapshot baseline will be created based on the new mode name. This is similar to what happens when you remove or rename a story.

</details>

<details>
<summary>Which addons are supported?</summary>

Any Storybook addon that uses [globals](https://storybook.js.org/docs/react/essentials/toolbars-and-globals#globals). For example:  [@storybookjs/addon-themes](https://storybook.js.org/addons/@storybook/addon-themes), [@storybookjs/addon-viewport](https://storybook.js.org/addons/@storybook/addon-viewport), [@storybook/addon-backgrounds](https://storybook.js.org/addons/@storybook/addon-backgrounds) and [storybook-i18n](https://github.com/stevensacks/storybook-i18n/tree/main).

Or if you build a custom decorator that uses addons. For more on custom decorators, see: [Modes with custom decorators](/docs/custom-decorators).

</details>
