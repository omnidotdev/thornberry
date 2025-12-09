import { DownloadTrigger as ArkDownloadTrigger } from "@ark-ui/react/download-trigger";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const DownloadTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkDownloadTrigger>) => {
  if (!children) {
    return (
      <ArkDownloadTrigger
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors",
          "hover:bg-primary/90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        <Download className="size-4" />
        Download
      </ArkDownloadTrigger>
    );
  }

  return (
    <ArkDownloadTrigger className={className} {...rest}>
      {children}
    </ArkDownloadTrigger>
  );
};

export { DownloadTrigger };
