import { HoverCard as ArkHoverCard } from "@ark-ui/react/hover-card";
import type { ComponentProps } from "react";
declare const HoverCardProvider: (props: ArkHoverCard.RootProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const HoverCardContext: (props: ArkHoverCard.ContextProps) => import("react").ReactNode;
declare const HoverCardRoot: (props: ArkHoverCard.RootProps) => import("react/jsx-runtime").JSX.Element;
declare const HoverCardTrigger: ({ className, ...rest }: ComponentProps<typeof ArkHoverCard.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const HoverCardContent: ({ className, ...rest }: ComponentProps<typeof ArkHoverCard.Content>) => import("react/jsx-runtime").JSX.Element;
declare const HoverCardPositioner: ({ className, ...rest }: ComponentProps<typeof ArkHoverCard.Positioner>) => import("react/jsx-runtime").JSX.Element;
export { HoverCardRoot, HoverCardTrigger, HoverCardContent, HoverCardPositioner, HoverCardProvider, HoverCardContext, };
