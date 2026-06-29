import { cn } from "@/lib/utils";

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
const LogoLockup = ({
  logo,
  name,
  className,
  nameClassName,
  ...rest
}: Props) => (
  <div
    data-slot="logo-lockup"
    className={cn("flex items-center gap-2", className)}
    {...rest}
  >
    {logo}

    <span
      className={cn(
        "font-semibold text-foreground text-lg tracking-tight",
        nameClassName,
      )}
    >
      {name}
    </span>
  </div>
);

export { LogoLockup };
