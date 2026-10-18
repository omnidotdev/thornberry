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
/**
 * Avatar with click-to-edit upload, crop, and remove. The storage endpoints are
 * host-specific, so the actual upload and clear are injected; the crop UX and
 * client-side validation live here. Defaults target the signed-in user's
 * avatar, but `src`/`fallback`/`onChanged`/`copy` repoint it at any entity
 */
declare const AvatarUpload: ({ size, editable, uploadEnabled, cropShape, src, fallback, onUpload, onClear, onChanged, copy: copyOverrides, }: AvatarUploadProps) => import("react/jsx-runtime").JSX.Element;
export { AvatarUpload };
