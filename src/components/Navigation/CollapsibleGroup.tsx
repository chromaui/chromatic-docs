import * as Collapsible from "@radix-ui/react-collapsible";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  typography,
  Icon,
  color,
  fontWeight,
  spacing,
} from "@chromatic-com/tetra";
import {
  isNestedTransformedGroup,
  type TransformedItem,
  type TransformedNavGroup,
} from "./types";
import { isChildActive, withBase } from "./nav-utils";

const Trigger = styled(Collapsible.Trigger, {
  shouldForwardProp: (prop) => prop !== "nested",
})<{ nested?: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  gap: 8px;
  ${typography.body14}
  color: ${color.slate600};
  cursor: pointer;

  &[data-state="open"] .icon-wrapper {
    transform: rotate(90deg);
    transform-origin: center;
  }

  ${({ nested }) =>
    nested
      ? css`
          height: ${spacing[8]};
        `
      : css`
          margin-bottom: 8px;
          font-weight: ${fontWeight.semibold};
        `}
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
  position: relative;
  /* Makes the spacing between trigger and content
  visually the same as non-timeline content */
  ${({ isTimeline }) => isTimeline && `margin-top: -6px;`}

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

const Link = styled.a`
  all: unset;
  display: flex;
  gap: 12px;
  align-items: center;
  height: ${spacing[8]};
`;

const ContentItem = styled.div<{ isActive: boolean; isTimeline?: boolean }>`
  ${typography.body14}
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
  const isActive = isHome && item.isHome ? true : withBase(item.id) === url;

  return (
    <Collapsible.Content asChild>
      <Link href={withBase(item.id)}>
        {!!timeline && <Bullet isActive={isActive} />}
        <ContentItem isActive={isActive} isTimeline={!!timeline}>
          {item.label}
        </ContentItem>
      </Link>
    </Collapsible.Content>
  );
};

export const CollapsibleGroup = ({
  group,
  url,
  isHome,
  nested,
}: {
  group: TransformedNavGroup;
  url: string;
  isHome?: boolean;
  nested?: boolean;
  open?: boolean;
}) => {
  const isSomeActive = isChildActive(group, url);

  return (
    <Collapsible.Root defaultOpen={group.defaultOpen || isSomeActive}>
      <Trigger nested={nested}>
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
                <CollapsibleGroup
                  group={item}
                  url={url}
                  isHome={isHome}
                  nested
                />
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
