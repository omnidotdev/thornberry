import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";
import type { ComponentProps } from "react";
declare const CollapsibleProvider: import("react").ForwardRefExoticComponent<ArkCollapsible.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const CollapsibleContext: (props: ArkCollapsible.ContextProps) => import("react").ReactNode;
declare const CollapsibleRoot: ({ className, ...rest }: ComponentProps<typeof ArkCollapsible.Root>) => import("react/jsx-runtime").JSX.Element;
declare const CollapsibleTrigger: ({ className, children, ...rest }: ComponentProps<typeof ArkCollapsible.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const CollapsibleContent: ({ className, ...rest }: ComponentProps<typeof ArkCollapsible.Content>) => import("react/jsx-runtime").JSX.Element;
export { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, CollapsibleProvider, CollapsibleContext, };
