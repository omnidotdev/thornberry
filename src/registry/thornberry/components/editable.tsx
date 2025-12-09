import { Editable as ArkEditable } from "@ark-ui/react/editable";
import { Check, Edit, X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const EditableProvider = ArkEditable.RootProvider;
const EditableContext = ArkEditable.Context;

const EditableRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkEditable.Root>) => (
  <ArkEditable.Root className={cn("space-y-2", className)} {...rest} />
);

const EditableLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkEditable.Label>) => (
  <ArkEditable.Label
    className={cn("font-medium text-sm leading-none", className)}
    {...rest}
  />
);

const EditableArea = ({
  className,
  ...rest
}: ComponentProps<typeof ArkEditable.Area>) => (
  <ArkEditable.Area
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

const EditableInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkEditable.Input>) => (
  <ArkEditable.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const EditablePreview = ({
  className,
  ...rest
}: ComponentProps<typeof ArkEditable.Preview>) => (
  <ArkEditable.Preview
    className={cn(
      "inline-flex h-10 w-full items-center rounded-md px-3 py-2 text-sm",
      "data-[placeholder-shown]:text-muted-foreground",
      className,
    )}
    {...rest}
  />
);

const EditableControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkEditable.Control>) => (
  <ArkEditable.Control
    className={cn("flex items-center gap-1", className)}
    {...rest}
  />
);

const EditableEditTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkEditable.EditTrigger>) => {
  if (!children) {
    return (
      <ArkEditable.EditTrigger
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        <Edit className="size-4" />
      </ArkEditable.EditTrigger>
    );
  }

  return (
    <ArkEditable.EditTrigger className={className} {...rest}>
      {children}
    </ArkEditable.EditTrigger>
  );
};

const EditableSubmitTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkEditable.SubmitTrigger>) => {
  if (!children) {
    return (
      <ArkEditable.SubmitTrigger
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        <Check className="size-4" />
      </ArkEditable.SubmitTrigger>
    );
  }

  return (
    <ArkEditable.SubmitTrigger className={className} {...rest}>
      {children}
    </ArkEditable.SubmitTrigger>
  );
};

const EditableCancelTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkEditable.CancelTrigger>) => {
  if (!children) {
    return (
      <ArkEditable.CancelTrigger
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        <X className="size-4" />
      </ArkEditable.CancelTrigger>
    );
  }

  return (
    <ArkEditable.CancelTrigger className={className} {...rest}>
      {children}
    </ArkEditable.CancelTrigger>
  );
};

export {
  EditableProvider,
  EditableContext,
  EditableRoot,
  EditableLabel,
  EditableArea,
  EditableInput,
  EditablePreview,
  EditableControl,
  EditableEditTrigger,
  EditableSubmitTrigger,
  EditableCancelTrigger,
};
