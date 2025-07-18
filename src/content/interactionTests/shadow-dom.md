---
title: Testing Shadow DOM
description: Learn how write interaction tests for components that use Shadow DOM
slug: "interactions/shadow-dom"
sidebar: { order: 2 }
---

# Testing Shadow DOM with Storybook and Chromatic

With the help of [shadow-dom-testing-library](https://github.com/konnorrogers/shadow-dom-testing-library), you can write tests that query elements inside the shadow root just like you would with standard DOM elements. This approach is fully compatible with Chromatic, which will accurately capture the UI state by waiting for interactions to complete.

## Configure Shadow DOM Queries in Storybook Preview

Install `shadow-dom-testing-library` and then in your preview file, inject shadow-aware query methods into the `canvas` object using `beforeEach()`.

```ts title=".storybook/preview.ts"
// Replace the @storybook/web-components-vite package with @storybook/web-components if you're not using Storybook 9.0
import type { Preview } from "@storybook/web-components-vite";

import { within as withinShadow } from "shadow-dom-testing-library";

const preview: Preview = {
  beforeEach({ canvasElement, canvas }) {
    Object.assign(canvas, { ...withinShadow(canvasElement) });
  },
};

// Extend TypeScript types for safety
export type ShadowQueries = ReturnType<typeof withinShadow>;

declare module "storybook/internal/csf" {
  // Since 8.6
  interface Canvas extends ShadowQueries {}
}

export default preview;
```

This adds methods like `findByShadowRole`, `findAllByShadowRole`, etc., directly to the `canvas` object in `play()` functions.

## Querying Shadow DOM within Stories

Use shadow root queries directly in your `play()` function, like so:

```ts title="Button.stories.ts"
const Story: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = await canvas.findByShadowRole("button", { name: /Reset/i });
    await userEvent.click(button);
  },
};
```

Using `shadow-dom-testing-library` provides DOM querying methods that mirror the familiar API of `@testing-library/dom`, but they're able to traverse shadow roots. By extending Storybook's `canvas` object, you can access methods that help ensure your tests are clean, intuitive, and maintainable.

## Shadow DOM test Example

Let's say you're testing a Web Component `<checkbox-group>` that renders shadow-root-contained checkboxes.

```tsx title="CheckboxGroup.stories.ts"
// Replace the @storybook/web-components-vite package with @storybook/web-components if you're not using Storybook 9.0
import { Meta, StoryObj } from "@storybook/web-components-vite";

import { html } from "lit";

/*
 * Replace the storybook/test import with `@storybook/test` and adjust the stories accordingly if you're not using Storybook 9.0.
 * Refer to the Storybook documentation for the correct package and imports for earlier versions.
 */
import { expect } from "storybook/test";

import { Checkbox } from "../src/checkbox";
import { CheckboxGroup } from "../src/checkbox-group";

Checkbox.register();
CheckboxGroup.register();

const meta: Meta = {
  component: CheckboxGroup,
  title: "Checkbox",
};

export default meta;
type Story = StoryObj;

export const Required: Story = {
  render: () => html`
    <checkbox-group
      required
      setCustomValidityValueMissing="Please select an option"
    >
      <span slot="legend">Form label</span>
      <checkbox value="value1" name="required" id="checkbox-required1"
        >Checkbox option</checkbox
      >
      <checkbox value="value2" name="required" id="checkbox-required2"
        >Checkbox option</checkbox
      >
      <checkbox value="value3" name="required" id="checkbox-required3"
        >Checkbox option</checkbox
      >
      <checkbox value="value4" name="required" id="checkbox-required4"
        >Checkbox option</checkbox
      >
    </checkbox-group>
  `,
  play: async ({ canvas, userEvent }) => {
    const checkboxes = await canvas.findAllByShadowRole("checkbox");
    const firstCheckbox = checkboxes[0];
    await userEvent.click(firstCheckbox); // select
    await userEvent.click(firstCheckbox); // deselect
  },
};
```

Now you can simulate and test user interactions with deeply nested shadow elements from the `play()` function, without needing to manually reach into `shadowRoot`.
