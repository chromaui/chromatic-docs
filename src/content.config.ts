import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
  title: z.string(),
  description: z.string(),
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
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/overview",
  }),
  schema,
});

const visualTests = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/visualTests",
  }),
  schema,
});

const accessibilityTests = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/accessibilityTests",
  }),
  schema,
});

const interactionTests = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/interactionTests",
  }),
  schema,
});

const playwright = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/playwright",
  }),
  schema,
});

const cypress = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/cypress" }),
  schema,
});

const configuration = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/configuration",
  }),
  schema,
});

const modes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/modes" }),
  schema,
});

const snapshot = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/snapshot",
  }),
  schema,
});

const collaborate = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/collaborate",
  }),
  schema,
});

const ci = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/ci" }),
  schema,
});

const account = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/account" }),
  schema,
});

const guides = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/guides" }),
  schema,
});

const turbosnap = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/turbosnap",
  }),
  schema,
});

const troubleshooting = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/troubleshooting",
  }),
  schema: schema.extend({
    description: z.string().optional(),
    sectionOrder: z.number().optional(),
    section: z.string().optional(),
  }),
});

const notInNavigation = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/notInNavigation",
  }),
  schema,
});

export const collections = {
  overview,
  visualTests,
  accessibilityTests,
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
  notInNavigation,
};
