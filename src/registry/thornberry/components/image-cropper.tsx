import { useState } from "react";
import Cropper from "react-easy-crop";

import { Button } from "@/registry/thornberry/components/button";
import { getCroppedImg } from "@/registry/thornberry/lib/crop";

import type { Area, Point } from "react-easy-crop";

interface ImageCropperProps {
  /** Data URL (or object URL) of the image being cropped */
  imageSrc: string;
  /** Crop mask shape. Round for avatars, rect for square logos. Defaults to round */
  cropShape?: "round" | "rect";
  /** Crop aspect ratio. Defaults to 1 (square) */
  aspect?: number;
  /** Label for the confirm button. Defaults to "Save" */
  confirmLabel?: string;
  /** Label for the confirm button while confirming. Defaults to "Uploading..." */
  confirmingLabel?: string;
  /** Whether the confirm action is in flight */
  confirming?: boolean;
  /** Discard the crop */
  onCancel: () => void;
  /** Receive the cropped JPEG blob */
  onConfirm: (blob: Blob) => void | Promise<void>;
}

/**
 * The shared crop step used by every avatar/logo uploader: a react-easy-crop
 * canvas plus a zoom slider and cancel/save actions. Keeping one implementation
 * means every upload surface crops consistently, rather than some accepting a
 * raw file. The host owns the surrounding dialog and the upload itself; this
 * only turns a chosen image into a cropped blob.
 */
const ImageCropper = ({
  imageSrc,
  cropShape = "round",
  aspect = 1,
  confirmLabel = "Save",
  confirmingLabel = "Uploading...",
  confirming = false,
  onCancel,
  onConfirm,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedBlob) return;

    await onConfirm(croppedBlob);
  };

  return (
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
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={confirming}>
          {confirming ? confirmingLabel : confirmLabel}
        </Button>
      </div>
    </div>
  );
};

export { ImageCropper };
