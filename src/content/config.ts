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

const storybook = defineCollection({
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

const snapshotOptions = defineCollection({
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

const onboarding = defineCollection({
  type: "content",
  schema,
});

export const collections = {
  overview,
  storybook,
  playwright,
  cypress,
  configuration,
  modes,
  snapshot,
  snapshotOptions,
  collaborate,
  plugins,
  ci,
  account,
  guides,
  turbosnap,
  troubleshooting,
  onboarding,
};
