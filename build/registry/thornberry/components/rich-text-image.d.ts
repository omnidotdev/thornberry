import { DecoratorNode } from "lexical";
import type { DOMConversionMap, DOMExportOutput, LexicalCommand, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
/** What an `upload` call resolves to: the hosted image's absolute URL and, when known, its pixel size */
interface RichTextImageUploadResult {
    /** Absolute `https://` URL of the hosted file (`http://` only with `allowInsecureHttp`) */
    src: string;
    /** Natural pixel width, used as the starting width (clamped to `maxWidth`) */
    width?: number;
    /** Natural pixel height */
    height?: number;
}
/** Why an image could not be inserted */
type RichTextImageErrorCode = "unsupported-type" | "file-too-large" | "upload-failed" | "invalid-url";
/** An image insert failure, with a message safe to show to the person editing */
interface RichTextImageError {
    code: RichTextImageErrorCode;
    /** Plain-language message, ready to show in a toast or inline */
    message: string;
    /** The file involved, for file inserts */
    file?: File;
    /** The rejected link, for `invalid-url` */
    url?: string;
    /** The underlying error (e.g. what `upload` rejected with), for logging only */
    cause?: unknown;
}
/** Turns on images in the rich text editor */
interface RichTextImageOptions {
    /**
     * Host a picked, pasted, or dropped file and resolve to its public URL. The
     * file is passed through untouched, so animated GIFs stay animated
     */
    upload: (file: File) => Promise<RichTextImageUploadResult>;
    /** File types accepted, as in an `<input accept>`. Defaults to JPEG, PNG, WebP, and GIF */
    accept?: string;
    /** Largest file size accepted, in bytes. Unlimited by default */
    maxBytes?: number;
    /** Widest an image may be set, in pixels. Defaults to 600, the usual email body width */
    maxWidth?: number;
    /**
     * Whether image sources may be another site's. Called for every image source
     * the editor would keep: upload results, links, and images in loaded or
     * pasted HTML. When it returns false, a loaded or pasted image becomes a
     * placeholder asking for the image to be uploaded instead (it is never loaded
     * or exported), a link is refused, and an upload counts as failed. Pass a
     * host whitelist so every exported image is one you host
     */
    isAllowedSrc?: (src: string) => boolean;
    /**
     * Accept `http://` image sources. Off by default (only `https://`); turn on
     * only for local development against a plain-http asset server
     */
    allowInsecureHttp?: boolean;
    /**
     * Called when an image cannot be inserted (wrong type, too large, upload
     * failed, link refused). When omitted, the editor shows the message inline
     * instead. A refused link is also explained inside the link form, so
     * `invalid-url` can be ignored if that is enough
     */
    onError?: (error: RichTextImageError) => void;
}
/** A summary of the images in the editor, reported through `onUpdate` */
interface RichTextImageSummary {
    /** Number of images, including uploading and external ones */
    count: number;
    /** Whether any image still lacks alt text */
    hasMissingAltText: boolean;
    /** Whether any image is still uploading */
    isUploading: boolean;
    /** Whether any image is hosted elsewhere and still needs uploading (it exports nothing) */
    hasExternalImages: boolean;
}
/** Image settings the node reads while importing, exporting, and rendering */
interface ImageSourcePolicy {
    maxWidth: number;
    allowInsecureHttp: boolean;
    isAllowedSrc?: (src: string) => boolean;
}
declare const DEFAULT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
declare const DEFAULT_IMAGE_MAX_WIDTH = 600;
/**
 * Inline style on exported images: a block that scales down on narrow screens,
 * never stretches vertically, and has no border (older desktop mail clients
 * draw one around linked images)
 */
declare const EMAIL_IMAGE_STYLE = "display:block;max-width:100%;height:auto;border:0";
/**
 * How an image source fares: "allowed" may be loaded and exported, "external"
 * is an http(s) image that may not be used (plain http without
 * `allowInsecureHttp`, or refused by `isAllowedSrc`), and "invalid" is not an
 * absolute http(s) URL at all (`data:`, `blob:`, relative)
 */
type ImageSrcVerdict = "allowed" | "external" | "invalid";
/** Judge an image source against a policy (https only by default) */
declare const checkImageSrc: (src: string | null | undefined, { allowInsecureHttp, isAllowedSrc, }?: Partial<Pick<ImageSourcePolicy, "allowInsecureHttp" | "isAllowedSrc">>) => ImageSrcVerdict;
/** Whether `src` is an absolute `https://` URL (or `http://` when allowed) */
declare const isSafeImageSrc: (src: string | null | undefined, allowInsecureHttp?: boolean) => src is string;
/**
 * The canonical form of an image source (`new URL(src).href`: lowercased
 * scheme and host, resolved dots, percent-encoding), which is what
 * `isAllowedSrc` judges, so the source kept and exported is exactly the one
 * that was checked. A source that is not a URL (an upload placeholder's empty
 * one) is returned trimmed
 */
declare const normalizeImageSrc: (src: string) => string;
/** Whether `value` is an absolute `https://` URL */
declare const isHttpsUrl: (value: string) => boolean;
/** Round a width to whole pixels within [16, maxWidth] */
declare const clampImageWidth: (width: number, maxWidth: number) => number;
/**
 * Check a file against the accepted types and size limit before uploading,
 * returning the error to report or null when it may be uploaded
 */
declare const validateImageFile: (file: File, { accept, maxBytes }: Partial<RichTextImageOptions>) => RichTextImageError | null;
interface RichTextImagePayload {
    src: string;
    alt?: string;
    width?: number | null;
    /** True while the file is uploading; the node renders a placeholder and exports nothing */
    uploading?: boolean;
    /** True for an image hosted elsewhere that must be uploaded before it can be used */
    external?: boolean;
    /** File name shown on the uploading placeholder */
    fileName?: string;
    /**
     * True for an image that must never render or export (pasted editor data
     * while images are off, or malformed data); it is removed on the next update
     */
    inert?: boolean;
}
type SerializedRichTextImageNode = Spread<{
    src: string;
    alt: string;
    width: number | null;
}, SerializedLexicalNode>;
/**
 * A block-level image in the rich text editor. Exports email-safe markup: an
 * absolute https `src`, `alt`, a pixel `width` (at most the editor's
 * `maxWidth`), and a block style that scales down on narrow screens.
 * Uploading and external images export nothing
 */
declare class RichTextImageNode extends DecoratorNode<ReactNode> {
    __src: string;
    __alt: string;
    __width: number | null;
    __uploading: boolean;
    __external: boolean;
    __fileName: string;
    __inert: boolean;
    static getType(): string;
    static clone(node: RichTextImageNode): RichTextImageNode;
    static importJSON(json: SerializedRichTextImageNode): RichTextImageNode;
    static importDOM(): DOMConversionMap;
    constructor(payload?: RichTextImagePayload, key?: NodeKey);
    exportJSON(): SerializedRichTextImageNode;
    exportDOM(editor: LexicalEditor): DOMExportOutput;
    createDOM(): HTMLElement;
    updateDOM(): false;
    isInline(): false;
    getSrc(): string;
    getAlt(): string;
    getWidth(): number | null;
    isUploading(): boolean;
    isExternal(): boolean;
    isInert(): boolean;
    /** Mark the image as hosted elsewhere (true) or usable (false) */
    setExternal(external: boolean): this;
    /** End a failed upload: an image being replaced goes back to its external placeholder */
    cancelUpload(): this;
    setAlt(alt: string): this;
    setWidth(width: number | null): this;
    /** Show the uploading placeholder (e.g. while replacing an external image) */
    setUploading(fileName: string): this;
    /** Swap the uploading placeholder for the hosted image */
    setUploaded(src: string, width: number | null): this;
    decorate(): ReactNode;
}
declare const $createRichTextImageNode: (payload: RichTextImagePayload) => RichTextImageNode;
declare const $isRichTextImageNode: (node: LexicalNode | null | undefined) => node is RichTextImageNode;
/** Read the image summary inside an editor read or update */
declare const $getRichTextImageSummary: () => RichTextImageSummary;
/** Read the image summary for an editor */
declare const getRichTextImageSummary: (editor: LexicalEditor) => RichTextImageSummary;
/** Insert an already-hosted image (absolute https URL allowed by the policy) at the selection */
declare const INSERT_RICH_TEXT_IMAGE_COMMAND: LexicalCommand<{
    src: string;
    alt?: string;
    width?: number;
}>;
/** Validate, upload, and insert image files at the selection */
declare const UPLOAD_RICH_TEXT_IMAGES_COMMAND: LexicalCommand<File[]>;
/** Upload a file in place of an existing image (e.g. one hosted elsewhere) */
declare const REPLACE_RICH_TEXT_IMAGE_COMMAND: LexicalCommand<{
    key: NodeKey;
    file: File;
}>;
/**
 * Mark events inside `ref` as handled so the editor root ignores them: typing
 * Backspace in the alt text field must edit the field, never delete the
 * selected image
 */
declare const useIsolateFromEditor: (ref: RefObject<HTMLElement | null>) => void;
/** Keep Enter in a settings field from submitting a form the editor sits in */
declare const preventSubmit: (event: KeyboardEvent<HTMLInputElement>) => void;
declare const inputClassName = "flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aria-invalid:border-destructive";
/**
 * Remember how an upload turned out so an undo or redo that restores its
 * placeholder can re-apply it, keeping only the most recent `limit` outcomes
 */
declare const rememberUploadOutcome: <K, V>(outcomes: Map<K, V>, key: K, outcome: V, limit?: number) => void;
interface RichTextImagesProps {
    /** Image settings; images are off while this is undefined */
    options: RichTextImageOptions | undefined;
    children: ReactNode;
}
/**
 * Turns on images inside a `LexicalComposer`: registers the insert, upload,
 * paste, and drop handling, and provides the settings the image view and
 * toolbar controls read. `RichTextEditor` always renders this (with
 * `options` undefined while images are off), so `images` can be toggled
 * without remounting the editor. The editor must register
 * {@link RichTextImageNode}
 */
declare const RichTextImages: ({ options, children }: RichTextImagesProps) => import("react/jsx-runtime").JSX.Element;
interface RichTextImageToolbarControlsProps {
    /** Toolbar button wrapper used by the host toolbar, so the controls match it */
    renderButton: (props: {
        label: string;
        icon: ReactNode;
        onClick: () => void;
        pressed?: boolean;
    }) => ReactNode;
}
/**
 * Toolbar controls for images: upload from the device, or insert a hosted
 * image by its https link. Renders nothing while images are off
 */
declare const RichTextImageToolbarControls: ({ renderButton, }: RichTextImageToolbarControlsProps) => import("react/jsx-runtime").JSX.Element | null;
export type { ImageSrcVerdict, RichTextImageError, RichTextImageErrorCode, RichTextImageOptions, RichTextImageSummary, RichTextImageUploadResult, SerializedRichTextImageNode, };
export { $createRichTextImageNode, $getRichTextImageSummary, $isRichTextImageNode, DEFAULT_IMAGE_ACCEPT, DEFAULT_IMAGE_MAX_WIDTH, EMAIL_IMAGE_STYLE, INSERT_RICH_TEXT_IMAGE_COMMAND, REPLACE_RICH_TEXT_IMAGE_COMMAND, RichTextImageNode, RichTextImageToolbarControls, RichTextImages, UPLOAD_RICH_TEXT_IMAGES_COMMAND, checkImageSrc, clampImageWidth, getRichTextImageSummary, inputClassName, isHttpsUrl, isSafeImageSrc, normalizeImageSrc, preventSubmit, rememberUploadOutcome, useIsolateFromEditor, validateImageFile, };
