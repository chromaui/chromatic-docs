import { generateSchema } from "./generate-schema.ts";
import { validateSchema } from "./validate-schema.ts";

export const schemaIntegration = {
  name: "chromatic-config-file-schema",
  hooks: {
    "astro:build:start": async () => {
      await generateSchema();
      await validateSchema();
    },
  },
};
