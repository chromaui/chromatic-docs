export const schemaIntegration = {
  name: "chromatic-config-file-schema",
  hooks: {
    "astro:build:start": async () => {
      const { generateSchema } = await import("./generate-schema.ts");
      await generateSchema();
      await import("./validate-schema.ts");
    },
  },
};
