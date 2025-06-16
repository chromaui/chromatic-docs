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

const overview = defineCollection({
  type: "content",
  schema,
});

const visualTests = defineCollection({
  type: "content",
  schema,
});

const interactionTests = defineCollection({
  type: "content",
  schema,
});

const playwright = defineCollection({
  type: "content",
  schema,
});

const cypress = defineCollection({
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

const guides = defineCollection({
  type: "content",
  schema,
});

const turbosnap = defineCollection({
  type: "content",
  schema,
});

const troubleshooting = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    sidebar: z
      .object({
        label: z.string().optional(),
        order: z.number().optional(),
        hide: z.boolean().optional(),
      })
      .optional(),
    sectionOrder: z.number().optional(),
    section: z.string().optional(),
    isHome: z.boolean().optional(),
  }),
});

export const collections = {
  overview,
  visualTests,
  interactionTests,
  playwright,
  cypress,
  configuration,
  modes,
  snapshot,
  collaborate,
  ci,
  account,
  guides,
  turbosnap,
  troubleshooting,
};
