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
    <MenuRoot onSelect={(details) => onSelect(details.value)}>
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
        <MenuContent className="min-w-52">
          <MenuItemGroup>
            <MenuItemGroupLabel>{groupLabel}</MenuItemGroupLabel>
            {workspaces.map((workspace) => (
              <MenuItem
                key={workspace.id}
                value={workspace.id}
                className="gap-2"
              >
                <WorkspaceAvatar workspace={workspace} />
                <span className="flex-1 truncate">{workspace.name}</span>
                {workspace.id === currentWorkspaceId && (
                  <Check className="size-4 shrink-0" />
                )}
              </MenuItem>
            ))}
          </MenuItemGroup>

          {manageUrl && (
            <>
              <MenuSeparator />
              <a
                href={manageUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-muted-foreground text-sm hover:bg-accent"
              >
                <ExternalLink className="size-4" />
                {manageLabel}
              </a>
            </>
          )}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export { WorkspaceSwitcher };
