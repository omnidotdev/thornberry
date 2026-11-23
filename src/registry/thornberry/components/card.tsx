import { ark } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const CardRoot = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    )}
    {...rest}
  />
);

const CardHeader = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("flex flex-col gap-1.5 p-6", className)} {...rest} />
);

const CardTitle = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...rest}
  />
);

const CardDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const CardContent = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("p-6 pt-0", className)} {...rest} />
);

const CardFooter = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("flex items-center p-6 pt-0", className)} {...rest} />
);

interface CardProps extends Omit<ComponentProps<typeof CardRoot>, "title"> {
  /** Heading, rendered in a `CardHeader` with the description. */
  title?: ReactNode;
  description?: ReactNode;
  /** Footer content, rendered in a `CardFooter` when set. */
  footer?: ReactNode;
  headerProps?: ComponentProps<typeof CardHeader>;
  titleProps?: ComponentProps<typeof CardTitle>;
  descriptionProps?: ComponentProps<typeof CardDescription>;
  contentProps?: ComponentProps<typeof CardContent>;
  footerProps?: ComponentProps<typeof CardFooter>;
}

/**
 * Card with the standard header, content, and footer layout. Pass `title`,
 * `description`, and `footer`; `children` fill the content. Compose `CardRoot`
 * and its parts directly for any other layout.
 */
const Card = ({
  title,
  description,
  footer,
  headerProps,
  titleProps,
  descriptionProps,
  contentProps,
  footerProps,
  children,
  ...rest
}: CardProps) => (
  <CardRoot {...rest}>
    {(title || description) && (
      <CardHeader {...headerProps}>
        {title && <CardTitle {...titleProps}>{title}</CardTitle>}
        {description && (
          <CardDescription {...descriptionProps}>{description}</CardDescription>
        )}
      </CardHeader>
    )}

    <CardContent {...contentProps}>{children}</CardContent>

    {footer && <CardFooter {...footerProps}>{footer}</CardFooter>}
  </CardRoot>
);

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardRoot,
  CardTitle,
};
