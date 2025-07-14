import { DropdownMenu } from "./DropdownMenu";
import styled from "@emotion/styled";
import { minMd } from "@chromatic-com/tetra";
import type { TransformedNavGroup, TransformedItem } from "../types";

const NavDropdownMenu = styled(DropdownMenu)`
  ${minMd} {
    display: none;
  }
`;

interface CompactNavProps {
  groups: TransformedNavGroup[];
  activeItem: TransformedItem;
  url: string;
}

export const CompactNav = ({ groups, activeItem, url }: CompactNavProps) => {
  const label = `Docs » ${activeItem.breadcrumb}`;

  return <NavDropdownMenu label={label} groups={groups} url={url} />;
};
