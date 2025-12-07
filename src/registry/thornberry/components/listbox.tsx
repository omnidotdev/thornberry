import {
  Listbox as ArkListbox,
  createListCollection,
} from "@ark-ui/react/listbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ListboxRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.Root>) => (
  <ArkListbox.Root className={cn("", className)} {...rest} />
);

const ListboxLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.Label>) => (
  <ArkListbox.Label
    className={cn("font-medium text-sm leading-none", className)}
    {...rest}
  />
);

const ListboxContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.Content>) => (
  <ArkListbox.Content
    className={cn(
      "w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      className,
    )}
    {...rest}
  />
);

const ListboxItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.Item>) => (
  <ArkListbox.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...rest}
  />
);

const ListboxItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.ItemText>) => (
  <ArkListbox.ItemText className={cn("flex-1", className)} {...rest} />
);

const ListboxItemIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkListbox.ItemIndicator>) => (
  <ArkListbox.ItemIndicator
    className={cn("flex h-4 w-4 items-center justify-center", className)}
    {...rest}
  >
    {children || <Check className="h-4 w-4" />}
  </ArkListbox.ItemIndicator>
);

const ListboxItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.ItemGroup>) => (
  <ArkListbox.ItemGroup className={cn("", className)} {...rest} />
);

const ListboxItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.ItemGroupLabel>) => (
  <ArkListbox.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-semibold text-muted-foreground text-sm",
      className,
    )}
    {...rest}
  />
);

const ListboxEmpty = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.Empty>) => (
  <ArkListbox.Empty
    className={cn(
      "px-2 py-3 text-center text-muted-foreground text-sm",
      className,
    )}
    {...rest}
  />
);

const ListboxInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.Input>) => (
  <ArkListbox.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const ListboxValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkListbox.ValueText>) => (
  <ArkListbox.ValueText className={cn("", className)} {...rest} />
);

export {
  ListboxRoot,
  ListboxLabel,
  ListboxContent,
  ListboxItem,
  ListboxItemText,
  ListboxItemIndicator,
  ListboxItemGroup,
  ListboxItemGroupLabel,
  ListboxEmpty,
  ListboxInput,
  ListboxValueText,
  createListCollection,
};
