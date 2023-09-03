import type { FC } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { sidebarData } from "./sidebarData";
import { styled } from "@storybook/theming";
import { typography, Icon, color, fontWeight } from "@chromaui/tetra";

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 35px;
`;

const ContentItem = styled.div`
  ${typography.body16}
  color: ${color.slate600};
  font-weight: ${fontWeight.regular};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${color.slate800};
  }
`;

export const Sidebar: FC = () => {
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
          <ContentWrapper>
            {group.items.map((item, j) => (
              <Collapsible.Content key={j} asChild>
                <ContentItem>{item.title}</ContentItem>
              </Collapsible.Content>
            ))}
          </ContentWrapper>
        </Collapsible.Root>
      ))}
    </Content>
  );
};
