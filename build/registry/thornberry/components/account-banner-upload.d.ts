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
declare const BannerUpload: ({ src, editable, uploadEnabled, onUpload, onClear, onChanged, copy: copyOverrides, }: BannerUploadProps) => import("react/jsx-runtime").JSX.Element;
export { BannerUpload };
