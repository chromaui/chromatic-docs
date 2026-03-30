/**
 * llms.txt generation utilities
 *
 * Based on https://kumak.dev/adding-llms-txt-to-astro
 */
import type { CollectionEntry } from "astro:content";

export type DocEntry =
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
  docs: { title: string; description: string; link: string; body: string }[];
}

const MDX_COMPONENT_TAG = /<\/?[A-Z][\w]*(\s+[^>]*?)?>/g;

function stripTopLevelImportsOutsideCodeFences(content: string): string {
  const lines = content.split("\n");
  const importPattern = /^import\s+.+from\s+['"].+['"];?\s*$/;

  let inFence = false;
  let seenNonImportOutsideFence = false;
  const resultLines: string[] = [];

  for (const line of lines) {
    const fenceMatch = line.trimStart().startsWith("```");
    if (fenceMatch) {
      inFence = !inFence;
      resultLines.push(line);
      continue;
    }

    if (inFence) {
      resultLines.push(line);
      continue;
    }

    if (!seenNonImportOutsideFence) {
      if (line.trim() === "") {
        resultLines.push(line);
        continue;
      }

      if (importPattern.test(line)) {
        // Skip top-of-file MDX import line.
        continue;
      }

      seenNonImportOutsideFence = true;
      resultLines.push(line);
      continue;
    }

    resultLines.push(line);
  }

  return resultLines.join("\n");
}

function stripMdx(content: string): string {
  const withoutImports = stripTopLevelImportsOutsideCodeFences(content);

  return withoutImports.replace(MDX_COMPONENT_TAG, "").trim();
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

function entryUrl(entry: DocEntry, site: string): string {
  return entry.data.isHome ? site : `${site}/${entry.id}`;
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
    `URL: ${entryUrl(entry, site)}`,
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
    link: entryUrl(entry, siteLink),
    body: entry.body ?? "",
  };
}
