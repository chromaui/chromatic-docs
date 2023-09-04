---
layout: default
title: isChromatic
description: Learn how to control what executes in the Chromatic environment
---

# Check for Chromatic

`isChromatic()` gives you full control over what code is executed in the Chromatic environment. Use it in your Storybook to omit/include behavior that will be captured in Chromatic's snapshots.

## Use in .storybook/preview.js

This is useful when you want to change behavior of all stories when rendered in Chromatic.

```js
// .storybook/preview.js

import isChromatic from 'chromatic/isChromatic';

// Disable animation
if (isChromatic()) {
  // The exact method to do this will depend on your animation techniques.
  AnimationLibrary.disable = true;
}

// Disable lazyloading
LazyLoad.disabled = isChromatic();
```

## Use in \*.stories.js

This is useful when you want to change behavior of one component's stories when rendered in Chromatic.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

import isChromatic from 'chromatic/isChromatic';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  args: {
    label: isChromatic() ? `I'm in Chromatic` : `Not in Chromatic`,
  },
};
```

## With an environment variable

If you're working with Storybook 7.0 or later, you can also adjust your `chromatic` script and add the `IS_CHROMATIC` environment variable to allow you to control the story's behavior when rendered in Chromatic.

```json
{
  "scripts": {
    "chromatic": "IS_CHROMATIC=true chromatic",
  }
}
```
Then in your component story file, set the options (e.g., [args](https://storybook.js.org/docs/react/writing-stories/args), [parameters](https://storybook.js.org/docs/react/writing-stories/parameters)) based on the environment variable as follows:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

export const StoryName = {
  args: {
    label: process.env.IS_CHROMATIC ? `I'm in Chromatic` : `Not in Chromatic`,
  },
};
```

<div class="aside"> 

ℹ️ For Vite-based environments, you may be required to adjust your story to allow it to access the environment variable. See the [Vite documentation](https://vitejs.dev/guide/env-and-mode.html) for more information.

</div>
