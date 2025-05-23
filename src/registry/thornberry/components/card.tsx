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
    className={cn("text-sm text-muted-foreground", className)}
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

interface CardProps extends ComponentProps<typeof CardRoot> {
  header?: {
    title?: string;
    description?: string;
  };
  footer?: ReactNode;
  headerProps?: ComponentProps<typeof ark.div>;
  titleProps?: ComponentProps<typeof ark.div>;
  descriptionProps?: ComponentProps<typeof ark.div>;
  contentProps?: ComponentProps<typeof ark.div>;
  footerProps?: ComponentProps<typeof ark.div>;
}

const Card = ({
  className,
  header,
  footer,
  headerProps,
  titleProps,
  descriptionProps,
  contentProps,
  footerProps,
  children,
  ...rest
}: CardProps) => (
  <CardRoot className={cn("relative", className)} {...rest}>
    {header && (
      <CardHeader {...headerProps}>
        {header.title && <CardTitle {...titleProps}>{header.title}</CardTitle>}
        {header.description && (
          <CardDescription {...descriptionProps}>
            {header.description}
          </CardDescription>
        )}
      </CardHeader>
    )}
    <CardContent {...contentProps}>{children}</CardContent>
    {footer && <CardFooter {...footerProps}>{footer}</CardFooter>}
  </CardRoot>
);

export {
  CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
  type CardProps,
};
