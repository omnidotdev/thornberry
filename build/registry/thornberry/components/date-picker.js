import {
  Button
} from "../../../chunks/avatar-07z52b3z.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/date-picker.tsx
import { DatePicker as ArkDatePicker } from "@ark-ui/react/date-picker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
"use client";
var DatePickerProvider = ArkDatePicker.RootProvider;
var DatePickerContext = ArkDatePicker.Context;
var DatePickerPositioner = ArkDatePicker.Positioner;
var DatePickerRangeText = ArkDatePicker.RangeText;
var DatePickerView = ArkDatePicker.View;
var DatePickerTableBody = ArkDatePicker.TableBody;
var DatePickerTableHead = ArkDatePicker.TableHead;
var DatePickerTableRow = ArkDatePicker.TableRow;
var DatePickerRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Root, {
  className: cn("flex flex-col gap-1.5", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Label, {
  className: cn("font-medium text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Control, {
  className: cn("flex items-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Input, {
  className: cn("flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Trigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "outline",
    size: "icon",
    className: cn("ml-2 h-10 w-10", className),
    children: /* @__PURE__ */ jsxDEV(Calendar, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var DatePickerClearTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.ClearTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "ghost",
    size: "sm",
    className: cn("h-auto px-2 text-xs", className),
    children: "Clear"
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var DatePickerContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-10 flex w-[344px] min-w-fit origin-(--transform-origin) flex-col rounded-md border bg-background p-4 shadow-lg duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerViewControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.ViewControl, {
  className: cn("flex items-center justify-between", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerViewTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.ViewTrigger, {
  className: cn("flex items-center justify-center rounded-md px-2 py-1 font-medium text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerPrevTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.PrevTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "ghost",
    size: "icon",
    className,
    children: /* @__PURE__ */ jsxDEV(ChevronLeft, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var DatePickerNextTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.NextTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "ghost",
    size: "icon",
    className,
    children: /* @__PURE__ */ jsxDEV(ChevronRight, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var DatePickerTable = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.Table, {
  className: cn("mt-0 mb-4 w-full border-spacing-0.5 rounded-md border", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerTableHeader = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.TableHeader, {
  className: cn("h-10 w-10 border-0 bg-transparent text-center font-semibold text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerTableCell = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.TableCell, {
  className: cn("h-8 w-8 rounded-md border-0 p-0 text-center outline-none hover:bg-accent", className),
  ...rest
}, undefined, false, undefined, this);
var DatePickerTableCellTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkDatePicker.TableCellTrigger, {
  className: cn("h-full w-full cursor-pointer rounded-md p-2 outline-none focus-visible:bg-accent data-disabled:cursor-not-allowed data-selected:bg-primary data-disabled:text-muted-foreground data-selected:text-black data-disabled:hover:bg-background", className),
  ...rest
}, undefined, false, undefined, this);
export {
  DatePickerViewTrigger,
  DatePickerViewControl,
  DatePickerView,
  DatePickerTrigger,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableHead,
  DatePickerTableCellTrigger,
  DatePickerTableCell,
  DatePickerTableBody,
  DatePickerTable,
  DatePickerRoot,
  DatePickerRangeText,
  DatePickerProvider,
  DatePickerPrevTrigger,
  DatePickerPositioner,
  DatePickerNextTrigger,
  DatePickerLabel,
  DatePickerInput,
  DatePickerControl,
  DatePickerContext,
  DatePickerContent,
  DatePickerClearTrigger
};
