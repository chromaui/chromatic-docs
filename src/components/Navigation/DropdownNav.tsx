import { type FC } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { styled } from "@storybook/theming";
import { minMd } from "@chromaui/tetra";

const NavDropdownMenu = styled(DropdownMenu)`
  ${minMd} {
    display: none;
  }
`;

interface DropdownNavGroup {
  title: string;
  items: {
    id: string;
    slug: string;
    breadcrumb: string;
    label: string;
    href: string;
    isActive: boolean;
  }[];
}

interface DropdownNavProps {
  groups: DropdownNavGroup[];
  url?: string;
}

export const DropdownNav: FC<DropdownNavProps> = ({ groups, url }) => {
  const withBase = (url: string) =>
    url === ""
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/${url}`;

  const navGroups = groups.map((group) => ({
    label: group.title,
    items: group.items.map((item) => ({
      id: item.slug,
      breadcrumb: `${group.title} » ${item.label}`,
      label: item.label,
      href: withBase(item.slug),
      isActive: item.slug === url,
    })),
  }));

  const allPages = navGroups.map((group) => group.items).flat();

  const label =
    allPages.find((item) => item.isActive)?.breadcrumb ||
    allPages[0].breadcrumb;

  return <NavDropdownMenu label={label} groups={navGroups} />;
};
