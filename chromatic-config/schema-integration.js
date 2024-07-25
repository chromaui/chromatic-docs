export const schemaIntegration = {
  name: "chromatic-config-file-schema",
  hooks: {
    "astro:build:start": async () => {
      await import("./generate-schema.mjs");
      await import("./validate-schema.mjs");
    },
  },
};
