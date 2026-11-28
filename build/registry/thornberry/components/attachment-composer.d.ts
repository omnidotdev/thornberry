import type { ClipboardEvent, DragEvent, ReactNode } from "react";
/**
 * Chat attachments for a composer: an attach button, paste a screenshot, drag
 * and drop, preview chips with remove, and a plain message when a file can't
 * be attached. Files are read in the browser into base64 ready to send; the
 * product's server checks them again (by their bytes, the limits, and See Less
 * screening for images) with `@omnidotdev/providers/attachments`, which shares
 * these defaults
 */
/** Image types a model reads */
export declare const ATTACHMENT_IMAGE_TYPES: readonly ["image/png", "image/jpeg", "image/webp", "image/gif"];
export type AttachmentImageType = (typeof ATTACHMENT_IMAGE_TYPES)[number];
/** Files read for their text: a PDF, or plain text, Markdown, or CSV */
export declare const ATTACHMENT_DOCUMENT_TYPES: readonly ["application/pdf", "text/plain", "text/markdown", "text/csv"];
export type AttachmentDocumentType = (typeof ATTACHMENT_DOCUMENT_TYPES)[number];
/** How much one message may carry, matching the server's checks */
export interface AttachmentLimits {
    /** Most files one message carries, images and documents together */
    maxAttachments: number;
    /** Largest image sent, in bytes, after any downscale */
    maxImageBytes: number;
    /** Largest image accepted before downscaling, in bytes */
    maxSourceImageBytes: number;
    /** Longest image edge sent; a larger image is scaled down to it */
    maxImageEdge: number;
    /** Largest PDF, in bytes */
    maxPdfBytes: number;
    /** Largest plain text, Markdown, or CSV file, in bytes */
    maxTextFileBytes: number;
}
export declare const DEFAULT_ATTACHMENT_LIMITS: AttachmentLimits;
/** `accept` for the file picker: images and documents, by type and extension */
export declare const ATTACH_ACCEPT: string;
/** `accept` for an images-only picker */
export declare const ATTACH_IMAGES_ACCEPT: string;
/** An image attached to the composer, ready to send */
export interface AttachedImageFile {
    kind: "image";
    id: string;
    name: string;
    mediaType: AttachmentImageType;
    /** Base64, without a `data:` prefix */
    data: string;
    /** A `data:` URL for the thumbnail */
    previewUrl: string;
}
/** A document attached to the composer, ready to send */
export interface AttachedDocumentFile {
    kind: "document";
    id: string;
    name: string;
    mediaType: AttachmentDocumentType;
    /** Base64, without a `data:` prefix */
    data: string;
}
/** Anything attached to the composer */
export type ComposerAttachment = AttachedImageFile | AttachedDocumentFile;
export type PrepareResult = {
    ok: true;
    attachment: ComposerAttachment;
} | {
    ok: false;
    message: string;
};
export declare const isAttachmentImageType: (type: string) => type is AttachmentImageType;
/**
 * The document type of a picked file, by its label or else its extension, or
 * null when it isn't one that is read
 */
export declare const documentTypeOf: (file: {
    name: string;
    type: string;
}) => AttachmentDocumentType | null;
/**
 * Why a picked document can't be attached, or null when it can. Its content
 * is checked again by the server, which reads it
 */
export declare const documentFileProblem: (file: {
    name: string;
    type: string;
    size: number;
}, limits?: AttachmentLimits) => string | null;
/**
 * Why a picked image can't be attached, or null when it can: PNG, JPEG, WebP,
 * and GIF are read, and very large files are refused before reading
 */
export declare const imageFileProblem: (file: {
    type: string;
    size: number;
}, limits?: AttachmentLimits) => string | null;
/** Size that fits within `max` on its longest edge, keeping the shape */
export declare const fitWithin: (width: number, height: number, max?: number) => {
    width: number;
    height: number;
};
/** Split a `data:` URL into its type and base64 payload */
export declare const fromDataUrl: (url: string) => {
    mediaType: string;
    data: string;
} | null;
/** Decoded byte length of base64 text */
export declare const base64Bytes: (data: string) => number;
/**
 * Read a picked or pasted image for sending. One small enough and within the
 * edge limit is sent as it is; a larger one is scaled down and re-encoded as
 * JPEG in the browser, so nothing larger than needed leaves the device
 */
export declare const prepareImage: (file: File, limits?: AttachmentLimits) => Promise<PrepareResult>;
/**
 * Read a picked document for sending, as it is. A PDF must start like one; a
 * text file is read by the server, which checks it is real text
 */
export declare const prepareDocument: (file: File, limits?: AttachmentLimits) => Promise<PrepareResult>;
/**
 * Read any picked, pasted, or dropped file: an image, or (unless `documents`
 * is off) a document
 */
export declare const prepareAttachment: (file: File, limits?: AttachmentLimits, documents?: boolean) => Promise<PrepareResult>;
/** "1 image attached", "2 files attached", or "1 image and 1 file attached" */
export declare const attachmentsLabel: (images?: number, files?: number) => string;
export interface UseAttachmentsOptions {
    /** Limits to apply instead of the shared defaults */
    limits?: Partial<AttachmentLimits>;
    /** Take PDFs and text files as well as images. Defaults to on */
    documents?: boolean;
    /** Stop taking new files, e.g. while a message is sending */
    disabled?: boolean;
}
/** The composer's attachments and the handlers that add to them */
export interface AttachmentsController {
    attachments: ComposerAttachment[];
    /** Why the last file couldn't be attached, or null */
    error: string | null;
    /** Whether files are being dragged over the drop zone */
    dragging: boolean;
    limits: AttachmentLimits;
    documents: boolean;
    disabled: boolean;
    /** Read and attach files, up to the limit, setting `error` for any refused */
    addFiles: (files: File[]) => Promise<void>;
    remove: (id: string) => void;
    /** Clear the attachments and the error, e.g. once a message is sent */
    clear: () => void;
    /** Put attachments back, e.g. when a send failed */
    restore: (attachments: ComposerAttachment[]) => void;
    setError: (error: string | null) => void;
    /** For the composer textarea: a pasted screenshot attaches, text pastes as usual */
    onPaste: (event: ClipboardEvent<HTMLElement>) => void;
    /** Spread on the element files may be dropped onto */
    dropZoneProps: {
        onDragEnter: (event: DragEvent<HTMLElement>) => void;
        onDragOver: (event: DragEvent<HTMLElement>) => void;
        onDragLeave: (event: DragEvent<HTMLElement>) => void;
        onDrop: (event: DragEvent<HTMLElement>) => void;
    };
}
/**
 * State and handlers for a composer's attachments: pick, paste, or drop files,
 * each read and checked in the browser (type, size, a downscale for large
 * images) before it is attached, up to `maxAttachments` per message
 */
export declare const useAttachments: ({ limits: overrides, documents, disabled, }?: UseAttachmentsOptions) => AttachmentsController;
export interface AttachButtonProps {
    /** Files already attached, to stop at the limit */
    count: number;
    /** Most files per message. Defaults to 3 */
    max?: number;
    disabled?: boolean;
    onFiles: (files: File[]) => void;
    /** `accept` for the picker. Defaults to images and documents */
    accept?: string;
    /** Accessible name. Defaults to "Attach files" */
    label?: string;
    /**
     * Tooltip: what can be attached and what happens to it. Defaults to the
     * limit and the kinds of files taken
     */
    title?: string;
    className?: string;
}
/**
 * The attach button and its hidden file picker. Picking the same file again
 * still attaches it
 */
export declare const AttachButton: ({ count, max, disabled, onFiles, accept, label, title, className, }: AttachButtonProps) => import("react/jsx-runtime").JSX.Element;
export interface AttachmentListProps {
    attachments: ComposerAttachment[];
    onRemove: (id: string) => void;
    /** Accessible name of the list. Defaults to "Attached files" */
    label?: string;
    className?: string;
}
/**
 * The attached files above the prompt, each removable: images as thumbnails,
 * documents as named chips. Removing one only takes it off this message, so
 * it needs no confirmation
 */
export declare const AttachmentList: ({ attachments, onRemove, label, className, }: AttachmentListProps) => import("react/jsx-runtime").JSX.Element | null;
export interface AttachmentErrorProps {
    message: string | null;
    className?: string;
}
/** Why a file couldn't be attached, announced when it appears */
export declare const AttachmentError: ({ message, className, }: AttachmentErrorProps) => import("react/jsx-runtime").JSX.Element | null;
export interface AttachmentDropOverlayProps {
    /** Show it (the controller's `dragging`) */
    active: boolean;
    /** Text shown while files are over the drop zone */
    children?: ReactNode;
    className?: string;
}
/**
 * Shown over the drop zone while files are dragged onto it. Place it inside a
 * `relative` element carrying the controller's `dropZoneProps`
 */
export declare const AttachmentDropOverlay: ({ active, children, className, }: AttachmentDropOverlayProps) => import("react/jsx-runtime").JSX.Element | null;
