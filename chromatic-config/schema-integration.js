export const schemaIntegration = {
  name: "chromatic-config-file-schema",
  hooks: {
    "astro:build:start": async () => {
      await import("./generate-schema.ts");
      await import("./validate-schema.ts");
    },
  },
};
