---
title: Themes
description: Configure Chromatic to test components with different themes
sidebar: { order: 3 }
---

# Themes in modes

<div class="aside" style="margin-bottom: 2rem;">
ℹ️&nbsp;&nbsp;This feature uses the modes API. Learn how to <a href="/docs/modes">get started</a>.
</div>

Themes control the visual characteristics of UI—color palette, typography, white space, border styles, shadows, radii, etc. Using modes enables Chromatic to test the same story with multiple themes.

<video autoPlay muted playsInline loop style="pointer-events: none;">
  <source src="/docs/assets/theme-switcher.mp4" type="video/mp4" />
</video>

## Configure CSS and theme in your Storybook

There are various ways to configure Storybook to load CSS and apply themes. Our recommendation is to use [@storybook/addon-themes](https://github.com/storybookjs/storybook/tree/next/code/addons/themes), which is a framework-agnostic solution compatible with most popular tools.
For tool-specific setup instructions, please refer to the recipes provided below:

- [Emotion](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/emotion.md)
- [@mui/material](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/material-ui.md)
- [bootstrap](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/bootstrap.md)
- [styled-components](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/styled-components.md)
- [tailwind](https://github.com/storybookjs/storybook/tree/next/code/addons/themes/docs/getting-started/tailwind.md)
- [vuetify@3.x](https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md#writing-a-custom-decorator)

Don't see your favorite tool listed? No worries! You can check out the "Writing a custom decorator" guide in the [Storybook Themes API documentation](https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md#writing-a-custom-decorator) to get started.

For this example, let's assume that the themes addon has been configured with a light theme and a dark theme:

```ts title=".storybook/preview.ts"
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
// if you're using Storybook 9, or with the appropriate renderer otherwise.
import type { Preview } from "@storybook/your-framework";

import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/index.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
```

## Define theme modes

Modes are defined in the `.storybook/modes.js|ts` file. If your project doesn't have this file yet, go ahead and create it. To enable a theme within a mode, specify the theme name using the `chromatic[mode_name].theme` parameter.

```ts title=".storybook/modes.ts"
export const allModes = {
  light: {
    theme: "light",
  },
  dark: {
    theme: "dark",
  },
} as const;
```

## Apply modes to enable themes

Modes can be applied at various levels: project, component, or story. If a mode includes a valid theme parameter, Chromatic will apply the corresponding theme when capturing the snapshot.

With the above set of modes, we can apply them as follows:

```ts title="ArticleCard.stories.ts|tsx"
// Adjust this import to match your framework (e.g., nextjs, vue3-vite)
import type { Meta } from "@storybook/your-framework";

import { allModes } from "../.storybook/modes";

import { ArticleCard } from "./ArticleCard";

const meta = {
  component: ArticleCard,
  title: "ArticleCard",
  parameters: {
    chromatic: {
      //🔶 Test each story for ArticleCard in two modes
      modes: {
        light: allModes["light"],
        dark: allModes["dark"],
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;
```

When Chromatic captures your story, it will capture _two_ snapshots during the build, with the corresponding theme enabled. Each mode will have independent baselines and require distinct approval.
