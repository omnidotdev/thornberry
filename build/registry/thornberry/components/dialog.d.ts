import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import type { ComponentProps } from "react";
declare const DialogProvider: (props: ArkDialog.RootProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const DialogContext: (props: ArkDialog.ContextProps) => import("react").ReactNode;
declare const DialogRoot: (props: ArkDialog.RootProps) => import("react/jsx-runtime").JSX.Element;
/**
 * Portals the dialog's backdrop and positioner to the document body. Without it
 * the `fixed inset-0` backdrop and positioner render inline in the DOM, so any
 * ancestor with a `transform`, `filter`, or `backdrop-filter` (page/route
 * transitions, blurred panels) becomes their containing block and the overlay no
 * longer covers the full viewport. Wrap every dialog's backdrop + positioner in
 * this so they always resolve against the viewport.
 */
declare const DialogPortal: (props: import("react").PropsWithChildren<import("@ark-ui/react").PortalProps>) => import("react/jsx-runtime").JSX.Element;
declare const DialogTrigger: ({ className, ...rest }: ComponentProps<typeof ArkDialog.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const DialogBackdrop: ({ className, ...rest }: ComponentProps<typeof ArkDialog.Backdrop>) => import("react/jsx-runtime").JSX.Element;
declare const DialogPositioner: ({ className, ...rest }: ComponentProps<typeof ArkDialog.Positioner>) => import("react/jsx-runtime").JSX.Element;
declare const DialogContent: ({ className, ...rest }: ComponentProps<typeof ArkDialog.Content>) => import("react/jsx-runtime").JSX.Element;
declare const DialogTitle: ({ className, ...rest }: ComponentProps<typeof ArkDialog.Title>) => import("react/jsx-runtime").JSX.Element;
declare const DialogDescription: ({ className, ...rest }: ComponentProps<typeof ArkDialog.Description>) => import("react/jsx-runtime").JSX.Element;
declare const DialogCloseTrigger: ({ className, children, asChild, ...rest }: ComponentProps<typeof ArkDialog.CloseTrigger>) => import("react/jsx-runtime").JSX.Element;
export { DialogRoot, DialogPortal, DialogTrigger, DialogBackdrop, DialogPositioner, DialogContent, DialogTitle, DialogDescription, DialogCloseTrigger, DialogProvider, DialogContext, };
