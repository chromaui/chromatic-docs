import { DropdownMenu } from "./DropdownMenu";
import { styled } from "@storybook/theming";
import { minMd } from "@chromatic-com/tetra";
import type { TransformedNavGroup, TransformedItem } from "../types";
import { withBase } from "../nav-utils";

const NavDropdownMenu = styled(DropdownMenu)`
  ${minMd} {
    display: none;
  }
`;

interface CompactNavProps {
  groups: TransformedNavGroup[];
  flatItems: TransformedItem[];
  url: string;
}

export const CompactNav = ({ groups, flatItems, url }: CompactNavProps) => {
  const activeItem =
    flatItems.find((item) => withBase(item.slug) === url) || flatItems[0];

  const label = `Docs » ${activeItem.breadcrumb}`;

  return <NavDropdownMenu label={label} groups={groups} url={url} />;
};
