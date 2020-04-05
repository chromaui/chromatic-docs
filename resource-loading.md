---
layout: default
title: Resource Loading
description: Learn how to Chromatic loads resources and waits to screenshot.
---

# Resource Loading

If your story uses resources (such as images or fonts), Chromatic needs to wait for those resources to fully load before creating a snapshot.

If the images fail to load in time, Chromatic will retry several times, finally taking a screenshot anyway (if the resources continue to fail), but display a warning telling you what's happened.

When resources fail to load, this can lead to spurious changes in your stories.

## Avoiding external resources

The first thing to note here is that the above is more likely to happen if you are using external resources, as we cannot necessarily rely on network connections or external hosting. If possible, add [resources to your Storybook](https://storybook.js.org/configurations/serving-static-files/) or use a reliable [placeholder service](https://placeholder.com/).

## Asynchronous rendering

Our browsers can only pick up network activity that happens immediately as your story renders. If your story renders after a delay (i.e. asyncronously), there is no way for Chromatic to tell that that has happened, and thus our network monitoring will not be able to reliably wait for resources such as images that are loaded in such async renders.

You can add a [delay](/delay) to avoid screenshotting until after the async rendering happening (if you know how long that will take), but typically it is difficult to reliably set a time that network resources will load within.

We are investigating ways to add first-class support to Storybook and then Chromatic for asynchronous rendering. Let us know if you need this feature by chat or [email](mailto:support@chromatic.com?Subject=Asynchronous Rendering).

## Browser differences

Although Chromatic makes a best effort to make rendering across our supported browsers as consistent as possible, there is one important difference in the way we wait for resource loading due to the increased access we have to networking APIs in Chrome.

In Chrome, we render your story via a Storybook JS API, and then watch network activity, waiting for quiescence (ie a period of no network activity) before capturing a screenshot.

In Firefox and Internet Explorer, we browse to a Storybook URL that renders your story, then wait for the browser ["load" event](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event). This utilizes the browser's built in network monitoring of assets used by the page.

The above can behave differently if your page loads resources (such as JS files) via techniques that aren't picked up by the load event (such as AJAX / background requests).
