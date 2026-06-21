"use client";

import { Handle } from "@xyflow/react";
import { memo } from "react";

import { cn } from "@/lib/utils";
import { resolveTheme } from "@/registry/thornberry/lib/node-themes";

import type { Node, NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type {
  NodeTheme,
  NodeThemeKey,
} from "@/registry/thornberry/lib/node-themes";

/**
 * Standard node dimensions for consistent canvas layout. The width is an
 * even multiple of the default grid size for clean center alignment.
 */
export const NODE_WIDTH = 300;
export const NODE_MIN_HEIGHT = 120;

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
  // Index signature so the shape satisfies React Flow's `Record`-based node data
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
export const BaseNode = memo(
  ({ data, selected }: NodeProps<Node<BaseNodeData>>) => {
    const {
      theme,
      icon: Icon,
      label,
      description,
      badge,
      handles = [],
      children,
      footer,
      onClick,
      onDelete,
    } = data;
    const t = resolveTheme(theme);

    return (
      <div
        className={cn(
          "group relative rounded-xl border px-4 py-3",
          onClick && "cursor-pointer",
          t.border,
          t.bg,
          t.glow,
          selected && "ring-2 ring-ring ring-offset-2",
        )}
        style={{ width: NODE_WIDTH, minHeight: NODE_MIN_HEIGHT }}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {onDelete && (
          <button
            type="button"
            aria-label="Delete node"
            className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-destructive opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <span aria-hidden="true">x</span>
          </button>
        )}

        {/* Header */}
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {Icon && (
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                  t.iconBg,
                )}
              >
                <Icon className={cn("h-5 w-5", t.iconText)} />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <span className="truncate font-medium">{label}</span>
              {description && (
                <span className="truncate text-xs opacity-70">
                  {description}
                </span>
              )}
            </div>
          </div>
          {badge && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs",
                t.iconBg,
                t.iconText,
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Body */}
        {children && <div className="mt-3 space-y-2">{children}</div>}

        {/* Footer */}
        {footer && <div className="mt-3">{footer}</div>}

        {/* Handles */}
        {handles.map((handle, index) => (
          <Handle
            key={handle.id ?? `${handle.type}-${handle.position}-${index}`}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            className={cn("h-3 w-3", handle.className ?? t.handleColor)}
            style={handle.style}
          />
        ))}
      </div>
    );
  },
);

BaseNode.displayName = "BaseNode";
