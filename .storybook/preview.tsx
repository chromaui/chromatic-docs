import React from "react";
import type { Preview } from "@storybook/react";
import { ContentContainer } from "../src/components/ContentContainer";
import { Global } from "@storybook/theming";
import { globalStyles } from "../src/styles/global";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: "responsive",
    },
  },
  decorators: [
    (StoryFn) => (
      <>
        <Global styles={globalStyles} />
        <ContentContainer>{StoryFn()}</ContentContainer>
      </>
    ),
  ],
};

export default preview;
