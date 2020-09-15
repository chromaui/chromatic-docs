---
layout: default
title: Storybook and Chromatic tutorial
description: Learn how to set up Storybook in your app to write snapshot specifications
---

# Storybook and Chromatic tutorial

This tutorial is a quick overview that walks you through installing Storybook and integrating Chromatic. It's intended for folks who haven't yet used Storybook.

If you're already using Storybook, then great!---skip to the [get started](/docs/) guide. If you'd prefer to learn Storybook in a free 11-chapter tutorial take a look at [Learn Storybook](https://www.learnstorybook.com/intro-to-storybook/).

#### How Chromatic works (in brief)

Chromatic publishes your Storybook to a secure CDN every commit. It uses your Storybook's stories for visual regression testing and UI review.

An image snapshot is taken of each story every commit. Chromatic compares these snapshots to previous versions to identify bugs for [UI Tests](test). And it compares snapshots _between branches_ to generate a changeset for [UI Review](review) (similar to code review).

---

## What is Storybook?

Storybook is the leading [component explorer](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a) for React, Angular, and Vue. It provides a dedicated UI that helps you visualize, interact, and develop your component states (called "stories" in Storybook) even as you create them. When embedded in your development workflow, it's a timesaving tool for developing apps from the ground up in a [component-driven](https://www.componentdriven.org/) fashion. Storybook is an essential tool for developers building Component Libraries for Design System (read our [guide](https://www.learnstorybook.com/design-systems-for-developers/)).

![Storybook](img/storybook-relationship.jpg)

For visual testing, Storybook helps you create visual test specifications as stories. Chromatic syncs with your stories to automate visual testing. If you change a story, your Chromatic test will also change. When a change is detected in Chromatic, we notify you, and direct you to the Storybook story that needs to be reviewed. For UI review, Chromatic shows you the visual differences in stories that are introduced by PRs.

---

## Install Storybook

Storybook is easy to setup. Within your app, run the following command:

```bash
npx -p @storybook/cli sb init

```

Or if you do not have npx, or you want to add the cli globally:

```bash
# Install the cli globally
npm install -g @storybook/cli

# Add Storybook to the app
sb init
```

The `sb init` command will install some important development dependencies, add some npm scripts to start your Storybook, and create a `.storybook` directory inside your app.

You can start your Storybook now with:

```bash
npm run storybook
```

### Configure Storybook

Chances are you will not need to configure Storybook further. But if you need to:

- Adjust [story loading](https://storybook.js.org/docs/react/configure/overview#configure-story-loading).
- Customize [webpack configuration](https://storybook.js.org/docs/react/configure/webpack#extending-storybooks-webpack-config).
- Register and configure additional [addons](https://storybook.js.org/docs/react/configure/storybook-addons).

You can use `.storybook/main.js` to apply the required configurations.

---

## Setup `.storybook/preview.js`

If you need to load custom styles, we recommend importing them into [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering).

```javascript
// .storybook/preview.js

// Global CSS for the app
import '../src/index.css';
```

---

## Write your first stories

Let's suppose you want to test a component named `Histogram`, that lives at `src/components/Histogram.js`.

Create a file called `src/components/Histogram.stories.js` and write the following:

```js
// src/components/Histogram.stories.js

import React from 'react';
import Histogram from './Histogram';

export default {
  component: Histogram,
  title: Histogram.displayName,
};

const Template = (args) => <Histogram {...args} />;

export const Loading= Template.bind({});
Loading.args = {
  loading: true
};

export const FullData = Template.bind({});
FullData.args = {
  series:[
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ]
};
```

This will create two stories for the Histogram, and you can browse to your Storybook (which you ran earlier with `npm run storybook`) to view the implementation (obviously adjust the component and props above to be relevant to your app).

When you are satisfied that your stories are sensible, you can start up your first Chromatic build and set the baselines for these stories with:

```bash
chromatic --project-token=<your-project-token>
```

Grab the project token from [www.chromatic.com](https://www.chromatic.com) and view the resultant build there to ensure the stories are snapshotted correctly. Read more about [running tests](test).

---

## Resources

- [Learn Storybook](https://learnstorybook.com) Step by step guides on learning Storybook and component development best practices
- [Visual Testing Handbook](https://www.learnstorybook.com/visual-testing-handbook/) a free 31-page walkthrough for visual testing with Storybook
- [How Storybook fits into your workflow](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)
- [Storybook docs](https://storybook.js.org/docs/react/get-started/introduction)
- [Component explorers](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a) are the essential tool for component development
- [Visual testing tools](https://www.chromatic.com/choose/visual-testing)
