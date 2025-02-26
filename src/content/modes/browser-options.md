---
layout: "../../layouts/Layout.astro"
title: Configure browser options in Modes
description: Learn how to configure browser options such as colorScheme and locale in Modes
sidebar: { order: 5, label: Browser options }
slug: "modes/browser-options"
---

# Configure browser options in Modes

Components adapt styling and layouts based on device characteristics. With Chromatic, developers can configure specific options via modes to ensure that the UI is rendering as expected in those scenarios. These browser mode options allow you to add more robust tests for your components by simulating user preferences, device capabilities, and internationalization settings.

## Color Schemes

Sets [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) to `light` or `dark` to test how your components look in different color schemes.

```jsx title="ArticleCard.stories.js|jsx"
import { allModes } from "../.storybook/modes";
import { ArticleCard } from "./ArticleCard";

export default {
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
};
```

## Device Pointer

It simulates touch events, which is useful for testing components that rely on touch interactions, such as taps and swipes.

```js title="ArticleCard.stories.js|jsx"
import { allModes } from "../.storybook/modes";
import { ArticleCard } from "./ArticleCard";

export default {
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
};
```

## Device Locale

Emulate the user locale. Enabling this option will also change the `navigator.language` and `Accept-Language` request headers, common when testing internationalization features (e.g., date formatting, number formatting, and right-to-left layouts).

```js title="ArticleCard.stories.js|jsx"
import { allModes } from "../.storybook/modes";
import { ArticleCard } from "./ArticleCard";

export default {
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
};
```

## Combining Options

You can combine multiple browser options within a mode for comprehensive testing:

```js title="ArticleCard.stories.js|jsx"
import { allModes } from "../.storybook/modes";
import { ArticleCard } from "./ArticleCard";

export default {
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
};
```
