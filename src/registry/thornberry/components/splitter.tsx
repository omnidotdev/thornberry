import { Splitter as ArkSplitter } from "@ark-ui/react/splitter";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const SplitterProvider = ArkSplitter.RootProvider;
const SplitterContext = ArkSplitter.Context;
const SplitterRoot = ArkSplitter.Root;

const SplitterPanel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSplitter.Panel>) => (
  <ArkSplitter.Panel
    className={cn("flex flex-col overflow-hidden", className)}
    {...rest}
  />
);

const SplitterResizeTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSplitter.ResizeTrigger>) => (
  <ArkSplitter.ResizeTrigger
    className={cn(
      "relative flex items-center justify-center bg-border transition-colors hover:bg-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1 data-[orientation=horizontal]:cursor-row-resize data-[orientation=vertical]:cursor-col-resize",
      className,
    )}
    {...rest}
  >
    {children || (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border data-[orientation=horizontal]:rotate-90">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ArkSplitter.ResizeTrigger>
);

export {
  SplitterRoot,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterProvider,
  SplitterContext,
};
