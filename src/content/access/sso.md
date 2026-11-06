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

Chromatic matches SAML profiles by the email address in the SAML assertion. The match is case-insensitive. Chromatic doesn't use the SAML `NameID` or the `idp_id` attribute to match profiles.

Your IdP must send `email` and `firstName` or `lastName` attributes in the SAML assertion. Chromatic requires them to create a profile, and uses the email address to find that profile at every later sign-in.

If you use Microsoft Entra ID, check the claim names for `user.givenname` and `user.surname` in your application's **Attributes & Claims** settings. Entra ID uses names ending in `/givenname` and `/surname` by default. Rename them to end in `/firstname` and `/lastname`, respectively, so Chromatic receives the expected name attributes.

If your account uses SCIM, Chromatic creates each profile with the SCIM `userName` as its email address. Set `userName` to each person's email address, and make sure it matches the email your SAML connection sends. If the two values differ, the person's first SSO sign-in creates a second profile instead of opening the one SCIM provisioned and gives them default permissions instead of the ones granted.

If you use Microsoft Entra ID, use the same user attribute for the SAML email claim and the SCIM `userName`, such as `user.mail` or `user.userprincipalname`. If `user.mail` is empty for some people, use `user.userprincipalname` for both.

If you use Okta, map both values to the Okta user's email in the Chromatic application's settings:

- Sign On → Credentials Details: set Application username format to **Email**. Okta uses this username for provisioning, so a custom expression that resolves to `user.id` sends the Okta user ID as the SCIM `userName` instead.
- Provisioning → To App → Attribute Mappings: map `userName` and `email` to `user.email`.

#### What happens when a person's email address changes?

Chromatic treats a new email address as a new person and creates a new profile. The previous profile's history and permissions don't carry over. Chromatic can't change the email address it matches a profile by.

If your account uses SCIM, the same applies to a changed `userName`. SCIM creates a new profile instead of updating the existing one.

#### What happens when the corporate domain changes (e.g., from @oldcompany.com to @newcompany.com)?

Changing domains changes every person's email address, so each person's next sign-in creates a new profile without the original history and permissions. Changing the `NameID` doesn't prevent this.

Contact Chromatic Support before the change about the new email domain and subdomain. After the change, Chromatic Support can remove the old profiles and move any Git provider connections to the new ones.

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

Use JIT when profiles can be created at first sign-in. Use SCIM when profile provisioning, directory group changes, or access removal must take effect before the next sign-in.

## Assign roles through SCIM

In the current access model, Chromatic maps directory groups to account roles. Chromatic Support configures those mappings and the default account role for account collaborators who do not belong to a mapped group.

For project access, set a default project role and assign SCIM-synced [Teams](/docs/access/teams) to projects. The default project role is the minimum role for every account collaborator. A Team can grant a higher role on each assigned project.

Some accounts configured before Teams use legacy SCIM role mapping. If your account uses this setup, send each person's project role as a `role` or `roles` attribute on their SCIM user record. Set its value to `owner`, `developer`, `reviewer`, or `viewer`. Chromatic assigns that project role across every project. Without a supported value, it assigns Developer. Follow the [Teams migration guidance](/docs/access/teams#migrate-from-legacy-project-role-mapping) when you are ready to move to Teams.

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

To move from one IdP to another, contact Chromatic Support to coordinate the switch. Chromatic switches your account to the new IdP in place, as described in the next question.

</details>

<details>
<summary>How do I migrate from one IdP to another (e.g., from Okta to PingOne)?</summary>

Chromatic switches your account to the new IdP in place. Your account, subdomain, projects, and billing stay the same.

1. **Request the switch**: Contact Chromatic Support with your current IdP, the new one, and whether the current IdP connection still works.

2. **Configure the new IdP**: Chromatic sends your identity administrator a setup link for the new IdP. If your account uses SCIM, set up directory sync for the new IdP too.

3. **Switch the account**: Once the setup is complete, Chromatic connects your subdomain to the new IdP.

4. **Test sign-in**: Start a new sign-in at `https://{YOUR-SUBDOMAIN}.chromatic.com/start` and confirm that it works. Chromatic then removes the old IdP connection.

Send the same email addresses from the new IdP to keep each person's profile history and permissions. A changed email address creates a duplicate profile.

Contact [priority-support@chromatic.com](mailto:priority-support@chromatic.com) to start a migration.

</details>

<details>
<summary>Does Chromatic support non-email NameID formats?</summary>

Yes. Chromatic accepts persistent, transient, username, and custom `NameID` formats. The format doesn't affect profile matching, because Chromatic [matches profiles by email address](#how-chromatic-matches-saml-profiles).

</details>

<details>
<summary>Will changing the NameID invalidate active user sessions?</summary>

No. Sessions belong to the Chromatic profile, not the `NameID`, and Chromatic doesn't use the `NameID` to match profiles.

</details>

<details>
<summary>What happens if a user’s NameID changes, but I have SCIM enabled?</summary>

Nothing changes in Chromatic. SCIM matches profiles by `userName` and SSO matches them by email address, so a `NameID` change doesn't affect either.

A changed `userName` or email address does. SCIM and SSO create a new profile instead of updating the existing one. See [what happens when a person's email address changes](#what-happens-when-a-persons-email-address-changes).

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

Yes. Chromatic can configure an account with SSO to connect to GitHub, GitLab, Bitbucket, GitHub Enterprise Server, GitHub Enterprise Cloud with data residency, or a self-managed GitLab instance.

Existing linked projects cannot move directly into the account. Unlink each repository first, then link it again from the account with SSO.

</details>

<details>
<summary>How do I link my project to GitHub Enterprise Server, GitHub Enterprise Cloud with data residency, or self-managed GitLab?</summary>

GitHub Enterprise Server, GitHub Enterprise Cloud with data residency (a `.ghe.com` address), and self-managed GitLab link through the on-premise Git provider. Chromatic organization accounts that use these providers typically use SSO to manage access and collaboration, which requires an Enterprise plan. Contact Chromatic Support to enable the connection.

[Review the prerequisites and linking steps »](/docs/faq/link-a-repository#link-github-enterprise-server-data-residency-or-self-managed-gitlab)

</details>
