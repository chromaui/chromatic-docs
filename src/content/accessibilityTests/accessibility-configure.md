---
layout: "../../layouts/Layout.astro"
title: Configure
description: Learn about the various configuration options for accessibility tests
slug: accessibility/configure
sidebar: { order: 3 }
---

# Configure Accessibility tests

You can configure Chromatic's accessibility tests to match your project's specific requirements. By default, Chromatic runs accessibility tests with the following rules:

- [WCAG 2.0 Level A & AA Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md#wcag-20-level-a--aa-rules)
- [WCAG 2.1 Level A & AA Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md#wcag-21-level-a--aa-rules)
- [Best Practices Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md#best-practices-rules)

The [region rule](https://dequeuniversity.com/rules/axe/4.1/region) _is_ disabled because you're testing individual stories, not entire pages, so the story will likely lack the HTML5 landmark element.

## How do I configure the Accessibility addon?

All configuration—such as selecting which rules to evaluate the UI against or enabling/disabling specific axe features—is managed through Storybook.

The Accessibility addon is configured via the `a11y` parameter which accepts the following properties:

- **`element` (optional):** the selector to inspect. Defaults to `body`.
- **`config`:** Options passed to `axe.configure`. See [axe.configure API docs](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure) to learn more about the available options.
- **`options`:** axe's options parameter. See [options parameter API docs](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter) to learn more about the available options.

Here's an example configuration for the Accessibility addon in Storybook:

```tsx title=".storybook/preview.ts"
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
// if you're using Storybook 9, or with the appropriate renderer otherwise.
import { Preview } from "@storybook/your-framework";

const preview: Preview = {
  parameters: {
    a11y: {
      // Optional selector to inspect
      element: "body",
      /*
       * Options passed to axe.configure
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available options.
       */
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: "autocomplete-valid",
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: "image-alt",
            enabled: false,
          },
        ],
      },
      /*
       * axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check within Storybook
      manual: true,
    },
  },
};

export default preview;
```

<div class="aside">

ℹ️ The `a11y` parameter can be set at story, component, and project levels. This enables you to set project wide defaults and override them for specific components and/or stories. <a href="/docs/config-with-story-params">Learn more »</a>

</div>

For more on configuring the Accessibility addon, refer to the [Storybook docs](https://storybook.js.org/docs/writing-tests/accessibility-testing#configure).

## Run all rules for a specific compliance standard

You can use tags to run rules specific to a standard, such as `WCAG 2.2 Level AA`, `EN-301-549` (European Accessibility Act), etc. For example:

```tsx title=".storybook/preview.ts"
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
// if you're using Storybook 9, or with the appropriate renderer otherwise.
import { Preview } from "@storybook/your-framework";

const preview: Preview = {
  parameters: {
    a11y: {
      configure: {},
      options: {
        runOnly: {
          type: "tag",
          // eg: If you wanted to specifically meet the standards of European Accessibility Act
          // Full list of available tags: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags
          values: ["EN-301-549"],
        },
      },
    },
  },
};

export default preview;
```

## Custom rules

Axe allows you to add custom [rules and checks](https://github.com/dequelabs/axe-core/blob/64d409dc5862e9fdebcec87a0a269ab3f3e71ad2/doc/rule-development.md). You can configure these rules via the `a11y.config.rules` property. Chromatic will also run these custom rules and report any violations within the web app.

```tsx title="RestaurantCard.stories.ts|js"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from "@storybook/your-framework";
import { restaurants } from "../../stub/restaurants";
import { RestaurantCard } from "./RestaurantCard";

const meta = {
  title: "Components/RestaurantCard",
  component: RestaurantCard,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "minimum-paragraph-length",
            selector: "p",
            impact: "critical",
            all: ["paragraph-minimum-text"],
            any: [],
            none: [],
            metadata: {
              description: "Ensures paragraphs have meaningful content",
              help: "Paragraphs should contain at least 5 characters",
            },
          },
        ],
        checks: [
          {
            id: "paragraph-minimum-text",
            evaluate: function evaluate(node: HTMLParagraphElement) {
              const textContent = node.textContent?.trim();
              return textContent && textContent.length > 0
                ? textContent.length > 50
                : false;
            },
          },
        ],
      },
    },
  },
} satisfies Meta<typeof RestaurantCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...restaurants[0],
    name: "Burger Kingdom",
  },
} satisfies Story;
```

## Disable accessibility tests

### Both in Storybook and Chromatic

For Storybook 8+, use the [a11y global](https://storybook.js.org/docs/writing-tests/accessibility-testing#turn-off-automated-a11y-tests) to disable accessibility tests for a story and/or component, both in Storybook and Chromatic.

```tsx title="MyComponent.stories.ts|tsx"
// Adjust this import to match your framework (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from "@storybook/your-framework";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const NonA11yStory: Story = {
  globals: {
    a11y: {
      // This option disables all automatic a11y checks on this story
      manual: true,
    },
  },
} satisfies Story;
```

<div class="aside">

For older versions of Storybook, use [a11y parameter](https://storybook.js.org/docs/7/writing-tests/accessibility-testing#how-to-disable-a11y-tests) instead.

</div>

### Only in Chromatic

To disable Accessibility Tests only within Chromatic you can use the [`chromatic.disableSnapshot` parameter](https://www.chromatic.com/docs/disable-snapshots/#with-storybook). Note, this will also disable visual tests for this story and/or component.

```tsx title="MyComponent.stories.ts|tsx"
// Adjust this import to match your framework (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from "@storybook/your-framework";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  title: "MyComponent",
  parameters: {
    // Disables Chromatic tests on a component level
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {};
```
