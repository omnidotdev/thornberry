import { Camera, CloudUpload, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";
import { Button } from "@/registry/thornberry/components/button";
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

interface AvatarUploadProps {
  /** Rendered avatar size */
  size?: AvatarSize;
  /** Whether the avatar opens the edit dialog on click */
  editable?: boolean;
  /** Whether photo uploads are available (host config). Defaults to true */
  uploadEnabled?: boolean;
  /**
   * Host uploads the cropped avatar blob to its own storage and applies it to
   * the user; the session is refetched afterward to reflect the new image. Omit
   * (or set uploadEnabled false) to disable uploads.
   */
  onUpload?: (blob: Blob) => Promise<void>;
  /** Host clears the user's avatar. Omit to hide the remove option */
  onClear?: () => Promise<void>;
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
 * client-side validation live here.
 */
const AvatarUpload = ({
  size = "md",
  editable = true,
  uploadEnabled = true,
  onUpload,
  onClear,
}: AvatarUploadProps) => {
  const { authClient, toaster } = useAccountContext();

  const { data: session, refetch } = authClient.useSession();

  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

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
    if (!onClear || isBusy) return;

    setIsClearing(true);
    setDialogOpen(false);

    try {
      await onClear();
      setPreviewUrl(null);
      await refetch();
      toaster.success({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      toaster.error({
        title: "Failed to remove avatar",
        description:
          error instanceof Error ? error.message : "Failed to remove avatar",
      });
    } finally {
      setIsClearing(false);
    }
  }, [onClear, isBusy, refetch, toaster]);

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
        await refetch();

        setImageToCrop(null);
        setDialogOpen(false);

        toaster.success({
          title: "Avatar updated",
          description: "Your profile picture has been updated.",
        });
      } catch (error) {
        setPreviewUrl(null);
        toaster.error({
          title: "Upload failed",
          description:
            error instanceof Error ? error.message : "Failed to upload avatar",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, refetch, toaster],
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
          <AvatarImage src={previewUrl || session?.user.image || undefined} />
          <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
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
              {isCropping ? "Crop your photo" : "Profile photo"}
            </DialogTitle>

            {isCropping && imageToCrop ? (
              <ImageCropper
                imageSrc={imageToCrop}
                cropShape="round"
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
                    onClick={handleClear}
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
    </>
  );
};

export { AvatarUpload };
