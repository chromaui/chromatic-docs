---
layout: default
title: FAQ
description: Frequently asked questions about Chromatic
---

## Frequently Asked Questions

Here are some answers to frequently asked questions. If you have a question not covered in our documentation, contact us via our <a href="/intercom" onclick="event.preventDefault();openIntercom();"><b>in-app chat</b></a>.

## Table of Contents

- [Accounts](#accounts)
- [Billing](#billing)
- [General information](#general-information)
- [Git providers](#git-providers)
- [Snapshots](#snapshots)
- [UI Testing and review](#ui-testing-and-review)
- [Security](#security)

### General information

Frequently asked questions mainly related to Chromatic common usage.

<details>
<summary>Can I hide the CI messages in the web app?</summary>

Chromatic detects CI test runs for most services. But it's not possible for every system, which results in users seeing persistent "Setup CI / Automation" messages in the UI.

If this is happening to you, prepend `CI=true` to your test command like so `CI=true yarn chromatic...` to hide the "Setup CI" messages in Chromatic. [Learn more](test).

</details>

<details>
<summary>How is Chromatic different from other tools like Cypress?</summary>

Chromatic is a tool for visual regression testing your Storybook. That means it will catch unintended visual changes in your UI components. Where you get a visual side-by-side comparison of changes made in a pull request and have team members review those changes before a PR is merged.

We don't do full end-to-end UI testing, meaning we don't test against a running application like Cypress does for example. That approach tends to be flaky because it relies on the application to be in a certain state before running the tests, and the tests have to run in a specific order. Because we test against a static Storybook build, we can eliminate that flake and run all tests in parallel. That means in practice our tests complete in less than a minute, while Cypress tests tend to take half an hour or more for an app of meaningful complexity. Needless to say we test only the visual aspect of your app, not if the app itself actually works as intended. In general it's a good idea to use the various tests (visual, unit, e2e) alongside each other.

</details>

<details>
<summary>How is Chromatic different from other existing products?</summary>

Chromatic is a faster, simpler, and cost effective alternative to Applitools that is built for UI components and component libraries. Our customers compare us favorably to Applitools on developer experience and price.

**Product differentiation**:

- Components are first class citizens in Chromatic so our workflow is necessarily different:

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
<summary>How does Chromatic fit into my E2E strategy?</summary>

Visual testing with screenshots is a perfect complement to other testing methodologies such as E2E tests. They tend to be a lot easier to maintain and less brittle than the equivalent E2E test. 

Chromatic focusses on testing components in their various states. This makes it easier to pinpoint regressions down to the basic UI building block of modern view layers. To best use our tool you'd mock out the variations of components statically in Storybook. Our customers get the most value from:

1. Continuous UI testing during development which means bugs are caught much earlier to save time and money

1. Maintaining existing UI appearance to prevent unexpected regressions and poor UX

These benefits probably apply less to the specific runtime use case but are a useful direction to work towards as you build more components.

You can incrementally go from evaluating existing UIs during runtime to testing components continuously. The way we do this at Storybook (we're maintainers of the OSS project) is to create a story that renders the page you want to visually test in an iframe. Chromatic will then take a screenshot in our cloud and provide the dev/QA workflow for managing and updating baselines.

The benefit of the iframe method for QA is that you save the page in the desired state and can easily reference it at anytime later.

</details>

<details>
<summary>How can I use Chromatic with my custom Storybook script?</summary>

We do our best to interpret your Storybook script in package.json, but you might need to pass additional options to the `chromatic` command. [See all the options](cli).

</details>

<details>
<summary>Why do I see <code>Failed to publish. Reason: self signed certificate in certificate chain</code> when running the CLI?</summary>

This isn't a Chromatic CLI issue. Check if your machine is using special security or network settings before running the CLI.

</details>

<details>
<summary>Why is my Storybook failing to load in Chromatic?</summary>

If your stories make use of non-HTTPS content (for instance images), the iframe we deliver live view will fail to load, as modern browsers do not allow mixed content (HTTP content hosted within HTTPS pages).

To fix this, ensure all resources used by your stories are hosted via HTTPS.

</details>

<details>
<summary>Why can't I see my images and fonts?</summary>

Make sure your resource hosts are reliably fast. When possible serve resources statically via Storybook or use a dedicated service. Learn more about [resource loading in Chromatic](resource-loading).

If your resources are behind a firewall, whitelist our domain so we can load your resources.

</details>

<details>
<summary>Why do I get errored builds randomly?</summary>

Chromatic builds and runs Storybook flawlessly _most of the time_, but we're not perfect (we wish). Sometimes builds don't run due to rare infrastructure issues. If this happens, try to re-run the build via your CI provider. We keep track of these errors to improve the service.

</details>

<details>
<summary>Why do my builds timeout?</summary>

Chromatic takes snapshots very quickly. However, if we lose the connection to your server (for instance if you stop your server mid-build, or your internet connection goes down), builds can time out. Check your connection and try restarting the build.

</details>

<details>
<summary>Why are my builds failing because of component errors?</summary>

A build will _fail_ if any of the snapshots fail to render (i.e. in rendering the latest version of the component, the snapshot throws a JavaScript exception). You'll need to fix the code for errored components before we can pass the build.

</details>

<details>
<summary>Why is my build failing with the message <code>Cannot run a build with no stories. Please add some stories</code>?</summary>

This happens if certain stories were disabled via the [`chromatic: { disable: true }`](ignoring-elements#ignore-stories) option at a higher level. 

To solve this you can:

1. Remove the top-level [`chromatic: { disable: true }`](ignoring-elements#ignore-stories) option
1. Enable snapshots for specific stories
3. Run `yarn storybook-build` locally and fix the issues in your stories

</details>

<details>
<summary>Why I’m getting cross-origin errors with my stories?</summary>

Most likely you are calling into `window.parent` somewhere in your code. As we serve your Storybook preview iframe inside our www.chromatic.com domain this leads to a x-origin error as your code doesn't have access to our frame (with good reason!). Generally speaking it is a good idea to wrap calls like that in a `try { } catch` in case the code is running in a context where that's not possible (e.g Chromatic).

</details>

---

### Accounts

Frequently asked questions related to Chromatic account management.

<details>
<summary>How can I remove a collaborator from my project?</summary>

If the project is linked to a online repository, once you remove the collaborator from the repository, your collaborator's list will be automatically updated in Chromatic. For unlinked projects, contact us via our <a href="/intercom" onclick="event.preventDefault();openIntercom();"><b>in-app chat</b></a>.

</details>

<details>
<summary>Why can't I update my email account in Chromatic?</summary>

Chromatic retrieves the email addresses associated with your account from your Git provider. Check your provider's account settings page on how to add or change your email(s).

</details>

<details>
<summary>Why can't my teammates access a project?</summary>

Check that your teammates are listed as collaborators in that repository. 

If they aren't listed, please add them and try accessing the Chromatic project again (you may have to re-login). Chromatic syncs permissions at the account _and_ repo level. Learn [more](access).

</details>

---

### Billing

Frequently asked questions related to Chromatic billing.

<details>
<summary>How do I access my invoices?</summary>

You can browse all invoices past and present in the `Billing` screen. Learn how to access your invoices in this [article](article-view-invoice).

</details>

<details>
<summary>How do I change my billing address?</summary>

Your billing address can be modified in the `Billing` screen . Learn how to change it in this [article](article-change-billing-address).

</details>

---

### Git providers

Frequently asked questions related to Chromatic usage with Git providers.

<details>
<summary>Why do I get a <code>Command error git log -n 1</code> with Chromatic?</summary>

This error often appears when `git` is not available in your CI environment. Chromatic uses `git` to associate commits to pull/merge requests and set baselines. We require that an executable git is available (on the `$PATH` ) of the `chromatic` script.

**Common cases:**

- **Docker containers**: Git may not be installed on certain Docker containers. You'll need to make the image includes Git.
- **Heroku CI**: Git history isn't available by default. You'll have to give Heroku auth access to your repo so that it can clone it before running CI. This can be unideal. Some customers end up using other CI providers to run Chromatic like GitHub Actions (free) or CircleCI.
- **Google Cloud CI**: The `.git` folder is ignored by default. Based on [their documentation](https://github.com/GoogleCloudPlatform/cloud-builders/issues/236#issuecomment-374629200) you can try `.gcloudignore`. However, some customers have run into trouble with this solution and instead opted to use other CI providers to run Chromatic like GitHub Actions (free) or CircleCI.
- **You don't use Git**: Enable Git version control in your project and try Chromatic again.

Try running the command manually `git log -n 1 --format="%H,%ct,%ce,%cn"` and check if there are errors.

</details>

<details>
<summary>Why do I see <code>Didn't find any commits in this git repository in the last X builds</code>?</summary>

This means that across the last X unique commits across all builds in your app, we didn't find a single one that exists in the repository you ran this build against. Commits can go missing if you rebase or perform squash-merges, however, if all of the previous X builds' commits are missing, it is likely something has gone wrong.

If you've reached this situation and can't work out why, please contact us through our <a href="/intercom" onclick="event.preventDefault();openIntercom();"><b>in-app chat</b></a> or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Why do I see <code>Failed to find common ancestors with most recent builds within X commits</code>?</summary>

This means that although we found recent builds that _were_ in your git repository history (see above), we couldn't find any _common_ history between your checked out build and those builds within X commits.

Unless you are doing something unusual with your git repository, this is extremely unlikely. Either way, please contact us through our <a href="/intercom" onclick="event.preventDefault();openIntercom();"><b>in-app chat</b></a> or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Why do I see <code>Build X is based on a commit without ancestor builds</code>? </summary>

When we create a build, we search your git history for a recent Chromatic build based on a commit that is an ancestor (i.e. a commit that is in the direct history of this commit). Unless this is the very first build, if we do not find one, we will show you this message.

This is typically unusual, because in order to run Chromatic on a commit, chances are the commit that added Chromatic to your app is an ancestor!

However, this situation can arise due to the following:

1. You switched branches and re-ran Chromatic, without checking-in the code changes that installed Chromatic. In this case you can safely ignore this message.

1. You rewrote history in merging the Chromatic installation code (e.g. using GitHub's "Squash and Merge" or "Rebase and Merge" buttons). [Learn how to resolve](ci#github-squash-rebase-merge-and-the-master-branch)

1. You are using a shallow clone of your repository when running Chromatic. Chromatic needs access to your full git history in order to find baselines (or at least the history until the previous Chromatic build, which depends on how often you push code/run builds). [Learn about how we use Git for baselines »](branching-and-baselines)

1. Something else happened---perhaps a bug at our end? Please contact us through our in app chat if this is the case.

</details>

---

### Snapshots

Frequently asked questions related to Chromatic's snapshots.

<details>
<summary>Does Chromatic takes snapshots when the code changes?</summary>

Snapshots are taken on every build. Global dependencies, such as CSS or third party APIs can affect the UI without the code changing. Taking all snapshots is the most reliable way to catch UI regressions.

</details>

<details>
<summary>Do I use more snapshots when both UI Tests and UI Review are enabled?</summary>

No. Snapshots taken for one workflow are reused for the other. You don't get charged twice.

</details>

<details>
<summary>What happens when I run out of snapshots on the free plan?</summary>

Free plans come with 5000 snapshots per month. Once free snapshots are exhausted, testing & review will become paused until the next month at which time Chromatic will again begin taking snapshots and functionality will automatically resume. Upgrading to a paid plan will immediately resume testing & review.

</details>

<details>
<summary>What is the limit for image snapshots?</summary>


We have a 25 million pixel size limit for image snapshots. This ensures fast and reliable performance for every build. 

If your stories are larger than this, perhaps something has gone wrong? Let us know if you need this limit increased via our <a href="/intercom" onclick="event.preventDefault();openIntercom();"><b>in-app chat</b></a> or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>How do browsers affect my snapshot count?</summary>

Each browser adds another snapshot for each of your stories. For example, if you have a story that is tested in Chrome and IE11 that counts as two snapshots.

If you also test your story with different viewports, those count as snapshots as well. For example, you want to test a story at `320px`, `1280px`, `Chrome`, and `IE11`. This would count as 4 snapshots.
</details>

<details>
<summary>Does Chromatic tell me when snapshots are different between browsers?</summary>

This has significant trade offs. Teams that try to verify consistency between browsers end up encountering false positives due to inherent browser/device/OS differences like anti-aliasing and font rendering. Or they require workarounds like loosening diff thresholds which result in false negatives.

Chromatic does not programmatically compare snapshots from different browsers against each other. Instead, we compare the snapshots for each browser against the baseline for that browser.

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

---

### UI Testing and Review

Frequently asked questions related to Chromatic's UI testing and review process.

<details>
<summary>Can I disable UI Tests if I prefer not to use them?</summary>

Yes. Go to the manage page for your project where you can disable UI Tests. Chromatic will no longer add status checks to your PRs for UI Tests once it is disabled.

</details>

<details>
<summary>Can I disable UI Review if I'd prefer not to use it?</summary>

You can initiate a UI review at any time. However, we recommend doing it later in the development cycle, once baselines have been approved and UI Tests are green.

</details>

<details>
<summary>Can I disable visual testing in Chrome?</summary>

All plans use Chrome by default because it offers the greatest test coverage for most people. It cannot be disabled.

</details>

<details>
<summary>Can I select which browser generates comparisons for UI review?</summary>

No. At the moment, Chrome is fixed as the browser used for UI review.

</details>

<details>
<summary>Can I control the height of the browser?</summary>

As we take a full screenshot of the component (even if it flows off the screen), it typically doesn't make any difference what height the browser has when taking screenshots. If this isn't the case for you application, please contact us through <a href="/intercom" onclick="event.preventDefault();openIntercom();"><b>in-app chat</b></a> or [email](mailto:support@chromatic.com).

</details>

<details>
<summary>Does enabling more browsers add time to my tests?</summary>

Yes it can. We do our best to provide the fastest test speeds but there are limits to browser performance (IE11) even when scaled across hundreds and thousands of machines.

</details>

<details>
<summary>How is UI review different from testing?</summary>

Testing is done primarily by developers, most often iteratively during development. The focus is on preventing UI regressions (bugs) and maintaining a clean set of baselines to test against.

Review is usually performed by designers, PMs, customers, and other stakeholders. The focus is not on finding bugs (this should have already happened through testing) but rather to find cases where the implementation is not quite as was intended by the design or specifications. The modern development process moves quickly and often developers are filling in gaps according to their best guess. UI review is an opportunity for developers to sync with other teammates to get a final OK before shipping.

</details>

<details>
<summary>How do I assign viewports to my entire Storybook?</summary>

We don't recommend this in most cases because each viewport is treated independently and snapshots must be approved as such. But if you really want to assign viewports for an entire Storybook use [`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters) in your [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering):

```js
// .storybook/preview.js

export const parameters={
    // Set the viewports in Chromatic globally.
  chromatic: { viewports: [320, 1200] },
}
```

</details>

<details>
<summary>How do I capture content inside scrollable <code>divs</code>?</summary>

Scrollable divs constrain the height of their children. Change the height of the scrollable div to ensure all content fits. It's not possible for Chromatic to infer how tall scrollable divs are intended to be.

</details>

<details>
<summary>What happens if I disable UI Tests and/or UI Review?</summary>

As long as either the testing or review features are enabled, Chromatic will continue taking snapshots. With both disabled, Chromatic will stop taking snapshots and all other features of the platform (such as publishing) will continue without limits.

</details>

<details>
<summary>What commits does Chromatic use to calculate UI changes?</summary>

Similar to [GitHub code review](https://github.com/features/code-review/), Chromatic compares between the latest commit on the PR branch and the 'merge base' commit, that is the commit that is the shared ancestor between the PR branch and the branch it was created from. It is important that Chromatic has run a build on both commits outlined above. If you've recently enabled CI and have existing PRs that you would like to review, ensure Chromatic has run in CI for both branches of that PR.

The process might look something like:

1. Create a new PR to `master` adding Chromatic to CI
1. Merge that PR when everything works well.
1. Update your existing feature PR(s) w/ the latest from `master` (either merge or rebase from master).

</details>

<details>
<summary>What about every other browser and versions?</summary>

Chromatic covers the major rendering engines (Blink, Gecko and Trident) at all viewports. This eliminates almost all browser regressions your users are likely to see with minimal effort, configuration, or additional time to your workflow.

Supporting more browser/device combinations ends up having diminishing returns that adds noise to the visual review process.

</details>

<details>
<summary>What viewports can I choose?</summary>

A viewport can be any whole number between 320 and 1800 pixels.

</details>

<details>
<summary>What if I have a modal component that doesn't have a width or height?</summary>

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
<summary>When should I ask for UI Review?</summary>

You can initiate a UI review at any time. However, we recommend doing it later in the development cycle, once baselines have been approved and UI Tests are green. Learn more about [UI review](review).

</details>

<details>
<summary>Why is review disabled in my build screen?</summary>

If a build isn't the newest build on a branch, we disable reviewing the build; as any future builds will base themselves on the _newest_ build, making approvals to this build pointless.

Note that in the case that there is a descendent build of this build on _a different branch_ (for instance if the commit for this build was merged into that different branch), we do allow reviewing of this build. Future builds on this branch _will_ use approved changes from the build; however future builds on the different branch will not---for this reason it is best to review builds before merging them.

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

---

### Security

Frequently asked questions related to Chromatic's Security policies.

<details>
<summary>Does Chromatic have a security policy and where can I see it?</summary>

We do have a security policy in place. You can read it [here](security). If you have further inquiries contact us through our in app chat or [email](mailto:security@chromatic.com).
</details>








