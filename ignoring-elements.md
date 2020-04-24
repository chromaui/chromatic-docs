---
layout: default
title: Ignore stories and elements
description: Learn how you can tell Chromatic to ignore changes for certain elements
---

# Ignore stories and elements

Sometimes a component's appearance changes every render or contains content like video and [animation](animations) that is impossible to test consistently. This will trigger visual changes even when the component code hasn't changed. Ignore stories or DOM elements to tell Chromatic to skip them when looking for changes.

<details>
<summary>How does it work?</summary>

Chromatic uses the rendered visual output at the pixel level to determine whether components' have changed.
Setting the `.chromatic-ignore` class or `[data-chromatic="ignore"]` attribute instructs the diffing algorithm to ignore the
pixels within the bounding rectangle of ignored elements. It's important to ensure the calculated bounding rectangle fully covers the changing content.

</details>

![Ignore elements](img/ignore.jpg)

## Ignore stories

You can omit stories entirely from Chromatic testing using the `disable` story parameter:

```js
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
};

export const StoryName = () => <MyComponent />;

StoryName.story = {
  parameters: {
    chromatic: { disable: true },
  },
};
```

You can use Storybook's parameter inheritance to whitelist stories if you want to implement Chromatic incrementally:

```js
// In .storybook/config.js
import { addParameters } from '@storybook/react'; // <- or your app layer

addParameters({ chromatic: { disable: true } });

// In the components you'd like to enable Chromatic for
import MyComponent from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    chromatic: { disable: false },
  },
};

export const StoryName = () => <MyComponent />;
```

## Ignore DOM elements

Add the `.chromatic-ignore` CSS class or `[data-chromatic="ignore"]` attribute to elements in your component you want
Chromatic to ignore.

```js
import React from 'react';

export default function MyComponent() {
  return (
    <div>
      <p>
        This date will always change so ignore it:{' '}
        <span className="chromatic-ignore">{new Date()}</span>
      </p>
      <p>
        Also ignore the animated gif:
        <img
          className="chromatic-ignore"
          src="https://media0.giphy.com/media/3oriO4WnYwNTZLKv5K/giphy.gif"
        />
      </p>
    </div>
  );
}
```
