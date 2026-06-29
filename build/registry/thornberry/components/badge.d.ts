import { ark } from "@ark-ui/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
declare const badgeVariants: (props?: ({
    variant?: "solid" | "secondary" | "destructive" | "outline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const Badge: ({ className, variant, ...rest }: ComponentProps<typeof ark.div> & VariantProps<typeof badgeVariants>) => import("react/jsx-runtime").JSX.Element;
export { Badge, badgeVariants };
