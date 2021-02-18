---
layout: default
title: FAQ
description: Frequently asked questions about Chromatic
---

# Frequently asked questions

If you have a question not covered in our documentation, contact us via our <a class="intercom-concierge-bot">in-app chat</a>.

## Comparison with other tools

<details>
<summary>How is this compared to End-to-End testing tools like Selenium and Cypress?</summary>

Chromatic complements your existing End-to-End tests (Selenium or Cypress).

#### Get tests for free

You already write stories as a natural part of building UIs. Chromatic transforms those stories into tests. That gives you expansive yet accurate UI coverage without having to write new tests.

#### No test flake

E2E tests are intended to QA the “happy path”, but are time-consuming to create and brittle to maintain. They tend to be flaky because they rely on the application being in a certain state before running the tests. The tests also have to run in a specific order. Chromatic tests against the static Storybook build. That prevents false positives and negatives.

#### Much faster

Chromatic runs all tests in parallel at no extra cost or configuration. We optimize for the fastest test time by evaluating only the rendered UI. This focus allows Chromatic to run thousands of UI tests in less than a minute. Selenium/Cypress tests can take half an hour or more for an app of meaningful complexity. That said, we recommend you use various testing strategies (visual, unit, E2E) for comprehensive app coverage.

</details>

<details>
<summary>Can I get rid of my BrowserStack or Sauce subscription?</summary>

Our aim isn’t to replace services like Browserstack or Sauce. Cloud browser services are invaluable for verifying interactive behavior (e.g., clicking around the UI) and End-to-End testing but aren’t built or priced for visual testing.

Chromatic gives professional UI engineers a purpose-built service for visual testing which helps you reduce your reliance on cloud browser services. In practice, our customers typically scale back their usage and save a boatload of money while increasing their testing productivity.

</details>

<details>
<summary>How is Chromatic different from visual testing tools like Applitools and Percy?</summary>

Chromatic is a faster, simpler, and cost effective alternative to Applitoolsor Percy that is built for UI components and component libraries. Our customers compare us favorably on developer experience and price.

[Get a detailed breakdown »](https://www.chromatic.com/choose/visual-testing)

**Product differentiation**:

- Components are first class citizens in Chromatic so our workflow is necessarily different

- Deep integration with Storybook (we're core maintainers)

- Track each components baselines through branches and merges

- Generate a living component library online

- Rewind component history

- Review components one at a time, approvals carry over from build to build

**We're proud of our developer experience:**

- "It just works" -- sensible defaults out of the box, no writing webdriver tests or custom integrations

- Lightning fast test runs (modern cloud architecture) with no cap on concurrency

- Automatic PR badging for GitHub, GitLab, and Bitbucket

</details>

<details>
<summary>What if I already publish Storybook using S3, Heroku, Netlify, or Vercel?</summary>

You don't need to do this anymore. Chromatic is a Storybook-optimized cloud service for frontend teams that includes collaboration, access control, versioning, history, and integrations with your existing tools. That said, we're happy customers of those hosting services and recommend them for other situations.

</details>

## Snapshot rendering

<details>
<summary>Where are my images and fonts?</summary>

Make sure your resource hosts are reliably fast. When possible serve resources statically via Storybook or use a dedicated service. Learn more about [resource loading in Chromatic](resource-loading).

If your resources are behind a firewall, whitelist our domain so we can load your resources.

</details>

<details>
<summary>Why am I getting cross-origin errors with my stories?</summary>

Most likely you are calling into `window.parent` somewhere in your code. As we serve your Storybook preview iframe inside our www.chromatic.com domain this leads to a x-origin error as your code doesn't have access to our frame (with good reason!).

Generally speaking it is a good idea to wrap calls like that in a `try { } catch` in case the code is running in a context where that's not possible (e.g Chromatic).

</details>

<details>
<summary>Why is my content being cut off vertically in my snapshots?</summary>

Make sure there are no elements inadvertently cutting off content through the use of overflow or height styles.

For elements that have relative height styles based on the size of the viewport (such as `height: 100vh`), all content nested under that element will show up in a screenshot unless either `overflow: hidden` or `overflow: scroll` is used to hide what is outside of that element (and therefore outside of the viewport).

When Chromatic takes a screenshot for an element that has a viewport-relative height as well as styling to hide/scroll the overflow, a default viewport height of `900px` will be used. This default is only used when we can't detect a "natural" height for the outermost DOM element (root ancestor), for instance, in the case of scrollable divs.

To set the height, you can add a decorator for stories that wraps them in a container with a fixed height:

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from './MyComponent';

export default {
  title: 'Example Story',
  component: MyComponent,
  decorators:  [(Story) => {% raw %}<div style={{ margin: '3em' }}{% endraw %}><Story/></div>]
};
```

</details>

<details>
<summary>How do I capture content inside scrollable <code>divs</code>?</summary>

Scrollable divs constrain the height of their children. Change the height of the scrollable div to ensure all content fits. It's not possible for Chromatic to infer how tall scrollable divs are intended to be.

</details>

<details>
<summary>Why isn’t my modal or dialog captured?</summary>

If you use an “animateIn” effect set [delay](delay) to ensure we snapshot when the animation completes.

If your component infers its dimensions from the layout of the surrounding DOM elements (e.g., it's a modal that uses `position:fixed`), you'll need to set the height of that component's stories using a decorator.

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from './MyComponent'

export default {
  component: MyComponent,
  decorators: [
    storyFn => (
      {% raw %}<div style={{ width: '1200px', height: '800px' }}>{% endraw %}
        This is a decorator for modals and such {storyFn()}
      </div>
    ),
  ],
}

export const StoryWithDimensions = () => <MyComponent/>
```

</details>

<details>
<summary>What if I have a modal component that doesn't define a width or height?</summary>

If your component infers its dimensions from the layout of the surrounding DOM elements (e.g., it's a modal that uses `position:fixed`), you can set the height of that component's stories using a <a href="https://storybook.js.org/docs/react/writing-stories/decorators#component-decorators">decorator</a>.

```js
// MyComponent.stories.js | MyComponent.stories.ts

import MyComponent from './MyComponent'

export default {
  title: 'Example Story',
  component: MyComponent,
  decorators: [
    storyFn => (
      {% raw %}<div style={{ width: '1200px', height: '800px' }}>{% endraw %}
        This is a decorator for modals and such {storyFn()}
      </div>
    ),
  ],
}

const Template = (args) => <MyComponent/>;

export const StoryWithDimensions = Template.bind({});
StoryWithDimensions.args = {};
```

</details>

<details>
<summary>Do you support taking snapshots of a component with multiple themes?</summary>

We recommend you render stories multiple times, one for each theme. Here's [a code snippet](https://github.com/storybookjs/storybook/blob/next/examples/official-storybook/preview.js#L90-L141) of how to configure Storybook to show the same story in multiple themes. This is how the snapshots will [appear in Chromatic](https://www.chromatic.com/library?appId=5a375b97f4b14f0020b0cda3&branch=next).

If you'd only like to see multiple themes side-by-side in Chromatic and not in your local Storybook, use [isChromatic()](isChromatic).

</details>

## Usage

<details>
<summary>How is UI Review different from UI Tests?</summary>

Testing is done primarily by developers, most often iteratively during development. The focus is on preventing UI regressions (bugs) and maintaining a clean set of baselines to test against.

Review is usually performed by designers, PMs, customers, and other stakeholders. The focus is not on finding bugs (this should have already happened through testing) but rather to find cases where the implementation is not quite as was intended by the design or specifications. The modern development process moves quickly and often developers are filling in gaps according to their best guess. UI review is an opportunity for developers to sync with other teammates to get a final OK before shipping.

</details>

<details>
<summary>Can I only take snapshots when a component's code changes?</summary>

We recommend taking snapshots on every build because it's the most reliable way to catch UI regressions. Global dependencies, such as CSS or third party APIs can affect the UI without the code changing.

</details>

<details>
<summary>What happens when I run out of snapshots on the free plan?</summary>

Free plans come with 5000 snapshots per month. Once free snapshots are exhausted, testing & review will become paused until the next month at which time Chromatic will again begin taking snapshots and functionality will automatically resume. Upgrading to a paid plan will immediately resume testing & review.

</details>

#### Browsers

<details>
<summary>Can I disable Chrome?</summary>

All plans use Chrome by default because it offers the greatest test coverage for most people. It cannot be disabled.

</details>

<details>
<summary>Can I change which browser generates comparisons for UI Review?</summary>

No. At the moment, Chrome is fixed as the browser used for UI review.

</details>

<details>
<summary>How do browsers affect my snapshot count?</summary>

Each browser adds another snapshot for each of your stories. For example, if you have a story that is tested in Chrome and IE11 that counts as two snapshots.

If you also test your story with different viewports, those count as snapshots as well. For example, you want to test a story at `320px`, `1280px`, `Chrome`, and `IE11`. This would count as 4 snapshots.

</details>

<details>
<summary>Does adding more browser coverage add time to my tests?</summary>

Yes it can. We do our best to provide the fastest test speeds but there are limits to browser performance (IE11) even when scaled across hundreds and thousands of machines.

</details>

<details>
<summary>What about testing in every other browser and its versions?</summary>

Chromatic covers the major rendering engines (Blink, Gecko and Trident) at all viewports. This eliminates almost all browser regressions your users are likely to see with minimal effort, configuration, or additional time to your workflow.

Supporting more browser/device combinations ends up having diminishing returns that adds noise to the visual review process.

</details>

#### UI Tests and UI Review

<details>
<summary>Do I use more snapshots when both UI Tests and UI Review are enabled?</summary>

No. Snapshots taken for one workflow are reused for the other. You don't get charged twice.

</details>

<details>
<summary>What happens if I disable UI Tests and/or UI Review?</summary>

As long as either the testing or review features are enabled, Chromatic will continue taking snapshots. With both disabled, Chromatic will stop taking snapshots and all other features of the platform (such as publishing) will continue without limits.

</details>

## Your account

<details>
<summary>How do I update my email account in Chromatic?</summary>

Chromatic retrieves the email addresses associated with your account from your Git provider. Check your provider's account settings page on how to add or change your email(s).

</details>
