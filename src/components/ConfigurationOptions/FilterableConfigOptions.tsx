import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  Icon,
} from "@chromatic-com/tetra";
import { ConfigOption } from "./ConfigOption";
import type {
  ConfigOption as ConfigOptionType,
  SupportedType,
} from "../../../chromatic-config/generate-schema";
import { useMemo, useState } from "react";

interface FilterableConfigOptionsProps {
  options: ConfigOptionType[];
}

type Filters = {
  [key in SupportedType]: boolean;
};

export const FilterableConfigOptions = ({
  options,
}: FilterableConfigOptionsProps) => {
  const [filters, setFilters] = useState<Filters>({
    CLI: true,
    "Github Action": true,
    "Config File": true,
  });

  const filteredOptions = useMemo(() => {
    const activeFilters = Object.keys(filters).filter(
      (filter) => filters[filter as SupportedType],
    );
    const filteredOptions = options.filter((option) =>
      option.supports.some((support) => activeFilters.includes(support)),
    );
    return filteredOptions;
  }, [filters, options]);

  return (
    <>
      <p>
        <DropdownMenu
          label={
            <>
              Filter based on platform
              <Icon name="filter" aria-hidden size={12} />
            </>
          }
        >
          <DropdownMenuCheckboxItem
            checked={filters["CLI"]}
            onCheckedChange={(checked: boolean) =>
              setFilters({ ...filters, CLI: checked })
            }
          >
            CLI
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters["Github Action"]}
            onCheckedChange={(checked: boolean) =>
              setFilters({ ...filters, "Github Action": checked })
            }
          >
            Github Action
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters["Config File"]}
            onCheckedChange={(checked: boolean) =>
              setFilters({ ...filters, "Config File": checked })
            }
          >
            Config File
          </DropdownMenuCheckboxItem>
        </DropdownMenu>
      </p>
      {filteredOptions.map((option) => (
        <ConfigOption {...option} />
      ))}
    </>
  );
};
