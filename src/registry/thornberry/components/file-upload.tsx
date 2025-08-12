import { FileUpload } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

const fileUploadVariants = tv({
  slots: {
    root: "w-full",
    dropzone:
      "flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed bg-background p-6 text-center transition-colors hover:bg-accent/50",
    trigger:
      "inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs outline-none transition-all hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
    itemGroup: "mt-4 space-y-2",
    item: "flex items-center justify-between rounded-md border bg-background p-3",
    itemName: "font-medium text-sm",
    itemSize: "text-muted-foreground text-xs",
    itemDeleteTrigger:
      "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground",
    label: "font-medium text-sm",
  },
  variants: {
    size: {
      sm: {
        dropzone: "p-4 text-sm",
        trigger: "h-8 px-3 text-xs",
        item: "p-2",
        itemName: "text-xs",
        itemSize: "text-xs",
        label: "text-xs",
      },
      md: {
        dropzone: "p-6 text-sm",
        trigger: "h-9 px-4 text-sm",
        item: "p-3",
        itemName: "text-sm",
        itemSize: "text-xs",
        label: "text-sm",
      },
      lg: {
        dropzone: "p-8 text-base",
        trigger: "h-10 px-6 text-sm",
        item: "p-4",
        itemName: "text-base",
        itemSize: "text-sm",
        label: "text-base",
      },
    },
    variant: {
      default: {
        dropzone: "border-border bg-background hover:bg-accent/50",
      },
      outlined: {
        dropzone: "border-input bg-background hover:bg-muted/50",
      },
      minimal: {
        dropzone:
          "border-muted-foreground/25 border-dashed bg-transparent hover:border-muted-foreground/50",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

const FileUploadContext = FileUpload.Context;

const FileUploadRoot = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.Root> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return <FileUpload.Root className={cn(styles.root(), className)} {...rest} />;
};

const FileUploadDropzone = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.Dropzone> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.Dropzone
      className={cn(styles.dropzone(), className)}
      {...rest}
    />
  );
};

const FileUploadTrigger = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.Trigger> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.Trigger className={cn(styles.trigger(), className)} {...rest} />
  );
};

const FileUploadItemGroup = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.ItemGroup> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.ItemGroup
      className={cn(styles.itemGroup(), className)}
      {...rest}
    />
  );
};

const FileUploadItem = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.Item> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return <FileUpload.Item className={cn(styles.item(), className)} {...rest} />;
};

const FileUploadItemName = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.ItemName> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.ItemName
      className={cn(styles.itemName(), className)}
      {...rest}
    />
  );
};

const FileUploadItemSizeText = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.ItemSizeText> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.ItemSizeText
      className={cn(styles.itemSize(), className)}
      {...rest}
    />
  );
};

const FileUploadItemDeleteTrigger = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.ItemDeleteTrigger> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.ItemDeleteTrigger
      className={cn(styles.itemDeleteTrigger(), className)}
      {...rest}
    />
  );
};

const FileUploadLabel = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof FileUpload.Label> &
  VariantProps<typeof fileUploadVariants>) => {
  const styles = fileUploadVariants({ size, variant });
  return (
    <FileUpload.Label className={cn(styles.label(), className)} {...rest} />
  );
};

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
  fileUploadVariants,
};
