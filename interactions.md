---
layout: default
title: Interactions
description: Learn how to simulate interactions with interactive stories
---

# Interactions

Building components and testing them in Chromatic safeguards you against unexpected regressions. But not every component can be tested without user intervention. For instance, forms, tooltips, and dropdowns.

Interactive stories enable you to test how components respond to user input by simulating behavior via the [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) function.

## How it works

Enable interactive stories by adding a `play` function to your component's story. For example, if you were working with a form and you want to validate it, you can write the following story:

```js
// LoginForm.stories.js|jsx

import React from 'react';

import { userEvent, within } from '@storybook/testing-library';
import { Form } from './Form';

export default {
  component: Form,
  title: 'Form',
};

const Template = (args) => <Form {...args} />;

export const FilledForm = Template.bind({});

FilledForm.play = async ({ canvasElement }) => {
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
};
```

<div class="aside">
Read more about interactive stories with the play function in the official Storybook <a href="https://storybook.js.org/docs/react/writing-stories/play-function">documentation</a>. 
</div>

Publish your newly added story. Chromatic will wait for the play function to run before capturing the snapshot.

![Interactive story snapshot](img/interactive-story-chromatic-snapshot.png)
