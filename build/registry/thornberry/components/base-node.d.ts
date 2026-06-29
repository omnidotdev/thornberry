import type { Node, NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { NodeTheme, NodeThemeKey } from "../../../registry/thornberry/lib/node-themes";
/**
 * Standard node dimensions for consistent canvas layout. The width is an
 * even multiple of the default grid size for clean center alignment.
 */
export declare const NODE_WIDTH = 300;
export declare const NODE_MIN_HEIGHT = 120;
/** Connection handle configuration */
interface NodeHandleConfig {
    type: "source" | "target";
    position: Position;
    id?: string;
    className?: string;
    style?: CSSProperties;
}
/**
 * Node data shape consumed by the `base` node type. React Flow supplies
 * `selected` on the node props, so it is not part of the data payload.
 * Consumers add nodes as `{ type: "base", data: { theme, label, ... } }`.
 */
export interface BaseNodeData {
    /** Theme key or fully custom theme object */
    theme: NodeThemeKey | NodeTheme;
    /** Optional icon rendered in the header badge */
    icon?: LucideIcon;
    /** Node title */
    label: string;
    /** Optional secondary description under the label */
    description?: string;
    /** Optional badge text rendered in the header */
    badge?: string;
    /** Connection handles to render */
    handles?: NodeHandleConfig[];
    /** Optional body content */
    children?: ReactNode;
    /** Optional footer content */
    footer?: ReactNode;
    /** Click handler for the node */
    onClick?: () => void;
    /** Delete handler; when set, a delete button is shown on hover */
    onDelete?: () => void;
    [key: string]: unknown;
}
/**
 * Generic base node providing a consistent header (icon, label, optional
 * description and badge), optional body and footer, selection state, and
 * connection handles. It is a proper React Flow node component: content
 * comes from `data` and selection from props, so it can be registered
 * directly as a `nodeType` without an adapter. Styling is driven by a
 * semantic {@link NodeTheme}.
 */
export declare const BaseNode: import("react").MemoExoticComponent<({ data, selected }: NodeProps<Node<BaseNodeData>>) => import("react/jsx-runtime").JSX.Element>;
export {};
