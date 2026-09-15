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
declare const ImageCropper: ({ imageSrc, cropShape, aspect, confirmLabel, confirmingLabel, confirming, onCancel, onConfirm, }: ImageCropperProps) => import("react/jsx-runtime").JSX.Element;
export { ImageCropper };
