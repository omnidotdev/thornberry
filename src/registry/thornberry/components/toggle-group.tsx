import { ToggleGroup as ArkToggleGroup } from "@ark-ui/react/toggle-group";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/registry/thornberry/components/toggle";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

type ToggleGroupVariantProps = VariantProps<typeof toggleVariants>;

// Lets items inherit the variant and size set once on the root
const ToggleGroupStyleContext = createContext<ToggleGroupVariantProps>({});

const ToggleGroupProvider = ArkToggleGroup.RootProvider;
const ToggleGroupContext = ArkToggleGroup.Context;

/**
 * A set of toggle buttons. Single selection by default; pass `multiple` to
 * allow several items on at once. `value` is always an array of item values.
 * `variant` and `size` set here apply to every item unless an item overrides
 * them.
 */
const ToggleGroupRoot = ({
  className,
  variant,
  size,
  ...rest
}: ComponentProps<typeof ArkToggleGroup.Root> & ToggleGroupVariantProps) => (
  <ToggleGroupStyleContext.Provider value={{ variant, size }}>
    <ArkToggleGroup.Root
      className={cn(
        "inline-flex w-fit items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className,
      )}
      {...rest}
    />
  </ToggleGroupStyleContext.Provider>
);

const ToggleGroupItem = ({
  className,
  variant,
  size,
  ...rest
}: ComponentProps<typeof ArkToggleGroup.Item> & ToggleGroupVariantProps) => {
  const inherited = useContext(ToggleGroupStyleContext);

  return (
    <ArkToggleGroup.Item
      className={cn(
        toggleVariants({
          variant: variant ?? inherited.variant,
          size: size ?? inherited.size,
        }),
        className,
      )}
      {...rest}
    />
  );
};

export {
  ToggleGroupContext,
  ToggleGroupItem,
  ToggleGroupProvider,
  ToggleGroupRoot,
};
