---
title: isChromatic
description: Learn how to control what executes in the Chromatic environment
sidebar: { order: 7 }
---

# Check for Chromatic

The `isChromatic` method allows you to control how your Storybook tests run in the Chromatic environment. Use it to configure what features and behaviors are available when testing.

You can also target specific CSS rules to the Chromatic capture environment using the [isChromatic class](#targeting-css-to-chromatic) added to the `body` element during capture.

<div class="aside">

ℹ️ The `isChromatic` functionality is specific to Storybook tests. If you need to control what code is executed in your Playwright or Cypress tests, you can use environment variables or other mechanisms provided by those tools to achieve similar results.

</div>

## Global configuration

If you're working with a framework-specific feature or library that prevents it from running in your tests, you can adjust your configuration file (i.e.,[`.storybook/preview.js|ts`](https://storybook.js.org/docs/configure#configure-story-rendering)) and add the `isChromatic` helper function, enabling you to configure how your tests run in Chromatic across your entire project. For example:

```js title=".storybook/preview.js|ts"
import isChromatic from "chromatic/isChromatic";

// Disables animation in Chromatic
if (isChromatic()) {
  // The exact method depends on your animation techniques.
  AnimationLibrary.disable = true;
}

// Disables lazyloading
LazyLoad.disabled = isChromatic();
```

## Test-specific configuration

If you need more granular control over how your tests run in Chromatic, you can add the `isChromatic` helper function and set the available options accordingly. For example:

```ts title="MyComponent.stories.ts|tsx"
// Adjust this import to match your framework (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from "@storybook/your-framework";

import isChromatic from "chromatic/isChromatic";

import { MyComponent } from "./MyComponent";

const meta = {
  component: MyComponent,
  title: "MyComponent",
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: isChromatic() ? "I'm in Chromatic" : "Not in Chromatic",
  },
};
```

## Environment variables

If you're running Storybook tests with version 7.6 or higher, you can also use the `IS_CHROMATIC` environment variable to control how your tests run in Chromatic. To do so, adjust your `chromatic` script in your `package.json` file to include the environment variable as follows:

```json title="package.json"
{
  "scripts": {
    "chromatic": "IS_CHROMATIC=true chromatic"
  }
}
```

Then, in your tests, you can check for the `IS_CHROMATIC` environment variable and set the available options accordingly (e.g., [args](https://storybook.js.org/docs/writing-stories/args), [parameters](https://storybook.js.org/docs/writing-stories/parameters)).

```ts title="MyComponent.stories.ts|tsx"
// Adjust this import to match your framework (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from "@storybook/your-framework";

import { MyComponent } from "./MyComponent";

const meta = {
  component: MyComponent,
  title: "MyComponent",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: process.env.IS_CHROMATIC ? "I'm in Chromatic" : "Not in Chromatic",
  },
};
```

<div class="aside">

ℹ️ For Vite-based environments, you may be required to adjust your test to allow it to access the environment variable. See the [Vite documentation](https://vitejs.dev/guide/env-and-mode.html) for more information.

</div>

## Using `isChromatic` in your application

Under specific circumstances, your components may require different behavior when running in Chromatic (e.g., [disabling animations](/docs/animations#javascript-animations), lazy loading). In these cases, you can use `isChromatic` directly in your components to control their behavior when tested. However, this approach can lead to unexpected behavior. We recommend using `isChromatic` only in your tests or via configuration to ensure a clear separation of concerns and make the code agnostic to the environment in which it's running.

<div class="aside">

💡 If you're attempting to make code-specific changes in your project with `isChromatic`, the Chromatic package must be installed as a dependency instead of a development dependency.

</div>

## Targeting CSS to Chromatic

Starting with [Capture 8](/docs/infrastructure-release-notes/#version-8), the isChromatic class is now added to the `<body>` element during snapshot capture. This allows you to write CSS rules specifically for the Chromatic capture environment. Whether you need to hide development-only UI, adjust animation timing, or tweak layout for testing, you now have a reliable way to target the Chromatic environment specifically in CSS.

```css
body.isChromatic .dev-only-banner {
  display: none;
}

body.isChromatic .animated-background {
  animation: none;
}
```
