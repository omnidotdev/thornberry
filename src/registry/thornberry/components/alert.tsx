import { ark } from "@ark-ui/react";
import { cva } from "class-variance-authority";
import {
  Check,
  CircleAlert,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { match } from "ts-pattern";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-5 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        error:
          "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive",
        info: "border-blue-500/50 bg-blue-500/5 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
        warning:
          "border-yellow-500/50 bg-yellow-500/5 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
        success:
          "border-green-500/50 bg-green-500/5 text-green-500 dark:border-green-500 [&>svg]:text-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const AlertRoot = ({
  className,
  variant,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof alertVariants>) => (
  <ark.div
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...rest}
  />
);

const AlertIcon = ({ className, ...rest }: ComponentProps<typeof ark.svg>) => (
  <ark.svg className={cn("size-5 shrink-0", className)} asChild {...rest} />
);

const AlertTitle = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn(
      "mb-1 font-bold text-lg leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const AlertDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("text-sm [&_p]:leading-relaxed", className)}
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
    .with("info", () => Info)
    .with("success", () => Check)
    .with("warning", () => TriangleAlert)
    .with("error", () => OctagonAlert)
    .otherwise(() => CircleAlert);

  return (
    <AlertRoot className={cn(alertVariants({ variant }), className)} {...rest}>
      {showIcon && (
        <AlertIcon {...iconProps} className={cn(iconProps?.className)}>
          {icon ?? <FallbackIcon />}
        </AlertIcon>
      )}

      <AlertTitle {...titleProps} className={cn(titleProps?.className)}>
        {title}
      </AlertTitle>

      {description && (
        <AlertDescription
          {...descriptionProps}
          className={cn(descriptionProps?.className)}
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
