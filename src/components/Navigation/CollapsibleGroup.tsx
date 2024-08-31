import * as Collapsible from "@radix-ui/react-collapsible";
import { styled } from "@storybook/theming";
import { typography, Icon, color, fontWeight } from "@chromatic-com/tetra";
import {
  isNestedTransformedGroup,
  type TransformedItem,
  type TransformedNavGroup,
} from "./types";

const Trigger = styled(Collapsible.Trigger, {
  shouldForwardProp: (prop) => prop !== "nested",
})<{ nested?: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  gap: 8px;
  ${typography.body16}
  color: ${color.slate600};
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  ${({ nested }) => !nested && `margin-bottom: 8px`}

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

const withBase = (url: string) =>
  url === "" ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/${url}`;

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

function isUrlActive(slug: string, url: string) {
  return withBase(slug) === url;
}

function checkIfSomeActive(group: TransformedNavGroup, url: string): boolean {
  return group.items.some((item) => {
    if (isNestedTransformedGroup(item)) {
      return item.items.some((nestedItem) => {
        if (isNestedTransformedGroup(nestedItem)) {
          return checkIfSomeActive(nestedItem, url);
        } else {
          return isUrlActive(nestedItem.slug, url);
        }
      });
    } else {
      return isUrlActive(item.slug, url);
    }
  });
}

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
  const isSomeActive = checkIfSomeActive(group, url);

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
