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
/**
 * Avatar with click-to-edit upload, crop, and remove. The storage endpoints are
 * host-specific, so the actual upload and clear are injected; the crop UX and
 * client-side validation live here.
 */
declare const AvatarUpload: ({ size, editable, uploadEnabled, onUpload, onClear, }: AvatarUploadProps) => import("react/jsx-runtime").JSX.Element;
export { AvatarUpload };
