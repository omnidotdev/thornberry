import type { MouseEvent } from "react";
interface UseSidebarResizeProps {
    /**
     * Direction of the resize handle
     * - 'left': Handle is on left side (for right-positioned panels)
     * - 'right': Handle is on right side (for left-positioned panels)
     */
    direction?: "left" | "right";
    /**
     * Current width of the panel
     */
    currentWidth: string;
    /**
     * Callback to update width when resizing
     */
    onResize: (width: string) => void;
    /**
     * Callback to toggle panel visibility
     */
    onToggle?: () => void;
    /**
     * Whether the panel is currently collapsed
     */
    isCollapsed?: boolean;
    /**
     * Minimum resize width
     */
    minResizeWidth?: string;
    /**
     * Maximum resize width
     */
    maxResizeWidth?: string;
    /**
     * Whether to enable auto-collapse when dragged below threshold
     */
    enableAutoCollapse?: boolean;
    /**
     * Auto-collapse threshold as percentage of minResizeWidth
     * A value of 1.0 means the panel will collapse when dragged to minResizeWidth
     * A value of 0.5 means the panel will collapse when dragged to 50% of minResizeWidth
     * A value of 1.5 means the panel will collapse when dragged to 50% beyond minResizeWidth
     * Can be any positive number, not limited to the range 0.0-1.0
     */
    autoCollapseThreshold?: number;
    /**
     * Threshold to expand when dragging in opposite direction (0.0-1.0)
     * Percentage of distance needed to drag back to expand
     */
    expandThreshold?: number;
    /**
     * Whether to enable drag functionality
     */
    enableDrag?: boolean;
    /**
     * Callback to update dragging rail state
     */
    setIsDraggingRail?: (isDragging: boolean) => void;
    /**
     * Cookie name for persisting width
     */
    widthCookieName?: string;
    /**
     * Cookie max age in seconds
     */
    widthCookieMaxAge?: number;
    /**
     * Whether this is a nested sidebar (not at the edge of the screen)
     */
    isNested?: boolean;
    /**
     * Whether to enable toggle functionality
     */
    enableToggle?: boolean;
}
/**
 * A versatile hook for handling resizable sidebar (or inset) panels
 * Works for both sidebar (left side) and artifacts (right side) panels
 * Supports VS Code-like continuous drag to collapse/expand
 */
export declare function useSidebarResize({ direction, currentWidth, onResize, onToggle, isCollapsed, minResizeWidth, maxResizeWidth, enableToggle, enableAutoCollapse, autoCollapseThreshold, // Default to collapsing at minWidth + 50%
expandThreshold, enableDrag, setIsDraggingRail, widthCookieName, widthCookieMaxAge, // 1 week default
isNested, }: UseSidebarResizeProps): {
    dragRef: import("react").RefObject<HTMLButtonElement | null>;
    isDragging: import("react").RefObject<boolean>;
    handleMouseDown: (e: MouseEvent) => void;
};
export {};
