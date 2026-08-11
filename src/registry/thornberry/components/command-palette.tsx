import { Fragment, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/thornberry/components/command";
import { Kbd } from "@/registry/thornberry/components/kbd";

import type { ComponentType } from "react";

/** Window event any UI can dispatch to open the shared command palette. */
export const OPEN_COMMAND_PALETTE_EVENT = "open-command-palette";

/**
 * Dispatch the open event so a trigger anywhere (a header button, an empty
 * state) can open the palette without threading its state through the layout.
 */
export const openCommandPalette = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT));
  }
};

/** A single selectable action in the palette. */
export interface CommandAction {
  /** Stable identifier. */
  id: string;
  /** Visible label. */
  label: string;
  /** Group heading this action is listed under. Ungrouped actions list first. */
  group?: string;
  /** Optional leading icon. */
  icon?: ComponentType<{ className?: string }>;
  /** Extra terms to match against beyond the label. */
  keywords?: string[];
  /** Shortcut hint rendered as a trailing chip (display only, not bound here). */
  shortcut?: string;
  /** Invoked when the action is selected. The palette closes first. */
  onSelect: () => void;
}

export interface CommandPaletteProps {
  /** Actions to list, grouped by `group` in first-seen order. */
  commands: CommandAction[];
  /** Input placeholder. */
  placeholder?: string;
  /** Empty-state text. */
  emptyMessage?: string;
  /** Shortcut that toggles the palette. Defaults to `mod+k`. */
  triggerKey?: string;
  /** Controlled open state. Omit for self-managed (uncontrolled) mode. */
  open?: boolean;
  /** Open-state change handler (pair with `open` for controlled mode). */
  onOpenChange?: (open: boolean) => void;
}

interface CommandGroupModel {
  name: string;
  items: CommandAction[];
}

/**
 * Opinionated command palette shared across Omni apps. Owns the global toggle
 * shortcut (defaults to `mod+k`) and an `open-command-palette` window event (so
 * any trigger can open it via {@link openCommandPalette}), then renders grouped,
 * fuzzy-searchable actions on the shared cmdk primitives. Apps supply only their
 * own {@link CommandAction} list, keeping the palette identical product to
 * product. Mount it once near the app root.
 */
const CommandPalette = ({
  commands,
  placeholder = "Search commands...",
  emptyMessage = "No results found.",
  triggerKey = "mod+k",
  open: openProp,
  onOpenChange,
}: CommandPaletteProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useHotkeys(triggerKey, () => setOpen(!open), {
    enableOnFormTags: true,
    preventDefault: true,
  });

  // A visible trigger dispatches the open event so buttons anywhere can open the
  // palette without the layout owning its state.
  useEffect(() => {
    const onOpen = () => {
      if (!isControlled) setInternalOpen(true);
      onOpenChange?.(true);
    };
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
  }, [isControlled, onOpenChange]);

  // Preserve first-seen order while collecting actions into their groups.
  const groups: CommandGroupModel[] = [];
  for (const command of commands) {
    const name = command.group ?? "";
    let group = groups.find((g) => g.name === name);
    if (!group) {
      group = { name, items: [] };
      groups.push(group);
    }
    group.items.push(command);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {groups.map((group, index) => (
          <Fragment key={group.name || "__ungrouped"}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.name || undefined}>
              {group.items.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.id}
                    value={`${command.label} ${command.keywords?.join(" ") ?? ""}`}
                    onSelect={() => {
                      setOpen(false);
                      command.onSelect();
                    }}
                  >
                    {Icon && <Icon className="size-4" />}
                    <span className="flex-1 truncate">{command.label}</span>
                    {command.shortcut && (
                      <CommandShortcut>
                        <Kbd>{command.shortcut}</Kbd>
                      </CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export { CommandPalette };
