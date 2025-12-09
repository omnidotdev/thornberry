import { Field as ArkField } from "@ark-ui/react/field";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const FieldProvider = ArkField.RootProvider;
const FieldContext = ArkField.Context;

const FieldRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.Root>) => (
  <ArkField.Root className={cn("space-y-2", className)} {...rest} />
);

const FieldLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.Label>) => (
  <ArkField.Label
    className={cn("font-medium text-sm leading-none", className)}
    {...rest}
  />
);

const FieldInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.Input>) => (
  <ArkField.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
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

const FieldTextarea = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.Textarea>) => (
  <ArkField.Textarea
    className={cn(
      "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[invalid]:border-destructive",
      className,
    )}
    {...rest}
  />
);

const FieldSelect = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.Select>) => (
  <ArkField.Select
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[invalid]:border-destructive",
      className,
    )}
    {...rest}
  />
);

const FieldHelperText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.HelperText>) => (
  <ArkField.HelperText
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const FieldErrorText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.ErrorText>) => (
  <ArkField.ErrorText
    className={cn("font-medium text-destructive text-sm", className)}
    {...rest}
  />
);

const FieldRequiredIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkField.RequiredIndicator>) => (
  <ArkField.RequiredIndicator
    className={cn("text-destructive", className)}
    {...rest}
  />
);

export {
  FieldProvider,
  FieldContext,
  FieldRoot,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  FieldSelect,
  FieldHelperText,
  FieldErrorText,
  FieldRequiredIndicator,
};
