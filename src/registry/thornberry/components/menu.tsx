import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { FiChevronRight } from "react-icons/fi";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const MenuProvider = ArkMenu.RootProvider;
const MenuRoot = ArkMenu.Root;

const MenuTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Trigger>) => (
  <ArkMenu.Trigger
    className={cn("inline-flex items-center justify-center", className)}
    {...rest}
  />
);

const MenuPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Positioner>) => (
  <ArkMenu.Positioner className={cn("", className)} {...rest} />
);

const MenuContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Content>) => (
  <ArkMenu.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const MenuArrow = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Arrow>) => (
  <ArkMenu.Arrow className={cn("fill-popover", className)} {...rest} />
);

const MenuArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ArrowTip>) => (
  <ArkMenu.ArrowTip className={cn("fill-border", className)} {...rest} />
);

const MenuItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.Item>) => (
  <ArkMenu.Item
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.Item>
);

const MenuCheckboxItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.CheckboxItem>) => (
  <ArkMenu.CheckboxItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.CheckboxItem>
);

const MenuItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemGroup>) => (
  <ArkMenu.ItemGroup
    className={cn("overflow-hidden p-1", className)}
    {...rest}
  />
);

const MenuItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemGroupLabel>) => (
  <ArkMenu.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-semibold text-muted-foreground text-xs",
      className,
    )}
    {...rest}
  />
);

const MenuItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemText>) => (
  <ArkMenu.ItemText className={cn("", className)} {...rest} />
);

const MenuItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.ItemIndicator>) => (
  <ArkMenu.ItemIndicator
    className={cn("flex h-3.5 w-3.5 items-center justify-center", className)}
    {...rest}
  />
);

const MenuRadioItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.RadioItem>) => (
  <ArkMenu.RadioItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkMenu.RadioItem>
);

const MenuRadioItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.RadioItemGroup>) => (
  <ArkMenu.RadioItemGroup className={cn("", className)} {...rest} />
);

const MenuSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMenu.Separator>) => (
  <ArkMenu.Separator
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...rest}
  />
);

const MenuTriggerItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkMenu.TriggerItem>) => (
  <ArkMenu.TriggerItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
    <FiChevronRight className="ml-auto h-4 w-4" />
  </ArkMenu.TriggerItem>
);

export {
  MenuArrow,
  MenuArrowTip,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuItemText,
  MenuItemIndicator,
  MenuPositioner,
  MenuProvider,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
};
