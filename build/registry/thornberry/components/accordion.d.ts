import type { AccordionItemContentProps, AccordionItemProps, AccordionItemTriggerProps, AccordionRootProps } from "@ark-ui/react";
import type { ElementType } from "react";
declare const AccordionRoot: ({ className, ...rest }: AccordionRootProps) => import("react/jsx-runtime").JSX.Element;
declare const AccordionItem: ({ className, ...rest }: AccordionItemProps) => import("react/jsx-runtime").JSX.Element;
interface ItemTriggerProps extends AccordionItemTriggerProps {
    icon?: ElementType;
}
declare const AccordionItemTrigger: ({ className, children, icon, ...rest }: ItemTriggerProps) => import("react/jsx-runtime").JSX.Element;
declare const AccordionItemContent: ({ className, children, ...rest }: AccordionItemContentProps) => import("react/jsx-runtime").JSX.Element;
export { AccordionRoot, AccordionItem, AccordionItemTrigger, AccordionItemContent, };
