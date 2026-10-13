import {
  useAccountContext2
} from "./account-user-two-factor-authentication-b60vh03c.js";
import {
  AvatarRoot2,
  AvatarFallback2,
  AvatarImage2
} from "./account-user-two-factor-authentication-b7jpk793.js";
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
} from "./account-user-two-factor-authentication-1qzbdkf5.js";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  ImageCropper2
} from "./account-user-two-factor-authentication-q37czf6m.js";

// src/registry/thornberry/components/account-avatar-upload.tsx
import { Camera, CloudUpload, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var sizeClassMap = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
  "2xl": "size-16"
};
var sizePixelMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  "2xl": 64
};
var AvatarUpload2 = ({
  size = "md",
  editable = true,
  uploadEnabled = true,
  onUpload,
  onClear
}) => {
  const { authClient, toaster } = useAccountContext2();
  const { data: session, refetch } = authClient.useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const canUpload = uploadEnabled && !!onUpload;
  const hasImage = !!(previewUrl || session?.user.image);
  const isBusy = isUploading || isClearing;
  const isCropping = !!imageToCrop;
  const pixelSize = sizePixelMap[size];
  const iconSize = Math.max(16, pixelSize * 0.4);
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
      await refetch();
      setConfirmRemoveOpen(false);
      setDialogOpen(false);
      toaster.success({
        title: "Avatar removed",
        description: "Your profile picture has been removed."
      });
    } catch (error) {
      toaster.error({
        title: "Failed to remove avatar",
        description: error instanceof Error ? error.message : "Failed to remove avatar"
      });
    } finally {
      setIsClearing(false);
    }
  }, [onClear, isBusy, refetch, toaster]);
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file)
      return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toaster.error({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WebP, or GIF image."
      });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toaster.error({
        title: "File too large",
        description: "Image must be less than 5 MB."
      });
      return;
    }
    const reader = new FileReader;
    reader.onloadend = () => {
      setImageToCrop(reader.result);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [toaster]);
  const handleCropConfirm = useCallback(async (croppedBlob) => {
    if (!onUpload)
      return;
    setIsUploading(true);
    try {
      setPreviewUrl(URL.createObjectURL(croppedBlob));
      await onUpload(croppedBlob);
      await refetch();
      setImageToCrop(null);
      setDialogOpen(false);
      toaster.success({
        title: "Avatar updated",
        description: "Your profile picture has been updated."
      });
    } catch (error) {
      setPreviewUrl(null);
      toaster.error({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar"
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, refetch, toaster]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "avatar-upload-wrapper relative inline-flex w-fit shrink-0",
        role: editable ? "button" : undefined,
        tabIndex: editable && !isBusy ? 0 : undefined,
        onClick: () => {
          if (editable && !isBusy)
            setDialogOpen(true);
        },
        onKeyDown: (event) => {
          if (editable && !isBusy && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setDialogOpen(true);
          }
        },
        style: { cursor: editable && !isBusy ? "pointer" : "default" },
        children: [
          /* @__PURE__ */ jsxs(AvatarRoot2, {
            className: sizeClassMap[size],
            children: [
              /* @__PURE__ */ jsx(AvatarImage2, {
                src: previewUrl || session?.user.image || undefined
              }),
              /* @__PURE__ */ jsx(AvatarFallback2, {
                children: session?.user.name?.charAt(0)
              })
            ]
          }),
          editable && /* @__PURE__ */ jsx("div", {
            className: "avatar-overlay absolute inset-0 flex items-center justify-center rounded-full bg-black/60 transition-opacity",
            style: { opacity: isBusy ? 1 : 0, pointerEvents: "none" },
            children: isBusy ? /* @__PURE__ */ jsx(Loader2, {
              size: iconSize,
              color: "white",
              className: "animate-spin"
            }) : /* @__PURE__ */ jsx(Camera, {
              size: iconSize,
              color: "white"
            })
          }),
          /* @__PURE__ */ jsx("style", {
            children: `
          .avatar-upload-wrapper:hover .avatar-overlay {
            opacity: 1 !important;
          }
        `
          })
        ]
      }),
      /* @__PURE__ */ jsx("input", {
        ref: fileInputRef,
        type: "file",
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
                  children: isCropping ? "Crop your photo" : "Profile photo"
                }),
                isCropping && imageToCrop ? /* @__PURE__ */ jsx(ImageCropper2, {
                  imageSrc: imageToCrop,
                  cropShape: "round",
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
                        "Upload new photo"
                      ]
                    }) : /* @__PURE__ */ jsx("p", {
                      className: "text-muted-foreground text-sm",
                      children: "Photo uploads are unavailable right now."
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
                        isClearing ? "Removing..." : "Remove photo"
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
        title: "Remove profile photo?",
        description: "This removes your current profile photo. You can upload a new one anytime.",
        confirmLabel: "Remove",
        isPending: isClearing,
        onConfirm: handleClear
      })
    ]
  });
};
export { AvatarUpload2 };
