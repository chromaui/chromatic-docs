import type { FC } from "react";
import { styled } from "@storybook/theming";
import type { CollectionEntry } from "astro:content";
import { Search } from "../Search";
import { Support } from "../Support";
import { SideNav } from "./SideNav";
import { minMd, spacing } from "@chromaui/tetra";
// import { DropdownNav } from "./DropdownNav";

interface NavigationProps {
  url?: string;
  navItems?: {
    title: string;
    items: (
      | CollectionEntry<"getStarted">
      | CollectionEntry<"configuration">
      | CollectionEntry<"modes">
      | CollectionEntry<"snapshot">
      | CollectionEntry<"collaborate">
      | CollectionEntry<"ci">
      | CollectionEntry<"account">
    )[];
    defaultOpen?: boolean;
    timeline?: boolean;
  }[];
}

const Container = styled.div`
  display: flex;
  gap: ${spacing[4]};
  align-items: center;

  ${minMd} {
    gap: ${spacing[6]};
    align-items: flex-start;
    flex-direction: column;
    width: 240px;
    flex-shrink: 0;
  }
`;

const SupportButton = styled(Support)`
  display: none;

  ${minMd} {
    display: block;
  }
`;

export const Navigation: FC<NavigationProps> = ({ url, navItems }) => {
  const navGroups = navItems
    ? navItems.map((group) => ({
        ...group,
        items: group.items
          .map((item) => ({
            ...item,
            label: item.data?.sidebar?.label || item.data.title,
            data: {
              ...item.data,
              sidebar: {
                label: item.data?.sidebar?.label || item.data.title,
                order: item.data?.sidebar?.order || 999,
                hide: item.data?.sidebar?.hide || false,
              },
            },
          }))
          .filter((item) => !item.data.sidebar.hide)
          .sort((p1, p2) =>
            p1.data.sidebar.order > p2.data.sidebar.order
              ? 1
              : p1.data.sidebar.order < p2.data.sidebar.order
              ? -1
              : 0,
          ),
      }))
    : [];

  return (
    <Container>
      <Search />
      {/* <DropdownNav groups={navGroups as any} url={url} /> */}
      <SideNav sidebarItems={navGroups} url={url} />
      <SupportButton />
    </Container>
  );
};
