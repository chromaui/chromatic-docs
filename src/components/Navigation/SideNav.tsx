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
  margin-left: 3px;
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

  ${minMd} {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: ${spacing[6]};
  }
`;

type Item = (
  | Omit<CollectionEntry<"overview">, "render" | "body">
  | Omit<CollectionEntry<"storybook">, "render" | "body">
  | Omit<CollectionEntry<"playwright">, "render" | "body">
  | Omit<CollectionEntry<"cypress">, "render" | "body">
  | Omit<CollectionEntry<"configuration">, "render" | "body">
  | Omit<CollectionEntry<"modes">, "render" | "body">
  | Omit<CollectionEntry<"snapshot">, "render" | "body">
  | Omit<CollectionEntry<"snapshotOptions">, "render" | "body">
  | Omit<CollectionEntry<"turbosnap">, "render" | "body">
  | Omit<CollectionEntry<"collaborate">, "render" | "body">
  | Omit<CollectionEntry<"plugins">, "render" | "body">
  | Omit<CollectionEntry<"ci">, "render" | "body">
  | Omit<CollectionEntry<"account">, "render" | "body">
  | Omit<CollectionEntry<"guides">, "render" | "body">
  | Omit<CollectionEntry<"troubleshooting">, "render" | "body">
) & {
  data: {
    sidebar: {
      label: string;
      order: number;
      hide: boolean;
    };
  };
};

export interface SidebarItem {
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
                  const isActive =
                    isHome && item.data.isHome
                      ? true
                      : withBase(item.slug) === url;

                  return (
                    <Collapsible.Content key={j} asChild>
                      <Line href={withBase(item.slug)}>
                        {!!group.timeline && <Bullet isActive={isActive} />}
                        <ContentItem
                          isActive={isActive}
                          isTimeline={!!group.timeline}
                        >
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
