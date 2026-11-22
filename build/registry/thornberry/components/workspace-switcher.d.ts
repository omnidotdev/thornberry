import type { ReactNode } from "react";
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
/**
 * Workspace (organization) switcher, shared across Omni apps.
 *
 * Presentational and data-agnostic: the host app supplies the workspaces, the
 * active id, and the select handler (which may navigate, set a cookie, close a
 * mobile sidebar, etc.). A single-workspace user with no actions sees a static
 * label (no dropdown), or nothing with `hideWhenSingle`. Creating and managing
 * workspaces is delegated to the identity dashboard via `actions`/`manageUrl`.
 */
declare const WorkspaceSwitcher: ({ workspaces, currentWorkspaceId, onSelect, onItemIntent, actions, manageUrl, manageLabel, groupLabel, placeholder, hideWhenSingle, variant, className, }: WorkspaceSwitcherProps) => import("react/jsx-runtime").JSX.Element | null;
export { WorkspaceSwitcher };
