import { Camera, CloudUpload, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";
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
  MAX_IMAGE_SIZE,
} from "@/registry/thornberry/lib/crop";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * User-facing copy for the upload control, overridable so the same control can
 * drive a personal avatar or another entity such as a workspace logo
 */
interface AvatarUploadCopy {
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

const defaultCopy: AvatarUploadCopy = {
  menuTitle: "Profile photo",
  cropTitle: "Crop your photo",
  updatedTitle: "Avatar updated",
  updatedDescription: "Your profile picture has been updated.",
  removedTitle: "Avatar removed",
  removedDescription: "Your profile picture has been removed.",
  removeConfirmTitle: "Remove profile photo?",
  removeConfirmDescription:
    "This removes your current profile photo. You can upload a new one anytime.",
};

interface AvatarUploadProps {
  /** Rendered avatar size */
  size?: AvatarSize;
  /** Whether the avatar opens the edit dialog on click */
  editable?: boolean;
  /** Whether photo uploads are available (host config). Defaults to true */
  uploadEnabled?: boolean;
  /** Crop framing: a round mask for people, a square one for logos */
  cropShape?: "round" | "rect";
  /**
   * Current image URL. Defaults to the signed-in user's avatar so the personal
   * profile needs no wiring; pass it (with `fallback` and `onChanged`) to drive
   * a different entity such as a workspace logo
   */
  src?: string | null;
  /** Fallback glyph when there is no image. Defaults to the user's initial */
  fallback?: string;
  /**
   * Host uploads the cropped blob to its own storage and applies it to the
   * entity. Omit (or set uploadEnabled false) to disable uploads
   */
  onUpload?: (blob: Blob) => Promise<void>;
  /** Host clears the image. Omit to hide the remove option */
  onClear?: () => Promise<void>;
  /**
   * Refresh the surrounding view after an upload or remove. Defaults to
   * refetching the auth session (for the personal avatar); pass it to reload
   * other data such as a workspace
   */
  onChanged?: () => void | Promise<void>;
  /** Copy overrides for non-avatar entities (e.g. a workspace logo) */
  copy?: Partial<AvatarUploadCopy>;
}

const sizeClassMap: Record<AvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
  "2xl": "size-16",
};

const sizePixelMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  "2xl": 64,
};

/**
 * Avatar with click-to-edit upload, crop, and remove. The storage endpoints are
 * host-specific, so the actual upload and clear are injected; the crop UX and
 * client-side validation live here. Defaults target the signed-in user's
 * avatar, but `src`/`fallback`/`onChanged`/`copy` repoint it at any entity
 */
const AvatarUpload = ({
  size = "md",
  editable = true,
  uploadEnabled = true,
  cropShape = "round",
  src,
  fallback,
  onUpload,
  onClear,
  onChanged,
  copy: copyOverrides,
}: AvatarUploadProps) => {
  const { authClient, toaster } = useAccountContext();

  const { data: session, refetch } = authClient.useSession();

  const copy = { ...defaultCopy, ...copyOverrides };
  // `src === undefined` means "uncontrolled": fall back to the session user so
  // the personal profile works with no wiring. An explicit null is a controlled
  // empty (e.g. a workspace with no logo)
  const resolvedImage = src !== undefined ? src : session?.user.image;
  const resolvedFallback =
    fallback !== undefined ? fallback : session?.user.name?.charAt(0);
  const refresh = onChanged ?? refetch;

  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const canUpload = uploadEnabled && !!onUpload;
  const hasImage = !!(previewUrl || resolvedImage);
  const isBusy = isUploading || isClearing;
  const isCropping = !!imageToCrop;

  const pixelSize = sizePixelMap[size];
  const iconSize = Math.max(16, pixelSize * 0.4);

  const resetCrop = useCallback(() => {
    setImageToCrop(null);
  }, []);

  const handleClear = useCallback(async () => {
    if (!onClear || isBusy) return;

    setIsClearing(true);

    try {
      await onClear();
      setPreviewUrl(null);
      await refresh();
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
    refresh,
    toaster,
    copy.removedTitle,
    copy.removedDescription,
  ]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toaster.error({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, WebP, or GIF image.",
        });
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toaster.error({
          title: "File too large",
          description: "Image must be less than 5 MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        await refresh();

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
    [onUpload, refresh, toaster, copy.updatedTitle, copy.updatedDescription],
  );

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: role is conditionally set when editable */}
      <div
        className="avatar-upload-wrapper relative inline-flex w-fit shrink-0"
        role={editable ? "button" : undefined}
        tabIndex={editable && !isBusy ? 0 : undefined}
        onClick={() => {
          if (editable && !isBusy) setDialogOpen(true);
        }}
        onKeyDown={(event) => {
          if (
            editable &&
            !isBusy &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            setDialogOpen(true);
          }
        }}
        style={{ cursor: editable && !isBusy ? "pointer" : "default" }}
      >
        <AvatarRoot className={sizeClassMap[size]}>
          <AvatarImage src={previewUrl || resolvedImage || undefined} />
          <AvatarFallback>{resolvedFallback}</AvatarFallback>
        </AvatarRoot>

        {editable && (
          <div
            className="avatar-overlay absolute inset-0 flex items-center justify-center rounded-full bg-black/60 transition-opacity"
            style={{ opacity: isBusy ? 1 : 0, pointerEvents: "none" }}
          >
            {isBusy ? (
              <Loader2 size={iconSize} color="white" className="animate-spin" />
            ) : (
              <Camera size={iconSize} color="white" />
            )}
          </div>
        )}

        <style>{`
          .avatar-upload-wrapper:hover .avatar-overlay {
            opacity: 1 !important;
          }
        `}</style>
      </div>

      <input
        ref={fileInputRef}
        type="file"
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
                cropShape={cropShape}
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
                    Upload new photo
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Photo uploads are unavailable right now.
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
                    {isClearing ? "Removing..." : "Remove photo"}
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

export { AvatarUpload };
