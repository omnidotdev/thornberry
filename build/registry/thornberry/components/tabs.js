import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/tabs.tsx
import { Tabs as ArkTabs } from "@ark-ui/react/tabs";
import { jsxDEV } from "react/jsx-dev-runtime";
var TabsProvider = ArkTabs.RootProvider;
var TabsContext = ArkTabs.Context;
var TabsRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTabs.Root, {
  className: cn("w-full", className),
  ...rest
}, undefined, false, undefined, this);
var TabsList = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTabs.List, {
  className: cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var TabsTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTabs.Trigger, {
  className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-sm", className),
  ...rest
}, undefined, false, undefined, this);
var TabsContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTabs.Content, {
  className: cn("mt-2 rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", className),
  ...rest
}, undefined, false, undefined, this);
var TabsIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTabs.Indicator, {
  className: cn("absolute transition-all duration-200 data-[orientation=vertical]:right-0 data-[orientation=horizontal]:bottom-0", className),
  ...rest
}, undefined, false, undefined, this);
export {
  TabsTrigger,
  TabsRoot,
  TabsProvider,
  TabsList,
  TabsIndicator,
  TabsContext,
  TabsContent
};
