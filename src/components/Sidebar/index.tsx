import type { FC } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { sidebarData } from "./sidebarData";
import { styled } from "@storybook/theming";
import { typography, Icon, color, fontWeight } from "@chromaui/tetra";

interface SidebarProps {
  url?: string;
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  flex-shrink: 0;
  gap: 24px;
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

export const Sidebar: FC<SidebarProps> = ({ url }) => {
  return (
    <Content>
      {sidebarData.map((group, i) => (
        <Collapsible.Root defaultOpen={group.defaultOpen} key={i}>
          <Trigger>
            <IconWrapper className="icon-wrapper">
              <Icon name="arrowright" />
            </IconWrapper>
            {group.title}
          </Trigger>
          <ContentWrapper isTimeline={!!group.timeline}>
            {group.items.map((item, j) => {
              const isActive = item.url === url;
              return (
                <Collapsible.Content key={j} asChild>
                  <Line href={item.url}>
                    {!!group.timeline && <Bullet isActive={isActive} />}
                    <ContentItem isActive={isActive}>{item.title}</ContentItem>
                  </Line>
                </Collapsible.Content>
              );
            })}
          </ContentWrapper>
        </Collapsible.Root>
      ))}
    </Content>
  );
};
