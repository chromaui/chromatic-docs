import { z, defineCollection } from "astro:content";

const schema = z.object({
  title: z.string(),
  sidebar: z
    .object({
      label: z.string().optional(),
      order: z.number().optional(),
      hide: z.boolean().optional(),
    })
    .optional(),
  isHome: z.boolean().optional(),
});

const getStarted = defineCollection({
  type: "content",
  schema,
});

const workflow = defineCollection({
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

const plugins = defineCollection({
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
  workflow,
  configuration,
  modes,
  snapshot,
  collaborate,
  plugins,
  ci,
  account,
};
