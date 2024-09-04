import { isNestedTransformedGroup, type TransformedNavGroup } from "./types";

export function withBase(url: string): string {
  return url === ""
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/${url}`;
}

export function isUrlActive(slug: string, url: string) {
  return withBase(slug) === url;
}

export function isChildActive(
  group: TransformedNavGroup,
  url: string,
): boolean {
  return group.items.some((item) => {
    if (isNestedTransformedGroup(item)) {
      return item.items.some((nestedItem) => {
        if (isNestedTransformedGroup(nestedItem)) {
          return isChildActive(nestedItem, url);
        } else {
          return isUrlActive(nestedItem.slug, url);
        }
      });
    } else {
      return isUrlActive(item.slug, url);
    }
  });
}
