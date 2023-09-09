import React from "react";
import type { FC } from "react";
import { css, styled } from "@storybook/theming";
import * as Popover from "@radix-ui/react-popover";
import { color, fontWeight, spacing, typography } from "@chromaui/tetra";

export const buttonStyles = css`
  all: unset;
  padding: 0 ${spacing[2]};
  outline: none;
  user-select: none;
  border-radius: 4px;
  border: none;
  height: ${spacing[8]};
  line-height: ${spacing[8]};
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
  ${typography.body14}
  font-weight: ${fontWeight.bold};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:focus {
    box-shadow: 0 0 0 2px rgba(30, 167, 253, 0.3);
    background-color: rgba(30, 167, 253, 0.14);
  }

  &:hover {
    background-color: rgba(30, 167, 253, 0.14);
    color: ${color.blue500};
  }
`;

const TriggerButton = styled(Popover.Trigger, {
  shouldForwardProp: (propName) =>
    propName !== "variant" && propName !== "isActive",
})<{
  variant?: "light" | "dark";
  isActive?: boolean;
}>`
  ${buttonStyles}
  background-color: ${({ isActive }) => isActive && "rgba(30, 167, 253, 0.07)"};
  color: ${({ isActive, variant }) => {
    if (isActive) return color.blue500;
    if (variant === "light") return color.slate500;
    return color.white;
  }};

  &[data-state="open"] {
    background-color: rgba(30, 167, 253, 0.14);
    color: ${color.blue500};
  }

  &[data-state="open"] > .CaretDown {
    transform: rotate(-180deg) translateY(0px);
  }
`;

interface DropdownTriggerProps {
  variant?: "light" | "dark";
  children?: React.ReactNode;
}

export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  children,
  variant = "light",
}) => {
  return (
    <>
      <TriggerButton variant={variant}>{children}</TriggerButton>
    </>
  );
};
