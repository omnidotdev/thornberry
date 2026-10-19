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
}
/**
 * Workspace (organization) switcher, shared across Omni apps.
 *
 * Presentational and data-agnostic: the host app supplies the workspaces,
 * the active id, and the select handler. Creating and managing workspaces is
 * delegated to the identity dashboard via `manageUrl`.
 */
declare const WorkspaceSwitcher: ({ workspaces, currentWorkspaceId, onSelect, manageUrl, manageLabel, groupLabel, }: WorkspaceSwitcherProps) => import("react/jsx-runtime").JSX.Element | null;
export { WorkspaceSwitcher };
