---
layout: default
title: Hover and focus states
description: Learn how to capture hover and focus states
---

# CSS hover and focus states

CSS includes pseudo-classes that allow precise styling of different element states. Here are a few techniques for capturing them in Chromatic.

## Add interactions

Interactions allow you to verify how a component responds to user input (e.g., `hover`, `focus`). As of 6.4, stories are capable of simulating user behavior via the [play](https://storybook.js.org/docs/react/writing-stories/play-function) function. Chromatic awaits <code>play</code> function execution before taking a snapshot.

### Hover

To test how the component responds when a user hovers over it, write a <code>play</code> function mimicking this behavior. For example:

```js
// Form.stories.js|jsx
import React from "react";

import { userEvent, waitFor, within } from "@storybook/testing-library";

import { Form } from "./LoginForm";

export default {
  component: Form,
  title: "Form",
};

const Template = (args) => <LoginForm {...args} />;

export const WithHoverState = Template.bind({});

WithHoverState.play = async ({ canvasElement }) => {
  // Starts querying the component from its root
  const canvas = within(canvasElement);

  // Looks up the input and fills it.
  const emailInput = canvas.getByLabelText("email", {
    selector: "input",
  });

  await userEvent.type(emailInput, "Example");

  // Looks up the button and interacts with it.
  const submitButton = canvas.getByRole("button");
  await userEvent.click(submitButton);

  // Triggers the hover state
  await waitFor(async () => {
    await userEvent.hover(canvas.getByLabelText("Email error"));
  });
};
```

### Focus

To simulate how the component responds when an element is focused (i.e., through mouse or keyboard), write a <code>play</code> function emulating the behavior. For example:

```js
// Form.stories.js|jsx

import React from "react";

import { userEvent, within } from "@storybook/testing-library";

import { Form } from "./LoginForm";

export default {
  component: Form,
  title: "Form",
};

const Template = (args) => <LoginForm {...args} />;

export const WithFocusState = Template.bind({});

WithFocusState.play = async ({ canvasElement }) => {
  // Starts querying the component from its root
  const canvas = within(canvasElement);

  // Looks up the inputs and fills them.
  const emailInput = canvas.getByLabelText("email", {
    selector: "input",
  });
  await userEvent.type(emailInput, "Example");

  const passwordInput = canvas.getByLabelText("password", {
    selector: "input",
  });

  await userEvent.type(passwordInput, "Example");

  // Looks up the button and interacts with it.
  const submitButton = canvas.getByRole("button");
  await userEvent.click(submitButton);

  // Sets focus on the email input
  emailInput.focus();
};
```

---

### Other methods

<details>
  <summary>Trigger CSS states via props</summary>

You can also test the element's states, although not recommended, by creating a separate "pure" stateless component, which you can use to test the exact configurations you are after via props. Looking at the following example:

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
  label: "Submit",
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

  <summary>Use CSS class names</summary>

You can also add a CSS class name that mirrors the states you're trying to test (e.g., `hover`, `active`):

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

import { MyComponent } from "./MyComponent";

export default {
  component: MyComponent,
  title: "MyComponent",
};

const Template = (args) => <MyComponent {...args} />;

export const HoverStatewithClass = Template.bind({});

HoverStatewithClass.args = {
  ...HoverState.args,
  className: "hover",
};

export const ActiveStatewithClass = Template.bind({});
ActiveStatewithClass.args = {
  ...ActiveState.args,
  className: "active",
};
```

You can also extend this technique using a JS wrapper that [automates adding a class](https://github.com/Workday/canvas-kit/pull/377/files).

</details>
