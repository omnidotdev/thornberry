import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { FiX } from "react-icons/fi";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps, ReactNode } from "react";

const DialogProvider = ArkDialog.RootProvider;
const DialogContext = ArkDialog.Context;
const DialogRoot = ArkDialog.Root;

const DialogTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Trigger>) => (
  <ArkDialog.Trigger className={cn("", className)} {...rest} />
);

const DialogBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Backdrop>) => (
  <ArkDialog.Backdrop
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...rest}
  />
);

const DialogPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Positioner>) => (
  <ArkDialog.Positioner
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      className,
    )}
    {...rest}
  />
);

const DialogContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Content>) => (
  <ArkDialog.Content
    className={cn(
      "relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] sm:rounded-lg",
      className,
    )}
    {...rest}
  />
);

const DialogTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Title>) => (
  <ArkDialog.Title
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const DialogDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Description>) => (
  <ArkDialog.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...rest}
  />
);

const DialogCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkDialog.CloseTrigger>) => {
  // If there are no children, render the default X icon
  if (!children) {
    return (
      <ArkDialog.CloseTrigger
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <FiX className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkDialog.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the dialog
  return (
    <ArkDialog.CloseTrigger
      className={cn(className)}
      asChild={asChild}
      {...rest}
    >
      {children}
    </ArkDialog.CloseTrigger>
  );
};

interface DialogProps extends ComponentProps<typeof DialogRoot> {
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

const Dialog = ({
  trigger,
  title,
  description,
  children,
  ...rest
}: DialogProps) => {
  return (
    <DialogRoot {...rest}>
      {trigger && (
        <DialogTrigger asChild>
          {typeof trigger === "string" ? <Button>{trigger}</Button> : trigger}
        </DialogTrigger>
      )}
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
          {children}
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
  DialogProvider,
  DialogContext,
  type DialogProps,
};
