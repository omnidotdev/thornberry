import { ark } from "@ark-ui/react";
import { BiErrorAlt } from "react-icons/bi";
import { FiCheck, FiInfo } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

const alertVariants = tv({
  slots: {
    root: "relative w-full rounded-lg border px-4 py-5 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
    icon: "size-5 shrink-0",
    title: "mb-1 font-bold text-lg leading-none tracking-tight",
    description: "text-sm [&_p]:leading-relaxed",
  },
  variants: {
    variant: {
      default: {
        root: "bg-background text-foreground",
      },
      error: {
        root: "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
      info: {
        root: "border-blue-500/50 bg-blue-500/5 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
      },
      warning: {
        root: "border-yellow-500/50 bg-yellow-500/5 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
      },
      success: {
        root: "border-green-500/50 bg-green-500/5 text-green-500 dark:border-green-500 [&>svg]:text-green-500",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const {
  root,
  icon: iconVariants,
  title: titleVariants,
  description: descriptionVariants,
} = alertVariants();

const AlertRoot = ({
  className,
  variant,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof root>) => (
  <ark.div
    role="alert"
    className={cn(root({ variant }), className)}
    {...rest}
  />
);

const AlertIcon = ({
  className,
  variant,
  ...rest
}: ComponentProps<typeof ark.svg> & VariantProps<typeof iconVariants>) => (
  <ark.svg
    className={cn(iconVariants({ variant }), className)}
    asChild
    {...rest}
  />
);

const AlertTitle = ({
  className,
  variant,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof titleVariants>) => (
  <ark.div className={cn(titleVariants({ variant }), className)} {...rest} />
);

const AlertDescription = ({
  className,
  variant,
  ...rest
}: ComponentProps<typeof ark.div> &
  VariantProps<typeof descriptionVariants>) => (
  <ark.div
    className={cn(descriptionVariants({ variant }), className)}
    {...rest}
  />
);

interface AlertProps extends ComponentProps<typeof AlertRoot> {
  title: string;
  description?: string;
  icon?: ReactNode;
  /**
   * @remarks `ComponentProps<typeof AlertIcon>`
   */
  iconProps?: ComponentProps<typeof AlertIcon>;
  /**
   * @remarks `ComponentProps<typeof AlertTitle>`
   */
  titleProps?: ComponentProps<typeof AlertTitle>;
  /**
   * @remarks `ComponentProps<typeof AlertDescription>`
   */
  descriptionProps?: ComponentProps<typeof AlertDescription>;
  /**
   * @default true
   */
  showIcon?: boolean;
}

const Alert = ({
  className,
  variant,
  title,
  titleProps,
  description,
  descriptionProps,
  icon,
  iconProps,
  showIcon = true,
  ...rest
}: AlertProps) => {
  const FallbackIcon = match(variant)
    .with("default", () => FiInfo)
    .with("success", () => FiCheck)
    .with("warning", () => IoWarningOutline)
    .with("error", () => BiErrorAlt)
    .otherwise(() => FiInfo);

  return (
    <AlertRoot className={cn(root({ variant }), className)} {...rest}>
      {showIcon && (
        <AlertIcon
          {...iconProps}
          className={cn(iconVariants({ variant }), iconProps?.className)}
        >
          {icon ?? <FallbackIcon />}
        </AlertIcon>
      )}

      <AlertTitle
        {...titleProps}
        className={cn(titleVariants({ variant }), titleProps?.className)}
      >
        {title}
      </AlertTitle>

      {description && (
        <AlertDescription
          {...descriptionProps}
          className={cn(
            descriptionVariants({ variant }),
            descriptionProps?.className,
          )}
        >
          {description}
        </AlertDescription>
      )}
    </AlertRoot>
  );
};

export {
  Alert,
  AlertRoot,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  alertVariants,
  type AlertProps,
};
