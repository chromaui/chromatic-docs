import { z, defineCollection } from "astro:content";

const getStarted = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const configuration = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { getStarted, configuration };
