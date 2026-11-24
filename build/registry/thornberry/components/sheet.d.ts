import { Dialog as ArkSheet } from "@ark-ui/react/dialog";
import type { ComponentProps } from "react";
declare const SheetProvider: (props: ArkSheet.RootProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const SheetContext: (props: ArkSheet.ContextProps) => import("react").ReactNode;
declare const SheetRoot: (props: ArkSheet.RootProps) => import("react/jsx-runtime").JSX.Element;
/**
 * Portals the sheet's backdrop and positioner to the document body, so no
 * transformed or blurred ancestor can clip the overlay. Wrap every sheet's
 * backdrop + positioner in this, as with dialogs
 */
declare const SheetPortal: (props: import("react").PropsWithChildren<import("@ark-ui/react").PortalProps>) => import("react/jsx-runtime").JSX.Element;
declare const SheetTrigger: ({ className, ...rest }: ComponentProps<typeof ArkSheet.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const SheetBackdrop: ({ className, ...rest }: ComponentProps<typeof ArkSheet.Backdrop>) => import("react/jsx-runtime").JSX.Element;
declare const SheetPositioner: ({ className, ...rest }: ComponentProps<typeof ArkSheet.Positioner>) => import("react/jsx-runtime").JSX.Element;
interface ArkSheetContentProps extends ComponentProps<typeof ArkSheet.Content> {
    side?: "top" | "right" | "bottom" | "left";
    /** Close when the sheet is swiped toward its edge on a touch screen */
    swipeToClose?: boolean;
}
declare const SheetContent: ({ className, side, swipeToClose, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, style, ...rest }: ArkSheetContentProps) => import("react/jsx-runtime").JSX.Element;
declare const SheetTitle: ({ className, ...rest }: ComponentProps<typeof ArkSheet.Title>) => import("react/jsx-runtime").JSX.Element;
declare const SheetDescription: ({ className, ...rest }: ComponentProps<typeof ArkSheet.Description>) => import("react/jsx-runtime").JSX.Element;
declare const SheetCloseTrigger: ({ className, children, asChild, ...rest }: ComponentProps<typeof ArkSheet.CloseTrigger>) => import("react/jsx-runtime").JSX.Element;
export { SheetBackdrop, SheetCloseTrigger, SheetContent, SheetContext, SheetDescription, SheetPortal, SheetPositioner, SheetProvider, SheetRoot, SheetTitle, SheetTrigger, };
