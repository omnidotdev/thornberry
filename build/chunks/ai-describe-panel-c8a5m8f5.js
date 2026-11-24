import {
  Button2
} from "./ai-describe-panel-h4yrvya3.js";
import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/rich-text-image.tsx
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
  stopLexicalPropagation
} from "lexical";
import {
  ImagePlus,
  Link2,
  LoaderCircle,
  TriangleAlert,
  Upload,
  X
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var DEFAULT_IMAGE_ACCEPT2 = "image/jpeg,image/png,image/webp,image/gif";
var DEFAULT_IMAGE_MAX_WIDTH2 = 600;
var MIN_IMAGE_WIDTH = 16;
var IMAGE_WIDTH_PRESETS = [25, 50, 75, 100];
var EMAIL_IMAGE_STYLE2 = "display:block;max-width:100%;height:auto;border:0";
var DEFAULT_POLICY = {
  maxWidth: DEFAULT_IMAGE_MAX_WIDTH2,
  allowInsecureHttp: false
};
var editorPolicies = new WeakMap;
var $getImagePolicy = () => {
  try {
    return editorPolicies.get($getEditor()) ?? null;
  } catch {
    return null;
  }
};
var checkImageSrc2 = (src, {
  allowInsecureHttp = false,
  isAllowedSrc
} = {}) => {
  if (!src?.trim())
    return "invalid";
  let url;
  try {
    url = new URL(src.trim());
  } catch {
    return "invalid";
  }
  if (url.protocol !== "https:" && url.protocol !== "http:")
    return "invalid";
  if (url.protocol === "http:" && !allowInsecureHttp)
    return "external";
  if (isAllowedSrc && !isAllowedSrc(url.href))
    return "external";
  return "allowed";
};
var isSafeImageSrc2 = (src, allowInsecureHttp = false) => checkImageSrc2(src, { allowInsecureHttp }) === "allowed";
var normalizeImageSrc2 = (src) => {
  const trimmed = src.trim();
  try {
    return new URL(trimmed).href;
  } catch {
    return trimmed;
  }
};
var isHttpsUrl2 = (value) => {
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
};
var clampImageWidth2 = (width, maxWidth) => Math.round(Math.min(Math.max(width, MIN_IMAGE_WIDTH), maxWidth));
var readImageWidth = (img) => {
  const attr = (img.getAttribute("width") ?? "").trim();
  if (/^\d+$/.test(attr) && Number(attr) > 0)
    return Number(attr);
  const style = /^(\d+(?:\.\d+)?)px$/.exec(img.style.width.trim());
  return style ? Math.round(Number(style[1])) : null;
};
var FORMAT_NAMES = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/avif": "AVIF",
  "image/svg+xml": "SVG"
};
var describeAccept = (accept) => {
  const names = Array.from(new Set(accept.split(",").map((token) => token.trim().toLowerCase()).filter(Boolean).map((token) => FORMAT_NAMES[token] ?? token.replace(/^image\//, "").replace(/^\./, "").toUpperCase())));
  if (names.length <= 1)
    return names[0] ?? "image";
  return `${names.slice(0, -1).join(", ")}, or ${names[names.length - 1]}`;
};
var matchesAccept = (file, accept) => {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept.split(",").map((token) => token.trim().toLowerCase()).filter(Boolean).some((token) => {
    if (token.startsWith("."))
      return name.endsWith(token);
    if (token.endsWith("/*"))
      return type.startsWith(token.slice(0, -1));
    return type === token;
  });
};
var formatBytes = (bytes) => bytes >= 1024 * 1024 ? `${Number((bytes / (1024 * 1024)).toFixed(1))} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
var validateImageFile2 = (file, { accept = DEFAULT_IMAGE_ACCEPT2, maxBytes }) => {
  if (!matchesAccept(file, accept)) {
    return {
      code: "unsupported-type",
      message: `"${file.name}" isn't a supported image. Use a ${describeAccept(accept)} file.`,
      file
    };
  }
  if (maxBytes !== undefined && file.size > maxBytes) {
    return {
      code: "file-too-large",
      message: `"${file.name}" is ${formatBytes(file.size)}. Images must be ${formatBytes(maxBytes)} or smaller.`,
      file
    };
  }
  return null;
};
var hostOf = (src) => {
  try {
    return new URL(src).host;
  } catch {
    return "another site";
  }
};
var $createImportedImageNode = (src, alt, width, policy) => {
  const verdict = checkImageSrc2(src, policy);
  if (verdict === "invalid" || !src)
    return null;
  return $createRichTextImageNode2({
    src: src.trim(),
    alt,
    width: width ? clampImageWidth2(width, policy.maxWidth) : null,
    external: verdict === "external"
  });
};
var convertImageElement = (domNode) => {
  const policy = $getImagePolicy();
  if (!policy)
    return { node: null };
  const img = domNode;
  return {
    node: $createImportedImageNode(img.getAttribute("src"), img.getAttribute("alt") ?? "", readImageWidth(img), policy)
  };
};

class RichTextImageNode2 extends DecoratorNode {
  __src;
  __alt;
  __width;
  __uploading;
  __external;
  __fileName;
  __inert;
  static getType() {
    return "rich-text-image";
  }
  static clone(node) {
    return new RichTextImageNode2({
      src: node.__src,
      alt: node.__alt,
      width: node.__width,
      uploading: node.__uploading,
      external: node.__external,
      fileName: node.__fileName,
      inert: node.__inert
    }, node.__key);
  }
  static importJSON(json) {
    const policy = $getImagePolicy();
    const src = typeof json.src === "string" ? json.src.trim() : null;
    if (!policy || src === null) {
      return $createRichTextImageNode2({ src: "", inert: true });
    }
    const width = Number(json.width);
    return $createRichTextImageNode2({
      src,
      alt: typeof json.alt === "string" ? json.alt : "",
      width: Number.isFinite(width) && width > 0 ? clampImageWidth2(width, policy.maxWidth) : null,
      external: checkImageSrc2(src, policy) !== "allowed"
    });
  }
  static importDOM() {
    return {
      img: () => $getImagePolicy() ? { conversion: convertImageElement, priority: 0 } : null
    };
  }
  constructor(payload = { src: "" }, key) {
    super(key);
    this.__src = payload.src;
    this.__alt = payload.alt ?? "";
    this.__width = payload.width ?? null;
    this.__uploading = payload.uploading ?? false;
    this.__external = payload.external ?? false;
    this.__fileName = payload.fileName ?? "";
    this.__inert = payload.inert ?? false;
  }
  exportJSON() {
    return {
      type: RichTextImageNode2.getType(),
      version: 1,
      src: this.__src,
      alt: this.__alt,
      width: this.__width
    };
  }
  exportDOM(editor) {
    const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
    if (this.__inert || this.__uploading || this.__external || checkImageSrc2(this.__src, policy) !== "allowed") {
      return { element: null };
    }
    const img = document.createElement("img");
    img.setAttribute("src", this.__src);
    img.setAttribute("alt", this.__alt);
    if (this.__width) {
      img.setAttribute("width", String(clampImageWidth2(this.__width, policy.maxWidth)));
    }
    img.setAttribute("style", EMAIL_IMAGE_STYLE2);
    return { element: img };
  }
  createDOM() {
    const div = document.createElement("div");
    div.className = "my-1 max-w-full";
    return div;
  }
  updateDOM() {
    return false;
  }
  isInline() {
    return false;
  }
  getSrc() {
    return this.getLatest().__src;
  }
  getAlt() {
    return this.getLatest().__alt;
  }
  getWidth() {
    return this.getLatest().__width;
  }
  isUploading() {
    return this.getLatest().__uploading;
  }
  isExternal() {
    return this.getLatest().__external;
  }
  isInert() {
    return this.getLatest().__inert;
  }
  setExternal(external) {
    const writable = this.getWritable();
    writable.__external = external;
    return writable;
  }
  cancelUpload() {
    const writable = this.getWritable();
    writable.__uploading = false;
    return writable;
  }
  setAlt(alt) {
    const writable = this.getWritable();
    writable.__alt = alt;
    return writable;
  }
  setWidth(width) {
    const writable = this.getWritable();
    writable.__width = width;
    return writable;
  }
  setUploading(fileName) {
    const writable = this.getWritable();
    writable.__uploading = true;
    writable.__fileName = fileName;
    return writable;
  }
  setUploaded(src, width) {
    const writable = this.getWritable();
    writable.__src = normalizeImageSrc2(src);
    writable.__width = width;
    writable.__uploading = false;
    writable.__external = false;
    return writable;
  }
  decorate() {
    if (this.__inert)
      return null;
    return /* @__PURE__ */ jsx(RichTextImageView, {
      nodeKey: this.getKey(),
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      uploading: this.__uploading,
      external: this.__external,
      fileName: this.__fileName
    });
  }
}
var $createRichTextImageNode2 = (payload) => $applyNodeReplacement(new RichTextImageNode2({ ...payload, src: normalizeImageSrc2(payload.src) }));
var $isRichTextImageNode2 = (node) => node instanceof RichTextImageNode2;
var $collectImageNodes = () => {
  const found = [];
  const visit = (node) => {
    if ($isRichTextImageNode2(node))
      found.push(node);
    else if ($isElementNode(node)) {
      for (const child of node.getChildren())
        visit(child);
    }
  };
  visit($getRoot());
  return found;
};
var $getRichTextImageSummary2 = () => {
  const summary = {
    count: 0,
    hasMissingAltText: false,
    isUploading: false,
    hasExternalImages: false
  };
  for (const node of $collectImageNodes()) {
    if (node.isInert())
      continue;
    summary.count += 1;
    if (node.isUploading())
      summary.isUploading = true;
    else if (node.isExternal())
      summary.hasExternalImages = true;
    else if (!node.getAlt().trim())
      summary.hasMissingAltText = true;
  }
  return summary;
};
var getRichTextImageSummary2 = (editor) => editor.getEditorState().read($getRichTextImageSummary2);
var $liftImageToBlock = (node) => {
  const parent = node.getParent();
  if (!parent || $isRootOrShadowRoot(parent))
    return;
  const [before, after] = $splitNode(parent, node.getIndexWithinParent());
  after.insertBefore(node);
  if (before?.isEmpty())
    before.remove();
  if (after.isEmpty())
    after.remove();
};
var $insertImageNodes = (nodes) => {
  const selection = $getSelection();
  if (!selection) {
    $getRoot().selectEnd();
  } else if ($isNodeSelection(selection)) {
    const last = selection.getNodes().at(-1);
    if (last)
      last.selectNext();
    else
      $getRoot().selectEnd();
  }
  $insertNodes(nodes);
  const last = nodes.at(-1);
  if (last?.isAttached() && !last.getNextSibling()) {
    const paragraph = $createParagraphNode();
    last.insertAfter(paragraph);
    paragraph.select();
  }
};
var INSERT_RICH_TEXT_IMAGE_COMMAND2 = createCommand("INSERT_RICH_TEXT_IMAGE_COMMAND");
var UPLOAD_RICH_TEXT_IMAGES_COMMAND2 = createCommand("UPLOAD_RICH_TEXT_IMAGES_COMMAND");
var REPLACE_RICH_TEXT_IMAGE_COMMAND2 = createCommand("REPLACE_RICH_TEXT_IMAGE_COMMAND");
var RichTextImageContext = createContext(null);
var useRichTextImageContext = () => useContext(RichTextImageContext);
var isFocusInsideEditor = (editor) => {
  const root = editor.getRootElement();
  if (!root)
    return false;
  const container = root.closest("[data-rich-text-editor]") ?? root;
  const active = root.ownerDocument.activeElement;
  return active !== null && container.contains(active);
};
var ISOLATED_EVENTS = [
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
  "drop"
];
var useIsolateFromEditor2 = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el)
      return;
    const stop = (event) => stopLexicalPropagation(event);
    for (const name of ISOLATED_EVENTS)
      el.addEventListener(name, stop);
    return () => {
      for (const name of ISOLATED_EVENTS)
        el.removeEventListener(name, stop);
    };
  });
};
var preventSubmit2 = (event) => {
  if (event.key === "Enter")
    event.preventDefault();
};
var inputClassName2 = "flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aria-invalid:border-destructive";
var RichTextImageView = ({
  nodeKey,
  src,
  alt,
  width,
  uploading,
  external,
  fileName
}) => {
  const [editor] = useLexicalComposerContext();
  const editable = useLexicalEditable();
  const context = useRichTextImageContext();
  const maxWidth = context?.maxWidth ?? DEFAULT_IMAGE_MAX_WIDTH2;
  const shownWidth = width ? Math.min(width, maxWidth) : null;
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [pinned, setPinned] = useState(false);
  const [failed, setFailed] = useState(false);
  const [altDraft, setAltDraft] = useState(alt);
  const [widthDraft, setWidthDraft] = useState(shownWidth ? String(shownWidth) : "");
  const imageRef = useRef(null);
  const altInputRef = useRef(null);
  const settingsRef = useRef(null);
  const badgeRef = useRef(null);
  const externalRef = useRef(null);
  const replaceInputRef = useRef(null);
  const altFocused = useRef(false);
  const altEditStarted = useRef(false);
  const id = useId();
  const altId = `${id}-alt`;
  const altHelpId = `${id}-alt-help`;
  const widthId = `${id}-width`;
  useIsolateFromEditor2(settingsRef);
  useIsolateFromEditor2(badgeRef);
  useIsolateFromEditor2(externalRef);
  const ready = !uploading && !external;
  const missingAlt = ready && !alt.trim();
  const showSettings = editable && ready && (isSelected || pinned);
  const updateNode = useCallback((fn, tag) => editor.update(() => {
    const node = $getNodeByKey(nodeKey);
    if ($isRichTextImageNode2(node))
      fn(node);
  }, { tag }), [editor, nodeKey]);
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
  useEffect(() => {
    if (!altFocused.current)
      setAltDraft(alt);
  }, [alt]);
  useEffect(() => {
    setWidthDraft(shownWidth ? String(shownWidth) : "");
  }, [shownWidth]);
  useEffect(() => {
    if (!ready || !context)
      return;
    if (context.takeAltPrompt(nodeKey))
      openSettings();
  }, [context, nodeKey, ready, openSettings]);
  useEffect(() => {
    const $openFromKeyboard = (event) => {
      const selection = $getSelection();
      if (!$isNodeSelection(selection) || !selection.has(nodeKey) || event && $isEventFromEmbeddedInput(event)) {
        return false;
      }
      event?.preventDefault();
      if (ready)
        openSettings();
      else if (external)
        replaceInputRef.current?.click();
      return true;
    };
    return mergeRegister(editor.registerCommand(CLICK_COMMAND, (event) => {
      if (!imageRef.current || event.target !== imageRef.current) {
        return false;
      }
      if (!event.shiftKey)
        clearSelection();
      setSelected(true);
      return true;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ENTER_COMMAND, $openFromKeyboard, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_SPACE_COMMAND, $openFromKeyboard, COMMAND_PRIORITY_LOW));
  }, [
    editor,
    nodeKey,
    ready,
    external,
    clearSelection,
    setSelected,
    openSettings
  ]);
  const closeSettings = () => {
    setPinned(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isRichTextImageNode2(node))
        node.selectNext();
    });
    editor.focus();
  };
  const commitAlt = (value) => {
    setAltDraft(value);
    const tag = altEditStarted.current ? HISTORY_MERGE_TAG : HISTORY_PUSH_TAG;
    altEditStarted.current = true;
    updateNode((node) => node.setAlt(value), tag);
  };
  const commitWidth = (value) => {
    const next = clampImageWidth2(value, maxWidth);
    setWidthDraft(String(next));
    if (next !== width) {
      updateNode((node) => node.setWidth(next), HISTORY_PUSH_TAG);
    }
  };
  const onImageLoad = () => {
    setFailed(false);
    const natural = imageRef.current?.naturalWidth;
    if (!width && natural) {
      const next = clampImageWidth2(natural, maxWidth);
      setWidthDraft(String(next));
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isRichTextImageNode2(node))
          node.setWidth(next);
      }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
    }
  };
  const selectedHint = isSelected && editable && /* @__PURE__ */ jsxs("span", {
    className: "sr-only",
    "aria-live": "polite",
    children: [
      "Image selected. Press Enter to",
      " ",
      ready ? "edit its alt text and width" : "upload a replacement",
      "."
    ]
  });
  if (uploading) {
    return /* @__PURE__ */ jsxs("div", {
      role: "status",
      className: "border-border bg-muted text-muted-foreground flex h-24 w-56 max-w-full items-center justify-center gap-2 rounded-md border border-dashed px-3 text-xs",
      children: [
        /* @__PURE__ */ jsx(LoaderCircle, {
          className: "size-4 shrink-0 animate-spin",
          "aria-hidden": true
        }),
        /* @__PURE__ */ jsxs("span", {
          className: "truncate",
          children: [
            "Uploading",
            fileName ? ` ${fileName}` : " image"
          ]
        })
      ]
    });
  }
  if (external) {
    return /* @__PURE__ */ jsxs("div", {
      ref: externalRef,
      role: "group",
      "aria-label": "Image that needs uploading",
      "data-rich-text-image": "",
      "data-external": "",
      onClick: () => {
        if (editable) {
          clearSelection();
          setSelected(true);
        }
      },
      className: cn("border-destructive bg-muted flex w-80 max-w-full flex-col items-start gap-2 rounded-md border border-dashed p-3 text-xs", isSelected && "outline-primary outline-2 outline-offset-2"),
      children: [
        /* @__PURE__ */ jsxs("span", {
          className: "text-destructive flex items-start gap-1.5 font-medium",
          children: [
            /* @__PURE__ */ jsx(TriangleAlert, {
              className: "mt-px size-3.5 shrink-0",
              "aria-hidden": true
            }),
            "This image is hosted on ",
            hostOf(src),
            ", so it can't be sent. Upload a copy to use it."
          ]
        }),
        alt && /* @__PURE__ */ jsxs("span", {
          className: "text-muted-foreground",
          children: [
            "Alt text: ",
            alt
          ]
        }),
        editable && /* @__PURE__ */ jsxs(Fragment, {
          children: [
            /* @__PURE__ */ jsxs(Button2, {
              size: "sm",
              variant: "outline",
              className: "h-7 px-2 text-xs",
              onClick: () => replaceInputRef.current?.click(),
              children: [
                /* @__PURE__ */ jsx(Upload, {
                  "aria-hidden": true
                }),
                "Upload replacement"
              ]
            }),
            /* @__PURE__ */ jsx("input", {
              ref: replaceInputRef,
              type: "file",
              accept: context?.accept ?? DEFAULT_IMAGE_ACCEPT2,
              hidden: true,
              tabIndex: -1,
              "aria-hidden": true,
              onChange: (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) {
                  editor.dispatchCommand(REPLACE_RICH_TEXT_IMAGE_COMMAND2, {
                    key: nodeKey,
                    file
                  });
                }
              }
            })
          ]
        }),
        selectedHint
      ]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "relative flex max-w-full flex-col items-start gap-2",
    "data-rich-text-image": "",
    "data-missing-alt": missingAlt ? "" : undefined,
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setPinned(false);
      }
    },
    children: [
      /* @__PURE__ */ jsxs("span", {
        className: "relative inline-block max-w-full",
        children: [
          /* @__PURE__ */ jsx("img", {
            ref: imageRef,
            src,
            alt,
            width: shownWidth ?? undefined,
            draggable: false,
            onLoad: onImageLoad,
            onError: () => setFailed(true),
            style: shownWidth ? { width: `${shownWidth}px` } : undefined,
            className: cn("block h-auto max-w-full rounded-sm", editable && "cursor-pointer", isSelected && "outline-primary outline-2 outline-offset-2", editable && (missingAlt || failed) && !isSelected && "outline-destructive outline-2 outline-offset-2 outline-dashed")
          }),
          editable && (missingAlt || failed) && /* @__PURE__ */ jsxs("button", {
            ref: badgeRef,
            type: "button",
            onClick: () => {
              setSelected(true);
              openSettings();
            },
            className: "border-destructive bg-background text-destructive focus-visible:ring-primary absolute top-2 left-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium shadow-sm focus-visible:ring-2 focus-visible:outline-none",
            children: [
              /* @__PURE__ */ jsx(TriangleAlert, {
                className: "size-3.5",
                "aria-hidden": true
              }),
              failed ? "Image couldn't load" : "Add alt text"
            ]
          })
        ]
      }),
      selectedHint,
      showSettings && /* @__PURE__ */ jsxs("div", {
        ref: settingsRef,
        role: "group",
        "aria-label": "Image settings",
        className: "border-border bg-popover text-popover-foreground flex w-72 max-w-full flex-col gap-3 rounded-md border p-3 text-sm shadow-md",
        onKeyDown: (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeSettings();
          }
        },
        onFocus: () => setPinned(true),
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1.5",
            children: [
              /* @__PURE__ */ jsxs("label", {
                htmlFor: altId,
                className: "text-xs font-medium",
                children: [
                  "Alt text",
                  " ",
                  /* @__PURE__ */ jsx("span", {
                    className: "text-muted-foreground font-normal",
                    children: "(required)"
                  })
                ]
              }),
              /* @__PURE__ */ jsx("input", {
                ref: altInputRef,
                id: altId,
                type: "text",
                value: altDraft,
                placeholder: "e.g. Three friends laughing at a cafe",
                "aria-invalid": missingAlt || undefined,
                "aria-describedby": altHelpId,
                className: inputClassName2,
                onFocus: () => {
                  altFocused.current = true;
                  altEditStarted.current = false;
                },
                onBlur: () => {
                  altFocused.current = false;
                },
                onKeyDown: (event) => {
                  preventSubmit2(event);
                  if (event.key === "Enter")
                    closeSettings();
                },
                onChange: (event) => commitAlt(event.target.value)
              }),
              /* @__PURE__ */ jsx("p", {
                id: altHelpId,
                className: cn("text-xs", missingAlt ? "text-destructive" : "text-muted-foreground"),
                children: missingAlt ? "Describe the image. Screen readers read it aloud, and inboxes that block images show it instead." : "Screen readers read this aloud, and inboxes that block images show it instead."
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1.5",
            children: [
              /* @__PURE__ */ jsx("span", {
                className: "text-xs font-medium",
                children: "Width"
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap items-center gap-1",
                children: [
                  IMAGE_WIDTH_PRESETS.map((percent) => {
                    const presetWidth = clampImageWidth2(maxWidth * percent / 100, maxWidth);
                    return /* @__PURE__ */ jsxs(Button2, {
                      variant: shownWidth === presetWidth ? "solid" : "outline",
                      size: "sm",
                      className: "h-7 px-2 text-xs",
                      "aria-pressed": shownWidth === presetWidth,
                      "aria-label": `${percent}% width (${presetWidth} pixels)`,
                      onClick: () => commitWidth(presetWidth),
                      children: [
                        percent,
                        "%"
                      ]
                    }, percent);
                  }),
                  /* @__PURE__ */ jsxs("span", {
                    className: "ml-auto flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsx("label", {
                        htmlFor: widthId,
                        className: "sr-only",
                        children: "Width in pixels"
                      }),
                      /* @__PURE__ */ jsx("input", {
                        id: widthId,
                        type: "number",
                        inputMode: "numeric",
                        min: MIN_IMAGE_WIDTH,
                        max: maxWidth,
                        value: widthDraft,
                        className: cn(inputClassName2, "w-20"),
                        onChange: (event) => setWidthDraft(event.target.value),
                        onBlur: () => {
                          const value = Number(widthDraft);
                          if (Number.isFinite(value) && value > 0)
                            commitWidth(value);
                          else
                            setWidthDraft(shownWidth ? String(shownWidth) : "");
                        },
                        onKeyDown: (event) => {
                          preventSubmit2(event);
                          if (event.key === "Enter") {
                            const value = Number(widthDraft);
                            if (Number.isFinite(value) && value > 0) {
                              commitWidth(value);
                            }
                          }
                        }
                      }),
                      /* @__PURE__ */ jsx("span", {
                        className: "text-muted-foreground text-xs",
                        children: "px"
                      })
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("p", {
                className: "text-muted-foreground text-xs",
                children: [
                  "Up to ",
                  maxWidth,
                  "px. Press Delete with the image selected to remove it."
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsx("div", {
            className: "flex justify-end",
            children: /* @__PURE__ */ jsx(Button2, {
              size: "sm",
              onClick: closeSettings,
              children: "Done"
            })
          })
        ]
      })
    ]
  });
};
var isImageOnlyHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.trim() === "" && doc.body.querySelector("img") !== null;
};
var imageFilesFromClipboard = (data) => {
  if (!data)
    return [];
  const files = Array.from(data.files ?? []).filter((file) => file.type.startsWith("image/"));
  if (!files.length)
    return [];
  const html = data.getData("text/html");
  if (html)
    return isImageOnlyHtml(html) ? files : [];
  return data.getData("text/plain").trim() ? [] : files;
};
var uploadFailedMessage = (file) => `"${file.name}" couldn't be uploaded. Check your connection and try again.`;
var describeRejectedUrl = (url, verdict) => verdict === "external" && isHttpsUrl2(url) ? `Images from ${hostOf(url)} can't be used. Upload the image instead.` : "Use a full image link that starts with https:// (for example, https://example.com/photo.jpg).";
var $applyUploadOutcome = (node, outcome) => {
  if (outcome !== "failed")
    node.setUploaded(outcome.src, outcome.width);
  else if (node.isExternal())
    node.cancelUpload();
  else
    node.remove();
};
var SETTLED_UPLOAD_LIMIT = 50;
var rememberUploadOutcome2 = (outcomes, key, outcome, limit = SETTLED_UPLOAD_LIMIT) => {
  outcomes.delete(key);
  outcomes.set(key, outcome);
  while (outcomes.size > limit) {
    const oldest = outcomes.keys().next().value;
    outcomes.delete(oldest);
  }
};
var RichTextImages2 = ({ options, children }) => {
  const [editor] = useLexicalComposerContext();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const enabled = Boolean(options);
  const accept = options?.accept ?? DEFAULT_IMAGE_ACCEPT2;
  const maxWidth = options?.maxWidth ?? DEFAULT_IMAGE_MAX_WIDTH2;
  const allowInsecureHttp = options?.allowInsecureHttp ?? false;
  const isAllowedSrc = options?.isAllowedSrc;
  if (enabled) {
    editorPolicies.set(editor, { maxWidth, allowInsecureHttp, isAllowedSrc });
  } else {
    editorPolicies.delete(editor);
  }
  useEffect(() => () => void editorPolicies.delete(editor), [editor]);
  const altPrompts = useRef(new Set);
  const inflight = useRef(new Set);
  const settled = useRef(new Map);
  const lastKeyDownAt = useRef(0);
  const generation = useRef(0);
  const [inlineError, setInlineError] = useState(null);
  const reportError = useCallback((error) => {
    const onError = optionsRef.current?.onError;
    if (onError)
      onError(error);
    else if (error.code !== "invalid-url")
      setInlineError(error);
  }, []);
  const $uploadFiles = useCallback((files, replaceKey) => {
    const current = optionsRef.current;
    if (!current)
      return;
    const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
    const accepted = [];
    for (const file of files) {
      const error = validateImageFile2(file, current);
      if (error)
        reportError(error);
      else
        accepted.push(file);
    }
    if (!accepted.length)
      return;
    let pending;
    const replaced = replaceKey ? $getNodeByKey(replaceKey) : null;
    if ($isRichTextImageNode2(replaced) && accepted[0]) {
      replaced.setUploading(accepted[0].name);
      pending = [{ key: replaced.getKey(), file: accepted[0] }];
    } else {
      const nodes = accepted.map((file) => $createRichTextImageNode2({
        src: "",
        uploading: true,
        fileName: file.name
      }));
      $insertImageNodes(nodes);
      pending = nodes.map((node, index) => ({
        key: node.getKey(),
        file: accepted[index]
      }));
    }
    const startedGeneration = generation.current;
    for (const { key, file } of pending) {
      inflight.current.add(key);
      const startedAt = Date.now();
      const settle = (outcome) => {
        if (generation.current !== startedGeneration)
          return;
        rememberUploadOutcome2(settled.current, key, outcome);
        inflight.current.delete(key);
        editor.update(() => {
          const node = $getNodeByKey(key);
          if (!$isRichTextImageNode2(node) || !node.isUploading())
            return;
          $applyUploadOutcome(node, outcome);
        }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
      };
      const fail = (cause) => {
        settle("failed");
        reportError({
          code: "upload-failed",
          message: uploadFailedMessage(file),
          file,
          cause
        });
      };
      Promise.resolve().then(() => current.upload(file)).then((result) => {
        if (checkImageSrc2(result?.src, policy) !== "allowed") {
          fail(new Error("upload did not resolve to an allowed https src"));
          return;
        }
        if (lastKeyDownAt.current < startedAt && isFocusInsideEditor(editor)) {
          altPrompts.current.add(key);
        }
        settle({
          src: result.src.trim(),
          width: result.width ? clampImageWidth2(result.width, policy.maxWidth) : null
        });
      }, fail);
    }
  }, [editor, reportError]);
  useEffect(() => editor.registerNodeTransform(RichTextImageNode2, (node) => {
    if (node.isInert())
      node.remove();
  }), [editor]);
  const wasEnabled = useRef(enabled);
  useEffect(() => {
    const was = wasEnabled.current;
    wasEnabled.current = enabled;
    if (!was || enabled)
      return;
    generation.current += 1;
    inflight.current.clear();
    settled.current.clear();
    altPrompts.current.clear();
    setInlineError(null);
    editor.update(() => {
      for (const node of $collectImageNodes()) {
        if (node.isUploading())
          $applyUploadOutcome(node, "failed");
      }
    }, { tag: SKIP_DOM_SELECTION_TAG });
  }, [editor, enabled]);
  useEffect(() => {
    if (!enabled)
      return;
    const policy = { allowInsecureHttp, isAllowedSrc };
    const changes = editor.getEditorState().read(() => $collectImageNodes().filter((node) => !node.isUploading() && !node.isInert()).map((node) => ({
      key: node.getKey(),
      external: checkImageSrc2(node.getSrc(), policy) !== "allowed",
      was: node.isExternal()
    })).filter(({ external, was }) => external !== was));
    if (!changes.length)
      return;
    editor.update(() => {
      for (const { key, external } of changes) {
        const node = $getNodeByKey(key);
        if ($isRichTextImageNode2(node))
          node.setExternal(external);
      }
    }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
  }, [editor, enabled, isAllowedSrc, allowInsecureHttp]);
  useEffect(() => {
    if (!enabled)
      return;
    const unregister = mergeRegister(editor.registerCommand(INSERT_RICH_TEXT_IMAGE_COMMAND2, ({ src, alt, width }) => {
      const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
      const verdict = checkImageSrc2(src, policy);
      if (verdict !== "allowed") {
        reportError({
          code: "invalid-url",
          message: describeRejectedUrl(src, verdict),
          url: src
        });
        return false;
      }
      const node = $createRichTextImageNode2({
        src: src.trim(),
        alt,
        width: width ? clampImageWidth2(width, policy.maxWidth) : null
      });
      if (!alt?.trim() && isFocusInsideEditor(editor)) {
        altPrompts.current.add(node.getKey());
      }
      $insertImageNodes([node]);
      return true;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND2, (files) => {
      $uploadFiles(files);
      return true;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(REPLACE_RICH_TEXT_IMAGE_COMMAND2, ({ key, file }) => {
      $uploadFiles([file], key);
      return true;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(PASTE_COMMAND, (event) => {
      if ($isEventFromEmbeddedInput(event))
        return false;
      const data = "clipboardData" in event ? event.clipboardData : ("dataTransfer" in event) ? event.dataTransfer : null;
      const files = imageFilesFromClipboard(data);
      if (!files.length)
        return false;
      event.preventDefault();
      $uploadFiles(files);
      return true;
    }, COMMAND_PRIORITY_HIGH), editor.registerCommand(DRAG_DROP_PASTE, (files) => {
      $uploadFiles(files);
      return true;
    }, COMMAND_PRIORITY_HIGH), editor.registerCommand(KEY_DOWN_COMMAND, () => {
      lastKeyDownAt.current = Date.now();
      return false;
    }, COMMAND_PRIORITY_HIGH), editor.registerCommand(KEY_BACKSPACE_COMMAND, (event) => $isEventFromEmbeddedInput(event), COMMAND_PRIORITY_HIGH), editor.registerCommand(KEY_DELETE_COMMAND, (event) => $isEventFromEmbeddedInput(event), COMMAND_PRIORITY_HIGH), editor.registerNodeTransform(RichTextImageNode2, $liftImageToBlock), editor.registerUpdateListener(({ editorState }) => {
      const orphans = editorState.read(() => $collectImageNodes().filter((node) => node.isUploading() && !inflight.current.has(node.getKey())).map((node) => node.getKey()));
      if (!orphans.length)
        return;
      editor.update(() => {
        for (const key of orphans) {
          const node = $getNodeByKey(key);
          if (!$isRichTextImageNode2(node) || !node.isUploading())
            continue;
          const outcome = settled.current.get(key);
          settled.current.delete(key);
          $applyUploadOutcome(node, outcome ?? "failed");
        }
      }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
    }));
    editor.update(() => {
      for (const node of $collectImageNodes())
        $liftImageToBlock(node);
    }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
    return unregister;
  }, [editor, enabled, $uploadFiles, reportError]);
  const context = useMemo(() => ({
    accept,
    maxWidth,
    takeAltPrompt: (key) => altPrompts.current.delete(key),
    reportError
  }), [accept, maxWidth, reportError]);
  return /* @__PURE__ */ jsxs(RichTextImageContext.Provider, {
    value: enabled ? context : null,
    children: [
      children,
      enabled && inlineError && /* @__PURE__ */ jsxs("div", {
        role: "alert",
        className: "border-input text-destructive flex items-start gap-2 border-t px-3 py-2 text-xs",
        children: [
          /* @__PURE__ */ jsx(TriangleAlert, {
            className: "mt-px size-3.5 shrink-0",
            "aria-hidden": true
          }),
          /* @__PURE__ */ jsx("span", {
            className: "flex-1",
            children: inlineError.message
          }),
          /* @__PURE__ */ jsx("button", {
            type: "button",
            "aria-label": "Dismiss",
            className: "text-muted-foreground hover:text-foreground focus-visible:ring-primary rounded-sm focus-visible:ring-2 focus-visible:outline-none",
            onClick: () => setInlineError(null),
            children: /* @__PURE__ */ jsx(X, {
              className: "size-3.5",
              "aria-hidden": true
            })
          })
        ]
      })
    ]
  });
};
var RichTextImageToolbarControls2 = ({
  renderButton
}) => {
  const [editor] = useLexicalComposerContext();
  const context = useRichTextImageContext();
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);
  const [urlOpen, setUrlOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const id = useId();
  useEffect(() => {
    if (urlOpen)
      urlInputRef.current?.focus();
  }, [urlOpen]);
  if (!context)
    return null;
  const closeUrl = () => {
    setUrlOpen(false);
    setUrl("");
    setUrlError(null);
  };
  const insertUrl = () => {
    const value = url.trim();
    const policy = editorPolicies.get(editor) ?? DEFAULT_POLICY;
    const verdict = isHttpsUrl2(value) ? checkImageSrc2(value, policy) : "invalid";
    if (verdict !== "allowed") {
      const message = describeRejectedUrl(value, verdict);
      setUrlError(message);
      urlInputRef.current?.focus();
      context.reportError({ code: "invalid-url", message, url: value });
      return;
    }
    editor.dispatchCommand(INSERT_RICH_TEXT_IMAGE_COMMAND2, { src: value });
    closeUrl();
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      renderButton({
        label: "Upload image",
        icon: /* @__PURE__ */ jsx(ImagePlus, {}),
        onClick: () => fileInputRef.current?.click()
      }),
      /* @__PURE__ */ jsx("input", {
        ref: fileInputRef,
        type: "file",
        accept: context.accept,
        multiple: true,
        hidden: true,
        tabIndex: -1,
        "aria-hidden": true,
        onChange: (event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length) {
            editor.dispatchCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND2, files);
          }
        }
      }),
      /* @__PURE__ */ jsxs("span", {
        className: "relative inline-flex",
        children: [
          renderButton({
            label: "Insert image from link",
            icon: /* @__PURE__ */ jsx(Link2, {}),
            pressed: urlOpen,
            onClick: () => urlOpen ? closeUrl() : setUrlOpen(true)
          }),
          urlOpen && /* @__PURE__ */ jsxs("div", {
            role: "group",
            "aria-label": "Insert image from link",
            className: "border-border bg-popover text-popover-foreground absolute top-full left-0 z-20 mt-1 flex w-80 max-w-screen flex-col gap-2 rounded-md border p-3 text-sm shadow-md",
            onKeyDown: (event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeUrl();
              }
            },
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: `${id}-url`,
                className: "text-xs font-medium",
                children: "Image link"
              }),
              /* @__PURE__ */ jsx("input", {
                ref: urlInputRef,
                id: `${id}-url`,
                type: "url",
                inputMode: "url",
                placeholder: "https://",
                value: url,
                "aria-invalid": urlError ? true : undefined,
                "aria-describedby": urlError ? `${id}-url-error` : undefined,
                className: inputClassName2,
                onChange: (event) => {
                  setUrl(event.target.value);
                  setUrlError(null);
                },
                onKeyDown: (event) => {
                  preventSubmit2(event);
                  if (event.key === "Enter")
                    insertUrl();
                }
              }),
              urlError && /* @__PURE__ */ jsx("p", {
                id: `${id}-url-error`,
                role: "alert",
                className: "text-destructive text-xs",
                children: urlError
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex justify-end gap-2",
                children: [
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "ghost",
                    size: "sm",
                    onClick: closeUrl,
                    children: "Cancel"
                  }),
                  /* @__PURE__ */ jsx(Button2, {
                    size: "sm",
                    onClick: insertUrl,
                    children: "Insert"
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};
export { DEFAULT_IMAGE_ACCEPT2, DEFAULT_IMAGE_MAX_WIDTH2, EMAIL_IMAGE_STYLE2, checkImageSrc2, isSafeImageSrc2, normalizeImageSrc2, isHttpsUrl2, clampImageWidth2, validateImageFile2, RichTextImageNode2, $createRichTextImageNode2, $isRichTextImageNode2, $getRichTextImageSummary2, getRichTextImageSummary2, INSERT_RICH_TEXT_IMAGE_COMMAND2, UPLOAD_RICH_TEXT_IMAGES_COMMAND2, REPLACE_RICH_TEXT_IMAGE_COMMAND2, useIsolateFromEditor2, preventSubmit2, inputClassName2, rememberUploadOutcome2, RichTextImages2, RichTextImageToolbarControls2 };
