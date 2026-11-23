import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import type { ComponentProps, ReactNode } from "react";
declare const TooltipProvider: (props: ArkTooltip.RootProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const TooltipRoot: (props: ArkTooltip.RootProps) => import("react/jsx-runtime").JSX.Element;
declare const TooltipArrow: import("react").ForwardRefExoticComponent<ArkTooltip.ArrowProps & import("react").RefAttributes<HTMLDivElement>>;
declare const TooltipTrigger: ({ className, ...rest }: ComponentProps<typeof ArkTooltip.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const TooltipPositioner: ({ className, ...rest }: ComponentProps<typeof ArkTooltip.Positioner>) => import("react/jsx-runtime").JSX.Element;
declare const TooltipContent: ({ className, ...rest }: ComponentProps<typeof ArkTooltip.Content>) => import("react/jsx-runtime").JSX.Element;
declare const TooltipArrowTip: ({ className, ...rest }: ComponentProps<typeof ArkTooltip.ArrowTip>) => import("react/jsx-runtime").JSX.Element;
interface TooltipProps extends ComponentProps<typeof TooltipRoot> {
    /** Tooltip text or content */
    content: ReactNode;
    /** The element that shows the tooltip on hover and focus */
    children: ReactNode;
    contentProps?: ComponentProps<typeof TooltipContent>;
}
/**
 * Tooltip on a single trigger element (rendered `asChild`, so pass one
 * focusable element). Compose `TooltipRoot` and its parts for anything else.
 */
declare const Tooltip: ({ content, children, contentProps, ...rest }: TooltipProps) => import("react/jsx-runtime").JSX.Element;
export { Tooltip, TooltipArrow, TooltipArrowTip, TooltipContent, TooltipPositioner, type TooltipProps, TooltipProvider, TooltipRoot, TooltipTrigger, };
