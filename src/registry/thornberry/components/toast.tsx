import { Toast as ArkToast, Toaster, createToaster } from "@ark-ui/react/toast";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ToastRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToast.Root>) => (
  <ArkToast.Root
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[type=error]:border-destructive data-[type=error]:bg-destructive data-[type=error]:text-destructive-foreground data-[type=success]:border-green-500 data-[type=success]:bg-green-50 data-[type=success]:text-green-900 data-[type=warning]:border-yellow-500 data-[type=warning]:bg-yellow-50 data-[type=warning]:text-yellow-900 data-[type=info]:bg-background",
      className,
    )}
    {...rest}
  />
);

const ToastTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToast.Title>) => (
  <ArkToast.Title
    className={cn("font-semibold text-sm", className)}
    {...rest}
  />
);

const ToastDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToast.Description>) => (
  <ArkToast.Description
    className={cn("text-sm opacity-90", className)}
    {...rest}
  />
);

const ToastCloseTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkToast.CloseTrigger>) => (
  <ArkToast.CloseTrigger
    className={cn(
      "absolute top-2 right-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
      className,
    )}
    {...rest}
  >
    {children || <X className="h-4 w-4" />}
  </ArkToast.CloseTrigger>
);

const ToastActionTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToast.ActionTrigger>) => (
  <ArkToast.ActionTrigger
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 font-medium text-sm transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

export {
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
  ToastActionTrigger,
  Toaster,
  createToaster,
};
