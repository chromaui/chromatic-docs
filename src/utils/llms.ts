import type { CollectionEntry } from "astro:content";

type DocEntry =
  | CollectionEntry<"overview">
  | CollectionEntry<"visualTests">
  | CollectionEntry<"accessibilityTests">
  | CollectionEntry<"interactionTests">
  | CollectionEntry<"playwright">
  | CollectionEntry<"cypress">
  | CollectionEntry<"configuration">
  | CollectionEntry<"modes">
  | CollectionEntry<"snapshot">
  | CollectionEntry<"turbosnap">
  | CollectionEntry<"collaborate">
  | CollectionEntry<"ci">
  | CollectionEntry<"account">
  | CollectionEntry<"guides">
  | CollectionEntry<"troubleshooting">
  | CollectionEntry<"notInNavigation">;

interface LlmsItem {
  title: string;
  description: string;
  link: string;
}

interface LlmsSection {
  title: string;
  items: LlmsItem[];
}

interface LlmsTxtConfig {
  name: string;
  description: string;
  sections: LlmsSection[];
}

interface LlmsFullTxtConfig {
  name: string;
  description: string;
  site: string;
  sections: LlmsSection[];
  docs: { title: string; description: string; link: string; body: string }[];
}

const MDX_PATTERNS = [
  /^import\s+.+from\s+['"].+['"];?\s*$/gm,
  /<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g,
  /<[A-Z][a-zA-Z]*[^>]*\/>/g,
] as const;

function stripMdx(content: string): string {
  return MDX_PATTERNS.reduce(
    (text, pattern) => text.replace(pattern, ""),
    content,
  ).trim();
}

function doc(...sections: (string | string[])[]): Response {
  const content = sections
    .flat()
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return new Response(content + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function llmsTxt(config: LlmsTxtConfig): Response {
  const head = [`# ${config.name}`, "", `> ${config.description}`];

  const sections = config.sections.filter((s) => s.items.length > 0).map((section) => [
    "",
    `## ${section.title}`,
    ...section.items.map(
      (item) => `- [${item.title}](${item.link}): ${item.description}`,
    ),
  ]);

  return doc(head, ...sections);
}

export function llmsFullTxt(config: LlmsFullTxtConfig): Response {
  const head = [
    `# ${config.name}`,
    "",
    `> ${config.description}`,
    "",
    `Site: ${config.site}`,
    "",
    "---",
  ];

  const docs = config.docs.flatMap((item) => [
    "",
    `## ${item.title}`,
    "",
    `URL: ${item.link}`,
    "",
    `> ${item.description}`,
    "",
    stripMdx(item.body),
    "",
    "---",
  ]);

  return doc(head, docs);
}

export function llmsDoc(entry: DocEntry, site: string): Response {
  const { title, description } = entry.data;

  return doc(
    `# ${title}`,
    "",
    `> ${description || title}`,
    "",
    `URL: ${site}/${entry.id}`,
    "",
    stripMdx(entry.body ?? ""),
  );
}

export function docToLlmsItem(
  entry: DocEntry,
  llmsLinkBase: string,
): LlmsItem {
  return {
    title: entry.data.title,
    description: entry.data.description || entry.data.title,
    link: `${llmsLinkBase}/${entry.id}.txt`,
  };
}

export function docToFullItem(entry: DocEntry, siteLink: string) {
  return {
    title: entry.data.title,
    description: entry.data.description || entry.data.title,
    link: `${siteLink}/${entry.id}`,
    body: entry.body ?? "",
  };
}
