import { Command as CommandPrimitive } from "cmdk";
import { DialogRoot } from "../../../registry/thornberry/components/dialog";
import type { ComponentProps } from "react";
/**
 * Command menu primitives (cmdk) styled for Sigil/Tailwind. Compose a command
 * palette with {@link CommandDialog} (a ⌘K-style modal) or embed {@link Command}
 * inline. Apps feed their own command items, so the palette is reusable across
 * products.
 */
declare const Command: ({ className, ...rest }: ComponentProps<typeof CommandPrimitive>) => import("react/jsx-runtime").JSX.Element;
interface CommandDialogProps extends ComponentProps<typeof DialogRoot> {
    /** Accessible title (visually hidden). */
    title?: string;
    /** Accessible description (visually hidden). */
    description?: string;
}
declare const CommandDialog: ({ children, title, description, ...rest }: CommandDialogProps) => import("react/jsx-runtime").JSX.Element;
declare const CommandInput: ({ className, ...rest }: ComponentProps<typeof CommandPrimitive.Input>) => import("react/jsx-runtime").JSX.Element;
declare const CommandList: ({ className, ...rest }: ComponentProps<typeof CommandPrimitive.List>) => import("react/jsx-runtime").JSX.Element;
declare const CommandEmpty: (rest: ComponentProps<typeof CommandPrimitive.Empty>) => import("react/jsx-runtime").JSX.Element;
declare const CommandGroup: ({ className, ...rest }: ComponentProps<typeof CommandPrimitive.Group>) => import("react/jsx-runtime").JSX.Element;
declare const CommandSeparator: ({ className, ...rest }: ComponentProps<typeof CommandPrimitive.Separator>) => import("react/jsx-runtime").JSX.Element;
declare const CommandItem: ({ className, ...rest }: ComponentProps<typeof CommandPrimitive.Item>) => import("react/jsx-runtime").JSX.Element;
/** A trailing shortcut hint inside a command item. */
declare const CommandShortcut: ({ className, ...rest }: ComponentProps<"span">) => import("react/jsx-runtime").JSX.Element;
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
