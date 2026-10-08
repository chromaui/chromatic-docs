---
sidebar: { hide: true }
title: Why is my build failing with component errors?
description: Identify capture errors and check what prevented a test from completing.
section: 'uiTestsAndReview'
---

# Why is my build failing with component errors?

Chromatic labels a build **Component error** when it can't render or capture a test. You can't accept its changes or pass the build until the error is resolved. Check the error kind on the affected test to find the next step.

## Capture errors

### `JS_ERROR`

An internal JavaScript error occurred in Capture Cloud. If the error persists when you rerun the build, contact support with the build URL.

### `FAILED_JS`

JavaScript threw an error while Chromatic rendered your story. Open the affected story in your published Storybook and check the browser console.

### `NO_JS`

Your bundle's JavaScript didn't evaluate correctly in the capture browser. Open the affected story in your published Storybook and check the browser console. Check your Babel configuration and any browser APIs used during initialization.

### `NAVIGATION_TIMEOUT`

The story took too long to load. Check that it opens in your published Storybook, then inspect slow or failed requests in your browser's Network panel. See [resource loading](/docs/resource-loading) for ways to make assets more reliable.

### `SCREENSHOT_TIMEOUT`

The snapshot took too long to capture. Check the affected story for large assets or work that continues while Chromatic captures it.

### `IMAGE_TOO_LARGE`

The captured image exceeded the pixel limit shown in the error. Check the rendered story's dimensions in your published Storybook. You can [crop the snapshot to the viewport height](/docs/modes/viewports/#how-does-snapshot-cropping-work-with-viewport-width-and-height) with `parameters.chromatic.cropToViewport` if the full height isn't needed.

## Other test results

### `COMPONENT_OFF_PAGE`

The component rendered outside the captured area. The capture can still finish, but the component won't appear in the snapshot. Give the story a decorator with enough space for the component, or use an [interaction test](/docs/interactions) to bring it into view.

### `INTERACTION_FAILURE`

An interaction didn't complete or an assertion failed. Chromatic shows this as a **Failed test**. Open the affected story in your published Storybook, then [debug the interaction test](/docs/interactions/debug).

If you have additional questions, use our **in-app chat** to contact us or email us at [support@chromatic.com](mailto:support@chromatic.com).
