import * as Collapsible from "@radix-ui/react-collapsible";
import { styled } from "@storybook/theming";
import {
  typography,
  Icon,
  color,
  fontWeight,
  spacing,
  minMd,
} from "@chromaui/tetra";
import type { CollectionEntry } from "astro:content";

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
  width: 14px;
  height: 14px;
  transition: all 0.2s ease-in-out;
  margin-top: -2px;
`;

const ContentWrapper = styled.div<{ isTimeline: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: ${({ isTimeline }) => (isTimeline ? "22px" : "35px")};
  position: relative;

  &:before {
    content: "";
    display: ${({ isTimeline }) => (isTimeline ? "block" : "none")};
    position: absolute;
    top: 12px;
    left: 4px;
    width: 1px;
    height: calc(100% - 24px);
    background-color: ${color.slate300};
    z-index: 0;
  }
`;

const Line = styled.a`
  all: unset;
  display: flex;
  gap: 16px;
  align-items: center;
  min-height: 32px;
`;

const ContentItem = styled.div<{ isActive: boolean }>`
  ${typography.body16}
  color: ${({ isActive }) => (isActive ? color.blue500 : color.slate600)};
  font-weight: ${fontWeight.regular};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${color.slate800};
  }
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

const IntroductionItem = styled.a<{ isActive?: boolean }>`
  all: unset;
  cursor: pointer;
  ${typography.body16}
  color: ${({ isActive }) => (isActive ? color.blue500 : color.slate600)};
  font-weight: ${fontWeight.semibold};
  margin-left: 22px; /* to align with the text 14px icon + 8 px gap */
`;

const SidebarContainer = styled.div`
  display: none;

  ${minMd} {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: ${spacing[6]};
  }
`;

type Item = (
  | CollectionEntry<"overview">
  | CollectionEntry<"getStarted">
  | CollectionEntry<"configuration">
  | CollectionEntry<"modes">
  | CollectionEntry<"snapshot">
  | CollectionEntry<"turbosnap">
  | CollectionEntry<"collaborate">
  | CollectionEntry<"plugins">
  | CollectionEntry<"ci">
  | CollectionEntry<"account">
  | CollectionEntry<"guides">
  | CollectionEntry<"troubleshooting">
) & {
  data: {
    sidebar: {
      label: string;
      order: number;
      hide: boolean;
    };
  };
};

interface SidebarItem {
  title: string;
  items: Item[];
  defaultOpen?: boolean;
  timeline?: boolean;
}

interface SideNavProps {
  url?: string;
  sidebarItems?: SidebarItem[];
}

const withBase = (url: string) =>
  url === "" ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/${url}`;

const homeUrl = withBase("");

export const SideNav = ({ url, sidebarItems }: SideNavProps) => {
  const isHome = url === homeUrl;

  return (
    <SidebarContainer>
      {sidebarItems &&
        sidebarItems.map((group, i) => {
          const isSomeActive = group.items.some(
            (item) => withBase(item.slug) === url,
          );
          return (
            <Collapsible.Root
              defaultOpen={group.defaultOpen || isSomeActive}
              key={i}
            >
              <Trigger>
                <IconWrapper className="icon-wrapper">
                  <Icon name="arrowright" />
                </IconWrapper>
                {group.title}
              </Trigger>
              <ContentWrapper isTimeline={!!group.timeline}>
                {group.items.map((item, j) => {
                  // const isActive = withBase(item.slug) === url;

                  const isActive =
                    isHome && item.data.isHome
                      ? true
                      : withBase(item.slug) === url;

                  return (
                    <Collapsible.Content key={j} asChild>
                      <Line href={withBase(item.slug)}>
                        {!!group.timeline && <Bullet isActive={isActive} />}
                        <ContentItem isActive={isActive}>
                          {item.data.sidebar.label}
                        </ContentItem>
                      </Line>
                    </Collapsible.Content>
                  );
                })}
              </ContentWrapper>
            </Collapsible.Root>
          );
        })}
    </SidebarContainer>
  );
};
