import { FileText, Paperclip, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

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
export const ATTACHMENT_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export type AttachmentImageType = (typeof ATTACHMENT_IMAGE_TYPES)[number];

/** Files read for their text: a PDF, or plain text, Markdown, or CSV */
export const ATTACHMENT_DOCUMENT_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
] as const;

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

export const DEFAULT_ATTACHMENT_LIMITS: AttachmentLimits = {
  maxAttachments: 3,
  maxImageBytes: 2_000_000,
  maxSourceImageBytes: 20_000_000,
  maxImageEdge: 1568,
  maxPdfBytes: 5_000_000,
  maxTextFileBytes: 200_000,
};

/**
 * File types by extension, for files the browser labels loosely (Markdown is
 * often unlabeled, and CSV can arrive as a spreadsheet type)
 */
const EXTENSION_TYPES: Record<string, AttachmentDocumentType> = {
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  markdown: "text/markdown",
  csv: "text/csv",
};

/** `accept` for the file picker: images and documents, by type and extension */
export const ATTACH_ACCEPT = [
  ...ATTACHMENT_IMAGE_TYPES,
  ...ATTACHMENT_DOCUMENT_TYPES,
  ...Object.keys(EXTENSION_TYPES).map((extension) => `.${extension}`),
].join(",");

/** `accept` for an images-only picker */
export const ATTACH_IMAGES_ACCEPT = ATTACHMENT_IMAGE_TYPES.join(",");

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

export type PrepareResult =
  | { ok: true; attachment: ComposerAttachment }
  | { ok: false; message: string };

export const isAttachmentImageType = (
  type: string,
): type is AttachmentImageType =>
  (ATTACHMENT_IMAGE_TYPES as readonly string[]).includes(type);

/**
 * The document type of a picked file, by its label or else its extension, or
 * null when it isn't one that is read
 */
export const documentTypeOf = (file: {
  name: string;
  type: string;
}): AttachmentDocumentType | null => {
  if ((ATTACHMENT_DOCUMENT_TYPES as readonly string[]).includes(file.type)) {
    return file.type as AttachmentDocumentType;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  return EXTENSION_TYPES[extension] ?? null;
};

/** Bytes as people read them: "2 MB", "200 KB" */
const size = (bytes: number): string =>
  bytes >= 1_000_000
    ? `${Math.round(bytes / 100_000) / 10} MB`
    : `${Math.round(bytes / 1000)} KB`;

/** What can be attached, for a refusal */
const attachable = (documents: boolean) =>
  documents
    ? "Attach images (PNG, JPEG, WebP, or GIF), PDFs, or plain text, Markdown, or CSV files."
    : "Attach PNG, JPEG, WebP, or GIF images.";

/**
 * Why a picked document can't be attached, or null when it can. Its content
 * is checked again by the server, which reads it
 */
export const documentFileProblem = (
  file: { name: string; type: string; size: number },
  limits: AttachmentLimits = DEFAULT_ATTACHMENT_LIMITS,
): string | null => {
  const type = documentTypeOf(file);

  if (!type) return attachable(true);

  if (type === "application/pdf" && file.size > limits.maxPdfBytes) {
    return `Each PDF can be up to ${size(limits.maxPdfBytes)}.`;
  }

  if (type !== "application/pdf" && file.size > limits.maxTextFileBytes) {
    return `Each text, Markdown, or CSV file can be up to ${size(limits.maxTextFileBytes)}.`;
  }

  if (file.size === 0) return "That file is empty.";

  return null;
};

/**
 * Why a picked image can't be attached, or null when it can: PNG, JPEG, WebP,
 * and GIF are read, and very large files are refused before reading
 */
export const imageFileProblem = (
  file: { type: string; size: number },
  limits: AttachmentLimits = DEFAULT_ATTACHMENT_LIMITS,
): string | null => {
  if (!isAttachmentImageType(file.type)) return attachable(false);

  if (file.size > limits.maxSourceImageBytes) {
    return "That image is too large. Try a smaller screenshot.";
  }

  return null;
};

/** Size that fits within `max` on its longest edge, keeping the shape */
export const fitWithin = (
  width: number,
  height: number,
  max = DEFAULT_ATTACHMENT_LIMITS.maxImageEdge,
): { width: number; height: number } => {
  const longest = Math.max(width, height);

  if (longest <= max) return { width, height };

  const scale = max / longest;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

/** Split a `data:` URL into its type and base64 payload */
export const fromDataUrl = (
  url: string,
): { mediaType: string; data: string } | null => {
  const match = /^data:([^;,]+);base64,(.+)$/.exec(url);

  return match?.[1] && match[2]
    ? { mediaType: match[1], data: match[2] }
    : null;
};

/** Decoded byte length of base64 text */
export const base64Bytes = (data: string): number =>
  Math.floor((data.length * 3) / 4) -
  (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);

const readDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Read a picked or pasted image for sending. One small enough and within the
 * edge limit is sent as it is; a larger one is scaled down and re-encoded as
 * JPEG in the browser, so nothing larger than needed leaves the device
 */
export const prepareImage = async (
  file: File,
  limits: AttachmentLimits = DEFAULT_ATTACHMENT_LIMITS,
): Promise<PrepareResult> => {
  const problem = imageFileProblem(file, limits);

  if (problem) return { ok: false, message: problem };

  try {
    const bitmap = await createImageBitmap(file);
    const fitted = fitWithin(bitmap.width, bitmap.height, limits.maxImageEdge);
    let url: string;

    if (
      fitted.width === bitmap.width &&
      fitted.height === bitmap.height &&
      file.size <= limits.maxImageBytes
    ) {
      url = await readDataUrl(file);
    } else {
      const canvas = document.createElement("canvas");

      canvas.width = fitted.width;
      canvas.height = fitted.height;
      canvas
        .getContext("2d")
        ?.drawImage(bitmap, 0, 0, fitted.width, fitted.height);
      url = canvas.toDataURL("image/jpeg", 0.85);
    }

    bitmap.close();

    const parsed = fromDataUrl(url);

    if (
      !parsed ||
      !isAttachmentImageType(parsed.mediaType) ||
      base64Bytes(parsed.data) > limits.maxImageBytes
    ) {
      return {
        ok: false,
        message: "That image is too large. Try a smaller screenshot.",
      };
    }

    return {
      ok: true,
      attachment: {
        kind: "image",
        id: newId(),
        name: file.name || "Pasted image",
        mediaType: parsed.mediaType,
        data: parsed.data,
        previewUrl: url,
      },
    };
  } catch {
    return { ok: false, message: "That image couldn't be read." };
  }
};

/**
 * Read a picked document for sending, as it is. A PDF must start like one; a
 * text file is read by the server, which checks it is real text
 */
export const prepareDocument = async (
  file: File,
  limits: AttachmentLimits = DEFAULT_ATTACHMENT_LIMITS,
): Promise<PrepareResult> => {
  const problem = documentFileProblem(file, limits);
  const mediaType = documentTypeOf(file);

  if (problem || !mediaType) {
    return { ok: false, message: problem ?? attachable(true) };
  }

  try {
    if (
      mediaType === "application/pdf" &&
      (await file.slice(0, 5).text()) !== "%PDF-"
    ) {
      return { ok: false, message: "That file isn't a readable PDF." };
    }

    const parsed = fromDataUrl(await readDataUrl(file));

    if (!parsed) return { ok: false, message: "That file couldn't be read." };

    return {
      ok: true,
      attachment: {
        kind: "document",
        id: newId(),
        name: file.name || "Attachment",
        mediaType,
        data: parsed.data,
      },
    };
  } catch {
    return { ok: false, message: "That file couldn't be read." };
  }
};

/**
 * Read any picked, pasted, or dropped file: an image, or (unless `documents`
 * is off) a document
 */
export const prepareAttachment = async (
  file: File,
  limits: AttachmentLimits = DEFAULT_ATTACHMENT_LIMITS,
  documents = true,
): Promise<PrepareResult> => {
  if (isAttachmentImageType(file.type)) return prepareImage(file, limits);

  if (documents && documentTypeOf(file)) return prepareDocument(file, limits);

  return { ok: false, message: attachable(documents) };
};

const count = (n: number, noun: string) =>
  `${n} ${n === 1 ? noun : `${noun}s`}`;

/** "1 image attached", "2 files attached", or "1 image and 1 file attached" */
export const attachmentsLabel = (images = 0, files = 0): string =>
  `${[images > 0 && count(images, "image"), files > 0 && count(files, "file")]
    .filter(Boolean)
    .join(" and ")} attached`;

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

const carriesFiles = (event: DragEvent<HTMLElement>) =>
  Array.from(event.dataTransfer?.types ?? []).includes("Files");

/**
 * State and handlers for a composer's attachments: pick, paste, or drop files,
 * each read and checked in the browser (type, size, a downscale for large
 * images) before it is attached, up to `maxAttachments` per message
 */
export const useAttachments = ({
  limits: overrides,
  documents = true,
  disabled = false,
}: UseAttachmentsOptions = {}): AttachmentsController => {
  const limits = { ...DEFAULT_ATTACHMENT_LIMITS, ...overrides };
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // The count as of the latest change, so files added in one go see the room
  // left by the ones before them
  const current = useRef<ComposerAttachment[]>([]);
  const depth = useRef(0);

  const update = useCallback((next: ComposerAttachment[]) => {
    current.current = next;
    setAttachments(next);
  }, []);

  const addFiles = async (files: File[]) => {
    if (disabled || !files.length) return;

    setError(null);

    const room = limits.maxAttachments - current.current.length;

    if (files.length > room) {
      setError(`Attach up to ${limits.maxAttachments} files to one message.`);
    }

    for (const file of files.slice(0, Math.max(0, room))) {
      const result = await prepareAttachment(file, limits, documents);

      if (result.ok) {
        if (current.current.length < limits.maxAttachments) {
          update([...current.current, result.attachment]);
        }
      } else {
        setError(result.message);
      }
    }
  };

  return {
    attachments,
    error,
    dragging,
    limits,
    documents,
    disabled,
    addFiles,
    remove: (id) =>
      update(current.current.filter((attachment) => attachment.id !== id)),
    clear: () => {
      update([]);
      setError(null);
    },
    restore: (list) => {
      if (!current.current.length) update(list);
    },
    setError,
    onPaste: (event) => {
      const pasted = Array.from(event.clipboardData.files).filter((file) =>
        file.type.startsWith("image/"),
      );

      if (pasted.length && !event.clipboardData.getData("text")) {
        event.preventDefault();
        void addFiles(pasted);
      }
    },
    dropZoneProps: {
      onDragEnter: (event) => {
        if (disabled || !carriesFiles(event)) return;

        event.preventDefault();
        depth.current += 1;
        setDragging(true);
      },
      onDragOver: (event) => {
        if (disabled || !carriesFiles(event)) return;

        // Allow the drop
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      },
      onDragLeave: (event) => {
        if (!carriesFiles(event)) return;

        depth.current = Math.max(0, depth.current - 1);

        if (depth.current === 0) setDragging(false);
      },
      onDrop: (event) => {
        if (!carriesFiles(event)) return;

        event.preventDefault();
        depth.current = 0;
        setDragging(false);

        if (!disabled) void addFiles(Array.from(event.dataTransfer.files));
      },
    },
  };
};

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
export const AttachButton = ({
  count,
  max = DEFAULT_ATTACHMENT_LIMITS.maxAttachments,
  disabled = false,
  onFiles,
  accept = ATTACH_ACCEPT,
  label = "Attach files",
  title,
  className,
}: AttachButtonProps) => {
  const picker = useRef<HTMLInputElement>(null);
  const full = count >= max;

  return (
    <>
      <button
        type="button"
        onClick={() => picker.current?.click()}
        disabled={disabled || full}
        aria-label={label}
        title={
          full
            ? `Up to ${max} files per message`
            : (title ??
              `Attach images, PDFs, or text files (up to ${max} per message)`)
        }
        className={cn(
          "border-border text-muted-foreground hover:text-foreground inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-35 pointer-fine:size-8",
          className,
        )}
      >
        <Paperclip className="size-4" aria-hidden="true" />
      </button>
      <input
        ref={picker}
        type="file"
        accept={accept}
        multiple={max > 1}
        hidden
        tabIndex={-1}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);

          // Picking the same file again still fires a change
          event.target.value = "";

          if (files.length) onFiles(files);
        }}
      />
    </>
  );
};

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
export const AttachmentList = ({
  attachments,
  onRemove,
  label = "Attached files",
  className,
}: AttachmentListProps) => {
  if (!attachments.length) return null;

  const images = attachments.filter((a) => a.kind === "image").length;

  return (
    <>
      <ul
        aria-label={label}
        className={cn("flex flex-wrap items-start gap-2", className)}
      >
        {attachments.map((attachment, index) => (
          <li key={attachment.id} className="relative max-w-full">
            {attachment.kind === "image" ? (
              <img
                src={attachment.previewUrl}
                alt={`Attachment ${index + 1}: ${attachment.name}`}
                className="border-border size-14 rounded-lg border object-cover"
              />
            ) : (
              <span className="border-border bg-muted flex h-14 max-w-48 items-center gap-2 rounded-lg border px-3 pr-5 text-xs">
                <FileText
                  className="text-muted-foreground size-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate" title={attachment.name}>
                  {attachment.name}
                </span>
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
              className="focus-visible:ring-primary absolute -top-2 -right-2 inline-flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none pointer-fine:-top-1.5 pointer-fine:-right-1.5 pointer-fine:size-5"
            >
              <span className="bg-foreground text-background inline-flex size-5 items-center justify-center rounded-full shadow-sm">
                <X className="size-3" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <span className="sr-only" role="status">
        {attachmentsLabel(images, attachments.length - images)}
      </span>
    </>
  );
};

export interface AttachmentErrorProps {
  message: string | null;
  className?: string;
}

/** Why a file couldn't be attached, announced when it appears */
export const AttachmentError = ({
  message,
  className,
}: AttachmentErrorProps) =>
  message ? (
    <p
      role="alert"
      className={cn("text-destructive mt-2 px-1 text-xs", className)}
    >
      {message}
    </p>
  ) : null;

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
export const AttachmentDropOverlay = ({
  active,
  children = "Drop files to attach",
  className,
}: AttachmentDropOverlayProps) =>
  active ? (
    <div
      aria-hidden="true"
      className={cn(
        "border-primary bg-background/90 text-foreground pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-[inherit] border-2 border-dashed text-sm font-medium",
        className,
      )}
    >
      <Upload className="size-4" />
      {children}
    </div>
  ) : null;
