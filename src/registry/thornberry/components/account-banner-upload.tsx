import { Camera, CloudUpload, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import { ConfirmDialog } from "@/registry/thornberry/components/confirm-dialog";
import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/registry/thornberry/components/dialog";
import { ImageCropper } from "@/registry/thornberry/components/image-cropper";
import {
  ALLOWED_IMAGE_TYPES,
  BANNER_ASPECT,
  MAX_BANNER_IMAGE_SIZE,
} from "@/registry/thornberry/lib/crop";

/** User-facing copy for the banner control, overridable per entity */
interface BannerUploadCopy {
  /** Accessible label for the banner preview and its hidden file input */
  label: string;
  /** Title over the upload/remove choices */
  menuTitle: string;
  /** Title over the crop step */
  cropTitle: string;
  /** Upload-success toast */
  updatedTitle: string;
  updatedDescription: string;
  /** Remove-success toast */
  removedTitle: string;
  removedDescription: string;
  /** Remove-confirmation dialog */
  removeConfirmTitle: string;
  removeConfirmDescription: string;
}

const defaultCopy: BannerUploadCopy = {
  label: "Workspace banner",
  menuTitle: "Workspace banner",
  cropTitle: "Crop banner",
  updatedTitle: "Banner updated",
  updatedDescription: "The workspace banner has been updated.",
  removedTitle: "Banner removed",
  removedDescription: "The workspace banner has been removed.",
  removeConfirmTitle: "Remove workspace banner?",
  removeConfirmDescription:
    "This removes the current workspace banner. You can upload a new one anytime.",
};

interface BannerUploadProps {
  /** Current banner URL, or null when unset (shows a placeholder) */
  src: string | null;
  /** Whether the banner opens the edit dialog on click */
  editable?: boolean;
  /** Whether banner uploads are available (host config). Defaults to true */
  uploadEnabled?: boolean;
  /**
   * Host uploads the cropped 4:1 JPEG to its own storage and applies it to the
   * entity. Omit (or set uploadEnabled false) to disable uploads
   */
  onUpload?: (blob: Blob) => Promise<void>;
  /** Host clears the banner. Omit to hide the remove option */
  onClear?: () => Promise<void>;
  /** Refresh the surrounding view after an upload or remove */
  onChanged?: () => void | Promise<void>;
  /** Copy overrides */
  copy?: Partial<BannerUploadCopy>;
}

/**
 * Wide (4:1) banner preview with click-to-edit upload, crop, and remove. The
 * banner counterpart of `AvatarUpload`: the storage endpoints are host-specific,
 * so the actual upload and clear are injected, while the crop UX, client-side
 * validation, and the remove confirmation live here
 */
const BannerUpload = ({
  src,
  editable = true,
  uploadEnabled = true,
  onUpload,
  onClear,
  onChanged,
  copy: copyOverrides,
}: BannerUploadProps) => {
  const { toaster } = useAccountContext();

  const copy = { ...defaultCopy, ...copyOverrides };

  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const canUpload = uploadEnabled && !!onUpload;
  const image = previewUrl || src;
  const hasImage = !!image;
  const isBusy = isUploading || isClearing;
  const isCropping = !!imageToCrop;

  const resetCrop = useCallback(() => {
    setImageToCrop(null);
  }, []);

  const handleClear = useCallback(async () => {
    if (!onClear || isBusy) return;

    setIsClearing(true);

    try {
      await onClear();
      setPreviewUrl(null);
      await onChanged?.();
      setConfirmRemoveOpen(false);
      setDialogOpen(false);
      toaster.success({
        title: copy.removedTitle,
        description: copy.removedDescription,
      });
    } catch (error) {
      toaster.error({
        title: "Failed to remove",
        description:
          error instanceof Error ? error.message : "Failed to remove",
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
    copy.removedDescription,
  ]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toaster.error({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, WebP, or GIF image.",
        });
        return;
      }

      if (file.size > MAX_BANNER_IMAGE_SIZE) {
        toaster.error({
          title: "File too large",
          description: "Image must be less than 10 MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [toaster],
  );

  const handleCropConfirm = useCallback(
    async (croppedBlob: Blob) => {
      if (!onUpload) return;

      setIsUploading(true);

      try {
        setPreviewUrl(URL.createObjectURL(croppedBlob));

        await onUpload(croppedBlob);
        await onChanged?.();

        setImageToCrop(null);
        setDialogOpen(false);

        toaster.success({
          title: copy.updatedTitle,
          description: copy.updatedDescription,
        });
      } catch (error) {
        setPreviewUrl(null);
        toaster.error({
          title: "Upload failed",
          description:
            error instanceof Error ? error.message : "Failed to upload",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, onChanged, toaster, copy.updatedTitle, copy.updatedDescription],
  );

  const frameClassName =
    "group relative block aspect-4/1 w-full overflow-hidden rounded-lg border bg-linear-to-r from-muted to-muted/40";

  const preview = hasImage ? (
    <img
      src={image ?? undefined}
      alt={editable ? "" : copy.label}
      className="size-full object-cover"
    />
  ) : null;

  return (
    <>
      {editable ? (
        <button
          type="button"
          className={cn(frameClassName, !isBusy && "cursor-pointer")}
          aria-label={copy.label}
          disabled={isBusy}
          onClick={() => setDialogOpen(true)}
        >
          {preview ?? (
            <span className="flex size-full items-center justify-center gap-2 text-muted-foreground text-sm">
              <ImageIcon className="size-4" />
              Add a banner
            </span>
          )}

          <span
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
              isBusy ? "opacity-100" : "opacity-0",
            )}
          >
            {isBusy ? (
              <Loader2 className="size-6 animate-spin text-white" />
            ) : (
              <Camera className="size-6 text-white" />
            )}
          </span>
        </button>
      ) : (
        <div className={frameClassName}>{preview}</div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        aria-label="Banner image"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <DialogRoot
        open={dialogOpen}
        onOpenChange={({ open }) => {
          setDialogOpen(open);
          if (!open) resetCrop();
        }}
      >
        <DialogBackdrop />

        <DialogPositioner>
          <DialogContent>
            <DialogTitle>
              {isCropping ? copy.cropTitle : copy.menuTitle}
            </DialogTitle>

            {isCropping && imageToCrop ? (
              <ImageCropper
                imageSrc={imageToCrop}
                cropShape="rect"
                aspect={BANNER_ASPECT}
                confirming={isUploading}
                onCancel={resetCrop}
                onConfirm={handleCropConfirm}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {canUpload ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUpload className="size-5" />
                    Upload new banner
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Banner uploads are unavailable right now.
                  </p>
                )}

                {hasImage && onClear && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600"
                    onClick={() => setConfirmRemoveOpen(true)}
                    disabled={isClearing}
                  >
                    <Trash2 className="size-5" />
                    {isClearing ? "Removing..." : "Remove banner"}
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        title={copy.removeConfirmTitle}
        description={copy.removeConfirmDescription}
        confirmLabel="Remove"
        isPending={isClearing}
        onConfirm={handleClear}
      />
    </>
  );
};

export { BannerUpload };
