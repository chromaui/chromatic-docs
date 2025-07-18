---
title: Configure browser options in Modes
description: Learn how to configure browser options such as colorScheme and locale in Modes
sidebar: { order: 5, label: Browser options }
slug: "modes/browser-options"
---

# Configure browser options in Modes

Components adapt styling and layouts based on device characteristics. With Chromatic, developers can configure specific options via modes to ensure that the UI is rendering as expected in those scenarios. These browser mode options allow you to add more robust tests for your components by simulating user preferences, device capabilities, and internationalization settings.

## Color Schemes

Sets [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) to `light` or `dark` to test how your components look in different color schemes.

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
      modes: {
        Light: {
          colorScheme: "light",
        },
        Dark: {
          colorScheme: "dark",
        },
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;
```

## Device Pointer

It simulates touch events, which are useful for testing components that rely on touch interactions, such as taps and swipes.

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
      modes: {
        Mobile: {
          hasTouch: true,
        },
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;
```

## Device Locale

Emulate the user locale. Enabling this option will also change the `navigator.language` and `Accept-Language` request headers, common when testing internationalization features (e.g., date formatting, number formatting, and right-to-left layouts).

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
      modes: {
        "United States": {
          locale: "en-US",
        },
        France: {
          locale: "fr-FR",
        },
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;
```

## Combining Options

You can combine multiple browser options within a mode for comprehensive testing:

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
      modes: {
        "Mobile Dark FR": {
          viewport: "small",
          colorScheme: "dark",
          hasTouch: true,
          locale: "fr-FR",
        },
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;
```
