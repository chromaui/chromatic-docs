import type { FC } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { styled } from "@storybook/theming";
import { typography, Icon, color, fontWeight } from "@chromaui/tetra";
import type { CollectionEntry } from "astro:content";

interface SidebarProps {
  url?: string;
  sidebar?: {
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
  display: none;

  @media (min-width: 800px) {
    display: flex;
    flex-direction: column;
    width: 240px;
    flex-shrink: 0;
    gap: 24px;
  }
`;

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
  height: 34px;
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

export const Sidebar: FC<SidebarProps> = ({ url, sidebar }) => {
  const sidebarItems = sidebar
    ? sidebar.map((group) => ({
        ...group,
        items: group.items
          .map((item) => ({
            ...item,
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
              : 0
          ),
      }))
    : [];

  return (
    <Container>
      {sidebarItems &&
        sidebarItems.map((group, i) => {
          const isSomeActive = group.items.some((item) => item.slug === url);

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
                  const isHome = url?.length === 0;
                  const isActive =
                    isHome && item.slug === "introduction"
                      ? true
                      : item.slug === url;
                  return (
                    <Collapsible.Content key={j} asChild>
                      <Line href={item.slug}>
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
    </Container>
  );
};
