import * as Collapsible from "@radix-ui/react-collapsible";
import { styled } from "@storybook/theming";
import {
  typography,
  Icon,
  color,
  fontWeight,
  spacing,
  minMd,
} from "@chromatic-com/tetra";
import {
  isNestedTransformedGroup,
  type TransformedItem,
  type TransformedNavGroup,
} from "./types";

const Trigger = styled(Collapsible.Trigger)`
  all: unset;
  display: flex;
  align-items: center;
  gap: 8px;
  ${typography.body16}
  color: ${color.slate600};
  font-weight: ${fontWeight.semibold};
  margin-bottom: 8px;

  cursor: pointer;

  &[data-state="open"] .icon-wrapper {
    transform: rotate(90deg);
    transform-origin: center;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  transition: all 0.2s ease-in-out;
`;

const ContentWrapper = styled.div<{ isTimeline: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: ${({ isTimeline }) => (isTimeline ? 12 : 0)}px;
    left: 4px;
    width: 1px;
    height: ${({ isTimeline }) => (isTimeline ? "calc(100% - 24px);" : "100%")};
    background-color: ${color.slate300};
    z-index: 0;
    border-radius: 9999px;
  }
`;

const Line = styled.a`
  all: unset;
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 32px;
`;

const ContentItem = styled.div<{ isActive: boolean; isTimeline?: boolean }>`
  ${typography.body16}
  color: ${({ isActive }) => (isActive ? color.blue500 : color.slate600)};
  font-weight: ${fontWeight.regular};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding-left: ${({ isTimeline }) => (isTimeline ? 0 : 20)}px;

  &:hover {
    color: ${color.slate800};
  }
`;

const NestedContent = styled(Collapsible.Content)`
  padding-left: 20px;
  margin-top: 4px;
`;

const Bullet = styled.div<{ isActive: boolean }>`
  position: relative;
  z-index: 1;
  width: 9px;
  height: 9px;
  background-color: ${({ isActive }) =>
    isActive ? color.blue500 : color.slate300};
  border-radius: 100%;
  box-shadow: white 0px 0px 0px 4px;
`;

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

interface SideNavProps {
  url?: string;
  sidebarGroups?: TransformedNavGroup[];
}

const withBase = (url: string) =>
  url === "" ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/${url}`;

const homeUrl = withBase("");

const CollapsibleItem = ({
  item,
  url,
  timeline,
  isHome,
}: {
  item: TransformedItem;
  url?: string;
  timeline?: boolean;
  isHome?: boolean;
}) => {
  const isActive = isHome && item.isHome ? true : withBase(item.slug) === url;

  return (
    <Collapsible.Content asChild>
      <Line href={withBase(item.slug)}>
        {!!timeline && <Bullet isActive={isActive} />}
        <ContentItem isActive={isActive} isTimeline={!!timeline}>
          {item.label}
        </ContentItem>
      </Line>
    </Collapsible.Content>
  );
};

const CollapsibleGroup = ({
  group,
  url,
  isHome,
}: {
  group: TransformedNavGroup;
  url?: string;
  isHome?: boolean;
}) => {
  const isSomeActive = group.items.some((item) => {
    // TODO: Recursively check nested items
    if (isNestedTransformedGroup(item)) {
      return item.items.some((nestedItem) => withBase(nestedItem.slug) === url);
    } else {
      return withBase(item.slug) === url;
    }
  });

  return (
    <Collapsible.Root defaultOpen={group.defaultOpen || isSomeActive}>
      <Trigger>
        {group.title}
        <IconWrapper className="icon-wrapper">
          <Icon size={10} name="arrowright" />
        </IconWrapper>
      </Trigger>
      <ContentWrapper isTimeline={!!group.timeline}>
        {group.items.map((item, j) => {
          if (isNestedTransformedGroup(item)) {
            return (
              <NestedContent key={j}>
                <CollapsibleGroup group={item} url={url} isHome={isHome} />
              </NestedContent>
            );
          }
          return (
            <CollapsibleItem
              key={j}
              item={item}
              url={url}
              timeline={group.timeline}
              isHome={isHome}
            />
          );
        })}
      </ContentWrapper>
    </Collapsible.Root>
  );
};

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
