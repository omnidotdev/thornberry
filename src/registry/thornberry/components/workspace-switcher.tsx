import { Check, ChevronsUpDown, ExternalLink } from "lucide-react";

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

/** A selectable workspace (Omni organization) in the switcher. */
export interface WorkspaceOption {
  id: string;
  name: string;
  /** The workspace's `@handle`, shown under its name in the list when set. */
  slug?: string | null;
  /** Logo URL, if set; falls back to the name's first letter. */
  logo?: string | null;
}

export interface WorkspaceSwitcherProps {
  /** Workspaces the signed-in user belongs to. */
  workspaces: WorkspaceOption[];
  /** Id of the currently active workspace. */
  currentWorkspaceId: string;
  /** Called with the selected workspace id. */
  onSelect: (id: string) => void;
  /** Optional link to manage workspaces (e.g. the identity dashboard). */
  manageUrl?: string;
  manageLabel?: string;
  groupLabel?: string;
  /**
   * Layout: "header" is a compact button (top bars); "sidebar" is a full-width
   * row (nav rails). Defaults to "header".
   */
  variant?: "header" | "sidebar";
}

/** Menu value of the manage link, never passed to `onSelect` */
const MANAGE_VALUE = "manage-workspaces";

/** Workspace avatar: logo if set, else the first letter of the name. */
const WorkspaceAvatar = ({ workspace }: { workspace: WorkspaceOption }) => (
  <AvatarRoot className="size-5 shrink-0 text-xs">
    <AvatarImage src={workspace.logo ?? undefined} alt={workspace.name} />
    <AvatarFallback>{workspace.name?.[0]?.toUpperCase()}</AvatarFallback>
  </AvatarRoot>
);

/**
 * Workspace (organization) switcher, shared across Omni apps.
 *
 * Presentational and data-agnostic: the host app supplies the workspaces, the
 * active id, and the select handler (which may navigate, set a cookie, etc.).
 * A single-workspace user sees a static label (no dropdown). Creating and
 * managing workspaces is delegated to the identity dashboard via `manageUrl`.
 */
const WorkspaceSwitcher = ({
  workspaces,
  currentWorkspaceId,
  onSelect,
  manageUrl,
  manageLabel = "Manage workspaces",
  groupLabel = "Workspaces",
  variant = "header",
}: WorkspaceSwitcherProps) => {
  const current = workspaces.find(
    (workspace) => workspace.id === currentWorkspaceId,
  );
  if (!current) return null;

  const isSidebar = variant === "sidebar";
  const hasMultiple = workspaces.length > 1;

  const triggerContent = (
    <>
      <WorkspaceAvatar workspace={current} />
      <span className={`truncate ${isSidebar ? "flex-1 font-medium" : ""}`}>
        {current.name}
      </span>
      {hasMultiple && <ChevronsUpDown className="size-4 shrink-0 opacity-60" />}
    </>
  );

  const sidebarTriggerClass =
    "flex w-full items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/60";

  // Single workspace: a static label, no dropdown
  if (!hasMultiple) {
    return isSidebar ? (
      <div className={`${sidebarTriggerClass} cursor-default`}>
        {triggerContent}
      </div>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="max-w-44 cursor-default gap-2"
        aria-disabled
      >
        {triggerContent}
      </Button>
    );
  }

  return (
    <MenuRoot
      // In a nav rail the list drops straight down at the row's own width
      {...(isSidebar && {
        positioning: { placement: "bottom-start", sameWidth: true },
      })}
      onSelect={(details) => {
        // The manage link navigates on its own; only workspaces are selected
        if (details.value !== MANAGE_VALUE) onSelect(details.value);
      }}
    >
      <MenuTrigger asChild>
        {isSidebar ? (
          <button type="button" className={sidebarTriggerClass}>
            {triggerContent}
          </button>
        ) : (
          <Button variant="outline" size="sm" className="max-w-44 gap-2">
            {triggerContent}
          </Button>
        )}
      </MenuTrigger>

      <MenuPositioner>
        <MenuContent className={isSidebar ? "w-full min-w-0" : "min-w-52"}>
          {/* The list scrolls on its own so the manage link stays in view */}
          <MenuItemGroup className="max-h-80 min-h-0 overflow-y-auto overscroll-contain">
            <MenuItemGroupLabel className="bg-popover sticky top-0 z-10">
              {groupLabel}
            </MenuItemGroupLabel>
            {workspaces.map((workspace) => (
              <MenuItem
                key={workspace.id}
                value={workspace.id}
                className="gap-2"
              >
                <WorkspaceAvatar workspace={workspace} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{workspace.name}</span>
                  {workspace.slug && (
                    <span className="text-muted-foreground truncate text-xs">
                      @{workspace.slug}
                    </span>
                  )}
                </span>
                {workspace.id === currentWorkspaceId && (
                  <Check className="size-4 shrink-0" />
                )}
              </MenuItem>
            ))}
          </MenuItemGroup>

          {manageUrl && (
            <>
              <MenuSeparator />
              <MenuItem value={MANAGE_VALUE} asChild>
                <a
                  href={manageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground"
                >
                  <ExternalLink className="size-4" />
                  {manageLabel}
                </a>
              </MenuItem>
            </>
          )}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export { WorkspaceSwitcher };
