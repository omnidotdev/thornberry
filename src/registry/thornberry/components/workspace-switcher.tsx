import { Check, ChevronsUpDown, ExternalLink } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";
import { Button } from "@/registry/thornberry/components/button";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/thornberry/components/menu";

import type { KeyboardEvent, PointerEvent, ReactNode } from "react";

/** A selectable workspace (Omni organization) in the switcher. */
export interface WorkspaceOption {
  id: string;
  name: string;
  /** The workspace's `@handle`, shown under its name in the list when set. */
  slug?: string | null;
  /** Logo URL, if set; falls back to the name's first letter. */
  logo?: string | null;
  /**
   * Secondary line under the name (e.g. the viewer's role in the workspace).
   * Shown in place of the `@handle` when set.
   */
  description?: string | null;
  /** Short tag beside the name (e.g. "Personal"). */
  badge?: string | null;
}

/** An extra entry below the workspace list (create, browse all, manage). */
export interface WorkspaceSwitcherAction {
  /** Stable key, unique among the actions. */
  id: string;
  label: string;
  /** Leading icon; a lucide icon sized by the menu item. */
  icon?: ReactNode;
  /** Link the entry opens. Without it the entry only calls `onSelect`. */
  href?: string;
  /** Open `href` in a new tab, marked with an external-link icon. */
  external?: boolean;
  /** Called when the entry is chosen (e.g. an in-app navigate). */
  onSelect?: () => void;
}

export interface WorkspaceSwitcherProps {
  /** Workspaces the signed-in user belongs to. */
  workspaces: WorkspaceOption[];
  /**
   * Id of the currently active workspace. When it is missing or not in the
   * list, the trigger shows `placeholder` and still opens the list.
   */
  currentWorkspaceId?: string | null;
  /** Called with the selected workspace id. */
  onSelect: (id: string) => void;
  /**
   * Called when a workspace entry is highlighted by pointer or keyboard,
   * before it is chosen. Use it to preload the workspace's route or data.
   */
  onItemIntent?: (id: string) => void;
  /** Extra entries below the list, in order (create, browse all, ...). */
  actions?: WorkspaceSwitcherAction[];
  /** Optional link to manage workspaces (e.g. the identity dashboard). */
  manageUrl?: string;
  manageLabel?: string;
  groupLabel?: string;
  /** Trigger text when no workspace is active. */
  placeholder?: string;
  /**
   * Render nothing for a user with one workspace (and no actions), instead of
   * a static label.
   */
  hideWhenSingle?: boolean;
  /**
   * Layout: "header" is a compact button (top bars); "sidebar" is a full-width
   * row (nav rails) that shrinks to the avatar in a collapsed icon sidebar.
   * Defaults to "header".
   */
  variant?: "header" | "sidebar";
  className?: string;
}

/** Menu value prefix of action entries, never passed to `onSelect` */
const ACTION_PREFIX = "action:";

/** Menu value of the manage link */
const MANAGE_ID = "manage-workspaces";

/** Workspace avatar: logo if set, else the first letter of the name. */
const WorkspaceAvatar = ({ workspace }: { workspace: WorkspaceOption }) => (
  <AvatarRoot className="size-5 shrink-0 text-xs">
    <AvatarImage src={workspace.logo ?? undefined} alt={workspace.name} />
    <AvatarFallback>{workspace.name?.[0]?.toUpperCase()}</AvatarFallback>
  </AvatarRoot>
);

const WorkspaceBadge = ({ children }: { children: ReactNode }) => (
  <span className="bg-muted text-muted-foreground shrink-0 rounded-sm px-1.5 py-0.5 text-xs leading-none font-medium">
    {children}
  </span>
);

/**
 * Workspace (organization) switcher, shared across Omni apps.
 *
 * Presentational and data-agnostic: the host app supplies the workspaces, the
 * active id, and the select handler (which may navigate, set a cookie, close a
 * mobile sidebar, etc.). A single-workspace user with no actions sees a static
 * label (no dropdown), or nothing with `hideWhenSingle`. Creating and managing
 * workspaces is delegated to the identity dashboard via `actions`/`manageUrl`.
 */
const WorkspaceSwitcher = ({
  workspaces,
  currentWorkspaceId,
  onSelect,
  onItemIntent,
  actions = [],
  manageUrl,
  manageLabel = "Manage workspaces",
  groupLabel = "Workspaces",
  placeholder = "Select workspace",
  hideWhenSingle = false,
  variant = "header",
  className,
}: WorkspaceSwitcherProps) => {
  // Whether the trigger sits in a collapsed icon sidebar, read as it is pressed
  // so the menu opens beside the rail instead of hanging off its narrow width
  const [inCollapsedRail, setInCollapsedRail] = useState(false);

  const current = workspaces.find(
    (workspace) => workspace.id === currentWorkspaceId,
  );

  const entries: WorkspaceSwitcherAction[] = manageUrl
    ? [
        ...actions,
        { id: MANAGE_ID, label: manageLabel, href: manageUrl, external: true },
      ]
    : actions;

  const isSidebar = variant === "sidebar";
  const hasMenu = workspaces.length > 1 || entries.length > 0 || !current;

  if (!workspaces.length && !entries.length) return null;
  if (hideWhenSingle && workspaces.length <= 1 && !entries.length) return null;

  const label = current?.name ?? placeholder;

  const triggerContent = (
    <>
      {current && <WorkspaceAvatar workspace={current} />}
      {/* Visually hidden, not removed, in a collapsed icon sidebar, so the
          trigger keeps its accessible name */}
      <span
        className={cn(
          "truncate",
          isSidebar &&
            "flex-1 font-medium group-data-[collapsible=icon]:sr-only",
          !current && "text-muted-foreground",
        )}
      >
        {label}
      </span>
      {hasMenu && (
        <ChevronsUpDown
          className={cn(
            "size-4 shrink-0 opacity-60",
            // With no avatar to show, the chevron stands in for the trigger
            isSidebar && current && "group-data-[collapsible=icon]:hidden",
          )}
        />
      )}
    </>
  );

  const sidebarTriggerClass = cn(
    "flex w-full items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/60",
    // A collapsed icon sidebar keeps just the avatar
    "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
    className,
  );
  const headerTriggerClass = cn("max-w-44 gap-2", className);

  // Single workspace and nothing else to offer: a static label, no dropdown
  if (!hasMenu) {
    return isSidebar ? (
      <div className={cn(sidebarTriggerClass, "cursor-default")}>
        {triggerContent}
      </div>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className={cn(headerTriggerClass, "cursor-default")}
        aria-disabled
      >
        {triggerContent}
      </Button>
    );
  }

  const handleSelect = (value: string) => {
    if (!value.startsWith(ACTION_PREFIX)) {
      onSelect(value);
      return;
    }
    // Links navigate on their own; only the callback runs here
    const action = entries.find(
      (entry) => `${ACTION_PREFIX}${entry.id}` === value,
    );
    action?.onSelect?.();
  };

  const detectRail = (
    event: PointerEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => {
    setInCollapsedRail(
      !!event.currentTarget.closest("[data-collapsible='icon']"),
    );
  };

  return (
    <MenuRoot
      // In a nav rail the list drops straight down at the row's own width; a
      // collapsed rail opens it to the side
      {...(isSidebar && {
        positioning: inCollapsedRail
          ? { placement: "right-start" }
          : { placement: "bottom-start", sameWidth: true },
      })}
      onSelect={(details) => handleSelect(details.value)}
      {...(onItemIntent && {
        onHighlightChange: ({ highlightedValue }) => {
          if (highlightedValue && !highlightedValue.startsWith(ACTION_PREFIX))
            onItemIntent(highlightedValue);
        },
      })}
    >
      <MenuTrigger
        asChild
        aria-label={`${label}, switch workspace`}
        {...(isSidebar && {
          onPointerDown: detectRail,
          onKeyDown: detectRail,
        })}
      >
        {isSidebar ? (
          <button type="button" className={sidebarTriggerClass}>
            {triggerContent}
          </button>
        ) : (
          <Button variant="outline" size="sm" className={headerTriggerClass}>
            {triggerContent}
          </Button>
        )}
      </MenuTrigger>

      <MenuPositioner>
        <MenuContent
          className={
            isSidebar
              ? // A collapsed rail is too narrow to match, so keep a floor
                cn("w-full min-w-0", inCollapsedRail && "min-w-52")
              : "min-w-52"
          }
        >
          {workspaces.length > 0 && (
            // The list scrolls on its own so the actions stay in view
            <MenuItemGroup className="max-h-80 min-h-0 overflow-y-auto overscroll-contain">
              <MenuItemGroupLabel className="bg-popover sticky top-0 z-10">
                {groupLabel}
              </MenuItemGroupLabel>
              {workspaces.map((workspace) => {
                const subtitle =
                  workspace.description ??
                  (workspace.slug ? `@${workspace.slug}` : null);

                return (
                  <MenuItem
                    key={workspace.id}
                    value={workspace.id}
                    className="gap-2"
                  >
                    <WorkspaceAvatar workspace={workspace} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate">{workspace.name}</span>
                        {workspace.badge && (
                          <WorkspaceBadge>{workspace.badge}</WorkspaceBadge>
                        )}
                      </span>
                      {subtitle && (
                        <span className="text-muted-foreground truncate text-xs">
                          {subtitle}
                        </span>
                      )}
                    </span>
                    {workspace.id === currentWorkspaceId && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </MenuItem>
                );
              })}
            </MenuItemGroup>
          )}

          {entries.length > 0 && (
            <>
              {workspaces.length > 0 && <MenuSeparator />}
              {entries.map((entry) => {
                const value = `${ACTION_PREFIX}${entry.id}`;
                const content = (
                  <>
                    {entry.icon}
                    <span className="flex-1 truncate">{entry.label}</span>
                    {entry.external && entry.icon && (
                      <ExternalLink className="size-3.5 opacity-60" />
                    )}
                  </>
                );

                return entry.href ? (
                  <MenuItem key={entry.id} value={value} asChild>
                    <a
                      href={entry.href}
                      {...(entry.external && {
                        target: "_blank",
                        rel: "noreferrer",
                      })}
                      className="text-muted-foreground"
                    >
                      {entry.external && !entry.icon && (
                        <ExternalLink className="size-4" />
                      )}
                      {content}
                    </a>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={entry.id}
                    value={value}
                    className="text-muted-foreground"
                  >
                    {content}
                  </MenuItem>
                );
              })}
            </>
          )}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export { WorkspaceSwitcher };
