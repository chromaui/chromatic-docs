import { styled } from "@storybook/theming";
import { spacing, minMd } from "@chromatic-com/tetra";
import { type TransformedNavGroup } from "../types";
import { CollapsibleGroup } from "../CollapsibleGroup";

const SidebarContainer = styled.div`
  display: none;
  width: 100%;
  padding: 0 ${spacing[8]} 0 ${spacing[2]};

  ${minMd} {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: ${spacing[6]};
  }
`;

const withBase = (url: string) =>
  url === "" ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/${url}`;

const homeUrl = withBase("");

interface SideNavProps {
  url: string;
  sidebarGroups?: TransformedNavGroup[];
}

export const SideNav = ({ url, sidebarGroups }: SideNavProps) => {
  const isHome = url === homeUrl;

  return (
    <SidebarContainer>
      {sidebarGroups &&
        sidebarGroups.map((group, i) => {
          return (
            <CollapsibleGroup key={i} group={group} url={url} isHome={isHome} />
          );
        })}
    </SidebarContainer>
  );
};
