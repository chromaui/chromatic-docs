---
layout: "../../layouts/Layout.astro"
title: Configure Chromatic features via Storybook params
description: Learn how to use Storybook parameters to configure Chromatic features at the project, component, and story level
sidebar: { order: 1, label: Config via params }
---

# Using Storybook parameters to configure Chromatic features

When using Chromatic with Storybook, you can control the snapshot capturing behavior through Storybook parameters. [Parameters](https://storybook.js.org/docs/api/parameters#story-parameters) are static metadata that can be attached at the story, component (meta), and project (global) levels.

This guide will show you how to configure Chromatic features like [`diffThreshold`](/docs/threshold), [`forcedColors`](/docs/media-features), [`disableSnapshot`](/docs/ignoring-elements), and more using Storybook parameters.

## Story level parameters

Parameters specified at the story level apply to that story only. They are defined in the parameters property of the story (named export):

```ts
// Button.stories.ts|tsx

import type { Meta, StoryObj } from "@storybook/angular";

import { Button } from "./button.component";

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    with: "props",
  },
  parameters: {
    // Sets the diffThreshold for 0.2 for this specific story
    chromatic: { diffThreshold: 0.2 },
  },
};
```

## Component level parameters (also known as Meta)

Parameter's specified in a CSF file's meta configuration apply to all stories in that file. They are defined in the parameters property of the meta (default export):

```ts
// Button.stories.ts|tsx

import type { Meta, StoryObj } from "@storybook/angular";

import { Button } from "./button.component";

const meta: Meta<Button> = {
  component: Button,
  parameters: {
    // Sets the diffThreshold for 0.2 for all stories in this file
    chromatic: { diffThreshold: 0.2 },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    with: "props",
  },
};

export const Secondary: Story = {
  args: {
    with: "secondary props",
  },
};
```

## Project level parameters

Parameters specified at the project (global) level apply to all stories in your Storybook. They are defined in the parameters property of the default export in your `.storybook/preview.js|ts` file:

```ts
// Replace your-renderer with the renderer you are using (e.g., react, vue3)
import { Preview } from "@storybook/your-renderer";

const preview: Preview = {
  parameters: {
    // Sets the diffThreshold for 0.2 for all stories in your project
    chromatic: { diffThreshold: 0.2 },
  },
};

export default preview;
```

## Parameter inheritance

When specifying parameters, they are merged together in order of increasing specificity:

- Project parameters
- Component parameters
- Story parameters

In other words, parameters set at the component (meta) level will override those set at the project level. Parameters set at the story level will, in turn, override those set at both the project and component (meta) levels.
