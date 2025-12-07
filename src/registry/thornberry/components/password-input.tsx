import { PasswordInput as ArkPasswordInput } from "@ark-ui/react/password-input";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const PasswordInputProvider = ArkPasswordInput.RootProvider;
const PasswordInputContext = ArkPasswordInput.Context;

const PasswordInputRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPasswordInput.Root>) => (
  <ArkPasswordInput.Root className={cn("space-y-2", className)} {...rest} />
);

const PasswordInputLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPasswordInput.Label>) => (
  <ArkPasswordInput.Label
    className={cn("font-medium text-sm leading-none", className)}
    {...rest}
  />
);

const PasswordInputControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPasswordInput.Control>) => (
  <ArkPasswordInput.Control
    className={cn("relative flex items-center", className)}
    {...rest}
  />
);

const PasswordInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPasswordInput.Input>) => (
  <ArkPasswordInput.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background",
      "file:border-0 file:bg-transparent file:font-medium file:text-sm",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[invalid]:border-destructive",
      className,
    )}
    {...rest}
  />
);

const PasswordInputVisibilityTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkPasswordInput.VisibilityTrigger>) => {
  // If there are no children, render the default Eye/EyeOff icons
  if (!children) {
    return (
      <ArkPasswordInput.VisibilityTrigger
        className={cn(
          "-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground transition-colors",
          "hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        <ArkPasswordInput.Indicator fallback={<EyeOff className="size-4" />}>
          <Eye className="size-4" />
        </ArkPasswordInput.Indicator>
      </ArkPasswordInput.VisibilityTrigger>
    );
  }

  return (
    <ArkPasswordInput.VisibilityTrigger className={className} {...rest}>
      {children}
    </ArkPasswordInput.VisibilityTrigger>
  );
};

const PasswordInputIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPasswordInput.Indicator>) => (
  <ArkPasswordInput.Indicator className={cn(className)} {...rest} />
);

export {
  PasswordInputProvider,
  PasswordInputContext,
  PasswordInputRoot,
  PasswordInputLabel,
  PasswordInputControl,
  PasswordInputInput,
  PasswordInputVisibilityTrigger,
  PasswordInputIndicator,
};
