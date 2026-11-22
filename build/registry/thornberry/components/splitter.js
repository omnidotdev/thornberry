import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/splitter.tsx
import { Splitter as ArkSplitter } from "@ark-ui/react/splitter";
import { GripVertical } from "lucide-react";
import { jsx } from "react/jsx-runtime";
var SplitterProvider = ArkSplitter.RootProvider;
var SplitterContext = ArkSplitter.Context;
var SplitterRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSplitter.Root, {
  className: cn("size-full", className),
  ...rest
});
var SplitterPanel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSplitter.Panel, {
  className: cn("min-h-0 min-w-0", className),
  ...rest
});
var SplitterResizeTrigger = ({
  className,
  "aria-label": ariaLabel = "Resize panels",
  ...rest
}) => /* @__PURE__ */ jsx(ArkSplitter.ResizeTrigger, {
  type: "button",
  "aria-label": ariaLabel,
  className: cn("relative flex shrink-0 items-center justify-center bg-border outline-none transition-colors after:absolute hover:bg-primary/50 focus-visible:ring-2 focus-visible:ring-primary data-disabled:pointer-events-none data-dragging:bg-primary", "data-[orientation=horizontal]:w-px data-[orientation=horizontal]:after:-inset-x-1.5 data-[orientation=horizontal]:after:inset-y-0", "data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:-inset-y-1.5 data-[orientation=vertical]:after:inset-x-0", className),
  ...rest
});
var SplitterResizeTriggerIndicator = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSplitter.ResizeTriggerIndicator, {
  className: cn("z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border text-muted-foreground data-[orientation=vertical]:rotate-90", className),
  ...rest,
  children: children ?? /* @__PURE__ */ jsx(GripVertical, {
    className: "size-2.5",
    "aria-hidden": "true"
  })
});
var resolveDefaultSizes = (panels) => {
  const sized = panels.filter((panel) => panel.defaultSize != null);
  const taken = sized.reduce((sum, panel) => sum + (panel.defaultSize ?? 0), 0);
  const share = (100 - taken) / Math.max(panels.length - sized.length, 1);
  return panels.map((panel) => panel.defaultSize ?? share);
};
var Splitter = ({ panels, withHandle = false, ...rest }) => /* @__PURE__ */ jsx(SplitterRoot, {
  panels: panels.map(({ content, defaultSize, label, ...panel }) => panel),
  defaultSize: resolveDefaultSizes(panels),
  ...rest,
  children: panels.map((panel, index) => {
    const next = panels[index + 1];
    return [
      /* @__PURE__ */ jsx(SplitterPanel, {
        id: panel.id,
        children: panel.content
      }, panel.id),
      next && /* @__PURE__ */ jsx(SplitterResizeTrigger, {
        id: `${panel.id}:${next.id}`,
        "aria-label": panel.label && next.label ? `Resize ${panel.label} and ${next.label}` : undefined,
        children: withHandle && /* @__PURE__ */ jsx(SplitterResizeTriggerIndicator, {})
      }, `${panel.id}:${next.id}`)
    ];
  })
});
export {
  Splitter,
  SplitterContext,
  SplitterPanel,
  SplitterProvider,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
  SplitterRoot
};
