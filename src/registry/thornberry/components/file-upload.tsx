import { FileUpload } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const FileUploadContext = FileUpload.Context;

const FileUploadRoot = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.Root>) => (
  <FileUpload.Root className={cn("w-full", className)} {...rest} />
);

const FileUploadDropzone = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.Dropzone>) => (
  <FileUpload.Dropzone
    className={cn(
      "flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-background p-6 text-center transition-colors hover:border-muted-foreground/50 hover:bg-accent/50",
      className,
    )}
    {...rest}
  />
);

const FileUploadTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.Trigger>) => (
  <FileUpload.Trigger
    className={cn(
      "inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs outline-none transition-all hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const FileUploadItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.ItemGroup>) => (
  <FileUpload.ItemGroup className={cn("mt-4 space-y-2", className)} {...rest} />
);

const FileUploadItem = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.Item>) => (
  <FileUpload.Item
    className={cn(
      "flex items-center justify-between rounded-md border bg-background p-3",
      className,
    )}
    {...rest}
  />
);

const FileUploadItemName = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.ItemName>) => (
  <FileUpload.ItemName
    className={cn("font-medium text-sm", className)}
    {...rest}
  />
);

const FileUploadItemSizeText = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.ItemSizeText>) => (
  <FileUpload.ItemSizeText
    className={cn("text-muted-foreground text-xs", className)}
    {...rest}
  />
);

const FileUploadItemDeleteTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.ItemDeleteTrigger>) => (
  <FileUpload.ItemDeleteTrigger
    className={cn(
      "w-6 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
      className,
    )}
    {...rest}
  />
);

const FileUploadLabel = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.Label>) => (
  <FileUpload.Label
    className={cn("font-medium text-sm", className)}
    {...rest}
  />
);

const FileUploadHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof FileUpload.HiddenInput>) => (
  <FileUpload.HiddenInput className={className} {...rest} />
);

export {
  FileUploadContext,
  FileUploadRoot as FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItem,
  FileUploadItemName,
  FileUploadItemSizeText,
  FileUploadItemDeleteTrigger,
  FileUploadLabel,
  FileUploadHiddenInput,
};
