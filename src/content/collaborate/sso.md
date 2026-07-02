---
title: Single Sign-On (SSO)
description: Configure SAML-based SSO, manage user identity matching, SCIM provisioning, and troubleshoot
sidebar: { order: 5 }
---

# Single Sign-On (SSO)

Single Sign-On (SSO) is available to [**enterprise customers**](/pricing). It allows your team to authenticate using your corporate identity provider (IdP) and access Chromatic via a custom subdomain (e.g., `mycompany.chromatic.com`). If you don’t know the Chromatic URL for your team, ask the account or project owner or contact support via chat or [support@chromatic.com](mailto:support@chromatic.com).

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

If your provider is not listed, contact [support@chromatic.com](mailto:support@chromatic.com) or use in-app chat to discuss compatibility.

## Logging in with SSO

Once SSO is enabled, collaborators can log in two ways:

1. **Direct subdomain link** – `https://{YOUR-SUBDOMAIN}.chromatic.com/start`
   Replace `{YOUR-SUBDOMAIN}` with the subdomain assigned to your organization.

2. **IdP dashboard** – Click the Chromatic application tile in your SSO provider’s portal.

When you add or remove collaborators in your SSO provider, changes will be reflected in Chromatic automatically.
At the project-level, all collaborators who have access via SSO will also get access to every Chromatic project within your organization’s account. **Limitation:** Currently, SSO users get access to **all projects**. Project-specific access is not supported via SCIM.

#### Troubleshooting login issues

- Ensure your user has been provisioned to the Chromatic application within your SSO provider. Confirm your user group has the necessary permissions.
- Double-check that you are using the correct subdomain in the login URL. It must exactly match the one assigned to your organization.
- Login issues are often caused by stale cookies or cached data. Try clearing your browser’s cache and cookies or using a private/incognito window to log in.
- If your organization has enabled IP restrictions, ensure you are connected to your corporate network (e.g., via a VPN) as required by your company’s policy.
- If your organization limits access by domain and you use a different email domain than your colleagues (e.g., you’re a contractor), ask your team to issue you an email address on an approved domain or contact us to add your current domain to the company’s allow list.

## How Chromatic matches SAML users

Chromatic identifies existing users using **two methods** in order:

1. **Primary identifier** – The SAML `NameID` (or `idp_id` attribute).
   This is typically a persistent, immutable user ID from your IdP.

2. **Fallback identifier** – A combination of `email`, `firstName`, and `lastName` attributes.
   This requires that your IdP sends these three attributes in the SAML assertion.

#### What happens when the `NameID` (or `idp_id`) changes?

If the `NameID` changes but the `email`, `firstName`, and `lastName` remain the same, Chromatic attempts to match the user using these attributes as a fallback. If successful, the existing user account is preserved and their history and permissions remain intact.

If the `NameID` changes and any of the `email`, `firstName`, or `lastName` attributes also change, the fallback match will fail. In this case, Chromatic treats the user as a new entity and creates a new user account. This results in the loss of the user’s previous history and permissions.

If the `NameID` changes and the `email`, `firstName`, or `lastName` attributes are not mapped in the SAML assertion, the fallback mechanism has no attributes to compare. Consequently, a new user account is created, again leading to the loss of historical data and permissions.

> ✅ **Best practice:** Use a **persistent, unchanging NameID (or `idp_id` attribute)**.

#### What happens when the corporate domain changes (e.g., from @oldcompany.com to @newcompany.com)?

When planning to change user email addresses — for example, from `user@old.com` to `user@new.com` — there is a significant risk if your SAML `NameID` is set to the user’s email address because the `NameID` serves as the primary identifier, Chromatic will see both a new `NameID` (the new email) and a new email attribute. As a result, the fallback matching mechanism may fail, and a duplicate user account will be created, losing the original user’s history and permissions.

To avoid this, configure your Identity Provider (IdP) to send a persistent, immutable `NameID` that does not change. Additionally, ensure that `email`, `firstName`, and `lastName` are sent as separate SAML attributes. With this setup, even after a domain change, users will be correctly matched, preventing account duplication. Finally, contact Chromatic support to let them know about the new email (and subdomain if needed).

> ✅ **Best practice:** Change one test user’s identifier and verify they can log in to their existing Chromatic account.

<details>
<summary>How can I invite external collaborators to my SAML account?</summary>

SAML accounts do not directly support **external collaborators**. However, we have an allowlist of email domains that can access Chromatic with SSO.

We can add any email domain to the allowlist, as long as it is not a generic email address (e.g., @gmail.com or @yahoo.com). For example, if you have a contractor with an email like `person@storybook.org`, we can add `storybook.org` to the allowlist for your SAML account.

Many companies add contractors as external users by creating specific domains for them, such as `person@chromatic-ext.com`, and then adding `chromatic-ext.com` to the allowlist.

Send us the list of external collaborators via our **in-app chat** or email us at [support@chromatic.com](mailto:support@chromatic.com).

</details>

## User provisioning: JIT vs SCIM

Chromatic supports two provisioning methods for managing user accounts via **Single Sign-On (SSO)**. The first is **Just-in-Time (JIT)** provisioning, where a user account is automatically created in Chromatic the first time the user logs in via SSO—no pre‑provisioning or administrative setup is required beforehand.

The second is **SCIM** (System for Cross-domain Identity Management) provisioning, which allows users and groups to be pushed from your identity provider (IdP) to Chromatic before their first login. **SCIM** enables automated role assignment (e.g., setting permissions based on group membership) and automated de-provisioning (e.g., removing access when a user is disabled in your IdP).

In short, **JIT** is simpler and requires no upfront configuration but offers less control over pre‑login access, while **SCIM** provides full lifecycle management and automation at the cost of additional setup.

## Role management

SCIM allows you to manage Chromatic roles (`Owner`, `Developer`, `Reviewer`, `Viewer`) directly from your IdP. **Requirements:**

- Configure groups in your IdP that contain a `roles` or `role` attribute. Without this attribute, Chromatic won't be able to identify the correct role and will fall back to `Developer`.
- Attribute values must match exactly: `"owner"`, `"developer"`, `"reviewer"`, `"viewer"`.

**Limitation:** SCIM sets the same role for a user across **all projects**. Project-specific roles are not supported via SCIM.

When SCIM is not implemented or groups are not set correctly, all users are assigned the `Developer` role.

### Access control

- Users are automatically added to accounts and projects that match their **SSO subdomain** at creation time.
- Role assignment via group mapping **does not** depend on email domain.
- If your organization restricts login by email domain or has several domains, contact Chromatic support to add new domains to the allowlist.

## SSO certificate

An **SSO certificate** is an X.509 digital certificate used by your Identity Provider (IdP) to sign SAML assertions or encrypt communication between the IdP and the service provider (e.g., Chromatic). It ensures that authentication responses are authentic and haven't been tampered with.

### Change the SSO certificate

- **Preferred method:** Provide a **metadata URL** from your IdP. Chromatic can then automatically fetch and update the certificate when it changes, avoiding any manual intervention.

- **If no metadata URL is available:** Send the new certificate to [priority-support@chromatic.com](mailto:priority-support@chromatic.com) with:
  - The requested change date, time, and timezone
  - A PEM-encoded X.509 certificate (accepted formats: `.pem`, `.key`, `.crt`, `.cer`, `.cert`)

> ✅ **Best practice:** Manual updates require scheduling to prevent authentication downtime. Perform the change during low‑usage hours; users may need to re‑authenticate after the certificate is rotated.

---

## Frequently asked questions

<details>
<summary>Is SSO available on the Starter and Pro plans, and for free users?</summary>

No. Single Sign-on (SSO) is not available on self-serve plans like Starter or Pro, nor for free users. It's only available on Enterprise plans.

If you're interested in SSO, contact us via in-app chat or <a href="mailto:support@chromatic.com?Subject=Custom%20plan%20with%20SSO">email</a> to discuss your requirements.

</details>

<details>
<summary>How does Chromatic handle IdP‑initiated (unsolicited) SAML?</summary>

Chromatic does **not** support IdP‑initiated (unsolicited) SAML.

When you enable SSO for your organization, Chromatic creates a SAML entity for your team and provides a configuration link. Your identity provider administrator uses that link to complete the integration.

</details>

<details>
<summary>Does Chromatic support using two IdPs (for example, Okta and PingOne together)?</summary>

No. Chromatic supports only **one Identity Provider (IdP)** per Enterprise account at a time. You cannot connect both Okta and PingOne simultaneously to the same Chromatic organization.

If you need to transition from one IdP to another (e.g., migrating from PingOne to Okta), contact Chromatic support to coordinate the switch. During the migration, you can schedule a maintenance window where the old IdP is disconnected and the new one is configured. Be aware that users will need to re‑authenticate after the change.

</details>

<details>
<summary>How do I migrate from one IdP to another (e.g., from Okta to PingOne)?</summary>

Because Chromatic only allows one active IdP per account, the migration process involves creating a new account and merging your data. Here's how it works:

1. **Request migration** – Contact Chromatic support to initiate the process. Provide details about your current IdP and the new one you wish to use.

2. **New account created** – Chromatic creates a new account for your organization and generates a fresh SSO configuration link for the **new IdP**.

3. **Configure the new IdP** – Your identity administrator completes the setup using the provided configuration link. Chromatic verifies that the new IdP is properly connected and functional.

4. **Billing and apps migration** – Chromatic transfers your billing details and all apps from the old account to the new account.

5. **Delete the old account** – Once the merge is confirmed and users can successfully authenticate via the new IdP, Chromatic permanently deletes the old account.

> ⚠️ **Important considerations:**
>
> - Users will need to re‑authenticate after the migration is complete.
> - Schedule the migration during low‑usage hours to minimize disruption.
> - Ensure your new IdP sends the same persistent `NameID` (or other unique identifier) to preserve user history and permissions. If identifiers change, duplicate accounts may be created.

Contact [priority-support@chromatic.com](mailto:priority-support@chromatic.com) to start a migration.

</details>

<details>
<summary>Does Chromatic support non‑email NameID formats?</summary>

Yes. Chromatic follows SAML 2.0 standards and accepts any NameID format (e.g., persistent, transient, username, or custom identifier).

</details>

<details>
<summary>Will changing the NameID invalidate active user sessions?</summary>

Yes, most likely. Users will need to re-authenticate after the NameID format or value is changed in your IdP.

</details>

<details>
<summary>What happens if a user’s NameID changes but I have SCIM enabled?</summary>

SCIM updates the user’s identifier in Chromatic if the IdP pushes the change. However, if the NameID changes before SCIM syncs, the user may be unable to log in. Always coordinate changes carefully.

</details>

<details>
<summary>Does Chromatic support IP restrictions for SSO?</summary>

Yes. Your organization can restrict SSO logins to specific IP ranges. Refer to [this article](/docs/faq/allowlist-ips-for-git-providers).

</details>

<details>
<summary>How do I request a custom SSO subdomain?</summary>

Contact [priority-support@chromatic.com](mailto:priority-support@chromatic.com). Subdomains are usually assigned during enterprise onboarding.

</details>

<details>
<summary>Can SSO accounts be integrated with Git providers?</summary>

Yes, you can use our standard integration with GitHub, GitLab and BitBucket, or integrate with GitHub Enterprise Server or GitLab self-managed.

</details>

<details>
<summary>How do I link my project to GitHub Enterprise Server or GitLab self-managed?</summary>

For Enterprise plans, we support connecting on-premise versions of GitHub Enterprise and GitLab. Please reach out to us via Support to get access.

You also need to have some information from your Git Provider setup ready

1. The URL to your Git Provider (e.g. https://chromatic.github.com, https://gitlab.custom.com)
2. The Name of Your Repository (e.g. chromatic/ux)
3. Access Token (See docs for [GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and [GitLab](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html))

Depending on your Git Provider, the relevant docs for creating an access token can be found below. When you create your token, please ensure that you enable the proper scopes.

| Git provider | Permission Scopes                                        |
| ------------ | -------------------------------------------------------- |
| GitHub       | `['user:email', 'read:user', 'read:org', 'repo:status']` |
| GitLab       | `['api']`                                                |

Once you have access and the prerequisite details, follow these instructions to link your project to GitHub Enterprise Server or GitLab self-managed:

1. Go to the manage (`/manage`) page for the app that you want to connect.
2. Click the Configure tab.
3. In the Connected Application section, find the "Sync project with a Git repository" area and click "Add on-prem Git Provider" to enter the details for your repository.

If your organization restricts IP addresses for git access, make sure to [add Chromatic's IP addresses to the allow list](/docs/faq/allowlist-ips-for-git-providers/#my-organization-restricts-ip-addresses-for-git-access-should-i-add-chromatic-to-the-allowlist).

</details>
