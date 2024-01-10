import type { ElementType, FC } from "react";
import { styled } from "@storybook/theming";
import * as Popover from "@radix-ui/react-popover";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  typography,
  color,
  spacing,
  minSm,
  fontWeight,
  minMd,
} from "@chromaui/tetra";
import { DropdownTrigger } from "./DropdownTrigger";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const NavigationMenu = styled(motion.div)`
  position: relative;
  background-color: ${color.white};
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  border-radius: 6px;
  margin-top: ${spacing[2]};
  min-width: calc(100vw - 32px);
  margin-left: ${spacing[4]};
  margin-right: ${spacing[4]};
  padding: 12px;
  z-index: 100;

  ${minSm} {
    margin-right: ${spacing[12]};
    min-width: 320px;
  }
`;

const DropdownGroup = styled.div``;

const DropdownMenuLabel = styled(RadixDropdownMenu.Label)`
  height: ${spacing[8]};
  padding: ${spacing[2]};
  ${typography.subheading}
  color: ${color.slate500};
`;

const DropdownMenuLink = styled.a`
  ${typography.body14};
  font-weight: ${fontWeight.bold};
  line-height: ${spacing[8]};
  height: ${spacing[8]};
  color: ${color.slate800};
  display: block;
  text-decoration: none;
  padding: 0 ${spacing[2]};
  border-radius: 4px;

  &:focus {
    box-shadow: 0 0 0 2px rgba(30, 167, 253, 0.3);
    outline: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${color.slate300};
  margin: ${spacing[4]} ${spacing[2]};
  width: calc(100% - ${spacing[4]});
`;

const NavMenuDropdownTrigger = styled(DropdownTrigger)`
  ${minMd} {
    display: none;
  }
`;

interface MenuItem {
  id: string;
  label: string;
  LinkWrapper?: ElementType;
  href: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface DropdownMenuProps {
  variant?: "light" | "dark";
  label: string;
  groups: MenuGroup[];
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  label,
  variant,
  groups,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <Popover.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <NavMenuDropdownTrigger {...props}>{label}</NavMenuDropdownTrigger>
      <AnimatePresence>
        {mobileMenuOpen && (
          <Popover.Portal forceMount>
            <Popover.Content
              asChild
              aria-label="Docs Menu"
              onOpenAutoFocus={(e: Event) => e.preventDefault()}
            >
              <NavigationMenu
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ ease: "easeOut", duration: 0.14 }}
              >
                {groups.map((group, index) => (
                  <DropdownGroup key={group.label}>
                    <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                    {group.items.map((item) => (
                      <DropdownMenuLink key={item.id} href={item.href}>
                        {item.label}
                      </DropdownMenuLink>
                    ))}
                    {index < groups.length - 1 && <Divider />}
                  </DropdownGroup>
                ))}
              </NavigationMenu>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
