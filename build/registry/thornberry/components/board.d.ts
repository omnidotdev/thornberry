import type { ComponentProps, MouseEvent as ReactMouseEvent, ReactNode } from "react";
/**
 * Presentational kanban/board primitives. A drag-agnostic shell shared across
 * apps: consumers render their own data (e.g. feedback posts grouped by status,
 * or tasks grouped by column) and layer interactivity (drag-and-drop) on top via
 * the slots. Keeps board layout/styling, and the momentum drag-to-scroll UX, in
 * one place instead of each app rebuilding it.
 */
interface UseInertialScrollOptions {
    /** Friction coefficient for deceleration (0-1, lower = more friction). */
    friction?: number;
    /** Velocity multiplier during drag. */
    velocityMultiplier?: number;
    /** Minimum velocity threshold to stop animation. */
    minVelocity?: number;
}
/**
 * Inertial (momentum-based) drag-to-scroll for the horizontal board surface,
 * with smooth deceleration after release. Skips dragging when the pointer starts
 * on a draggable card, so it composes with card drag-and-drop.
 */
declare const useInertialScroll: ({ friction, velocityMultiplier, minVelocity, }?: UseInertialScrollOptions) => {
    scrollContainerRef: import("react").RefObject<HTMLDivElement | null>;
    isMouseDragging: boolean;
    handleMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void;
    handleMouseUp: () => void;
    handleMouseMove: (e: ReactMouseEvent<HTMLDivElement>) => void;
    handleMouseLeave: () => void;
};
interface BoardProps extends ComponentProps<"div"> {
    /** Enable momentum drag-to-scroll on the horizontal surface (default true). */
    enableDragScroll?: boolean;
}
/** Horizontal board surface: columns scroll sideways on desktop, stack on mobile. */
declare const Board: ({ className, enableDragScroll, ...rest }: BoardProps) => import("react/jsx-runtime").JSX.Element;
/** A single column panel. */
declare const BoardColumn: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
interface BoardColumnHeaderProps extends Omit<ComponentProps<"div">, "title" | "color"> {
    /** Column title. */
    title: ReactNode;
    /** Dot color (hex/token); ignored when `icon` is provided. */
    color?: string | null;
    /** Leading icon, replacing the color dot. */
    icon?: ReactNode;
    /** Item count shown as a trailing pill. */
    count?: number;
}
/** Column header: a color dot (or icon) + truncated title + optional count pill. */
declare const BoardColumnHeader: ({ title, color, icon, count, className, children, ...rest }: BoardColumnHeaderProps) => import("react/jsx-runtime").JSX.Element;
/** Column body: holds the cards (or an empty state). */
declare const BoardColumnBody: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
/** Empty-state placeholder for a column with no items. */
declare const BoardColumnEmpty: ({ className, ...rest }: ComponentProps<"p">) => import("react/jsx-runtime").JSX.Element;
export { Board, BoardColumn, BoardColumnHeader, BoardColumnBody, BoardColumnEmpty, useInertialScroll, };
