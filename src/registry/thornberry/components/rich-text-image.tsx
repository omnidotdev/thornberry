import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import {
  $applyNodeReplacement,
  $createParagraphNode,
  $getEditor,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isElementNode,
  $isEventFromEmbeddedInput,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $splitNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  HISTORY_MERGE_TAG,
  HISTORY_PUSH_TAG,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_DOWN_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_SPACE_COMMAND,
  PASTE_COMMAND,
  SKIP_DOM_SELECTION_TAG,
  createCommand,
  mergeRegister,
  stopLexicalPropagation,
} from "lexical";
import {
  ImagePlus,
  Link2,
  LoaderCircle,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from "react";

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
type RichTextImageErrorCode =
  | "unsupported-type"
  | "file-too-large"
  | "upload-failed"
  | "invalid-url";

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

const DEFAULT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const DEFAULT_IMAGE_MAX_WIDTH = 600;
const MIN_IMAGE_WIDTH = 16;
const IMAGE_WIDTH_PRESETS = [25, 50, 75, 100] as const;

/**
 * Inline style on exported images: a block that scales down on narrow screens,
 * never stretches vertically, and has no border (older desktop mail clients
 * draw one around linked images)
 */
const EMAIL_IMAGE_STYLE = "display:block;max-width:100%;height:auto;border:0";

const DEFAULT_POLICY: ImageSourcePolicy = {
  maxWidth: DEFAULT_IMAGE_MAX_WIDTH,
  allowInsecureHttp: false,
};

// the image settings of each editor with images turned on; the node class is
// shared by every editor, so it looks its editor up here
const editorPolicies = new WeakMap<LexicalEditor, ImageSourcePolicy>();

/** The image settings of the editor being updated, or null when images are off */
const $getImagePolicy = (): ImageSourcePolicy | null => {
  try {
    return editorPolicies.get($getEditor()) ?? null;
  } catch {
    return null;
  }
};

/**
 * How an image source fares: "allowed" may be loaded and exported, "external"
 * is an http(s) image that may not be used (plain http without
 * `allowInsecureHttp`, or refused by `isAllowedSrc`), and "invalid" is not an
 * absolute http(s) URL at all (`data:`, `blob:`, relative)
 */
type ImageSrcVerdict = "allowed" | "external" | "invalid";

/** Judge an image source against a policy (https only by default) */
const checkImageSrc = (
  src: string | null | undefined,
  {
    allowInsecureHttp = false,
    isAllowedSrc,
  }: Partial<
    Pick<ImageSourcePolicy, "allowInsecureHttp" | "isAllowedSrc">
  > = {},
): ImageSrcVerdict => {
  if (!src?.trim()) return "invalid";
  let url: URL;
  try {
    url = new URL(src.trim());
  } catch {
    return "invalid";
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return "invalid";
  if (url.protocol === "http:" && !allowInsecureHttp) return "external";
  if (isAllowedSrc && !isAllowedSrc(url.href)) return "external";
  return "allowed";
};

/** Whether `src` is an absolute `https://` URL (or `http://` when allowed) */
const isSafeImageSrc = (
  src: string | null | undefined,
  allowInsecureHttp = false,
): src is string => checkImageSrc(src, { allowInsecureHttp }) === "allowed";

/** Whether `value` is an absolute `https://` URL */
const isHttpsUrl = (value: string): boolean => {
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
};

/** Round a width to whole pixels within [16, maxWidth] */
const clampImageWidth = (width: number, maxWidth: number): number =>
  Math.round(Math.min(Math.max(width, MIN_IMAGE_WIDTH), maxWidth));

/** Parse a pixel width from an `<img>`'s `width` attribute or inline `width` style, digits only */
const readImageWidth = (img: HTMLImageElement): number | null => {
  const attr = (img.getAttribute("width") ?? "").trim();
  if (/^\d+$/.test(attr) && Number(attr) > 0) return Number(attr);
  const style = /^(\d+(?:\.\d+)?)px$/.exec(img.style.width.trim());
  return style ? Math.round(Number(style[1])) : null;
};

const FORMAT_NAMES: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/avif": "AVIF",
  "image/svg+xml": "SVG",
};

/** Human list of the formats in an `accept` string, e.g. "JPEG, PNG, WebP, or GIF" */
const describeAccept = (accept: string): string => {
  const names = Array.from(
    new Set(
      accept
        .split(",")
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean)
        .map(
          (token) =>
            FORMAT_NAMES[token] ??
            token
              .replace(/^image\//, "")
              .replace(/^\./, "")
              .toUpperCase(),
        ),
    ),
  );
  if (names.length <= 1) return names[0] ?? "image";
  return `${names.slice(0, -1).join(", ")}, or ${names[names.length - 1]}`;
};

/** Whether a file matches an `accept` string (MIME types, `type/*` wildcards, or extensions) */
const matchesAccept = (file: File, accept: string): boolean => {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
};

const formatBytes = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${Number((bytes / (1024 * 1024)).toFixed(1))} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Check a file against the accepted types and size limit before uploading,
 * returning the error to report or null when it may be uploaded
 */
const validateImageFile = (
  file: File,
  { accept = DEFAULT_IMAGE_ACCEPT, maxBytes }: Partial<RichTextImageOptions>,
): RichTextImageError | null => {
  if (!matchesAccept(file, accept)) {
    return {
      code: "unsupported-type",
      message: `"${file.name}" isn't a supported image. Use a ${describeAccept(accept)} file.`,
      file,
    };
  }
  if (maxBytes !== undefined && file.size > maxBytes) {
    return {
      code: "file-too-large",
      message: `"${file.name}" is ${formatBytes(file.size)}. Images must be ${formatBytes(maxBytes)} or smaller.`,
      file,
    };
  }
  return null;
};

/** The host of an image source, for messages */
const hostOf = (src: string): string => {
  try {
    return new URL(src).host;
  } catch {
    return "another site";
  }
};

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

type SerializedRichTextImageNode = Spread<
  { src: string; alt: string; width: number | null },
  SerializedLexicalNode
>;

/** Build an image node for a source found in loaded or pasted content, or null to drop it */
const $createImportedImageNode = (
  src: string | null,
  alt: string,
  width: number | null,
  policy: ImageSourcePolicy,
): RichTextImageNode | null => {
  const verdict = checkImageSrc(src, policy);
  // `data:`, `blob:`, and relative images never reach the exported email
  if (verdict === "invalid" || !src) return null;
  return $createRichTextImageNode({
    src: src.trim(),
    alt,
    width: width ? clampImageWidth(width, policy.maxWidth) : null,
    external: verdict === "external",
  });
};

const convertImageElement = (domNode: HTMLElement): DOMConversionOutput => {
  const policy = $getImagePolicy();
  if (!policy) return { node: null };
  const img = domNode as HTMLImageElement;
  return {
    node: $createImportedImageNode(
      img.getAttribute("src"),
      img.getAttribute("alt") ?? "",
      readImageWidth(img),
      policy,
    ),
  };
};

/**
 * A block-level image in the rich text editor. Exports email-safe markup: an
 * absolute https `src`, `alt`, a pixel `width` (at most the editor's
 * `maxWidth`), and a block style that scales down on narrow screens.
 * Uploading and external images export nothing
 */
class RichTextImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __alt: string;
  __width: number | null;
  __uploading: boolean;
  __external: boolean;
  __fileName: string;
  __inert: boolean;

  static getType(): string {
    return "rich-text-image";
  }

  static clone(node: RichTextImageNode): RichTextImageNode {
    return new RichTextImageNode(
      {
        src: node.__src,
        alt: node.__alt,
        width: node.__width,
        uploading: node.__uploading,
        external: node.__external,
        fileName: node.__fileName,
        inert: node.__inert,
      },
      node.__key,
    );
  }

  static importJSON(json: SerializedRichTextImageNode): RichTextImageNode {
    // editor data (e.g. pasted from another editor) is untrusted: coerce every
    // field, and keep the image inert (never rendered or exported, removed on
    // the next update) when images are off here or the source is not a string
    const policy = $getImagePolicy();
    const src = typeof json.src === "string" ? json.src.trim() : null;
    if (!policy || src === null) {
      return $createRichTextImageNode({ src: "", inert: true });
    }
    const width = Number(json.width);
    return $createRichTextImageNode({
      src,
      alt: typeof json.alt === "string" ? json.alt : "",
      width:
        Number.isFinite(width) && width > 0
          ? clampImageWidth(width, policy.maxWidth)
          : null,
      external: checkImageSrc(src, policy) !== "allowed",
    });
  }

  static importDOM(): DOMConversionMap {
    return {
      // with images off this importer stands aside, so `<img>` is dropped as
      // before (or handled by an app's own image node)
      img: () =>
        $getImagePolicy()
          ? { conversion: convertImageElement, priority: 0 }
          : null,
    };
  }

  constructor(payload: RichTextImagePayload = { src: "" }, key?: NodeKey) {
    super(key);
    this.__src = payload.src;
    this.__alt = payload.alt ?? "";
    this.__width = payload.width ?? null;
    this.__uploading = payload.uploading ?? false;
    this.__external = payload.external ?? false;
    this.__fileName = payload.fileName ?? "";
    this.__inert = payload.inert ?? false;
  }

  exportJSON(): SerializedRichTextImageNode {
    return {
      type: RichTextImageNode.getType(),
      version: 1,
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
    if (
      this.__inert ||
      this.__uploading ||
      this.__external ||
      checkImageSrc(this.__src, policy) !== "allowed"
    ) {
      return { element: null };
    }
    const img = document.createElement("img");
    img.setAttribute("src", this.__src);
    img.setAttribute("alt", this.__alt);
    if (this.__width) {
      img.setAttribute(
        "width",
        String(clampImageWidth(this.__width, policy.maxWidth)),
      );
    }
    img.setAttribute("style", EMAIL_IMAGE_STYLE);
    return { element: img };
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "my-1 max-w-full";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): false {
    return false;
  }

  getSrc(): string {
    return this.getLatest().__src;
  }

  getAlt(): string {
    return this.getLatest().__alt;
  }

  getWidth(): number | null {
    return this.getLatest().__width;
  }

  isUploading(): boolean {
    return this.getLatest().__uploading;
  }

  isExternal(): boolean {
    return this.getLatest().__external;
  }

  isInert(): boolean {
    return this.getLatest().__inert;
  }

  /** Mark the image as hosted elsewhere (true) or usable (false) */
  setExternal(external: boolean): this {
    const writable = this.getWritable();
    writable.__external = external;
    return writable;
  }

  /** End a failed upload: an image being replaced goes back to its external placeholder */
  cancelUpload(): this {
    const writable = this.getWritable();
    writable.__uploading = false;
    return writable;
  }

  setAlt(alt: string): this {
    const writable = this.getWritable();
    writable.__alt = alt;
    return writable;
  }

  setWidth(width: number | null): this {
    const writable = this.getWritable();
    writable.__width = width;
    return writable;
  }

  /** Show the uploading placeholder (e.g. while replacing an external image) */
  setUploading(fileName: string): this {
    const writable = this.getWritable();
    writable.__uploading = true;
    writable.__fileName = fileName;
    return writable;
  }

  /** Swap the uploading placeholder for the hosted image */
  setUploaded(src: string, width: number | null): this {
    const writable = this.getWritable();
    writable.__src = src;
    writable.__width = width;
    writable.__uploading = false;
    writable.__external = false;
    return writable;
  }

  decorate(): ReactNode {
    if (this.__inert) return null;
    return (
      <RichTextImageView
        nodeKey={this.getKey()}
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        uploading={this.__uploading}
        external={this.__external}
        fileName={this.__fileName}
      />
    );
  }
}

const $createRichTextImageNode = (
  payload: RichTextImagePayload,
): RichTextImageNode => $applyNodeReplacement(new RichTextImageNode(payload));

const $isRichTextImageNode = (
  node: LexicalNode | null | undefined,
): node is RichTextImageNode => node instanceof RichTextImageNode;

/** Every image node in the document, in order */
const $collectImageNodes = (): RichTextImageNode[] => {
  const found: RichTextImageNode[] = [];
  const visit = (node: LexicalNode) => {
    if ($isRichTextImageNode(node)) found.push(node);
    else if ($isElementNode(node)) {
      for (const child of node.getChildren()) visit(child);
    }
  };
  visit($getRoot());
  return found;
};

/** Read the image summary inside an editor read or update */
const $getRichTextImageSummary = (): RichTextImageSummary => {
  const summary: RichTextImageSummary = {
    count: 0,
    hasMissingAltText: false,
    isUploading: false,
    hasExternalImages: false,
  };
  for (const node of $collectImageNodes()) {
    if (node.isInert()) continue;
    summary.count += 1;
    if (node.isUploading()) summary.isUploading = true;
    else if (node.isExternal()) summary.hasExternalImages = true;
    else if (!node.getAlt().trim()) summary.hasMissingAltText = true;
  }
  return summary;
};

/** Read the image summary for an editor */
const getRichTextImageSummary = (editor: LexicalEditor): RichTextImageSummary =>
  editor.getEditorState().read($getRichTextImageSummary);

/**
 * Lift an image found inside a paragraph (e.g. `<p><img></p>` in loaded HTML)
 * to the top level, splitting the paragraph around it and dropping halves left
 * empty
 */
const $liftImageToBlock = (node: RichTextImageNode) => {
  const parent = node.getParent();
  if (!parent || $isRootOrShadowRoot(parent)) return;
  const [before, after] = $splitNode(parent, node.getIndexWithinParent());
  after.insertBefore(node);
  if (before?.isEmpty()) before.remove();
  if (after.isEmpty()) after.remove();
};

/** Insert image blocks at the selection (splitting a paragraph), or at the end when there is none */
const $insertImageNodes = (nodes: RichTextImageNode[]) => {
  const selection = $getSelection();
  if (!selection) {
    $getRoot().selectEnd();
  } else if ($isNodeSelection(selection)) {
    // insert beside a selected node rather than replacing it
    const last = selection.getNodes().at(-1);
    if (last) last.selectNext();
    else $getRoot().selectEnd();
  }
  $insertNodes(nodes);
  // keep somewhere to type after an image at the end of the document
  const last = nodes.at(-1);
  if (last?.isAttached() && !last.getNextSibling()) {
    const paragraph = $createParagraphNode();
    last.insertAfter(paragraph);
    paragraph.select();
  }
};

/** Insert an already-hosted image (absolute https URL allowed by the policy) at the selection */
const INSERT_RICH_TEXT_IMAGE_COMMAND: LexicalCommand<{
  src: string;
  alt?: string;
  width?: number;
}> = createCommand("INSERT_RICH_TEXT_IMAGE_COMMAND");

/** Validate, upload, and insert image files at the selection */
const UPLOAD_RICH_TEXT_IMAGES_COMMAND: LexicalCommand<File[]> = createCommand(
  "UPLOAD_RICH_TEXT_IMAGES_COMMAND",
);

/** Upload a file in place of an existing image (e.g. one hosted elsewhere) */
const REPLACE_RICH_TEXT_IMAGE_COMMAND: LexicalCommand<{
  key: NodeKey;
  file: File;
}> = createCommand("REPLACE_RICH_TEXT_IMAGE_COMMAND");

interface RichTextImageContextValue {
  accept: string;
  maxWidth: number;
  /** Claim a pending request to focus a node's alt text field, once */
  takeAltPrompt: (key: NodeKey) => boolean;
  /** Report an insert failure to `onError` (or inline) */
  reportError: (error: RichTextImageError) => void;
}

const RichTextImageContext = createContext<RichTextImageContextValue | null>(
  null,
);

/** The image settings in scope, or null when images are off */
const useRichTextImageContext = () => useContext(RichTextImageContext);

/** Whether keyboard focus is inside the editor (its surface or its toolbar) */
const isFocusInsideEditor = (editor: LexicalEditor): boolean => {
  const root = editor.getRootElement();
  if (!root) return false;
  const container = root.closest("[data-rich-text-editor]") ?? root;
  const active = root.ownerDocument.activeElement;
  return active !== null && container.contains(active);
};

/** Events from the image controls that the editor must not treat as its own input */
const ISOLATED_EVENTS = [
  "beforeinput",
  "input",
  "keydown",
  "keyup",
  "keypress",
  "paste",
  "copy",
  "cut",
  "compositionstart",
  "compositionend",
  "pointerdown",
  "click",
  "dragstart",
  "drop",
] as const;

/**
 * Mark events inside `ref` as handled so the editor root ignores them: typing
 * Backspace in the alt text field must edit the field, never delete the
 * selected image
 */
const useIsolateFromEditor = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (event: Event) => stopLexicalPropagation(event);
    for (const name of ISOLATED_EVENTS) el.addEventListener(name, stop);
    return () => {
      for (const name of ISOLATED_EVENTS) el.removeEventListener(name, stop);
    };
  });
};

/** Keep Enter in a settings field from submitting a form the editor sits in */
const preventSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === "Enter") event.preventDefault();
};

const inputClassName =
  "flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aria-invalid:border-destructive";

interface RichTextImageViewProps {
  nodeKey: NodeKey;
  src: string;
  alt: string;
  width: number | null;
  uploading: boolean;
  external: boolean;
  fileName: string;
}

/** The in-editor rendering of an image: placeholder, image, alt warning, and settings */
const RichTextImageView = ({
  nodeKey,
  src,
  alt,
  width,
  uploading,
  external,
  fileName,
}: RichTextImageViewProps) => {
  const [editor] = useLexicalComposerContext();
  const editable = useLexicalEditable();
  const context = useRichTextImageContext();
  const maxWidth = context?.maxWidth ?? DEFAULT_IMAGE_MAX_WIDTH;
  const shownWidth = width ? Math.min(width, maxWidth) : null;
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [pinned, setPinned] = useState(false);
  const [failed, setFailed] = useState(false);
  const [altDraft, setAltDraft] = useState(alt);
  const [widthDraft, setWidthDraft] = useState(
    shownWidth ? String(shownWidth) : "",
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const externalRef = useRef<HTMLDivElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const altFocused = useRef(false);
  // the first alt keystroke of a visit to the field starts its own undo step
  const altEditStarted = useRef(false);
  const id = useId();
  const altId = `${id}-alt`;
  const altHelpId = `${id}-alt-help`;
  const widthId = `${id}-width`;

  useIsolateFromEditor(settingsRef);
  useIsolateFromEditor(badgeRef);
  useIsolateFromEditor(externalRef);

  const ready = !uploading && !external;
  const missingAlt = ready && !alt.trim();
  const showSettings = editable && ready && (isSelected || pinned);

  const updateNode = useCallback(
    (fn: (node: RichTextImageNode) => void, tag: string) =>
      editor.update(
        () => {
          const node = $getNodeByKey(nodeKey);
          if ($isRichTextImageNode(node)) fn(node);
        },
        { tag },
      ),
    [editor, nodeKey],
  );

  // focus the alt text field once the settings have rendered
  const wantsAltFocus = useRef(false);
  const openSettings = useCallback(() => {
    wantsAltFocus.current = true;
    setPinned(true);
  }, []);
  useEffect(() => {
    if (wantsAltFocus.current && altInputRef.current) {
      wantsAltFocus.current = false;
      altInputRef.current.focus();
    }
  });

  // keep the drafts in step with the node unless the person is mid-edit
  useEffect(() => {
    if (!altFocused.current) setAltDraft(alt);
  }, [alt]);
  useEffect(() => {
    setWidthDraft(shownWidth ? String(shownWidth) : "");
  }, [shownWidth]);

  // a just-inserted image asks for its alt text
  useEffect(() => {
    if (!ready || !context) return;
    if (context.takeAltPrompt(nodeKey)) openSettings();
  }, [context, nodeKey, ready, openSettings]);

  useEffect(() => {
    // the keyboard route to the alt text and width: select the image with the
    // arrow keys, then press Enter or Space
    const $openFromKeyboard = (event: globalThis.KeyboardEvent | null) => {
      const selection = $getSelection();
      if (
        !$isNodeSelection(selection) ||
        !selection.has(nodeKey) ||
        (event && $isEventFromEmbeddedInput(event))
      ) {
        return false;
      }
      event?.preventDefault();
      if (ready) openSettings();
      else if (external) replaceInputRef.current?.click();
      return true;
    };
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (!imageRef.current || event.target !== imageRef.current) {
            return false;
          }
          if (!event.shiftKey) clearSelection();
          setSelected(true);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        $openFromKeyboard,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_SPACE_COMMAND,
        $openFromKeyboard,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [
    editor,
    nodeKey,
    ready,
    external,
    clearSelection,
    setSelected,
    openSettings,
  ]);

  const closeSettings = () => {
    setPinned(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isRichTextImageNode(node)) node.selectNext();
    });
    editor.focus();
  };

  const commitAlt = (value: string) => {
    setAltDraft(value);
    const tag = altEditStarted.current ? HISTORY_MERGE_TAG : HISTORY_PUSH_TAG;
    altEditStarted.current = true;
    updateNode((node) => node.setAlt(value), tag);
  };

  const commitWidth = (value: number) => {
    const next = clampImageWidth(value, maxWidth);
    setWidthDraft(String(next));
    if (next !== width) {
      updateNode((node) => node.setWidth(next), HISTORY_PUSH_TAG);
    }
  };

  const onImageLoad = () => {
    setFailed(false);
    const natural = imageRef.current?.naturalWidth;
    // fill in a missing width so the exported markup always carries one; this
    // is not an edit, so it joins the current undo step
    if (!width && natural) {
      const next = clampImageWidth(natural, maxWidth);
      setWidthDraft(String(next));
      editor.update(
        () => {
          const node = $getNodeByKey(nodeKey);
          if ($isRichTextImageNode(node)) node.setWidth(next);
        },
        { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
      );
    }
  };

  const selectedHint = isSelected && editable && (
    <span className="sr-only" aria-live="polite">
      Image selected. Press Enter to{" "}
      {ready ? "edit its alt text and width" : "upload a replacement"}.
    </span>
  );

  if (uploading) {
    return (
      <div
        role="status"
        className="border-border bg-muted text-muted-foreground flex h-24 w-56 max-w-full items-center justify-center gap-2 rounded-md border border-dashed px-3 text-xs"
      >
        <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden />
        <span className="truncate">
          Uploading{fileName ? ` ${fileName}` : " image"}
        </span>
      </div>
    );
  }

  if (external) {
    return (
      <div
        ref={externalRef}
        role="group"
        aria-label="Image that needs uploading"
        data-rich-text-image=""
        data-external=""
        onClick={() => {
          if (editable) {
            clearSelection();
            setSelected(true);
          }
        }}
        className={cn(
          "border-destructive bg-muted flex w-80 max-w-full flex-col items-start gap-2 rounded-md border border-dashed p-3 text-xs",
          isSelected && "outline-primary outline-2 outline-offset-2",
        )}
      >
        <span className="text-destructive flex items-start gap-1.5 font-medium">
          <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          This image is hosted on {hostOf(src)}, so it can't be sent. Upload a
          copy to use it.
        </span>
        {alt && <span className="text-muted-foreground">Alt text: {alt}</span>}
        {editable && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => replaceInputRef.current?.click()}
            >
              <Upload aria-hidden />
              Upload replacement
            </Button>
            <input
              ref={replaceInputRef}
              type="file"
              accept={context?.accept ?? DEFAULT_IMAGE_ACCEPT}
              hidden
              tabIndex={-1}
              aria-hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) {
                  editor.dispatchCommand(REPLACE_RICH_TEXT_IMAGE_COMMAND, {
                    key: nodeKey,
                    file,
                  });
                }
              }}
            />
          </>
        )}
        {selectedHint}
      </div>
    );
  }

  return (
    <div
      className="relative flex max-w-full flex-col items-start gap-2"
      data-rich-text-image=""
      data-missing-alt={missingAlt ? "" : undefined}
      onBlur={(event) => {
        // close the pinned settings once focus leaves the image entirely
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPinned(false);
        }
      }}
    >
      <span className="relative inline-block max-w-full">
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          width={shownWidth ?? undefined}
          draggable={false}
          onLoad={onImageLoad}
          onError={() => setFailed(true)}
          style={shownWidth ? { width: `${shownWidth}px` } : undefined}
          className={cn(
            "block h-auto max-w-full rounded-sm",
            editable && "cursor-pointer",
            isSelected && "outline-primary outline-2 outline-offset-2",
            editable &&
              (missingAlt || failed) &&
              !isSelected &&
              "outline-destructive outline-2 outline-offset-2 outline-dashed",
          )}
        />
        {editable && (missingAlt || failed) && (
          <button
            ref={badgeRef}
            type="button"
            onClick={() => {
              setSelected(true);
              openSettings();
            }}
            className="border-destructive bg-background text-destructive focus-visible:ring-primary absolute top-2 left-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium shadow-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <TriangleAlert className="size-3.5" aria-hidden />
            {failed ? "Image couldn't load" : "Add alt text"}
          </button>
        )}
      </span>
      {selectedHint}

      {showSettings && (
        <div
          ref={settingsRef}
          role="group"
          aria-label="Image settings"
          className="border-border bg-popover text-popover-foreground flex w-72 max-w-full flex-col gap-3 rounded-md border p-3 text-sm shadow-md"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeSettings();
            }
          }}
          onFocus={() => setPinned(true)}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor={altId} className="text-xs font-medium">
              Alt text{" "}
              <span className="text-muted-foreground font-normal">
                (required)
              </span>
            </label>
            <input
              ref={altInputRef}
              id={altId}
              type="text"
              value={altDraft}
              placeholder="e.g. Three friends laughing at a cafe"
              aria-invalid={missingAlt || undefined}
              aria-describedby={altHelpId}
              className={inputClassName}
              onFocus={() => {
                altFocused.current = true;
                altEditStarted.current = false;
              }}
              onBlur={() => {
                altFocused.current = false;
              }}
              onKeyDown={(event) => {
                preventSubmit(event);
                if (event.key === "Enter") closeSettings();
              }}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                commitAlt(event.target.value)
              }
            />
            <p
              id={altHelpId}
              className={cn(
                "text-xs",
                missingAlt ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {missingAlt
                ? "Describe the image. Screen readers read it aloud, and inboxes that block images show it instead."
                : "Screen readers read this aloud, and inboxes that block images show it instead."}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium">Width</span>
            <div className="flex flex-wrap items-center gap-1">
              {IMAGE_WIDTH_PRESETS.map((percent) => {
                const presetWidth = clampImageWidth(
                  (maxWidth * percent) / 100,
                  maxWidth,
                );
                return (
                  <Button
                    key={percent}
                    variant={shownWidth === presetWidth ? "solid" : "outline"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    aria-pressed={shownWidth === presetWidth}
                    aria-label={`${percent}% width (${presetWidth} pixels)`}
                    onClick={() => commitWidth(presetWidth)}
                  >
                    {percent}%
                  </Button>
                );
              })}
              <span className="ml-auto flex items-center gap-1">
                <label htmlFor={widthId} className="sr-only">
                  Width in pixels
                </label>
                <input
                  id={widthId}
                  type="number"
                  inputMode="numeric"
                  min={MIN_IMAGE_WIDTH}
                  max={maxWidth}
                  value={widthDraft}
                  className={cn(inputClassName, "w-20")}
                  onChange={(event) => setWidthDraft(event.target.value)}
                  onBlur={() => {
                    const value = Number(widthDraft);
                    if (Number.isFinite(value) && value > 0) commitWidth(value);
                    else setWidthDraft(shownWidth ? String(shownWidth) : "");
                  }}
                  onKeyDown={(event) => {
                    preventSubmit(event);
                    if (event.key === "Enter") {
                      const value = Number(widthDraft);
                      if (Number.isFinite(value) && value > 0) {
                        commitWidth(value);
                      }
                    }
                  }}
                />
                <span className="text-muted-foreground text-xs">px</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Up to {maxWidth}px. Press Delete with the image selected to remove
              it.
            </p>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={closeSettings}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/** Whether pasted HTML is just an image (e.g. "Copy image" in a browser), so the attached file should win */
const isImageOnlyHtml = (html: string): boolean => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (
    doc.body.textContent?.trim() === "" &&
    doc.body.querySelector("img") !== null
  );
};

/** Image files carried by a paste, or none when the paste is really text */
const imageFilesFromClipboard = (data: DataTransfer | null): File[] => {
  if (!data) return [];
  const files = Array.from(data.files ?? []).filter((file) =>
    file.type.startsWith("image/"),
  );
  if (!files.length) return [];
  // office-suite clipboards attach a picture of copied text alongside it; keep
  // the text unless the copied markup is itself only an image
  const html = data.getData("text/html");
  if (html) return isImageOnlyHtml(html) ? files : [];
  return data.getData("text/plain").trim() ? [] : files;
};

const uploadFailedMessage = (file: File) =>
  `"${file.name}" couldn't be uploaded. Check your connection and try again.`;

/** The message for a refused image link */
const describeRejectedUrl = (url: string, verdict: ImageSrcVerdict): string =>
  verdict === "external" && isHttpsUrl(url)
    ? `Images from ${hostOf(url)} can't be used. Upload the image instead.`
    : "Use a full image link that starts with https:// (for example, https://example.com/photo.jpg).";

type UploadOutcome = { src: string; width: number | null } | "failed";

/**
 * Finish an upload placeholder: show the hosted image, or on failure drop the
 * placeholder (an image being replaced goes back to its external placeholder,
 * alt text and all)
 */
const $applyUploadOutcome = (
  node: RichTextImageNode,
  outcome: UploadOutcome,
) => {
  if (outcome !== "failed") node.setUploaded(outcome.src, outcome.width);
  else if (node.isExternal()) node.cancelUpload();
  else node.remove();
};

/** How many settled upload outcomes are kept for undo and redo */
const SETTLED_UPLOAD_LIMIT = 50;

/**
 * Remember how an upload turned out so an undo or redo that restores its
 * placeholder can re-apply it, keeping only the most recent `limit` outcomes
 */
const rememberUploadOutcome = <K, V>(
  outcomes: Map<K, V>,
  key: K,
  outcome: V,
  limit = SETTLED_UPLOAD_LIMIT,
) => {
  outcomes.delete(key);
  outcomes.set(key, outcome);
  while (outcomes.size > limit) {
    const oldest = outcomes.keys().next().value as K;
    outcomes.delete(oldest);
  }
};

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
const RichTextImages = ({ options, children }: RichTextImagesProps) => {
  const [editor] = useLexicalComposerContext();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const enabled = Boolean(options);
  const accept = options?.accept ?? DEFAULT_IMAGE_ACCEPT;
  const maxWidth = options?.maxWidth ?? DEFAULT_IMAGE_MAX_WIDTH;
  const allowInsecureHttp = options?.allowInsecureHttp ?? false;
  const isAllowedSrc = options?.isAllowedSrc;

  // register the policy during render, not in an effect: child plugins (which
  // load `defaultContent`) run their effects before this component's would
  if (enabled) {
    editorPolicies.set(editor, { maxWidth, allowInsecureHttp, isAllowedSrc });
  } else {
    editorPolicies.delete(editor);
  }
  useEffect(() => () => void editorPolicies.delete(editor), [editor]);

  // images whose alt text field should take focus once they are ready
  const altPrompts = useRef(new Set<NodeKey>());
  // uploads still running, and how finished ones turned out; an undo or redo
  // can bring back a placeholder after its upload settled, and the outcome is
  // re-applied then (and the entry dropped)
  const inflight = useRef(new Set<NodeKey>());
  const settled = useRef(new Map<NodeKey, UploadOutcome>());
  const lastKeyDownAt = useRef(0);
  // bumped when images are turned off, so uploads started before are ignored
  const generation = useRef(0);
  const [inlineError, setInlineError] = useState<RichTextImageError | null>(
    null,
  );

  const reportError = useCallback((error: RichTextImageError) => {
    const onError = optionsRef.current?.onError;
    if (onError) onError(error);
    // a refused link is already explained inside the link form
    else if (error.code !== "invalid-url") setInlineError(error);
  }, []);

  /** Upload files into placeholder nodes; runs inside an editor update (a command handler) */
  const $uploadFiles = useCallback(
    (files: File[], replaceKey?: NodeKey) => {
      const current = optionsRef.current;
      if (!current) return;
      const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
      const accepted: File[] = [];
      for (const file of files) {
        const error = validateImageFile(file, current);
        if (error) reportError(error);
        else accepted.push(file);
      }
      if (!accepted.length) return;

      let pending: Array<{ key: NodeKey; file: File }>;
      const replaced = replaceKey ? $getNodeByKey(replaceKey) : null;
      if ($isRichTextImageNode(replaced) && accepted[0]) {
        replaced.setUploading(accepted[0].name);
        pending = [{ key: replaced.getKey(), file: accepted[0] }];
      } else {
        // a nested editor.update would be deferred past the loop below, so
        // the placeholders are created directly in this update
        const nodes = accepted.map((file) =>
          $createRichTextImageNode({
            src: "",
            uploading: true,
            fileName: file.name,
          }),
        );
        $insertImageNodes(nodes);
        pending = nodes.map((node, index) => ({
          key: node.getKey(),
          file: accepted[index] as File,
        }));
      }

      const startedGeneration = generation.current;
      for (const { key, file } of pending) {
        inflight.current.add(key);
        const startedAt = Date.now();
        const settle = (outcome: UploadOutcome) => {
          // images were turned off since; their placeholders are gone
          if (generation.current !== startedGeneration) return;
          rememberUploadOutcome(settled.current, key, outcome);
          inflight.current.delete(key);
          editor.update(
            () => {
              const node = $getNodeByKey(key);
              if (!$isRichTextImageNode(node) || !node.isUploading()) return;
              $applyUploadOutcome(node, outcome);
            },
            // the upload finishing is not an edit of its own, and must not
            // pull focus back into the editor if the person has moved on
            { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
          );
        };
        const fail = (cause: unknown) => {
          settle("failed");
          reportError({
            code: "upload-failed",
            message: uploadFailedMessage(file),
            file,
            cause,
          });
        };

        Promise.resolve()
          .then(() => current.upload(file))
          .then((result) => {
            if (checkImageSrc(result?.src, policy) !== "allowed") {
              fail(new Error("upload did not resolve to an allowed https src"));
              return;
            }
            // focus the alt field only if focus is still in the editor and
            // nobody has typed since the insert, so a finished upload never
            // steals the caret (the missing alt text warning shows either way)
            if (
              lastKeyDownAt.current < startedAt &&
              isFocusInsideEditor(editor)
            ) {
              altPrompts.current.add(key);
            }
            settle({
              src: result.src.trim(),
              width: result.width
                ? clampImageWidth(result.width, policy.maxWidth)
                : null,
            });
          }, fail);
      }
    },
    [editor, reportError],
  );

  // inert images (editor data pasted while images are off, or malformed) never
  // stay in the document, whether images are on or off
  useEffect(
    () =>
      editor.registerNodeTransform(RichTextImageNode, (node) => {
        if (node.isInert()) node.remove();
      }),
    [editor],
  );

  // turning images off ends running uploads: their placeholders are dropped
  // (an image being replaced keeps its external placeholder) and late results
  // are ignored, so nothing reports an upload that can no longer finish
  const wasEnabled = useRef(enabled);
  useEffect(() => {
    const was = wasEnabled.current;
    wasEnabled.current = enabled;
    if (!was || enabled) return;
    generation.current += 1;
    inflight.current.clear();
    settled.current.clear();
    altPrompts.current.clear();
    setInlineError(null);
    editor.update(
      () => {
        for (const node of $collectImageNodes()) {
          if (node.isUploading()) $applyUploadOutcome(node, "failed");
        }
      },
      { tag: SKIP_DOM_SELECTION_TAG },
    );
  }, [editor, enabled]);

  // a stricter (or looser) source policy applies to images already in the
  // document: a now-refused image becomes an external placeholder (reported by
  // `hasExternalImages`), and a now-allowed one becomes usable again
  useEffect(() => {
    if (!enabled) return;
    const policy = { allowInsecureHttp, isAllowedSrc };
    const changes = editor.getEditorState().read(() =>
      $collectImageNodes()
        .filter((node) => !node.isUploading() && !node.isInert())
        .map((node) => ({
          key: node.getKey(),
          external: checkImageSrc(node.getSrc(), policy) !== "allowed",
          was: node.isExternal(),
        }))
        .filter(({ external, was }) => external !== was),
    );
    // only update when something changed: an inline `isAllowedSrc` is a new
    // function on every render, and an empty update would still report
    if (!changes.length) return;
    editor.update(
      () => {
        for (const { key, external } of changes) {
          const node = $getNodeByKey(key);
          if ($isRichTextImageNode(node)) node.setExternal(external);
        }
      },
      { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
    );
  }, [editor, enabled, isAllowedSrc, allowInsecureHttp]);

  useEffect(() => {
    if (!enabled) return;
    const unregister = mergeRegister(
      editor.registerCommand(
        INSERT_RICH_TEXT_IMAGE_COMMAND,
        ({ src, alt, width }) => {
          const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
          const verdict = checkImageSrc(src, policy);
          if (verdict !== "allowed") {
            reportError({
              code: "invalid-url",
              message: describeRejectedUrl(src, verdict),
              url: src,
            });
            return false;
          }
          const node = $createRichTextImageNode({
            src: src.trim(),
            alt,
            width: width ? clampImageWidth(width, policy.maxWidth) : null,
          });
          if (!alt?.trim() && isFocusInsideEditor(editor)) {
            altPrompts.current.add(node.getKey());
          }
          $insertImageNodes([node]);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        UPLOAD_RICH_TEXT_IMAGES_COMMAND,
        (files) => {
          $uploadFiles(files);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        REPLACE_RICH_TEXT_IMAGE_COMMAND,
        ({ key, file }) => {
          $uploadFiles([file], key);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          if ($isEventFromEmbeddedInput(event)) return false;
          const data =
            "clipboardData" in event
              ? event.clipboardData
              : "dataTransfer" in event
                ? event.dataTransfer
                : null;
          const files = imageFilesFromClipboard(data);
          if (!files.length) return false;
          event.preventDefault();
          $uploadFiles(files);
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      // drops (the selection is already moved to the drop point) and
      // file-only pastes the handler above passed on
      editor.registerCommand(
        DRAG_DROP_PASTE,
        (files) => {
          $uploadFiles(files);
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        () => {
          lastKeyDownAt.current = Date.now();
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      // never let keys typed in an image's settings delete the image
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event) => $isEventFromEmbeddedInput(event),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        (event) => $isEventFromEmbeddedInput(event),
        COMMAND_PRIORITY_HIGH,
      ),
      // images are blocks of their own: lift any found inside a paragraph
      editor.registerNodeTransform(RichTextImageNode, $liftImageToBlock),
      // an undo or redo can restore a placeholder whose upload is no longer
      // running: re-apply its outcome, or remove it when the outcome is lost
      editor.registerUpdateListener(({ editorState }) => {
        const orphans = editorState.read(() =>
          $collectImageNodes()
            .filter(
              (node) =>
                node.isUploading() && !inflight.current.has(node.getKey()),
            )
            .map((node) => node.getKey()),
        );
        if (!orphans.length) return;
        editor.update(
          () => {
            for (const key of orphans) {
              const node = $getNodeByKey(key);
              if (!$isRichTextImageNode(node) || !node.isUploading()) continue;
              const outcome = settled.current.get(key);
              settled.current.delete(key);
              $applyUploadOutcome(node, outcome ?? "failed");
            }
          },
          { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
        );
      }),
    );
    // lift images in content loaded before images were turned on
    editor.update(
      () => {
        for (const node of $collectImageNodes()) $liftImageToBlock(node);
      },
      { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
    );
    return unregister;
  }, [editor, enabled, $uploadFiles, reportError]);

  const context = useMemo<RichTextImageContextValue>(
    () => ({
      accept,
      maxWidth,
      takeAltPrompt: (key) => altPrompts.current.delete(key),
      reportError,
    }),
    [accept, maxWidth, reportError],
  );

  // always the same element, so turning images on or off never remounts the
  // editor (which would lose its content, undo history, and focus)
  return (
    <RichTextImageContext.Provider value={enabled ? context : null}>
      {children}
      {enabled && inlineError && (
        <div
          role="alert"
          className="border-input text-destructive flex items-start gap-2 border-t px-3 py-2 text-xs"
        >
          <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          <span className="flex-1">{inlineError.message}</span>
          <button
            type="button"
            aria-label="Dismiss"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-primary rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setInlineError(null)}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      )}
    </RichTextImageContext.Provider>
  );
};

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
const RichTextImageToolbarControls = ({
  renderButton,
}: RichTextImageToolbarControlsProps) => {
  const [editor] = useLexicalComposerContext();
  const context = useRichTextImageContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [urlOpen, setUrlOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const id = useId();

  useEffect(() => {
    if (urlOpen) urlInputRef.current?.focus();
  }, [urlOpen]);

  if (!context) return null;

  const closeUrl = () => {
    setUrlOpen(false);
    setUrl("");
    setUrlError(null);
  };

  const insertUrl = () => {
    const value = url.trim();
    const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
    // links must be https even when uploads may use http in development
    const verdict = isHttpsUrl(value)
      ? checkImageSrc(value, policy)
      : "invalid";
    if (verdict !== "allowed") {
      const message = describeRejectedUrl(value, verdict);
      setUrlError(message);
      urlInputRef.current?.focus();
      context.reportError({ code: "invalid-url", message, url: value });
      return;
    }
    editor.dispatchCommand(INSERT_RICH_TEXT_IMAGE_COMMAND, { src: value });
    closeUrl();
  };

  return (
    <>
      {renderButton({
        label: "Upload image",
        icon: <ImagePlus />,
        onClick: () => fileInputRef.current?.click(),
      })}
      <input
        ref={fileInputRef}
        type="file"
        accept={context.accept}
        multiple
        hidden
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          // reset so picking the same file again still fires a change
          event.target.value = "";
          if (files.length) {
            editor.dispatchCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND, files);
          }
        }}
      />
      <span className="relative inline-flex">
        {renderButton({
          label: "Insert image from link",
          icon: <Link2 />,
          pressed: urlOpen,
          onClick: () => (urlOpen ? closeUrl() : setUrlOpen(true)),
        })}
        {urlOpen && (
          <div
            role="group"
            aria-label="Insert image from link"
            className="border-border bg-popover text-popover-foreground absolute top-full left-0 z-20 mt-1 flex w-80 max-w-screen flex-col gap-2 rounded-md border p-3 text-sm shadow-md"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeUrl();
              }
            }}
          >
            <label htmlFor={`${id}-url`} className="text-xs font-medium">
              Image link
            </label>
            <input
              ref={urlInputRef}
              id={`${id}-url`}
              type="url"
              inputMode="url"
              placeholder="https://"
              value={url}
              aria-invalid={urlError ? true : undefined}
              aria-describedby={urlError ? `${id}-url-error` : undefined}
              className={inputClassName}
              onChange={(event) => {
                setUrl(event.target.value);
                setUrlError(null);
              }}
              onKeyDown={(event) => {
                preventSubmit(event);
                if (event.key === "Enter") insertUrl();
              }}
            />
            {urlError && (
              <p
                id={`${id}-url-error`}
                role="alert"
                className="text-destructive text-xs"
              >
                {urlError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={closeUrl}>
                Cancel
              </Button>
              <Button size="sm" onClick={insertUrl}>
                Insert
              </Button>
            </div>
          </div>
        )}
      </span>
    </>
  );
};

export type {
  ImageSrcVerdict,
  RichTextImageError,
  RichTextImageErrorCode,
  RichTextImageOptions,
  RichTextImageSummary,
  RichTextImageUploadResult,
  SerializedRichTextImageNode,
};
export {
  $createRichTextImageNode,
  $getRichTextImageSummary,
  $isRichTextImageNode,
  DEFAULT_IMAGE_ACCEPT,
  DEFAULT_IMAGE_MAX_WIDTH,
  EMAIL_IMAGE_STYLE,
  INSERT_RICH_TEXT_IMAGE_COMMAND,
  REPLACE_RICH_TEXT_IMAGE_COMMAND,
  RichTextImageNode,
  RichTextImageToolbarControls,
  RichTextImages,
  UPLOAD_RICH_TEXT_IMAGES_COMMAND,
  checkImageSrc,
  clampImageWidth,
  getRichTextImageSummary,
  isHttpsUrl,
  isSafeImageSrc,
  rememberUploadOutcome,
  validateImageFile,
};
