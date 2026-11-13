import {
  useAccountContext2
} from "./account-user-two-factor-authentication-b60vh03c.js";
import {
  Button2
} from "./account-user-two-factor-authentication-qyg3bvpa.js";
import {
  DialogRoot2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2
} from "./account-user-two-factor-authentication-8q0yqrx6.js";
import {
  ConfirmDialog2
} from "./account-user-two-factor-authentication-p4sysg6s.js";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_BANNER_IMAGE_SIZE,
  BANNER_ASPECT,
  ImageCropper2
} from "./account-user-two-factor-authentication-4v8v7btg.js";
import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/account-banner-upload.tsx
import { Camera, CloudUpload, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var defaultCopy = {
  label: "Workspace banner",
  menuTitle: "Workspace banner",
  cropTitle: "Crop banner",
  updatedTitle: "Banner updated",
  updatedDescription: "The workspace banner has been updated.",
  removedTitle: "Banner removed",
  removedDescription: "The workspace banner has been removed.",
  removeConfirmTitle: "Remove workspace banner?",
  removeConfirmDescription: "This removes the current workspace banner. You can upload a new one anytime."
};
var BannerUpload2 = ({
  src,
  editable = true,
  uploadEnabled = true,
  onUpload,
  onClear,
  onChanged,
  copy: copyOverrides
}) => {
  const { toaster } = useAccountContext2();
  const copy = { ...defaultCopy, ...copyOverrides };
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const canUpload = uploadEnabled && !!onUpload;
  const image = previewUrl || src;
  const hasImage = !!image;
  const isBusy = isUploading || isClearing;
  const isCropping = !!imageToCrop;
  const resetCrop = useCallback(() => {
    setImageToCrop(null);
  }, []);
  const handleClear = useCallback(async () => {
    if (!onClear || isBusy)
      return;
    setIsClearing(true);
    try {
      await onClear();
      setPreviewUrl(null);
      await onChanged?.();
      setConfirmRemoveOpen(false);
      setDialogOpen(false);
      toaster.success({
        title: copy.removedTitle,
        description: copy.removedDescription
      });
    } catch (error) {
      toaster.error({
        title: "Failed to remove",
        description: error instanceof Error ? error.message : "Failed to remove"
      });
    } finally {
      setIsClearing(false);
    }
  }, [
    onClear,
    isBusy,
    onChanged,
    toaster,
    copy.removedTitle,
    copy.removedDescription
  ]);
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file)
      return;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toaster.error({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WebP, or GIF image."
      });
      return;
    }
    if (file.size > MAX_BANNER_IMAGE_SIZE) {
      toaster.error({
        title: "File too large",
        description: "Image must be less than 10 MB."
      });
      return;
    }
    const reader = new FileReader;
    reader.onloadend = () => {
      setImageToCrop(reader.result);
    };
    reader.readAsDataURL(file);
  }, [toaster]);
  const handleCropConfirm = useCallback(async (croppedBlob) => {
    if (!onUpload)
      return;
    setIsUploading(true);
    try {
      setPreviewUrl(URL.createObjectURL(croppedBlob));
      await onUpload(croppedBlob);
      await onChanged?.();
      setImageToCrop(null);
      setDialogOpen(false);
      toaster.success({
        title: copy.updatedTitle,
        description: copy.updatedDescription
      });
    } catch (error) {
      setPreviewUrl(null);
      toaster.error({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload"
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, onChanged, toaster, copy.updatedTitle, copy.updatedDescription]);
  const frameClassName = "group relative block aspect-4/1 w-full overflow-hidden rounded-lg border bg-linear-to-r from-muted to-muted/40";
  const preview = hasImage ? /* @__PURE__ */ jsx("img", {
    src: image ?? undefined,
    alt: editable ? "" : copy.label,
    className: "size-full object-cover"
  }) : null;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      editable ? /* @__PURE__ */ jsxs("button", {
        type: "button",
        className: cn(frameClassName, !isBusy && "cursor-pointer"),
        "aria-label": copy.label,
        disabled: isBusy,
        onClick: () => setDialogOpen(true),
        children: [
          preview ?? /* @__PURE__ */ jsxs("span", {
            className: "flex size-full items-center justify-center gap-2 text-muted-foreground text-sm",
            children: [
              /* @__PURE__ */ jsx(ImageIcon, {
                className: "size-4"
              }),
              "Add a banner"
            ]
          }),
          /* @__PURE__ */ jsx("span", {
            className: cn("pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100", isBusy ? "opacity-100" : "opacity-0"),
            children: isBusy ? /* @__PURE__ */ jsx(Loader2, {
              className: "size-6 animate-spin text-white"
            }) : /* @__PURE__ */ jsx(Camera, {
              className: "size-6 text-white"
            })
          })
        ]
      }) : /* @__PURE__ */ jsx("div", {
        className: frameClassName,
        children: preview
      }),
      /* @__PURE__ */ jsx("input", {
        ref: fileInputRef,
        type: "file",
        "aria-label": "Banner image",
        accept: ALLOWED_IMAGE_TYPES.join(","),
        onChange: handleFileChange,
        style: { display: "none" }
      }),
      /* @__PURE__ */ jsxs(DialogRoot2, {
        open: dialogOpen,
        onOpenChange: ({ open }) => {
          setDialogOpen(open);
          if (!open)
            resetCrop();
        },
        children: [
          /* @__PURE__ */ jsx(DialogBackdrop2, {}),
          /* @__PURE__ */ jsx(DialogPositioner2, {
            children: /* @__PURE__ */ jsxs(DialogContent2, {
              children: [
                /* @__PURE__ */ jsx(DialogTitle2, {
                  children: isCropping ? copy.cropTitle : copy.menuTitle
                }),
                isCropping && imageToCrop ? /* @__PURE__ */ jsx(ImageCropper2, {
                  imageSrc: imageToCrop,
                  cropShape: "rect",
                  aspect: BANNER_ASPECT,
                  confirming: isUploading,
                  onCancel: resetCrop,
                  onConfirm: handleCropConfirm
                }) : /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col gap-3",
                  children: [
                    canUpload ? /* @__PURE__ */ jsxs(Button2, {
                      variant: "outline",
                      className: "w-full justify-start gap-3",
                      onClick: () => fileInputRef.current?.click(),
                      children: [
                        /* @__PURE__ */ jsx(CloudUpload, {
                          className: "size-5"
                        }),
                        "Upload new banner"
                      ]
                    }) : /* @__PURE__ */ jsx("p", {
                      className: "text-muted-foreground text-sm",
                      children: "Banner uploads are unavailable right now."
                    }),
                    hasImage && onClear && /* @__PURE__ */ jsxs(Button2, {
                      variant: "outline",
                      className: "w-full justify-start gap-3 text-red-500 hover:text-red-600",
                      onClick: () => setConfirmRemoveOpen(true),
                      disabled: isClearing,
                      children: [
                        /* @__PURE__ */ jsx(Trash2, {
                          className: "size-5"
                        }),
                        isClearing ? "Removing..." : "Remove banner"
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx(ConfirmDialog2, {
        open: confirmRemoveOpen,
        onOpenChange: setConfirmRemoveOpen,
        title: copy.removeConfirmTitle,
        description: copy.removeConfirmDescription,
        confirmLabel: "Remove",
        isPending: isClearing,
        onConfirm: handleClear
      })
    ]
  });
};
export { BannerUpload2 };
