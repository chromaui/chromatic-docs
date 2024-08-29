import type { CollectionEntry } from "astro:content";

type CollectionEntryItem =
  | Omit<CollectionEntry<"overview">, "render" | "body">
  | Omit<CollectionEntry<"storybook">, "render" | "body">
  | Omit<CollectionEntry<"playwright">, "render" | "body">
  | Omit<CollectionEntry<"cypress">, "render" | "body">
  | Omit<CollectionEntry<"configuration">, "render" | "body">
  | Omit<CollectionEntry<"modes">, "render" | "body">
  | Omit<CollectionEntry<"snapshot">, "render" | "body">
  | Omit<CollectionEntry<"snapshotOptions">, "render" | "body">
  | Omit<CollectionEntry<"turbosnap">, "render" | "body">
  | Omit<CollectionEntry<"collaborate">, "render" | "body">
  | Omit<CollectionEntry<"plugins">, "render" | "body">
  | Omit<CollectionEntry<"ci">, "render" | "body">
  | Omit<CollectionEntry<"account">, "render" | "body">
  | Omit<CollectionEntry<"guides">, "render" | "body">
  | Omit<CollectionEntry<"troubleshooting">, "render" | "body">;

export type NavGroupItem = CollectionEntryItem | NavGroup;

export interface NavGroup {
  title: string;
  items: NavGroupItem[];
  defaultOpen?: boolean;
  timeline?: boolean;
  order?: number;
  hide?: boolean;
}

export function isNestedGroup(item: NavGroupItem): item is NavGroup {
  return (item as NavGroup).items !== undefined;
}

export type TransformedNavGroupItem =
  | {
      label: string;
      slug: string;
      order: number;
      hide: boolean;
      items?: TransformedNavGroupItem[];
    }
  | TransformedNavGroup;

export interface TransformedNavGroup {
  title: string;
  items: TransformedNavGroupItem[];
  defaultOpen?: boolean;
  timeline?: boolean;
  order: number;
  hide: boolean;
}
