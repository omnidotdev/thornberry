import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

export interface OptionsMenuProps {
  /**
   * Accessible name and tooltip of the trigger, and the menu's heading.
   * Defaults to "Options"
   */
  label?: string;
  /** Show `label` as text beside the icon, not only to screen readers */
  showLabel?: boolean;
  /** Trigger icon. Defaults to a sliders icon */
  icon?: ReactNode;
  /** The menu's settings, typically one or more `OptionsMenuChoice` groups */
  children: ReactNode;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Where the menu opens relative to the trigger. Defaults to "top-end" */
  placement?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  /** Class names for the trigger button */
  className?: string;
  /** Class names for the menu panel */
  contentClassName?: string;
}

/**
 * A small settings menu beside a composer's send button: an icon trigger that
 * opens a popover of secondary choices (a model, a quality level, a format),
 * so the main row keeps only what most people need. Presentational; the host
 * owns the values and persists them.
 */
const OptionsMenu = ({
  label = "Options",
  showLabel = false,
  icon,
  children,
  disabled = false,
  open,
  onOpenChange,
  placement = "top-end",
  className,
  contentClassName,
}: OptionsMenuProps) => (
  <ArkPopover.Root
    open={open}
    onOpenChange={
      onOpenChange ? (details) => onOpenChange(details.open) : undefined
    }
    positioning={{ placement, gutter: 8 }}
    lazyMount
    unmountOnExit
  >
    <ArkPopover.Trigger
      type="button"
      disabled={disabled}
      aria-label={showLabel ? undefined : label}
      title={label}
      className={cn(
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40 data-[state=open]:text-foreground pointer-fine:min-h-8 pointer-fine:min-w-8",
        !showLabel && "px-0",
        className,
      )}
    >
      {icon ?? <SlidersHorizontal className="size-4" aria-hidden="true" />}
      {showLabel && <span>{label}</span>}
    </ArkPopover.Trigger>

    <Portal>
      <ArkPopover.Positioner>
        <ArkPopover.Content
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 flex w-72 flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
            contentClassName,
          )}
        >
          <ArkPopover.Title className="px-1 text-sm font-semibold">
            {label}
          </ArkPopover.Title>
          {children}
        </ArkPopover.Content>
      </ArkPopover.Positioner>
    </Portal>
  </ArkPopover.Root>
);

/** One choice in an `OptionsMenuChoice` */
export interface OptionsMenuOption<T extends string = string> {
  value: T;
  /** A plain name for the choice, e.g. "Balanced" */
  label: string;
  /** One short line on what the choice is good for */
  description?: string;
  /** A small note beside the name, e.g. a relative cost */
  hint?: string;
}

export interface OptionsMenuChoiceProps<T extends string = string> {
  /** The group's heading, e.g. "Quality" */
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: readonly OptionsMenuOption<T>[];
  disabled?: boolean;
  className?: string;
}

/**
 * A single-choice group inside an `OptionsMenu`: one row per option with its
 * plain name, an optional hint, and a one-line description. Arrow keys move
 * between rows, as in any radio group
 */
const OptionsMenuChoice = <T extends string = string>({
  label,
  value,
  onValueChange,
  options,
  disabled = false,
  className,
}: OptionsMenuChoiceProps<T>) => (
  <ArkRadioGroup.Root
    value={value}
    onValueChange={(details) => {
      if (details.value) onValueChange(details.value as T);
    }}
    disabled={disabled}
    className={cn("flex flex-col gap-1", className)}
  >
    <ArkRadioGroup.Label className="text-muted-foreground px-1 text-xs font-medium">
      {label}
    </ArkRadioGroup.Label>

    {options.map((option) => (
      <ArkRadioGroup.Item
        key={option.value}
        value={option.value}
        className="group hover:bg-accent data-[state=checked]:bg-accent flex min-h-11 cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 transition-colors data-disabled:cursor-not-allowed data-disabled:opacity-50"
      >
        <ArkRadioGroup.ItemHiddenInput />
        <ArkRadioGroup.ItemControl className="border-input data-focus-visible:ring-primary data-[state=checked]:border-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors data-focus-visible:ring-2">
          <span className="bg-primary size-2 rounded-full opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
        </ArkRadioGroup.ItemControl>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-2">
            <ArkRadioGroup.ItemText className="text-sm leading-tight font-medium">
              {option.label}
            </ArkRadioGroup.ItemText>
            {option.hint && (
              <span className="text-muted-foreground shrink-0 text-xs">
                {option.hint}
              </span>
            )}
          </span>
          {option.description && (
            <span className="text-muted-foreground text-xs leading-snug">
              {option.description}
            </span>
          )}
        </span>
      </ArkRadioGroup.Item>
    ))}
  </ArkRadioGroup.Root>
);

export { OptionsMenu, OptionsMenuChoice };
