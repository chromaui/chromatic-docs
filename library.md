---
layout: default
title: Component library
description: Learn about your component library
---

# Component library

Chromatic generates a component library from your Storybook automatically. Every time you push code each component is recorded so you can browse variations of any component across branches and builds. Right from the comfort of your web browser; no `git checkout` or `npm install` required.

---

## Library
The library screen visualizes the latest components on a branch-by-branch basis. Browse existing components to reuse or reference. Use the branch picker to find branch-specific components.

<video autoPlay muted playsInline controls width="560px">
  <source src="/img/feature-library-component-workflow-optimized.mp4" type="video/mp4" />
</video>

**How this helps you**
- Get a quick overview of your library in a glance
- Identify changes by comparing historical commits and branches
- Share the library with teammates
- Browse existing components for re-use

---

## Component

Each component and its stories are securely indexed each commit and branch. The component screen is your window into the metadata and variations of the component Chromatic has on file. You'll find image snapshots of each story each commit.

<video autoPlay muted playsInline controls width="560px">
  <source src="/img/feature-component-inspect-optimized.mp4" type="video/mp4" />
</video>

**What you can do**
- Visual review components without needing to switch branches, pull code, or Git.
- Easy reproductions by toggling Live View to interact with the real component code
- Get feedback faster by sharing a link to the component with your team
- Compare components historically to check if they look correct



---

#### Troubleshooting

##### Live view fails to load

If your stories make use of non-HTTPS content (for instance images), the iframe we deliver live view will fail to load, as modern browsers do not allow mixed content (HTTP content hosted within HTTPS pages).

To fix this, simply ensure all resources used by your stories are hosted via HTTPS.
