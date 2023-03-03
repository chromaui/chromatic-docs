---
layout: default
title: Hover and focus states
description: Learn how to capture hover and focus states
---

# Hover and focus states

Components can respond differently based on hover or focus events. Here are a few techniques for capturing the result of these user events Chromatic.

## Make your stories interactive

As of 6.4, stories are capable of simulating user interactions via the [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) function. Interactions allow you to verify how a component responds to user input (e.g., hover, focus, click, type). Chromatic awaits `play` function execution before taking a snapshot.

## JavaScript-triggered hover states

If the hover behavior is triggered via JavaScript like tooltips or dropdowns, write a `play` function to simulate it using Storybook's instrumented version of Testing Library. For example:

```js
// Form.stories.js|jsx

import React from 'react';

import { userEvent, waitFor, within } from '@storybook/testing-library';

import { Form } from './LoginForm';

export default {
  component: Form,
  title: 'Form',
};

const Template = (args) => <LoginForm {...args} />;

export const WithHoverState = Template.bind({});
WithHoverState.play = async ({ canvasElement }) => {
  // Starts querying the component from its root
  const canvas = within(canvasElement);

  // Looks up the input and fills it.
  const emailInput = canvas.getByLabelText('email', {
    selector: 'input',
  });

  await userEvent.type(emailInput, 'Example');

  // Looks up the button and interacts with it.
  const submitButton = canvas.getByRole('button');
  await userEvent.click(submitButton);

  // Triggers the hover state
  await waitFor(async () => {
    await userEvent.hover(canvas.getByLabelText('Email error'));
  });
};
```

## CSS :hover state

CSS includes the `:hover` pseudo-class that allow precise styling of an element on cursor hover. This is a "trusted event" for web browsers, meaning it can't be simulated by the `play` function. There are multiple ways you can snapshot this state.

<details>

  <summary>Use CSS class names</summary>

Add a CSS class name that mirrors the states you're trying to test (e.g., `hover`, `active`):

```css
/* Component styles */
MyComponent:hover,
MyComponent.hover {
  background: purple;
}

MyComponent:active,
MyComponent.active {
  background: green;
}
```

Then write a story that utilizes the class name:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};

const Template = (args) => <MyComponent {...args} />;

export const HoverStatewithClass = Template.bind({});

HoverStatewithClass.args = {
  ...HoverState.args,
  className: 'hover',
};

export const ActiveStatewithClass = Template.bind({});
ActiveStatewithClass.args = {
  ...ActiveState.args,
  className: 'active',
};
```

You can also extend this technique using a JS wrapper that [automates adding a class](https://github.com/Workday/canvas-kit/pull/377/files).

</details>

<details>

  <summary>Trigger CSS states via props</summary>

Although not recommended, you can test an element's states by creating a separate "pure" stateless component. Then use it to test the exact configurations you are after via props. For example:

```js
// MyComponent.js|jsx

export function MyComponent({ isHovered, isActive, label }) {
  return (
    <Button isHovered={isHovered} isActive={isActive}>
      {label}
    </Button>
  );
}

MyComponent.defaultProps = {
  isHovered: false,
  isActive: false,
  label: 'Submit',
};
```

You can write the following story to trigger the props:

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'MyComponent',
};


const Template = (args) => <MyComponent {...args}/>;

export const HoverState = Template.bind({});

HoverState.args = {
  isHovered: true,
  label: `I'm :hover`
};

export const ActiveState = Template.bind({});
ActiveState.args = {
  isActive: true,
  label: `I'm :active`
}:
```

</details>

<details>
<summary>With Storybook's Pseudo States addon</summary>

For atomic, functional components with CSS pseudo-classes (e.g., `hover`, `active`), try the [Storybook's Pseudo States addon](https://storybook.js.org/addons/storybook-addon-pseudo-states) to test pseudo states. For example:

```js
// Button.stories.js|jsx

import React from 'react';

import { Button } from './Button';

export default {
  component: Button,
  title: 'Button',
};

const Template = (args) => <Button {...args} />;

export const WithHoverState = Template.bind({});
WithHoverState.args = {
  size: 'small',
  label: 'Button',
};

WithHoverState.parameters = {
  // Toggles the component hover state via parameter.
  pseudo: { hover: true },
};
```

</details>

## Focus

To simulate how the component responds when an element is focused (i.e., through mouse or keyboard), write a `play` function emulating the behavior. For example:

```js
// Button.stories.js|jsx

import React from 'react';

import { userEvent, within } from '@storybook/testing-library';

import { Button } from './Button';

export default {
  component: Button,
  title: 'Button',
};

const Template = (args) => <Button {...args} />;

export const WithFocusState = Template.bind({});

export const WithFocusState = Template.bind({});
WithFocusState.play = async ({ canvasElement }) => {
  // Starts querying the component from its root
  const canvas = within(canvasElement);

  // Looks up the button and interacts with it.
  await canvas.getByRole('button').focus();
};
```

---

### Frequently asked questions

<details>

  <summary>Why are focus states visible in Storybook but not in a snapshot?</summary>

Snapshots can sometimes exclude outline and other focus styles because Chromatic trims each snapshot to the dimensions of the root node of the story.

To capture those styles, wrap the story in a [decorator](https://storybook.js.org/docs/react/writing-stories/decorators#component-decorators) that adds slight padding.

```js
// MyComponent.stories.js|jsx

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  decorators:  [(Story) => {% raw %}<div style={{ padding: '1em' }}{% endraw %}><Story/></div>],
  title: 'Example Story',
};
```

</details>
