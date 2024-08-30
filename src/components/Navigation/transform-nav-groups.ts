import {
  isNestedGroup,
  type NavGroup,
  type NavGroupItem,
  type TransformedNavGroupItem,
} from "./types";

export function transformNavItem(item: NavGroupItem): TransformedNavGroupItem {
  if (isNestedGroup(item)) {
    return {
      ...item,
      order: item.order || 999,
      hide: item.hide || false,
      items: transformSortAndFilterNavItems(item.items),
    };
  }

  return {
    label: item.data?.sidebar?.label || item.data.title,
    slug: item.data?.isHome ? "" : item.slug,
    order: item.data?.sidebar?.order || 999,
    hide: item.data?.sidebar?.hide || false,
    isHome: item.data?.isHome || false,
  };
}

export function transformSortAndFilterNavItems(
  items: NavGroupItem[],
): TransformedNavGroupItem[] {
  return items
    .map(transformNavItem)
    .filter((item) => !item.hide)
    .sort((p1, p2) => (p1.order > p2.order ? 1 : p1.order < p2.order ? -1 : 0));
}

export function transformNavGroups(groups: NavGroup[]) {
  return groups.map((group) => ({
    ...group,
    items: transformSortAndFilterNavItems(group.items),
  }));
}
