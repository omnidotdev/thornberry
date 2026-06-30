import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/tabs.tsx
import { Tabs as ArkTabs } from "@ark-ui/react/tabs";
import { jsx } from "react/jsx-runtime";
var TabsProvider = ArkTabs.RootProvider;
var TabsContext = ArkTabs.Context;
var TabsRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTabs.Root, {
  className: cn("w-full", className),
  ...rest
});
var TabsList = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTabs.List, {
  className: cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
  ...rest
});
var TabsTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTabs.Trigger, {
  className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm", className),
  ...rest
});
var TabsContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTabs.Content, {
  className: cn("mt-2 rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", className),
  ...rest
});
var TabsIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTabs.Indicator, {
  className: cn("absolute transition-all duration-200 data-[orientation=vertical]:right-0 data-[orientation=horizontal]:bottom-0", className),
  ...rest
});
export {
  TabsTrigger,
  TabsRoot,
  TabsProvider,
  TabsList,
  TabsIndicator,
  TabsContext,
  TabsContent
};
