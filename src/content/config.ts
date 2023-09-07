import { z, defineCollection } from "astro:content";

const schema = z.object({
  title: z.string(),
});

const getStarted = defineCollection({
  type: "content",
  schema,
});

const configuration = defineCollection({
  type: "content",
  schema,
});

const modes = defineCollection({
  type: "content",
  schema,
});

const snapshot = defineCollection({
  type: "content",
  schema,
});

const collaborate = defineCollection({
  type: "content",
  schema,
});

const ci = defineCollection({
  type: "content",
  schema,
});

const account = defineCollection({
  type: "content",
  schema,
});

export const collections = {
  getStarted,
  configuration,
  modes,
  snapshot,
  collaborate,
  ci,
  account,
};
