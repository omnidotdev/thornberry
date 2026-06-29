import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/file-upload.tsx
import { FileUpload } from "@ark-ui/react";
import { jsxDEV } from "react/jsx-dev-runtime";
var FileUploadContext = FileUpload.Context;
var FileUploadRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.Root, {
  className: cn("w-full", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadDropzone = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.Dropzone, {
  className: cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-background p-6 text-center outline-none transition-colors hover:border-primary hover:bg-accent/50 focus-visible:border-primary focus-visible:border-dashed focus-visible:bg-accent/50", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.Trigger, {
  className: cn("inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs outline-none transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.ItemGroup, {
  className: cn("mt-4 space-y-2", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.Item, {
  className: cn("flex items-center justify-between rounded-md border bg-background p-3", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadItemName = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.ItemName, {
  className: cn("font-medium text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadItemSizeText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.ItemSizeText, {
  className: cn("text-muted-foreground text-xs", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadItemDeleteTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.ItemDeleteTrigger, {
  className: cn("w-6 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.Label, {
  className: cn("font-medium text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var FileUploadHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(FileUpload.HiddenInput, {
  className,
  ...rest
}, undefined, false, undefined, this);
export {
  FileUploadTrigger,
  FileUploadLabel,
  FileUploadItemSizeText,
  FileUploadItemName,
  FileUploadItemGroup,
  FileUploadItemDeleteTrigger,
  FileUploadItem,
  FileUploadHiddenInput,
  FileUploadDropzone,
  FileUploadContext,
  FileUploadRoot as FileUpload
};
