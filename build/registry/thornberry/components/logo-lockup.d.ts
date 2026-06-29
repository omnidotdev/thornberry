import type { ComponentProps, ReactNode } from "react";
interface Props extends ComponentProps<"div"> {
    /** Brand mark to render alongside the name (img, inline SVG, or icon). */
    logo?: ReactNode;
    /** Product name shown next to the mark. */
    name: ReactNode;
    /** Class applied to the name text. */
    nameClassName?: string;
}
/**
 * Header brand lockup: a product mark paired with its name for consistent
 * top-left branding across Omni apps. Presentational only; wrap it in the
 * consuming app's router link to make it navigable.
 */
declare const LogoLockup: ({ logo, name, className, nameClassName, ...rest }: Props) => import("react/jsx-runtime").JSX.Element;
export { LogoLockup };
