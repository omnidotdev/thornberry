import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/scroll-area.tsx
import { ScrollArea as ArkScrollArea } from "@ark-ui/react/scroll-area";
import { jsx, jsxs } from "react/jsx-runtime";
var ScrollAreaProvider = ArkScrollArea.RootProvider;
var ScrollAreaContext = ArkScrollArea.Context;
var ScrollAreaRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkScrollArea.Root, {
  className: cn("relative overflow-hidden", className),
  ...rest
});
var ScrollAreaViewport = ({
  className,
  style,
  ...rest
}) => /* @__PURE__ */ jsx(ArkScrollArea.Viewport, {
  className: cn("size-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset", className),
  style: { scrollbarWidth: "none", ...style },
  ...rest
});
var ScrollAreaContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkScrollArea.Content, {
  className,
  ...rest
});
var ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  ...rest
}) => /* @__PURE__ */ jsx(ArkScrollArea.Scrollbar, {
  orientation,
  className: cn("z-10 flex touch-none select-none p-0.5 transition-colors", "data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:not-data-overflow-y:hidden", "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:not-data-overflow-x:hidden", className),
  ...rest
});
var ScrollAreaThumb = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkScrollArea.Thumb, {
  className: cn("rounded-full bg-border transition-colors hover:bg-muted-foreground/50 data-dragging:bg-muted-foreground/60", "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full", className),
  ...rest
});
var ScrollAreaCorner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkScrollArea.Corner, {
  className: cn("bg-transparent", className),
  ...rest
});
var ScrollArea = ({
  orientation = "vertical",
  viewportClassName,
  children,
  ...rest
}) => /* @__PURE__ */ jsxs(ScrollAreaRoot, {
  ...rest,
  children: [
    /* @__PURE__ */ jsx(ScrollAreaViewport, {
      className: viewportClassName,
      children: /* @__PURE__ */ jsx(ScrollAreaContent, {
        children
      })
    }),
    orientation !== "horizontal" && /* @__PURE__ */ jsx(ScrollAreaScrollbar, {
      orientation: "vertical",
      children: /* @__PURE__ */ jsx(ScrollAreaThumb, {})
    }),
    orientation !== "vertical" && /* @__PURE__ */ jsx(ScrollAreaScrollbar, {
      orientation: "horizontal",
      children: /* @__PURE__ */ jsx(ScrollAreaThumb, {})
    }),
    orientation === "both" && /* @__PURE__ */ jsx(ScrollAreaCorner, {})
  ]
});
export {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaContext,
  ScrollAreaCorner,
  ScrollAreaProvider,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport
};
