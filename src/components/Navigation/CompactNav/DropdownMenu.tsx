import styled from "@emotion/styled";
import * as Popover from "@radix-ui/react-popover";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  typography,
  color,
  spacing,
  minSm,
  fontWeight,
  minMd,
  VStack,
} from "@chromatic-com/tetra";
import { DropdownTrigger } from "./DropdownTrigger";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import type { TransformedNavGroup } from "../types";
import { CollapsibleGroup } from "../CollapsibleGroup";

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
  padding: ${spacing[6]};
  z-index: 100;

  ${minSm} {
    margin-right: ${spacing[12]};
    min-width: 560px;
  }
`;

const NavMenuDropdownTrigger = styled(DropdownTrigger)`
  ${minMd} {
    display: none;
  }
`;

interface DropdownMenuProps {
  variant?: "light" | "dark";
  label: string;
  groups: TransformedNavGroup[];
  url: string;
}

const PopoverContent = styled(Popover.Content)`
  margin: 1rem;
  max-height: 75vh;
  overflow: scroll;
`;

export const DropdownMenu = ({
  label,
  variant,
  groups,
  url,
  ...props
}: DropdownMenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <Popover.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} modal>
      <NavMenuDropdownTrigger {...props}>{label}</NavMenuDropdownTrigger>
      <AnimatePresence>
        {mobileMenuOpen && (
          <Popover.Portal forceMount>
            <PopoverContent
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
                <VStack gap={4}>
                  {groups.map((group) => (
                    <CollapsibleGroup
                      key={group.title}
                      group={group}
                      url={url}
                    />
                  ))}
                </VStack>
              </NavigationMenu>
            </PopoverContent>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
