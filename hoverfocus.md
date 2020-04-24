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
// In MyComponent.js
export function MyComponent({ isHovered, isActive }) {
  return (
    <Button isHovered={isHovered} isActive={isActive}>
      Submit
    </Button>
  );
}

MyComponent.defaultProps = {
  isHovered: false,
  isActive: false,
};
```

Then write a story that triggers the props.

```js
// In MyComponent.stories.js
import MyComponent from "./MyComponent";

export default {
  component: MyComponent,
};

export const HoverState = () => (
  <MyComponent isHovered={true}>I'm :hover</MyComponent>
);
export const ActiveState = () => (
  <MyComponent isActive={true}>I'm :active</MyComponent>
);
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
// In MyComponent.stories.js
import MyComponent from "./MyComponent";

export default {
  component: MyComponent,
};

export const HoverState = () => (
  <MyComponent className="hover">I'm :hover</MyComponent>
);
export const ActiveState = () => (
  <MyComponent className="active">I'm :active</MyComponent>
);
```

You can also extend this technique using a JS wrapper that [automates adding a class](https://github.com/Workday/canvas-kit/pull/377/files).

## In the future

We're considering ways to allow this kind of interaction via Chromatic and may add a thin layer for this in the future.
