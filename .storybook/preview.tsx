import React from "react";
import type { Preview } from "@storybook/react-vite";
import { ContentContainer } from "../src/components/ContentContainer";
import { Global } from "@emotion/react";
import { globalStyles } from "../src/styles/global";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    viewport: { value: "responsive" },
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
