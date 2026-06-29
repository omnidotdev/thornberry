import {
  Skeleton
} from "../../../chunks/avatar-6znt0986.js";
import {
  Button
} from "../../../chunks/avatar-07z52b3z.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/rich-text-editor.tsx
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $createLinkNode,
  AutoLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND
} from "@lexical/link";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode
} from "@lexical/list";
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  HEADING,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK as LINK_TRANSFORMER,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST
} from "@lexical/markdown";
import {
  AutoLinkPlugin,
  createLinkMatcherWithRegExp
} from "@lexical/react/LexicalAutoLinkPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import DOMPurify from "isomorphic-dompurify";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  PASTE_COMMAND
} from "lexical";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { jsxDEV, Fragment } from "react/jsx-dev-runtime";
var defaultTheme = {
  paragraph: "mb-2 last:mb-0",
  heading: {
    h1: "mt-4 mb-2 font-bold text-xl first:mt-0",
    h2: "mt-3 mb-2 font-bold text-lg first:mt-0",
    h3: "mt-3 mb-1 font-semibold text-base first:mt-0"
  },
  text: {
    bold: "font-semibold",
    italic: "italic",
    strikethrough: "line-through",
    underline: "underline",
    code: "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
  },
  list: {
    ul: "mb-2 ml-5 list-disc",
    ol: "mb-2 ml-5 list-decimal",
    listitem: "mb-1"
  },
  link: "text-primary underline underline-offset-2 hover:opacity-80",
  quote: "my-2 border-border border-l-2 pl-3 text-muted-foreground italic"
};
var MARKDOWN_TRANSFORMERS = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECK_LIST,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  INLINE_CODE,
  LINK_TRANSFORMER
];
var URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-\w@:%.+~#=]{1,256}\.[a-z]{2,6}\b([-\w@:%+.~#?&/=]*)/i;
var EMAIL_MATCHER = /[\w.+-]+@([\w-]+\.)+[a-z]{2,}/i;
var AUTO_LINK_MATCHERS = [
  createLinkMatcherWithRegExp(URL_MATCHER, (text) => text.startsWith("http") ? text : `https://${text}`),
  createLinkMatcherWithRegExp(EMAIL_MATCHER, (text) => `mailto:${text}`)
];
var linkFromText = (text) => {
  const value = text.trim();
  if (!value || /\s/.test(value))
    return null;
  if (/^https?:\/\/\S+$/i.test(value))
    return value;
  if (/^www\.\S+$/i.test(value))
    return `https://${value}`;
  if (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value))
    return `mailto:${value}`;
  return null;
};
var exportToHtml = (editor) => {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor);
  });
  return html;
};
var getTextContent = (editor) => {
  let text = "";
  editor.getEditorState().read(() => {
    text = $getRoot().getTextContent();
  });
  return text;
};
var isEditorEmpty = (editor) => {
  let empty = true;
  editor.getEditorState().read(() => {
    empty = $getRoot().getTextContent().trim().length === 0;
  });
  return empty;
};
var importFromHtml = (editor, html) => {
  editor.update(() => {
    const dom = new DOMParser().parseFromString(html, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);
    const root = $getRoot();
    root.clear();
    $insertNodes(nodes);
    $setSelection(null);
  });
};
var ToolbarButton = ({
  label,
  children,
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(Button, {
  type: "button",
  size: "icon",
  variant: "ghost",
  "aria-label": label,
  title: label,
  className: cn("size-8", className),
  onMouseDown: (event) => event.preventDefault(),
  ...rest,
  children
}, undefined, false, undefined, this);
var Toolbar = ({
  enableChecklist,
  className
}) => {
  const [editor] = useLexicalComposerContext();
  const format = (type) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  const insertLink = () => {
    const url = window.prompt("Link URL");
    if (url)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
  };
  return /* @__PURE__ */ jsxDEV("div", {
    className: cn("flex items-center gap-0.5 border-input border-b px-1 py-1", className),
    children: [
      /* @__PURE__ */ jsxDEV(ToolbarButton, {
        label: "Bold",
        onClick: () => format("bold"),
        children: /* @__PURE__ */ jsxDEV(Bold, {}, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(ToolbarButton, {
        label: "Italic",
        onClick: () => format("italic"),
        children: /* @__PURE__ */ jsxDEV(Italic, {}, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(ToolbarButton, {
        label: "Bulleted list",
        onClick: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
        children: /* @__PURE__ */ jsxDEV(List, {}, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(ToolbarButton, {
        label: "Numbered list",
        onClick: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
        children: /* @__PURE__ */ jsxDEV(ListOrdered, {}, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      enableChecklist && /* @__PURE__ */ jsxDEV(ToolbarButton, {
        label: "Checklist",
        onClick: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
        children: /* @__PURE__ */ jsxDEV(ListChecks, {}, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(ToolbarButton, {
        label: "Link",
        onClick: insertLink,
        children: /* @__PURE__ */ jsxDEV(LinkIcon, {}, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var EditablePlugin = ({ editable }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);
  return null;
};
var LinkShortcutsPlugin = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const unregisterPaste = editor.registerCommand(PASTE_COMMAND, (event) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        return false;
      }
      const href = linkFromText(event.clipboardData?.getData("text/plain") ?? "");
      if (!href)
        return false;
      event.preventDefault();
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, href);
      return true;
    }, COMMAND_PRIORITY_LOW);
    const unregisterShortcut = editor.registerCommand(KEY_MODIFIER_COMMAND, (event) => {
      const isLinkShortcut = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "k";
      if (!isLinkShortcut)
        return false;
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        return false;
      }
      event.preventDefault();
      const url = window.prompt("Link URL");
      if (url?.trim()) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
      }
      return true;
    }, COMMAND_PRIORITY_LOW);
    return () => {
      unregisterPaste();
      unregisterShortcut();
    };
  }, [editor]);
  return null;
};
var EditorApiPlugin = ({
  editorApi,
  defaultContent
}) => {
  const [editor] = useLexicalComposerContext();
  const seeded = useRef(false);
  useEffect(() => {
    if (defaultContent && !seeded.current) {
      seeded.current = true;
      importFromHtml(editor, defaultContent);
    }
  }, [editor, defaultContent]);
  useEffect(() => {
    if (!editorApi)
      return;
    editorApi.current = {
      clearContent: () => editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        paragraph.select();
      }),
      focus: () => editor.focus(() => editor.update(() => {
        $getRoot().selectEnd();
      }))
    };
  }, [editor, editorApi]);
  return null;
};

class MentionTypeaheadOption extends MenuOption {
  item;
  constructor(item) {
    super(item.id);
    this.item = item;
  }
}
var MentionTypeahead = ({ items }) => {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState(null);
  const triggerFn = useBasicTypeaheadTriggerMatch("@", { minLength: 0 });
  const options = useMemo(() => {
    const normalized = (query ?? "").toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(normalized)).slice(0, 6).map((item) => new MentionTypeaheadOption(item));
  }, [items, query]);
  const onSelectOption = useCallback((option, nodeToReplace, closeMenu) => {
    editor.update(() => {
      const mention = $createLinkNode(option.item.url ?? "#");
      mention.append($createTextNode(`@${option.item.label}`));
      if (nodeToReplace)
        nodeToReplace.replace(mention);
      const trailing = $createTextNode(" ");
      mention.insertAfter(trailing);
      trailing.select();
      closeMenu();
    });
  }, [editor]);
  return /* @__PURE__ */ jsxDEV(LexicalTypeaheadMenuPlugin, {
    onQueryChange: setQuery,
    onSelectOption,
    triggerFn,
    options,
    menuRenderFn: (anchorRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => anchorRef.current && options.length ? createPortal(/* @__PURE__ */ jsxDEV("ul", {
      className: "z-50 max-h-56 min-w-44 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      children: options.map((option, index) => /* @__PURE__ */ jsxDEV("li", {
        className: cn("cursor-pointer rounded-sm px-2 py-1.5 text-sm", selectedIndex === index && "bg-muted"),
        onMouseEnter: () => setHighlightedIndex(index),
        onMouseDown: (event) => {
          event.preventDefault();
          selectOptionAndCleanUp(option);
        },
        children: [
          "@",
          option.item.label
        ]
      }, option.key, true, undefined, this))
    }, undefined, false, undefined, this), anchorRef.current) : null
  }, undefined, false, undefined, this);
};

class IssueReferenceOption extends MenuOption {
  item;
  constructor(item) {
    super(String(item.id));
    this.item = item;
  }
}
var IssueReferenceTypeahead = ({
  items
}) => {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState(null);
  const triggerFn = useBasicTypeaheadTriggerMatch("#", { minLength: 0 });
  const options = useMemo(() => {
    const normalized = (query ?? "").toLowerCase();
    return items.filter((item) => String(item.number).startsWith(normalized) || item.title.toLowerCase().includes(normalized)).slice(0, 6).map((item) => new IssueReferenceOption(item));
  }, [items, query]);
  const onSelectOption = useCallback((option, nodeToReplace, closeMenu) => {
    editor.update(() => {
      const reference = $createTextNode(`#${option.item.number}`);
      if (nodeToReplace)
        nodeToReplace.replace(reference);
      const trailing = $createTextNode(" ");
      reference.insertAfter(trailing);
      trailing.select();
      closeMenu();
    });
  }, [editor]);
  return /* @__PURE__ */ jsxDEV(LexicalTypeaheadMenuPlugin, {
    onQueryChange: setQuery,
    onSelectOption,
    triggerFn,
    options,
    menuRenderFn: (anchorRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => anchorRef.current && options.length ? createPortal(/* @__PURE__ */ jsxDEV("ul", {
      className: "z-50 max-h-56 min-w-56 max-w-72 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      children: options.map((option, index) => /* @__PURE__ */ jsxDEV("li", {
        className: cn("flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm", selectedIndex === index && "bg-muted"),
        onMouseEnter: () => setHighlightedIndex(index),
        onMouseDown: (event) => {
          event.preventDefault();
          selectOptionAndCleanUp(option);
        },
        children: [
          /* @__PURE__ */ jsxDEV("span", {
            className: "shrink-0 font-medium text-muted-foreground",
            children: [
              "#",
              option.item.number
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV("span", {
            className: "truncate",
            children: option.item.title
          }, undefined, false, undefined, this)
        ]
      }, option.key, true, undefined, this))
    }, undefined, false, undefined, this), anchorRef.current) : null
  }, undefined, false, undefined, this);
};
var RichTextEditor = ({
  editorApi,
  onUpdate,
  defaultContent,
  editable = true,
  placeholder,
  hideToolbar = false,
  toolbarClassName,
  mentionItems,
  issueReferenceItems,
  enableChecklist,
  extraNodes,
  plugins,
  theme,
  skeletonClassName,
  className,
  editorClassName,
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!defaultContent);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return /* @__PURE__ */ jsxDEV(Skeleton, {
      className: cn("h-24 w-full rounded-md", skeletonClassName ?? className),
      ...rest
    }, undefined, false, undefined, this);
  }
  const initialConfig = {
    namespace: "RichTextEditor",
    theme: theme ?? defaultTheme,
    editable,
    onError: (error) => console.error("Lexical error:", error),
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      ...extraNodes ?? []
    ]
  };
  const handleChange = (_state, editor) => {
    const empty = isEditorEmpty(editor);
    setIsEmpty(empty);
    onUpdate?.({
      getHTML: () => exportToHtml(editor),
      getText: () => getTextContent(editor),
      isEmpty: empty
    });
  };
  return /* @__PURE__ */ jsxDEV("div", {
    className: cn("rounded-md border border-input bg-background text-sm focus-within:ring-1 focus-within:ring-ring", className),
    ...rest,
    children: /* @__PURE__ */ jsxDEV(LexicalComposer, {
      initialConfig,
      children: [
        !hideToolbar && editable && /* @__PURE__ */ jsxDEV(Toolbar, {
          enableChecklist,
          className: toolbarClassName
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV("div", {
          className: "relative",
          children: [
            /* @__PURE__ */ jsxDEV(RichTextPlugin, {
              contentEditable: /* @__PURE__ */ jsxDEV(ContentEditable, {
                className: cn("min-h-20 px-3 py-2 text-base outline-none md:text-sm", editorClassName),
                spellCheck: true
              }, undefined, false, undefined, this),
              placeholder: placeholder && isEmpty ? /* @__PURE__ */ jsxDEV("div", {
                className: "pointer-events-none absolute top-2 left-3 select-none text-muted-foreground",
                children: placeholder
              }, undefined, false, undefined, this) : null,
              ErrorBoundary: LexicalErrorBoundary
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(HistoryPlugin, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(ListPlugin, {}, undefined, false, undefined, this),
            enableChecklist && /* @__PURE__ */ jsxDEV(CheckListPlugin, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(TabIndentationPlugin, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(MarkdownShortcutPlugin, {
              transformers: MARKDOWN_TRANSFORMERS
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(LinkPlugin, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(LinkShortcutsPlugin, {}, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(AutoLinkPlugin, {
              matchers: AUTO_LINK_MATCHERS
            }, undefined, false, undefined, this),
            mentionItems?.length ? /* @__PURE__ */ jsxDEV(MentionTypeahead, {
              items: mentionItems
            }, undefined, false, undefined, this) : null,
            issueReferenceItems?.length ? /* @__PURE__ */ jsxDEV(IssueReferenceTypeahead, {
              items: issueReferenceItems
            }, undefined, false, undefined, this) : null,
            plugins,
            /* @__PURE__ */ jsxDEV(OnChangePlugin, {
              onChange: handleChange
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(EditablePlugin, {
              editable
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(EditorApiPlugin, {
              editorApi,
              defaultContent
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
var LINKIFY_PATTERN = /(?:https?:\/\/|www\.)[^\s<]+|[^\s<@]+@[^\s<@]+\.[a-z]{2,}/gi;
var TRAILING_PUNCTUATION = /[.,!?;:)\]]+$/;
var linkifyBareUrls = (html) => {
  let anchorDepth = 0;
  return html.split(/(<[^>]+>)/).map((segment) => {
    if (segment.startsWith("<")) {
      if (/^<a[\s>]/i.test(segment))
        anchorDepth++;
      else if (/^<\/a\s*>/i.test(segment) && anchorDepth > 0)
        anchorDepth--;
      return segment;
    }
    if (anchorDepth > 0)
      return segment;
    return segment.replace(LINKIFY_PATTERN, (match) => {
      const isEmail = match.includes("@") && !/^(https?:\/\/|www\.)/i.test(match);
      const trailing = isEmail ? "" : TRAILING_PUNCTUATION.exec(match)?.[0] ?? "";
      const core = trailing ? match.slice(0, -trailing.length) : match;
      const href = isEmail ? `mailto:${core}` : core.startsWith("http") ? core : `https://${core}`;
      return `<a href="${href}">${core}</a>${trailing}`;
    });
  }).join("");
};
var MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g;
var linkifyMarkdownLinks = (html) => {
  let anchorDepth = 0;
  return html.split(/(<[^>]+>)/).map((segment) => {
    if (segment.startsWith("<")) {
      if (/^<a[\s>]/i.test(segment))
        anchorDepth++;
      else if (/^<\/a\s*>/i.test(segment) && anchorDepth > 0)
        anchorDepth--;
      return segment;
    }
    if (anchorDepth > 0)
      return segment;
    return segment.replace(MARKDOWN_LINK_PATTERN, (_match, text, url) => `<a href="${url}">${text}</a>`);
  }).join("");
};
var openLinksInNewTab = (node) => {
  const href = node.tagName === "A" ? node.getAttribute("href") : null;
  if (href && /^https?:\/\//i.test(href)) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
};
var RichTextContent = ({
  html,
  fallback = null,
  className,
  ...rest
}) => {
  if (!html?.trim())
    return /* @__PURE__ */ jsxDEV(Fragment, {
      children: fallback
    }, undefined, false, undefined, this);
  DOMPurify.addHook("afterSanitizeAttributes", openLinksInNewTab);
  const clean = DOMPurify.sanitize(linkifyBareUrls(linkifyMarkdownLinks(html)), {
    ALLOWED_TAGS: [
      "p",
      "br",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "s",
      "code",
      "pre",
      "ul",
      "ol",
      "li",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "span"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"]
  });
  DOMPurify.removeHook("afterSanitizeAttributes");
  return /* @__PURE__ */ jsxDEV("div", {
    className: cn("[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-2 [&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h1]:font-bold [&_h1]:text-xl [&_h2]:font-bold [&_h2]:text-lg [&_h3]:font-semibold [&_h3]:text-base [&_ol]:ml-5 [&_ol]:list-decimal [&_ol_ol]:list-[lower-alpha] [&_p:last-child]:mb-0 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul_ul]:list-[circle]", className),
    dangerouslySetInnerHTML: { __html: clean },
    ...rest
  }, undefined, false, undefined, this);
};
var rich_text_editor_default = RichTextEditor;
export {
  linkifyMarkdownLinks,
  linkifyBareUrls,
  linkFromText,
  rich_text_editor_default as default,
  RichTextEditor,
  RichTextContent
};
