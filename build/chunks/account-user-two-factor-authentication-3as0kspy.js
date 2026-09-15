import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot
} from "./account-user-two-factor-authentication-w1smy5z1.js";
import {
  useAccountContext
} from "./account-user-two-factor-authentication-en4v22ys.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "./account-user-two-factor-authentication-negb4kbv.js";
import {
  ALLOWED_IMAGE_TYPES,
  ImageCropper,
  MAX_IMAGE_SIZE
} from "./account-user-two-factor-authentication-hpbe7ba5.js";
import {
  Button
} from "./account-user-two-factor-authentication-jb3sh07m.js";

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
var AvatarUpload = ({
  size = "md",
  editable = true,
  uploadEnabled = true,
  onUpload,
  onClear
}) => {
  const { authClient, toaster } = useAccountContext();
  const { data: session, refetch } = authClient.useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    setDialogOpen(false);
    try {
      await onClear();
      setPreviewUrl(null);
      await refetch();
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
          /* @__PURE__ */ jsxs(AvatarRoot, {
            className: sizeClassMap[size],
            children: [
              /* @__PURE__ */ jsx(AvatarImage, {
                src: previewUrl || session?.user.image || undefined
              }),
              /* @__PURE__ */ jsx(AvatarFallback, {
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
      /* @__PURE__ */ jsxs(DialogRoot, {
        open: dialogOpen,
        onOpenChange: ({ open }) => {
          setDialogOpen(open);
          if (!open)
            resetCrop();
        },
        children: [
          /* @__PURE__ */ jsx(DialogBackdrop, {}),
          /* @__PURE__ */ jsx(DialogPositioner, {
            children: /* @__PURE__ */ jsxs(DialogContent, {
              children: [
                /* @__PURE__ */ jsx(DialogTitle, {
                  children: isCropping ? "Crop your photo" : "Profile photo"
                }),
                isCropping && imageToCrop ? /* @__PURE__ */ jsx(ImageCropper, {
                  imageSrc: imageToCrop,
                  cropShape: "round",
                  confirming: isUploading,
                  onCancel: resetCrop,
                  onConfirm: handleCropConfirm
                }) : /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col gap-3",
                  children: [
                    canUpload ? /* @__PURE__ */ jsxs(Button, {
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
                    hasImage && onClear && /* @__PURE__ */ jsxs(Button, {
                      variant: "outline",
                      className: "w-full justify-start gap-3 text-red-500 hover:text-red-600",
                      onClick: handleClear,
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
      })
    ]
  });
};
export { AvatarUpload };
