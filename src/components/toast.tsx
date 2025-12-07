"use client";

import {
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
  ToastActionTrigger,
  Toaster,
  createToaster,
} from "@/registry/thornberry/components/toast";

// Create and export a default toaster instance for convenience
export const toaster = createToaster({
  placement: "top-end" as const,
  overlap: true,
  gap: 16,
  duration: 5000,
});

// Re-export all components
export {
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
  ToastActionTrigger,
  Toaster,
  createToaster,
};

// Example usage component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster toaster={toaster}>
        {(toast) => (
          <ToastRoot key={toast.id}>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastCloseTrigger />
          </ToastRoot>
        )}
      </Toaster>
    </>
  );
}
