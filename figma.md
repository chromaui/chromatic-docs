---
layout: default
title: Figma
description: Connect stories to variants
---

# Figma plugin (beta)

Storybook Connect is a Figma plugin that allows you to link stories to Figma components . Once connected, you can view your live stories in the design workspace without leaving Figma.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;">
  <source src="img/figma-plugin-overview.mp4" type="video/mp4" />
</video>

### Install the plugin

Go to [Storybook Connect](https://www.figma.com/community/plugin/1056265616080331589/Storybook-Connect) in the Figma community to install the plugin.

Next, open the plugin. Use the command palette in Figma (`command + /`) then type `Storybook Connect`.

![Open Storybook Connect in Figma](img/figma-plugin-open-in-figma.png)

Follow the installation instructions to authenticate with Chromatic.

### Connect a story to a Figma component

Select a Figma component to connect. The plugin supports connecting stories to Figma components, variants, and instances. It does not support connecting stories to layers.

![Select component](img/figma-plugin-select-component.png)

Navigate to a story in a Storybook published on Chromatic. Make sure it's on the branch you want to link. Then copy the URL to the story.

![Copy story url](img/figma-plugin-copy-url.png)

Paste the URL into the plugin’s form field.

![Paste story url](img/figma-plugin-paste-url.png)

Once connected, the component and its instances will all have links in the sidebar to view the corresponding story.

![Figma sidebar view](img/figma-plugin-sidebar-view.png)

### Open a story in Figma

Select the component that you've previously connected in Figma.

Then navigate to Figma’s Design sidebar and click the “View story” action. Alternatively, open the plugin by using the command palette (`command + /`) then type the name `Storybook Connect`.

<video autoPlay muted playsInline loop width="560px" class="center" style="pointer-events: none;">
  <source src="img/figma-plugin-open-story.mp4" type="video/mp4" />
</video>