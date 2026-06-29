import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/table.tsx
import { jsxDEV } from "react/jsx-dev-runtime";
var Table = ({ containerProps, className, ...rest }) => /* @__PURE__ */ jsxDEV("div", {
  "data-slot": "table-container",
  className: cn("no-scrollbar relative w-full overflow-auto", containerProps),
  children: /* @__PURE__ */ jsxDEV("table", {
    "data-slot": "table",
    className: cn("w-full caption-bottom text-sm", className),
    ...rest
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var TableHeader = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("thead", {
  "data-slot": "table-header",
  className: cn("h-8 [&_tr]:border-b", className),
  ...rest
}, undefined, false, undefined, this);
var TableBody = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("tbody", {
  "data-slot": "table-body",
  className: cn("[&_tr:last-child]:border-0", className),
  ...rest
}, undefined, false, undefined, this);
var TableFooter = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("tfoot", {
  "data-slot": "table-footer",
  className: cn("border-t bg-muted/50 [&>tr]:last:border-b-0", className),
  ...rest
}, undefined, false, undefined, this);
var TableRow = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("tr", {
  "data-slot": "table-row",
  className: cn("border-b hover:bg-accent data-[state=selected]:bg-accent", className),
  ...rest
}, undefined, false, undefined, this);
var TableHead = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("th", {
  "data-slot": "table-head",
  className: cn("whitespace-nowrap p-1 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5", className),
  ...rest
}, undefined, false, undefined, this);
var TableCell = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("td", {
  "data-slot": "table-cell",
  className: cn("select-none whitespace-nowrap p-2 align-middle font-light [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5", className),
  ...rest
}, undefined, false, undefined, this);
var TableCaption = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("caption", {
  "data-slot": "table-caption",
  className: cn("mt-4 text-muted-foreground text-sm", className),
  ...rest
}, undefined, false, undefined, this);
export {
  TableRow,
  TableHeader,
  TableHead,
  TableFooter,
  TableCell,
  TableCaption,
  TableBody,
  Table
};
