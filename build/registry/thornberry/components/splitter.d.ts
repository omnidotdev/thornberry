import { Splitter as ArkSplitter } from "@ark-ui/react/splitter";
import type { SplitterPanelData } from "@ark-ui/react/splitter";
import type { ComponentProps, ReactNode } from "react";
declare const SplitterProvider: import("react").ForwardRefExoticComponent<ArkSplitter.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const SplitterContext: (props: ArkSplitter.ContextProps) => ReactNode;
/**
 * Lays out panels in a row (`orientation="horizontal"`, the default) or a
 * column. Sizes are percentages of the root, so give the root (or its parent)
 * a definite height for vertical splits.
 */
declare const SplitterRoot: ({ className, ...rest }: ComponentProps<typeof ArkSplitter.Root>) => import("react/jsx-runtime").JSX.Element;
declare const SplitterPanel: ({ className, ...rest }: ComponentProps<typeof ArkSplitter.Panel>) => import("react/jsx-runtime").JSX.Element;
/**
 * The draggable divider between two panels (`id` is `"<before>:<after>"`).
 * Focus it and use the arrow keys to resize (Shift for larger steps),
 * Home/End to jump to the limits, and Enter to collapse a collapsible panel.
 * Ark gives it `role="separator"`; it is labelled "Resize panels" unless an
 * `aria-label` is passed.
 */
declare const SplitterResizeTrigger: ({ className, "aria-label": ariaLabel, ...rest }: ComponentProps<typeof ArkSplitter.ResizeTrigger>) => import("react/jsx-runtime").JSX.Element;
/** A grip drawn on the resize trigger. Place it inside `SplitterResizeTrigger`. */
declare const SplitterResizeTriggerIndicator: ({ className, children, ...rest }: ComponentProps<typeof ArkSplitter.ResizeTriggerIndicator>) => import("react/jsx-runtime").JSX.Element;
interface SplitterPanelConfig extends SplitterPanelData {
    /** The panel's content. */
    content: ReactNode;
    /** Initial size as a percentage. Panels without one share what is left. */
    defaultSize?: number;
    /** Human-readable name, used to label the adjacent resize triggers. */
    label?: string;
}
interface SplitterProps extends Omit<ComponentProps<typeof ArkSplitter.Root>, "panels" | "defaultSize" | "children"> {
    /** Panels in order, with their constraints (`minSize`/`maxSize` in percent). */
    panels: SplitterPanelConfig[];
    /** Draw a grip on each resize trigger. */
    withHandle?: boolean;
}
/**
 * Resizable panels separated by draggable, keyboard-accessible dividers.
 *
 * @example
 * <Splitter
 *   className="h-64"
 *   withHandle
 *   panels={[
 *     { id: "nav", label: "Navigation", defaultSize: 30, minSize: 20, content: <Nav /> },
 *     { id: "main", label: "Content", content: <Main /> },
 *   ]}
 * />
 */
declare const Splitter: ({ panels, withHandle, ...rest }: SplitterProps) => import("react/jsx-runtime").JSX.Element;
export type { SplitterPanelConfig };
export { Splitter, SplitterContext, SplitterPanel, SplitterProvider, SplitterResizeTrigger, SplitterResizeTriggerIndicator, SplitterRoot, };
