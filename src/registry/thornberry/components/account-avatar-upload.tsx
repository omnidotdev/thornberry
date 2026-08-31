import { Camera, CloudUpload, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";

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

import type { Area, Point } from "react-easy-crop";

/** Maximum avatar size: 5 MB */
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

/** Allowed avatar file types */
const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Crop an image to the given pixel area and return a JPEG Blob. An opaque white
 * background is filled first so transparent source pixels do not encode as
 * black in the alpha-less JPEG output.
 */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
  });
};

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
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const canUpload = uploadEnabled && !!onUpload;
  const hasImage = !!(previewUrl || session?.user.image);
  const isBusy = isUploading || isClearing;
  const isCropping = !!imageToCrop;

  const pixelSize = sizePixelMap[size];
  const iconSize = Math.max(16, pixelSize * 0.4);

  const resetCrop = useCallback(() => {
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
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

      if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        toaster.error({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, WebP, or GIF image.",
        });
        return;
      }

      if (file.size > MAX_AVATAR_SIZE) {
        toaster.error({
          title: "File too large",
          description: "Image must be less than 5 MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [toaster],
  );

  const handleCropConfirm = useCallback(async () => {
    if (!imageToCrop || !croppedAreaPixels || !onUpload) return;

    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }

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
  }, [imageToCrop, croppedAreaPixels, onUpload, refetch, toaster]);

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
        accept={ALLOWED_AVATAR_TYPES.join(",")}
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

            {isCropping ? (
              <div className="flex flex-col gap-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 300,
                    background: "var(--colors-background-subtle)",
                    borderRadius: "var(--radii-md)",
                    overflow: "hidden",
                  }}
                >
                  <Cropper
                    image={imageToCrop ?? undefined}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={(_: Area, pixels: Area) =>
                      setCroppedAreaPixels(pixels)
                    }
                    onZoomChange={setZoom}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-sm">Zoom</p>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={resetCrop}>
                    Cancel
                  </Button>
                  <Button onClick={handleCropConfirm} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Save"}
                  </Button>
                </div>
              </div>
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
