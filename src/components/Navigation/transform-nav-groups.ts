import {
  isNestedGroup,
  type NavGroup,
  type NavGroupItem,
  type NestedTransformedGroup,
  type TransformedItem,
  type TransformedNavGroup,
  type TransformedNavGroupItem,
} from "./types";

function generateBreadcrumb(path: string[]): string {
  return path.join(" » ");
}

function transformNavItem(
  item: NavGroupItem,
  path: string[],
): TransformedNavGroupItem | NestedTransformedGroup {
  if (isNestedGroup(item)) {
    return {
      ...item,
      order: item.order || 999,
      hide: item.hide || false,
      items: transformSortAndFilterNavItems(item.items, [...path, item.title]),
    };
  }

  return {
    label: item.data?.sidebar?.label || item.data.title,
    slug: item.data?.isHome ? "" : item.slug,
    order: item.data?.sidebar?.order || 999,
    hide: item.data?.sidebar?.hide || false,
    isHome: item.data?.isHome || false,
    breadcrumb: generateBreadcrumb(path),
  };
}

function transformSortAndFilterNavItems(
  items: NavGroupItem[],
  path: string[] = [],
): TransformedNavGroupItem[] {
  return items
    .map((item) => transformNavItem(item, path))
    .filter((item) => !item.hide)
    .sort((p1, p2) => (p1.order > p2.order ? 1 : p1.order < p2.order ? -1 : 0));
}

export function transformNavGroups(groups: NavGroup[]) {
  return groups.map((group) => ({
    ...group,
    items: transformSortAndFilterNavItems(group.items, [group.title]),
  }));
}

export function isTransformedItem(
  item: TransformedNavGroupItem | TransformedNavGroup,
): item is TransformedItem {
  return (
    (item as NestedTransformedGroup | TransformedNavGroup).items === undefined
  );
}

// Flatten the navGroups into a single array of items
export function flattenGroups(
  groups: TransformedNavGroup[] | TransformedNavGroupItem[],
): TransformedItem[] {
  let flattenedItems: TransformedItem[] = [];

  for (const item of groups) {
    if (!isTransformedItem(item)) {
      const items = flattenGroups(
        (item as NestedTransformedGroup | TransformedNavGroup).items,
      );
      flattenedItems.push(...items);
    } else {
      flattenedItems.push(item as TransformedItem);
    }
  }

  return flattenedItems;
}
