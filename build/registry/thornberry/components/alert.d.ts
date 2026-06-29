import { ark } from "@ark-ui/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
declare const alertVariants: (props?: ({
    variant?: "default" | "error" | "info" | "warning" | "success" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const AlertRoot: ({ className, variant, ...rest }: ComponentProps<typeof ark.div> & VariantProps<typeof alertVariants>) => import("react/jsx-runtime").JSX.Element;
declare const AlertIcon: ({ className, ...rest }: ComponentProps<typeof ark.svg>) => import("react/jsx-runtime").JSX.Element;
declare const AlertTitle: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
declare const AlertDescription: ({ className, ...rest }: ComponentProps<typeof ark.div>) => import("react/jsx-runtime").JSX.Element;
export { AlertRoot, AlertIcon, AlertTitle, AlertDescription, alertVariants };
