import { ark } from "@ark-ui/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
declare const buttonVariants: (props?: ({
    variant?: "destructive" | "ghost" | "link" | "muted" | "outline" | "solid" | "unstyled" | null | undefined;
    size?: "icon" | "lg" | "md" | "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const Button: ({ className, variant, size, ...rest }: ComponentProps<typeof ark.button> & VariantProps<typeof buttonVariants>) => import("react/jsx-runtime").JSX.Element;
export { Button, buttonVariants };
