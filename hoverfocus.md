---
layout: default
title: Hover and focus states
description: Learn how to capture hover and focus states
---

# CSS hover and focus states

CSS includes pseudo-classes that allow precise styling of different element states. Here are a few techniques for capturing them in Chromatic.

## Trigger CSS states via props

For interactive states, we recommend separating state from the component to achieve a "pure" stateless component and a stateful one. Then you can write stories against the stateless one in exactly the configurations you are after. This is useful for development too, we've found you can toggle between stories without even needing to interact with the component.

```js
// MyComponent.js

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
  label: 'Submit'
};
```

Then write a story that triggers the props.

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from "./MyComponent";

export default {
  component: MyComponent,
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

## CSS class name

Add a CSS class name that mirrors the `:hover`, `:active`, or `:focus` state.

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

Then write a story that utilizes the class name.

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from "./MyComponent";

export default {
  component: MyComponent,
};

const Template = (args) => <MyComponent {...args}/>;

export const HoverStatewithClass= Template.bind({});
HoverStatewithClass.args = {
  ...HoverState.args,
  className: 'hover'
};

export const ActiveStatewithClass = Template.bind({});
ActiveStatewithClass.args = {
  ...ActiveState.args,
  className: 'active',
};

```

You can also extend this technique using a JS wrapper that [automates adding a class](https://github.com/Workday/canvas-kit/pull/377/files).

## In the future

We're considering ways to allow this kind of interaction via Chromatic and may add a thin layer for this in the future.
