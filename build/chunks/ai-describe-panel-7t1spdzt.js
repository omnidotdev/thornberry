import {
  Button2
} from "./ai-describe-panel-g9z5bw52.js";
import {
  cn
} from "./ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/date-picker.tsx
import { DatePicker as ArkDatePicker } from "@ark-ui/react/date-picker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { jsx } from "react/jsx-runtime";
"use client";
var DatePickerProvider2 = ArkDatePicker.RootProvider;
var DatePickerContext2 = ArkDatePicker.Context;
var DatePickerPositioner2 = ArkDatePicker.Positioner;
var DatePickerRangeText2 = ArkDatePicker.RangeText;
var DatePickerView2 = ArkDatePicker.View;
var DatePickerTableBody2 = ArkDatePicker.TableBody;
var DatePickerTableHead2 = ArkDatePicker.TableHead;
var DatePickerTableRow2 = ArkDatePicker.TableRow;
var DatePickerRoot2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Root, {
  className: cn("flex flex-col gap-1.5", className),
  ...rest
});
var DatePickerLabel2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Label, {
  className: cn("font-medium text-sm", className),
  ...rest
});
var DatePickerControl2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Control, {
  className: cn("flex items-center gap-2", className),
  ...rest
});
var DatePickerInput2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Input, {
  className: cn("flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var DatePickerTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Trigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button2, {
    variant: "outline",
    size: "icon",
    className: cn("ml-2 h-10 w-10", className),
    children: /* @__PURE__ */ jsx(Calendar, {
      className: "h-4 w-4"
    })
  })
});
var DatePickerClearTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.ClearTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button2, {
    variant: "ghost",
    size: "sm",
    className: cn("h-auto px-2 text-xs", className),
    children: "Clear"
  })
});
var DatePickerContent2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-10 flex w-[344px] min-w-fit origin-(--transform-origin) flex-col rounded-md border bg-background p-4 shadow-lg duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var DatePickerViewControl2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.ViewControl, {
  className: cn("flex items-center justify-between", className),
  ...rest
});
var DatePickerViewTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.ViewTrigger, {
  className: cn("flex items-center justify-center rounded-md px-2 py-1 font-medium text-sm", className),
  ...rest
});
var DatePickerPrevTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.PrevTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button2, {
    variant: "ghost",
    size: "icon",
    className,
    children: /* @__PURE__ */ jsx(ChevronLeft, {
      className: "h-4 w-4"
    })
  })
});
var DatePickerNextTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.NextTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button2, {
    variant: "ghost",
    size: "icon",
    className,
    children: /* @__PURE__ */ jsx(ChevronRight, {
      className: "h-4 w-4"
    })
  })
});
var DatePickerTable2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.Table, {
  className: cn("mt-0 mb-4 w-full border-spacing-0.5 rounded-md border", className),
  ...rest
});
var DatePickerTableHeader2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.TableHeader, {
  className: cn("h-10 w-10 border-0 bg-transparent text-center font-semibold text-sm", className),
  ...rest
});
var DatePickerTableCell2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.TableCell, {
  className: cn("h-8 w-8 rounded-md border-0 p-0 text-center outline-none hover:bg-accent", className),
  ...rest
});
var DatePickerTableCellTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDatePicker.TableCellTrigger, {
  className: cn("h-full w-full cursor-pointer rounded-md p-2 outline-none focus-visible:bg-accent data-disabled:cursor-not-allowed data-selected:bg-primary data-disabled:text-muted-foreground data-selected:text-black data-disabled:hover:bg-background", className),
  ...rest
});
export { DatePickerProvider2, DatePickerContext2, DatePickerPositioner2, DatePickerRangeText2, DatePickerView2, DatePickerTableBody2, DatePickerTableHead2, DatePickerTableRow2, DatePickerRoot2, DatePickerLabel2, DatePickerControl2, DatePickerInput2, DatePickerTrigger2, DatePickerClearTrigger2, DatePickerContent2, DatePickerViewControl2, DatePickerViewTrigger2, DatePickerPrevTrigger2, DatePickerNextTrigger2, DatePickerTable2, DatePickerTableHeader2, DatePickerTableCell2, DatePickerTableCellTrigger2 };
