---
title: Parameters & Globals
description: Use with globals and params to control snapshot capturing behavior
sidebar: { order: 4 }
---

# Use with globals and params to control snapshot capturing behavior

When using Chromatic with Storybook, you can control how a snapshot is captured via Storybook [parameters](https://storybook.js.org/docs/writing-stories/parameters) and [globals](https://storybook.js.org/docs/essentials/toolbars-and-globals?renderer=vue#globals).

## Parameters

Parameters are static metadata that can be attached at the story, component (meta), and project (global) levels. For more information on how to use parameters in Storybook, see: [Config with story params](/docs/config-with-story-params).

| Parameter                           | Purpose                                                                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `chromatic.delay`                   | [Delay](/docs/delay) the capture by specified number of milliseconds.                                                                         |
| `chromatic.diffIncludeAntiAliasing` | Include [anti-aliasing](/docs/threshold#anti-aliasing) in diffs                                                                               |
| `chromatic.diffThreshold`           | Control visual sensitivity of diffs, [learn more](/docs/threshold#setting-the-threshold)                                                      |
| `chromatic.disableSnapshot`         | [Skip test](/docs/disable-snapshots)                                                                                                          |
| `chromatic.ignoreSelectors`         | [Ignore elements](/docs/ignoring-elements) from diff                                                                                          |
| `chromatic.pauseAnimationAtEnd`     | [Pause animation at end](/docs/animations#css-animations)                                                                                     |
| `chromatic.forcedColors`            | Control CSS [forced colors mode](/docs/media-features#test-high-contrast-color-schemes)                                                       |
| `chromatic.prefersReducedMotion`    | Control CSS [reduce motion setting](/docs/media-features#verify-reduced-motion-animations)                                                    |
| `chromatic.media`                   | Enable CSS [print media styles](/docs/media-features/#combine-media-features-with-modes)                                                      |
| `chromatic.cropToViewport`          | Crop the screenshot to the viewport, [learn more](docs/modes/viewports/#how-does-snapshot-cropping-work-with-viewport-width-and-height)       |
| `chromatic.modes`                   | Apply [modes](/docs/modes)                                                                                                                    |
| `viewport`                          | Use the Storybook viewport feature to [control the dimensions of the story](/docs/modes/viewports#combining-modes-with-the-viewports-feature) |
| `chromatic.viewports`               | [Legacy API](/docs/modes/viewports) for setting viewports for a story. Use [Modes](/docs/modes/viewports) instead.                            |

## Globals

Globals in Storybook represent “global” (as in not story-specific) inputs that affect how a story is rendered.

| Parameter     | Purpose                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------ |
| `a11y`        | [Configure accessibility tests](/docs/accessibility/configure#disable-accessibility-tests) |
| Custom global | [Custom globals](/docs/custom-decorators#custom-decorator-and-globals-in-modes) in modes   |
