---
title: Figma in Chromatic
description: View Figma components next to their stories in Chromatic
sidebar: { order: 4 }
---

# Figma in Chromatic

View Figma components alongside their linked story right in Chromatic.

## Enable

Get started with this integration by connecting your Figma account with Chromatic. Visit your project’s Manage page, and under the configuration tab, you’ll find “Connected Applications”.
![Chromatic manage screen showing new “Connected Applications” section](../../images/figma-manage.png)

## Link to a Figma design

Connect Figma components to your stories from within the Chromatic web app. Copy the Figma URL for a component like so:
![image](https://user-images.githubusercontent.com/1164060/229818480-f24216e0-3367-4a6b-9c5e-8ab1e7087cd4.png)

<div class="aside">

- Chromatic only supports linking Figma components. It doesn't support links to frame or layers.
- Components must be published to a Figma libary to be viewable in the designs tab.

</div>

Then enter that URL on a story's Designs tab. This will link the design with the story. You and your teammates will now be to quickly reference the design in the future.
![Designs tab in Chromatic showing the Link to a design UI](../../images/figma-link-story.png)

## View a Figma design in Chromatic

View Figma designs in Chromatic by going to Library and clicking one of your components. You’ll see a Designs tab which shows the linked Figma design.
![Designs tab in Chromatic showing the rendering of a Figma component](../../images/figma-designs.png)

You can zoom, pan, and even inspect the layers.
![Designs tab in Chromatic showing the rendering of a Figma component with the layer inspect drawer open showing CSS for the layer](../../images/figma-layer-styles.png)

## Bring your stories into Figma with our plugin

[Storybook Connect](/docs/figma-plugin) is a Figma plugin that allows you view your live stories in your design workspace. It works bi-directionally with Figma in Chromatic. Any connection you make between story and component will be visible in the plugin and in Chromatic.
