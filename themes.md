---
layout: default
title: Themes
description: Configure Chromatic to test components with different themes
---

# Themes in modes

<div class="aside" style="margin-bottom: 2rem;">
ℹ️&nbsp;&nbsp;This feature uses the modes API. To learn more, checkout the <a href="/docs/modes#using-modes">getting started guide</a>.
</div>

Themes control the visual characteristics of UI—color palette, typography, white space, border styles, shadows, radii, etc. Using modes enables Chromatic to test the same story with multiple themes.

<video autoPlay muted playsInline loop width="600px" class="center">
  <source src="img/theme-switcher.mp4" type="video/mp4" />
</video>

## Configure CSS and theme in your Storybook

There are various ways to configure Storybook for loading CSS and applying themes. Our recommendation is to use [@storybook/addon-themes](https://github.com/storybookjs/storybook/tree/next/code/addons/themes), which is a framework-agnostic solution compatible with most popular tools.
For tool-specific setup instructions, please refer to the recipes provided below:

- [Emotion](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/emotion.md)
- [@mui/material](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/material-ui.md)
- [bootstrap](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/bootstrap.md)
- [styled-components](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/styled-components.md)
- [tailwind](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/tailwind.md)
- [vuetify@3.x](https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md#writing-a-custom-decorator)

Don't see your favorite tool listed? No worries! You can check out the "Writing a custom decorator" guide in the [Storybook Themes API documentation](https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md#writing-a-custom-decorator) to get started.

For this example, let's assume that the themes addon has been configured with a light theme and a dark theme:

```jsx
// .storybook/preview.js|ts
import { Preview } from '@storybook/your-renderer';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/index.css';

const preview: Preview = {
  parameters: {
    /* ... */
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

## Define theme modes

Modes are defined in the `.storybook/modes.js|ts` file. If your project doesn't have this file yet, go ahead and create it. To enable a theme within a mode, specify the theme name using the `chromatic[mode_name].theme` parameter.

```jsx
// .storybook/modes.js|ts
export const allModes = {
  light: {
    theme: 'light',
  },
  dark: {
    theme: 'dark',
  },
};
```

## Apply modes to enable themes

Modes can be applied at various levels: project, component, or story. If a mode includes a valid theme parameter, Chromatic will apply the corresponding theme when capturing the snapshot.

With the above set of modes, we can apply them as follows:

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
        light: allModes['light'],
        dark: allModes['dark'],
      },
    },
  },
};

export const Base = {
  args: {
    //...
  },
};
```

When Chromatic captures your story, it will capture *two* snapshots during the build, with the corresponding theme enabled. Each mode will have an independent baselines and require distinct approval.
