import { ScrollArea as ArkScrollArea } from "@ark-ui/react/scroll-area";
import type { ComponentProps } from "react";
declare const ScrollAreaProvider: import("react").ForwardRefExoticComponent<ArkScrollArea.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const ScrollAreaContext: (props: ArkScrollArea.ContextProps) => import("react").ReactNode;
declare const ScrollAreaRoot: ({ className, ...rest }: ComponentProps<typeof ArkScrollArea.Root>) => import("react/jsx-runtime").JSX.Element;
declare const ScrollAreaViewport: ({ className, style, ...rest }: ComponentProps<typeof ArkScrollArea.Viewport>) => import("react/jsx-runtime").JSX.Element;
declare const ScrollAreaContent: ({ className, ...rest }: ComponentProps<typeof ArkScrollArea.Content>) => import("react/jsx-runtime").JSX.Element;
declare const ScrollAreaScrollbar: ({ className, orientation, ...rest }: ComponentProps<typeof ArkScrollArea.Scrollbar>) => import("react/jsx-runtime").JSX.Element;
declare const ScrollAreaThumb: ({ className, ...rest }: ComponentProps<typeof ArkScrollArea.Thumb>) => import("react/jsx-runtime").JSX.Element;
declare const ScrollAreaCorner: ({ className, ...rest }: ComponentProps<typeof ArkScrollArea.Corner>) => import("react/jsx-runtime").JSX.Element;
interface ScrollAreaProps extends ComponentProps<typeof ArkScrollArea.Root> {
    /** Which axes get a styled scrollbar. */
    orientation?: "vertical" | "horizontal" | "both";
    /** Class names for the scrolling viewport. */
    viewportClassName?: string;
}
/**
 * A scroll container with styled, overlaid scrollbars. Give it a bounded
 * height (or width, for horizontal scrolling) via `className`.
 */
declare const ScrollArea: ({ orientation, viewportClassName, children, ...rest }: ScrollAreaProps) => import("react/jsx-runtime").JSX.Element;
export { ScrollArea, ScrollAreaContent, ScrollAreaContext, ScrollAreaCorner, ScrollAreaProvider, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport, };
