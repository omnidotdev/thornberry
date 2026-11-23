import { useState } from "react";

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/registry/thornberry/components/dialog";
import { Kbd } from "@/registry/thornberry/components/kbd";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
  useHotkeys,
} from "@/registry/thornberry/components/use-hotkeys";

type GlobalHotkey = keyof typeof GLOBAL_HOTKEYS;

interface Shortcut {
  /** `react-hotkeys-hook` binding, e.g. `mod+k` or `shift+slash` */
  keys: string;
  /** What the shortcut does */
  label: string;
}

interface ShortcutGroup {
  title: string;
  /** Hint shown beside the heading (e.g. "Hover a card, then press:") */
  hint?: string;
  shortcuts: Shortcut[];
}

/** How each global hotkey reads in the list, in display order */
const GLOBAL_LABELS: Record<GlobalHotkey, string> = {
  commandPalette: "Open command palette",
  showShortcuts: "Show keyboard shortcuts",
  toggleSidebar: "Toggle sidebar",
  toggleTheme: "Toggle light/dark theme",
};

interface ShortcutsDialogProps {
  /**
   * Global hotkeys the app binds, listed first under "General". Defaults to
   * every one except `toggleSidebar`; include it when the app has a sidebar.
   */
  globals?: GlobalHotkey[];
  /** App-wide shortcuts appended to the "General" group */
  general?: Shortcut[];
  /** Product shortcut groups, listed after "General" */
  groups?: ShortcutGroup[];
  /** Controlled open state, e.g. to open the list from the command palette */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_GLOBALS: GlobalHotkey[] = [
  "commandPalette",
  "showShortcuts",
  "toggleTheme",
];

/**
 * Keyboard shortcuts list, opened with `?` (`GLOBAL_HOTKEYS.showShortcuts`).
 * Mount once in the app root, next to the command palette, and pass the
 * product's own shortcuts so every key the app binds is discoverable in one
 * place. Labels render with {@link hotkeyLabel}, so they match the platform.
 */
const ShortcutsDialog = ({
  globals = DEFAULT_GLOBALS,
  general = [],
  groups = [],
  open: openProp,
  onOpenChange,
}: ShortcutsDialogProps) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  useHotkeys(GLOBAL_HOTKEYS.showShortcuts, () => setOpen(!open), [open]);

  const ordered = (Object.keys(GLOBAL_LABELS) as GlobalHotkey[]).filter((key) =>
    globals.includes(key),
  );

  const allGroups: ShortcutGroup[] = [
    {
      title: "General",
      shortcuts: [
        ...ordered.map((key) => ({
          keys: GLOBAL_HOTKEYS[key],
          label: GLOBAL_LABELS[key],
        })),
        ...general,
      ],
    },
    ...groups,
  ];

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      lazyMount
      unmountOnExit
    >
      <DialogPortal>
        <DialogBackdrop />

        <DialogPositioner>
          <DialogContent className="max-h-full overflow-y-auto">
            <DialogCloseTrigger />

            <div className="flex flex-col gap-1.5">
              <DialogTitle>Keyboard shortcuts</DialogTitle>
              <DialogDescription>
                Press <Kbd>{hotkeyLabel(GLOBAL_HOTKEYS.showShortcuts)}</Kbd>{" "}
                anytime to open this list.
              </DialogDescription>
            </div>

            <div className="flex flex-col gap-5">
              {allGroups
                .filter((group) => group.shortcuts.length > 0)
                .map((group) => (
                  <section key={group.title} className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-foreground text-sm font-medium">
                        {group.title}
                      </h3>
                      {group.hint && (
                        <span className="text-muted-foreground text-xs">
                          {group.hint}
                        </span>
                      )}
                    </div>

                    <ul className="divide-border flex flex-col divide-y">
                      {group.shortcuts.map((shortcut) => (
                        <li
                          key={`${shortcut.keys}-${shortcut.label}`}
                          className="flex items-center justify-between gap-4 py-1.5"
                        >
                          <span className="text-muted-foreground text-sm">
                            {shortcut.label}
                          </span>
                          <Kbd>{hotkeyLabel(shortcut.keys)}</Kbd>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

export { type Shortcut, type ShortcutGroup, ShortcutsDialog };
