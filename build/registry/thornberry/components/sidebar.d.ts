import { ark } from "@ark-ui/react/factory";
import { Button } from "../../../registry/thornberry/components/button";
import { Input } from "../../../registry/thornberry/components/input";
import type { ComponentProps } from "react";
interface SidebarContextProps {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
    width: string;
    setWidth: (width: string) => void;
    isDraggingRail: boolean;
    setIsDraggingRail: (isDraggingRail: boolean) => void;
}
declare const useSidebar: () => SidebarContextProps;
declare const SidebarProvider: ({ defaultOpen, open: openProp, onOpenChange: setOpenProp, className, style, children, defaultWidth, ...rest }: ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultWidth?: string;
}) => import("react/jsx-runtime").JSX.Element;
declare const Sidebar: ({ side, variant, collapsible, className, children, ...rest }: ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}) => import("react/jsx-runtime").JSX.Element;
declare const SidebarTrigger: ({ className, onClick, ...rest }: ComponentProps<typeof Button>) => import("react/jsx-runtime").JSX.Element;
declare const SidebarRail: ({ enableDrag, className, ...rest }: ComponentProps<typeof ark.button> & {
    enableDrag?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
declare const SidebarInset: ({ className, ...rest }: ComponentProps<"main">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarSeparator: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarInput: ({ className, ...rest }: ComponentProps<typeof Input>) => import("react/jsx-runtime").JSX.Element;
declare const SidebarHeader: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarFooter: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarContent: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarGroup: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarGroupLabel: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const SidebarGroupAction: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const SidebarGroupContent: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenu: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuItem: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuButton: ({ isActive, tooltip, shortcut, className, ...rest }: ComponentProps<typeof ark.button> & {
    isActive?: boolean;
    tooltip?: string;
    shortcut?: string;
}) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuAction: ({ isActive, className, showOnHover, ...rest }: ComponentProps<typeof ark.button> & {
    isActive?: boolean;
    showOnHover?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuBadge: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuShortcut: ({ className, ...rest }: ComponentProps<"span">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuSub: ({ className, ...rest }: ComponentProps<"ul">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuSubItem: ({ className, ...rest }: ComponentProps<"li">) => import("react/jsx-runtime").JSX.Element;
declare const SidebarMenuSubButton: ({ size, isActive, className, ...rest }: ComponentProps<typeof ark.a> & {
    size?: "sm" | "md";
    isActive?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar, SidebarMenuShortcut, SidebarSeparator, };
