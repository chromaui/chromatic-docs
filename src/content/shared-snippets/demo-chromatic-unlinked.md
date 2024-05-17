<details>
<summary id="demo-chromatic-unlinked">How to setup Chromatic if you require SSO, on-premises, or have a different Git provider.</summary>

["Unlinked" projects](/docs/access#unlinked-projects) are the way to go if you use an OAuth provider or Git host that Chromatic doesn't support yet, or if you need an enterprise plan but wish to trial Chromatic with your project first.

To setup Chromatic with an "unlinked" project:

1. Make sure your code is in a local or self-hosted repository (Chromatic uses Git history to track baselines).
2. Sign in using your _personal_ account via any of the supported providers. We'll use this to authenticate you as a user only so the account doesn't have to be associated with your work.
3. Select "Create a project" and type your project name to create an unlinked project.

![Setup unlinked project](../../images/chromatic-setup-unlinked-project.png)

Nice! You created an unlinked project. This will allow you to get started with [UI Testing](/docs/test) workflow regardless of the underlying git provider. You can then configure your CI system to automatically run a Chromatic build on push.

The Chromatic CLI provides the option to generate a JUnit XML report of your build, which you can use to handle commit / pull request statuses yourself. See [debug options](/docs/cli#debug-options) for details.

Unlinked projects have certain drawbacks:

- You won't get automatic PR checks, so pull requests will not be marked with our status messages. You'll need to set this up manually via your CI provider.
- Authentication and access control must be handled manually through user invites.

</details>
