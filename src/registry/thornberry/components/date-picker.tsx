"use client";

import { DatePicker as ArkDatePicker } from "@ark-ui/react/date-picker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const datePickerVariants = tv({
  slots: {
    root: "flex flex-col gap-1.5",
    label: "font-medium text-sm",
    control: "flex items-center gap-2",
    input:
      "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
    trigger: "ml-2 h-10 w-10",
    clearTrigger: "h-auto px-2 text-xs",
    content:
      "z-10 flex w-[344px] min-w-fit flex-col rounded-md border bg-background p-4 shadow-lg",
    viewControl: "flex items-center justify-between",
    viewTrigger:
      "flex items-center justify-center rounded-md font-medium text-sm",
    table: "mt-0 mb-4 w-full border-spacing-[2px]",
    tableHeader:
      "h-10 w-10 border-0 bg-transparent text-center font-semibold text-sm",
    tableCell: "h-8 w-8 rounded border-0 p-0 text-center hover:bg-accent",
    tableCellTrigger:
      "h-full w-full cursor-pointer rounded p-2 data-[selected]:bg-accent data-[selected]:text-primary",
  },
});

const {
  root,
  label,
  control,
  input,
  trigger,
  clearTrigger,
  content,
  viewControl,
  viewTrigger,
  table,
  tableHeader,
  tableCell,
  tableCellTrigger,
} = datePickerVariants();

const DatePickerProvider = ArkDatePicker.RootProvider;
const DatePickerContext = ArkDatePicker.Context;
const DatePickerPositioner = ArkDatePicker.Positioner;
const DatePickerRangeText = ArkDatePicker.RangeText;
const DatePickerView = ArkDatePicker.View;
const DatePickerTableBody = ArkDatePicker.TableBody;
const DatePickerTableHead = ArkDatePicker.TableHead;
const DatePickerTableRow = ArkDatePicker.TableRow;

const DatePickerRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Root>) => (
  <ArkDatePicker.Root className={cn(root(), className)} {...rest} />
);

const DatePickerLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Label>) => (
  <ArkDatePicker.Label className={cn(label(), className)} {...rest} />
);

const DatePickerControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Control>) => (
  <ArkDatePicker.Control className={cn(control(), className)} {...rest} />
);

const DatePickerInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Input>) => (
  <ArkDatePicker.Input className={cn(input(), className)} {...rest} />
);

const DatePickerTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Trigger>) => (
  <ArkDatePicker.Trigger asChild {...rest}>
    <Button variant="outline" size="icon" className={cn(trigger(), className)}>
      <Calendar className="h-4 w-4" />
    </Button>
  </ArkDatePicker.Trigger>
);

const DatePickerClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ClearTrigger>) => (
  <ArkDatePicker.ClearTrigger asChild {...rest}>
    <Button variant="ghost" size="sm" className={cn(clearTrigger(), className)}>
      Clear
    </Button>
  </ArkDatePicker.ClearTrigger>
);

const DatePickerContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Content>) => (
  <ArkDatePicker.Content className={cn(content(), className)} {...rest} />
);

const DatePickerViewControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ViewControl>) => (
  <ArkDatePicker.ViewControl
    className={cn(viewControl(), className)}
    {...rest}
  />
);

const DatePickerViewTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ViewTrigger>) => (
  <ArkDatePicker.ViewTrigger
    className={cn(viewTrigger(), className)}
    {...rest}
  />
);

const DatePickerPrevTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.PrevTrigger>) => (
  <ArkDatePicker.PrevTrigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={cn(className)}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
  </ArkDatePicker.PrevTrigger>
);

const DatePickerNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.NextTrigger>) => (
  <ArkDatePicker.NextTrigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={cn(className)}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </ArkDatePicker.NextTrigger>
);

const DatePickerTable = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Table>) => (
  <ArkDatePicker.Table className={cn(table(), className)} {...rest} />
);

const DatePickerTableHeader = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableHeader>) => (
  <ArkDatePicker.TableHeader
    className={cn(tableHeader(), className)}
    {...rest}
  />
);

const DatePickerTableCell = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableCell>) => (
  <ArkDatePicker.TableCell className={cn(tableCell(), className)} {...rest} />
);

const DatePickerTableCellTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableCellTrigger>) => (
  <ArkDatePicker.TableCellTrigger
    className={cn(tableCellTrigger(), className)}
    {...rest}
  />
);

export {
  DatePickerRoot,
  DatePickerLabel,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  DatePickerPrevTrigger,
  DatePickerNextTrigger,
  DatePickerTable,
  DatePickerTableHead,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerProvider,
  DatePickerContext,
  DatePickerPositioner,
  DatePickerRangeText,
  DatePickerTableCellTrigger,
};
