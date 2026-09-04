---
title: Single Sign-On (SSO)
description: Configure SAML-based SSO, profile matching, SCIM provisioning, and account access
slug: 'access/sso'
sidebar: { order: 3 }
---

# Single Sign-On (SSO)

Single Sign-On (SSO) is available on the [Enterprise plan](/pricing). Chromatic enables it on an organization account so your team can authenticate through a corporate identity provider (IdP).

Your team signs in through a custom subdomain such as `mycompany.chromatic.com`. If you do not know the subdomain, ask an account Admin or project Owner. You can also contact Chromatic Support through in-app chat or [email](mailto:support@chromatic.com).

## Supported SSO providers

Chromatic works with any **SAML 2.0** compliant Identity Provider, including:

- Okta
- Microsoft Entra ID (Azure AD)
- Google Workspace
- OneLogin
- PingOne
- JumpCloud
- Keycloak
- CyberArk
- Generic SAML 2.0 IdP
- Generic OIDC IdP

If your provider is not listed, contact Chromatic Support through in-app chat or [email](mailto:support@chromatic.com) to check compatibility.

## Logging in with SSO

Once SSO is enabled, account collaborators can sign in two ways:

1. **Direct subdomain link**: `https://{YOUR-SUBDOMAIN}.chromatic.com/start`
   Replace `{YOUR-SUBDOMAIN}` with the subdomain assigned to your account.

2. **IdP dashboard**: Click the Chromatic application tile in your SSO provider’s portal.

SCIM synchronizes account collaborator changes from your SSO provider. Use [Teams](/docs/access/teams) to grant SCIM-synced groups access to specific projects.

### What changes when SSO is enabled

SSO changes how existing account collaborators authenticate. Profiles that used a Git provider lose their account and project memberships during the cutover, and Chromatic disconnects their Git identities.

Each account collaborator must sign in through SAML to regain access. If the account needs Git connections, Chromatic configures them separately for the SSO setup.

#### Troubleshooting login issues

- Confirm that your profile is provisioned to the Chromatic application and that its IdP group has the required permissions.
- Double-check that you are using the correct subdomain in the login URL. It must exactly match the one assigned to your account.
- Stale cookies or cached data can block login. Clear your browser's cache and cookies, or sign in from a private window.
- If your account has IP restrictions, connect to your corporate network as required by your company's policy.
- If your account limits access by domain, your email domain must be on its allow list. Contact Support to add a non-generic contractor domain.

## How Chromatic matches SAML profiles

Chromatic identifies SAML profiles by the SAML `NameID` (or `idp_id` attribute) alone. The match is case-insensitive. Use a persistent, immutable profile identifier from your IdP.

Your IdP must also send `email` and `firstName` or `lastName` attributes in the SAML assertion. Chromatic requires them to create a profile, but doesn't use them to match existing profiles.

#### What happens when the `NameID` (or `idp_id`) changes?

Chromatic treats an unrecognized `NameID` as a new person and creates a new profile. The previous profile's history and permissions don't carry over, even when the email and name attributes are unchanged.

Use a persistent, unchanging `NameID` or `idp_id` attribute.

#### What happens when the corporate domain changes (e.g., from @oldcompany.com to @newcompany.com)?

If your SAML `NameID` is an email address, changing domains changes every `NameID`. Chromatic then creates duplicate profiles without the original history and permissions. Configure your IdP to send a persistent, immutable `NameID` before the change, and contact Chromatic Support about the new email and subdomain.

Before changing the domain, change one test profile's email and verify that it still opens the existing profile.

<details>
<summary>How can I invite external collaborators to an account with SSO?</summary>

Accounts with SSO do not support external collaborators outside the SSO flow. Chromatic can allow additional business email domains to authenticate through the account's SSO configuration.

Chromatic cannot add generic email domains such as `gmail.com` or `yahoo.com`. For example, a contractor with `person@storybook.org` can sign in after Chromatic adds `storybook.org` to the allow list.

Many companies create a specific contractor domain, such as `chromatic-ext.com`, and add that domain to the allow list.

Contact Chromatic Support through in-app chat or [email](mailto:support@chromatic.com) with the domains you need to add.

</details>

## Provision profiles with JIT or SCIM

Chromatic supports two provisioning methods. **Just-in-Time (JIT)** provisioning creates a profile when someone signs in through SSO for the first time.

**System for Cross-domain Identity Management (SCIM)** pushes profiles and groups from your IdP before their first sign-in. It can assign roles and remove access when your IdP disables someone. Directory groups become [Teams](/docs/access/teams) that you can assign to projects.

Use JIT when profiles can be created at first sign-in. Use SCIM when your IdP needs to provision and remove access before or without a sign-in.

## Assign roles through SCIM

In the current access model, Chromatic maps directory groups to account roles. Chromatic Support configures those mappings and the default account role for account collaborators who do not belong to a mapped group.

For project access, set a default project role and assign SCIM-synced [Teams](/docs/access/teams) to projects. The default project role is the minimum role for every account collaborator. A Team can grant a higher role on each assigned project.

Some accounts configured before Teams use a `role` or `roles` attribute with `owner`, `developer`, `reviewer`, or `viewer`. This legacy setup assigns one project role across every project. Without a supported value, it assigns Developer. Follow the [Teams migration guidance](/docs/access/teams#migrate-from-legacy-project-role-mapping) to move to the current model.

See [Collaborators and roles](/docs/access/collaborators#roles) for account and project role definitions.

### Account and project access

- Profiles are automatically added to accounts that match their **SSO subdomain** at creation time.
- Project access comes from the account Admin role, a direct project assignment, the default project role, or Team membership.
- Role assignment via group mapping **does not** depend on email domain.
- If your account restricts sign-in by email domain or uses several domains, contact Chromatic Support to update the allow list.

## SSO certificate

An **SSO certificate** is an X.509 certificate that your identity provider uses to sign SAML assertions or encrypt communication with Chromatic. It lets Chromatic verify that an authentication response came from your identity provider and was not changed in transit.

### Change the SSO certificate

- **Metadata URL:** Provide a metadata URL from your IdP. Chromatic can fetch the new certificate automatically when it changes.

- **Manual update:** Send the new certificate to [priority-support@chromatic.com](mailto:priority-support@chromatic.com) with:
  - The requested change date, time, and timezone
  - A PEM-encoded X.509 certificate (accepted formats: `.pem`, `.key`, `.crt`, `.cer`, `.cert`)

Schedule a manual change during low-usage hours. Account collaborators may need to sign in again after the certificate rotates.

## Frequently asked questions

<details>
<summary>Is SSO available on the Starter and Pro plans, and for free users?</summary>

No. Single Sign-On (SSO) is available only on Enterprise plans.

Contact Chromatic Support through in-app chat or <a href="mailto:support@chromatic.com?Subject=Custom%20plan%20with%20SSO">email</a> to discuss an Enterprise plan.

</details>

<details>
<summary>How does Chromatic handle IdP-initiated (unsolicited) SAML?</summary>

Chromatic does **not** support IdP-initiated (unsolicited) SAML.

When Chromatic enables SSO on your account, it creates a SAML entity for your team and provides a configuration link. Your identity provider administrator uses that link to complete the integration.

</details>

<details>
<summary>Does Chromatic support using two IdPs (for example, Okta and PingOne together)?</summary>

No. Chromatic supports only one identity provider per Enterprise account. You cannot connect Okta and PingOne to the same Chromatic account at the same time.

To move from one IdP to another, contact Chromatic Support to coordinate the switch. Schedule a maintenance window for disconnecting the old IdP and configuring the new one. Account collaborators must sign in again after the change.

</details>

<details>
<summary>How do I migrate from one IdP to another (e.g., from Okta to PingOne)?</summary>

Because Chromatic allows one active IdP per account, the migration requires a new account and a data transfer:

1. **Request migration**: Contact Chromatic support to initiate the process. Provide details about your current IdP and the new one you wish to use.

2. **New account created**: Chromatic creates a new organization account and generates an SSO configuration link for the new IdP.

3. **Configure the new IdP**: Your identity administrator completes the setup with the configuration link. Chromatic verifies the new connection.

4. **Billing and projects migration**: Chromatic transfers your billing details and all projects from the old account to the new account.

5. **Delete the old account**: Once the merge is confirmed and account collaborators can authenticate through the new IdP, Chromatic permanently deletes the old account.

> **Migration effects:**
>
> - Account collaborators need to sign in again after the migration.
> - Schedule the migration during low-usage hours to minimize disruption.
> - Keep the same persistent `NameID` in the new IdP to preserve profile history and permissions. A changed identifier creates a duplicate profile.

Contact [priority-support@chromatic.com](mailto:priority-support@chromatic.com) to start a migration.

</details>

<details>
<summary>Does Chromatic support non-email NameID formats?</summary>

Yes. Chromatic follows SAML 2.0 standards and accepts persistent, transient, username, and custom `NameID` formats.

</details>

<details>
<summary>Will changing the NameID invalidate active user sessions?</summary>

Yes, most likely. Account collaborators need to sign in again after the `NameID` format or value changes.

</details>

<details>
<summary>What happens if a user’s NameID changes, but I have SCIM enabled?</summary>

SCIM updates the profile identifier when the IdP pushes the change. If the `NameID` changes before SCIM synchronizes it, the profile may be unable to sign in. Coordinate the changes with Chromatic Support.

</details>

<details>
<summary>Does Chromatic support IP restrictions for SSO?</summary>

Yes. Your account can restrict SSO sign-ins to specific IP ranges. See [how to allowlist IP addresses](/docs/faq/allowlist-ips-for-git-providers).

</details>

<details>
<summary>How do I request a custom SSO subdomain?</summary>

Contact [priority-support@chromatic.com](mailto:priority-support@chromatic.com). Subdomains are usually assigned during enterprise onboarding.

</details>

<details>
<summary>Can an account with SSO connect to Git providers?</summary>

Yes. Chromatic can configure an account with SSO to connect to GitHub, GitLab, Bitbucket, GitHub Enterprise Server, or a self-managed GitLab instance.

Existing linked projects cannot move directly into the account. Unlink each repository first, then link it again from the account with SSO.

</details>

<details>
<summary>How do I link my project to GitHub Enterprise Server or GitLab self-managed?</summary>

GitHub Enterprise Server and self-managed GitLab connections require an Enterprise plan and setup from Chromatic Support.

[Review the prerequisites and linking steps »](/docs/faq/link-a-repository#link-an-on-premise-provider)

</details>
