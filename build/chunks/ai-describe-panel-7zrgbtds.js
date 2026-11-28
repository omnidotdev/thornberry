import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/attachment-composer.tsx
import { FileText, Paperclip, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ATTACHMENT_IMAGE_TYPES2 = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif"
];
var ATTACHMENT_DOCUMENT_TYPES2 = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv"
];
var DEFAULT_ATTACHMENT_LIMITS2 = {
  maxAttachments: 3,
  maxImageBytes: 2000000,
  maxSourceImageBytes: 20000000,
  maxImageEdge: 1568,
  maxPdfBytes: 5000000,
  maxTextFileBytes: 200000
};
var EXTENSION_TYPES = {
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  markdown: "text/markdown",
  csv: "text/csv"
};
var ATTACH_ACCEPT2 = [
  ...ATTACHMENT_IMAGE_TYPES2,
  ...ATTACHMENT_DOCUMENT_TYPES2,
  ...Object.keys(EXTENSION_TYPES).map((extension) => `.${extension}`)
].join(",");
var ATTACH_IMAGES_ACCEPT2 = ATTACHMENT_IMAGE_TYPES2.join(",");
var isAttachmentImageType2 = (type) => ATTACHMENT_IMAGE_TYPES2.includes(type);
var documentTypeOf2 = (file) => {
  if (ATTACHMENT_DOCUMENT_TYPES2.includes(file.type)) {
    return file.type;
  }
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TYPES[extension] ?? null;
};
var size = (bytes) => bytes >= 1e6 ? `${Math.round(bytes / 1e5) / 10} MB` : `${Math.round(bytes / 1000)} KB`;
var attachable = (documents) => documents ? "Attach images (PNG, JPEG, WebP, or GIF), PDFs, or plain text, Markdown, or CSV files." : "Attach PNG, JPEG, WebP, or GIF images.";
var documentFileProblem2 = (file, limits = DEFAULT_ATTACHMENT_LIMITS2) => {
  const type = documentTypeOf2(file);
  if (!type)
    return attachable(true);
  if (type === "application/pdf" && file.size > limits.maxPdfBytes) {
    return `Each PDF can be up to ${size(limits.maxPdfBytes)}.`;
  }
  if (type !== "application/pdf" && file.size > limits.maxTextFileBytes) {
    return `Each text, Markdown, or CSV file can be up to ${size(limits.maxTextFileBytes)}.`;
  }
  if (file.size === 0)
    return "That file is empty.";
  return null;
};
var imageFileProblem2 = (file, limits = DEFAULT_ATTACHMENT_LIMITS2) => {
  if (!isAttachmentImageType2(file.type))
    return attachable(false);
  if (file.size > limits.maxSourceImageBytes) {
    return "That image is too large. Try a smaller screenshot.";
  }
  return null;
};
var fitWithin2 = (width, height, max = DEFAULT_ATTACHMENT_LIMITS2.maxImageEdge) => {
  const longest = Math.max(width, height);
  if (longest <= max)
    return { width, height };
  const scale = max / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
};
var fromDataUrl2 = (url) => {
  const match = /^data:([^;,]+);base64,(.+)$/.exec(url);
  return match?.[1] && match[2] ? { mediaType: match[1], data: match[2] } : null;
};
var base64Bytes2 = (data) => Math.floor(data.length * 3 / 4) - (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);
var readDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});
var newId = () => typeof crypto !== "undefined" && ("randomUUID" in crypto) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
var prepareImage2 = async (file, limits = DEFAULT_ATTACHMENT_LIMITS2) => {
  const problem = imageFileProblem2(file, limits);
  if (problem)
    return { ok: false, message: problem };
  try {
    const bitmap = await createImageBitmap(file);
    const fitted = fitWithin2(bitmap.width, bitmap.height, limits.maxImageEdge);
    let url;
    if (fitted.width === bitmap.width && fitted.height === bitmap.height && file.size <= limits.maxImageBytes) {
      url = await readDataUrl(file);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = fitted.width;
      canvas.height = fitted.height;
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, fitted.width, fitted.height);
      url = canvas.toDataURL("image/jpeg", 0.85);
    }
    bitmap.close();
    const parsed = fromDataUrl2(url);
    if (!parsed || !isAttachmentImageType2(parsed.mediaType) || base64Bytes2(parsed.data) > limits.maxImageBytes) {
      return {
        ok: false,
        message: "That image is too large. Try a smaller screenshot."
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
        previewUrl: url
      }
    };
  } catch {
    return { ok: false, message: "That image couldn't be read." };
  }
};
var prepareDocument2 = async (file, limits = DEFAULT_ATTACHMENT_LIMITS2) => {
  const problem = documentFileProblem2(file, limits);
  const mediaType = documentTypeOf2(file);
  if (problem || !mediaType) {
    return { ok: false, message: problem ?? attachable(true) };
  }
  try {
    if (mediaType === "application/pdf" && await file.slice(0, 5).text() !== "%PDF-") {
      return { ok: false, message: "That file isn't a readable PDF." };
    }
    const parsed = fromDataUrl2(await readDataUrl(file));
    if (!parsed)
      return { ok: false, message: "That file couldn't be read." };
    return {
      ok: true,
      attachment: {
        kind: "document",
        id: newId(),
        name: file.name || "Attachment",
        mediaType,
        data: parsed.data
      }
    };
  } catch {
    return { ok: false, message: "That file couldn't be read." };
  }
};
var prepareAttachment2 = async (file, limits = DEFAULT_ATTACHMENT_LIMITS2, documents = true) => {
  if (isAttachmentImageType2(file.type))
    return prepareImage2(file, limits);
  if (documents && documentTypeOf2(file))
    return prepareDocument2(file, limits);
  return { ok: false, message: attachable(documents) };
};
var count = (n, noun) => `${n} ${n === 1 ? noun : `${noun}s`}`;
var attachmentsLabel2 = (images = 0, files = 0) => `${[images > 0 && count(images, "image"), files > 0 && count(files, "file")].filter(Boolean).join(" and ")} attached`;
var carriesFiles = (event) => Array.from(event.dataTransfer?.types ?? []).includes("Files");
var useAttachments2 = ({
  limits: overrides,
  documents = true,
  disabled = false
} = {}) => {
  const limits = { ...DEFAULT_ATTACHMENT_LIMITS2, ...overrides };
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const current = useRef([]);
  const depth = useRef(0);
  const update = useCallback((next) => {
    current.current = next;
    setAttachments(next);
  }, []);
  const addFiles = async (files) => {
    if (disabled || !files.length)
      return;
    setError(null);
    const room = limits.maxAttachments - current.current.length;
    if (files.length > room) {
      setError(`Attach up to ${limits.maxAttachments} files to one message.`);
    }
    for (const file of files.slice(0, Math.max(0, room))) {
      const result = await prepareAttachment2(file, limits, documents);
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
    remove: (id) => update(current.current.filter((attachment) => attachment.id !== id)),
    clear: () => {
      update([]);
      setError(null);
    },
    restore: (list) => {
      if (!current.current.length)
        update(list);
    },
    setError,
    onPaste: (event) => {
      const pasted = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith("image/"));
      if (pasted.length && !event.clipboardData.getData("text")) {
        event.preventDefault();
        addFiles(pasted);
      }
    },
    dropZoneProps: {
      onDragEnter: (event) => {
        if (disabled || !carriesFiles(event))
          return;
        event.preventDefault();
        depth.current += 1;
        setDragging(true);
      },
      onDragOver: (event) => {
        if (disabled || !carriesFiles(event))
          return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      },
      onDragLeave: (event) => {
        if (!carriesFiles(event))
          return;
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0)
          setDragging(false);
      },
      onDrop: (event) => {
        if (!carriesFiles(event))
          return;
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        if (!disabled)
          addFiles(Array.from(event.dataTransfer.files));
      }
    }
  };
};
var AttachButton2 = ({
  count,
  max = DEFAULT_ATTACHMENT_LIMITS2.maxAttachments,
  disabled = false,
  onFiles,
  accept = ATTACH_ACCEPT2,
  label = "Attach files",
  title,
  className
}) => {
  const picker = useRef(null);
  const full = count >= max;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx("button", {
        type: "button",
        onClick: () => picker.current?.click(),
        disabled: disabled || full,
        "aria-label": label,
        title: full ? `Up to ${max} files per message` : title ?? `Attach images, PDFs, or text files (up to ${max} per message)`,
        className: cn("border-border text-muted-foreground hover:text-foreground inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-35 pointer-fine:size-8", className),
        children: /* @__PURE__ */ jsx(Paperclip, {
          className: "size-4",
          "aria-hidden": "true"
        })
      }),
      /* @__PURE__ */ jsx("input", {
        ref: picker,
        type: "file",
        accept,
        multiple: max > 1,
        hidden: true,
        tabIndex: -1,
        onChange: (event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length)
            onFiles(files);
        }
      })
    ]
  });
};
var AttachmentList2 = ({
  attachments,
  onRemove,
  label = "Attached files",
  className
}) => {
  if (!attachments.length)
    return null;
  const images = attachments.filter((a) => a.kind === "image").length;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx("ul", {
        "aria-label": label,
        className: cn("flex flex-wrap items-start gap-2", className),
        children: attachments.map((attachment, index) => /* @__PURE__ */ jsxs("li", {
          className: "relative max-w-full",
          children: [
            attachment.kind === "image" ? /* @__PURE__ */ jsx("img", {
              src: attachment.previewUrl,
              alt: `Attachment ${index + 1}: ${attachment.name}`,
              className: "border-border size-14 rounded-lg border object-cover"
            }) : /* @__PURE__ */ jsxs("span", {
              className: "border-border bg-muted flex h-14 max-w-48 items-center gap-2 rounded-lg border px-3 pr-5 text-xs",
              children: [
                /* @__PURE__ */ jsx(FileText, {
                  className: "text-muted-foreground size-4 shrink-0",
                  "aria-hidden": "true"
                }),
                /* @__PURE__ */ jsx("span", {
                  className: "truncate",
                  title: attachment.name,
                  children: attachment.name
                })
              ]
            }),
            /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => onRemove(attachment.id),
              "aria-label": `Remove ${attachment.name}`,
              className: "focus-visible:ring-primary absolute -top-2 -right-2 inline-flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none pointer-fine:-top-1.5 pointer-fine:-right-1.5 pointer-fine:size-5",
              children: /* @__PURE__ */ jsx("span", {
                className: "bg-foreground text-background inline-flex size-5 items-center justify-center rounded-full shadow-sm",
                children: /* @__PURE__ */ jsx(X, {
                  className: "size-3",
                  "aria-hidden": "true"
                })
              })
            })
          ]
        }, attachment.id))
      }),
      /* @__PURE__ */ jsx("span", {
        className: "sr-only",
        role: "status",
        children: attachmentsLabel2(images, attachments.length - images)
      })
    ]
  });
};
var AttachmentError2 = ({
  message,
  className
}) => message ? /* @__PURE__ */ jsx("p", {
  role: "alert",
  className: cn("text-destructive mt-2 px-1 text-xs", className),
  children: message
}) : null;
var AttachmentDropOverlay2 = ({
  active,
  children = "Drop files to attach",
  className
}) => active ? /* @__PURE__ */ jsxs("div", {
  "aria-hidden": "true",
  className: cn("border-primary bg-background/90 text-foreground pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-[inherit] border-2 border-dashed text-sm font-medium", className),
  children: [
    /* @__PURE__ */ jsx(Upload, {
      className: "size-4"
    }),
    children
  ]
}) : null;

export { ATTACHMENT_IMAGE_TYPES2, ATTACHMENT_DOCUMENT_TYPES2, DEFAULT_ATTACHMENT_LIMITS2, ATTACH_ACCEPT2, ATTACH_IMAGES_ACCEPT2, isAttachmentImageType2, documentTypeOf2, documentFileProblem2, imageFileProblem2, fitWithin2, fromDataUrl2, base64Bytes2, prepareImage2, prepareDocument2, prepareAttachment2, attachmentsLabel2, useAttachments2, AttachButton2, AttachmentList2, AttachmentError2, AttachmentDropOverlay2 };
