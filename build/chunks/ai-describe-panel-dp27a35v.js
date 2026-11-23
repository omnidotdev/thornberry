import {
  Button2
} from "./ai-describe-panel-h4yrvya3.js";
import {
  useIsolateFromEditor2,
  preventSubmit2,
  inputClassName2
} from "./ai-describe-panel-c8a5m8f5.js";
import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/rich-text-button.tsx
import { $createLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $applyNodeReplacement,
  $createParagraphNode,
  $createTextNode,
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
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  HISTORY_MERGE_TAG,
  HISTORY_PUSH_TAG,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_SPACE_COMMAND,
  SKIP_DOM_SELECTION_TAG,
  createCommand,
  mergeRegister
} from "lexical";
import { RectangleHorizontal, TriangleAlert } from "lucide-react";
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
import { jsx, jsxs } from "react/jsx-runtime";
var BUTTON_VARIANT2 = "button";
var editorButtonPolicies = new WeakMap;
var $getButtonPolicy = () => {
  try {
    return editorButtonPolicies.get($getEditor()) ?? null;
  } catch {
    return null;
  }
};
var checkButtonHref2 = (href, isAllowedHref) => {
  const value = href?.trim() ?? "";
  if (!value)
    return { ok: false, problem: "missing" };
  let url;
  try {
    url = new URL(value);
  } catch {
    return { ok: false, problem: "invalid" };
  }
  const valid = url.protocol === "https:" ? url.hostname !== "" : url.protocol === "mailto:" && url.pathname.includes("@");
  if (!valid)
    return { ok: false, problem: "invalid" };
  if (isAllowedHref && !isAllowedHref(url.href)) {
    return { ok: false, problem: "refused" };
  }
  return { ok: true, href: url.href };
};
var normalizeButtonLabel = (label) => label.replace(/\s+/g, " ").trim();
var describeButtonHrefProblem2 = (problem, href) => {
  if (problem === "missing")
    return "Add a link for the button.";
  if (problem === "invalid") {
    return "Use a full link that starts with https:// (for example, https://example.com), or mailto: and an email address.";
  }
  try {
    const url = new URL(href.trim());
    return url.protocol === "mailto:" ? "Buttons can't email this address. Use a different link." : `Buttons can't link to ${url.host}. Use a different link.`;
  } catch {
    return "Buttons can't use this link. Use a different link.";
  }
};
var normalizeHref = (href) => {
  const trimmed = href.trim();
  try {
    return new URL(trimmed).href;
  } catch {
    return trimmed;
  }
};
var isButtonAnchor = (domNode) => domNode.nodeName === "A" && domNode.getAttribute("data-variant") === BUTTON_VARIANT2;
var convertButtonAnchor = (domNode) => {
  const policy = $getButtonPolicy();
  const label = normalizeButtonLabel(domNode.textContent ?? "");
  const verdict = checkButtonHref2(domNode.getAttribute("href"), policy?.isAllowedHref);
  if (!policy || !verdict.ok || !label)
    return { node: null };
  return { node: $createRichTextButtonNode2({ label, href: verdict.href }) };
};

class RichTextButtonNode2 extends DecoratorNode {
  __label;
  __href;
  __inert;
  static getType() {
    return "rich-text-button";
  }
  static clone(node) {
    return new RichTextButtonNode2({ label: node.__label, href: node.__href, inert: node.__inert }, node.__key);
  }
  static importJSON(json) {
    const policy = $getButtonPolicy();
    const label = typeof json.label === "string" ? normalizeButtonLabel(json.label) : "";
    const href = typeof json.href === "string" ? json.href : "";
    if (!policy) {
      const verdict = checkButtonHref2(href);
      return $createRichTextButtonNode2({
        label,
        href: verdict.ok ? verdict.href : "",
        inert: true
      });
    }
    const verdict = checkButtonHref2(href, policy.isAllowedHref);
    if (!verdict.ok || !label) {
      return $createRichTextButtonNode2({ label, href: "", inert: true });
    }
    return $createRichTextButtonNode2({ label, href: verdict.href });
  }
  static importDOM() {
    return {
      a: (domNode) => $getButtonPolicy() && isButtonAnchor(domNode) ? { conversion: convertButtonAnchor, priority: 2 } : null
    };
  }
  constructor(payload = { label: "", href: "" }, key) {
    super(key);
    this.__label = payload.label;
    this.__href = payload.href;
    this.__inert = payload.inert ?? false;
  }
  exportJSON() {
    return {
      type: RichTextButtonNode2.getType(),
      version: 1,
      label: this.__label,
      href: this.__href
    };
  }
  exportDOM(editor) {
    if (this.__inert || !this.__label)
      return { element: null };
    const paragraph = document.createElement("p");
    const verdict = checkButtonHref2(this.__href, editorButtonPolicies.get(editor)?.isAllowedHref);
    if (!verdict.ok) {
      paragraph.textContent = this.__label;
      return { element: paragraph };
    }
    const anchor = document.createElement("a");
    anchor.setAttribute("href", verdict.href);
    anchor.setAttribute("data-variant", BUTTON_VARIANT2);
    anchor.textContent = this.__label;
    paragraph.append(anchor);
    return { element: paragraph };
  }
  createDOM() {
    const div = document.createElement("div");
    div.className = "my-2 max-w-full";
    return div;
  }
  updateDOM() {
    return false;
  }
  isInline() {
    return false;
  }
  getTextContent() {
    return this.getLatest().__inert ? "" : this.getLatest().__label;
  }
  getLabel() {
    return this.getLatest().__label;
  }
  getHref() {
    return this.getLatest().__href;
  }
  isInert() {
    return this.getLatest().__inert;
  }
  setButton(label, href) {
    const writable = this.getWritable();
    writable.__label = normalizeButtonLabel(label);
    writable.__href = normalizeHref(href);
    return writable;
  }
  decorate() {
    if (this.__inert)
      return null;
    return /* @__PURE__ */ jsx(RichTextButtonView, {
      nodeKey: this.getKey(),
      label: this.__label,
      href: this.__href
    });
  }
}
var $createRichTextButtonNode2 = (payload) => $applyNodeReplacement(new RichTextButtonNode2({
  ...payload,
  label: normalizeButtonLabel(payload.label),
  href: normalizeHref(payload.href)
}));
var $isRichTextButtonNode2 = (node) => node instanceof RichTextButtonNode2;
var $collectButtonNodes = () => {
  const found = [];
  const visit = (node) => {
    if ($isRichTextButtonNode2(node))
      found.push(node);
    else if ($isElementNode(node)) {
      for (const child of node.getChildren())
        visit(child);
    }
  };
  visit($getRoot());
  return found;
};
var $downgradeButton = (node) => {
  const label = node.getLabel();
  const href = node.getHref();
  if (!label) {
    node.remove();
    return;
  }
  const text = $createTextNode(label);
  const inline = href ? $createLinkNode(href).append(text) : text;
  const parent = node.getParent();
  if (!parent || $isRootOrShadowRoot(parent)) {
    node.replace($createParagraphNode().append(inline));
  } else {
    node.replace(inline);
  }
};
var $liftButtonToBlock = (node) => {
  const parent = node.getParent();
  if (!parent || $isRootOrShadowRoot(parent))
    return;
  const grandparent = parent.getParent();
  if (!grandparent || !$isRootOrShadowRoot(grandparent)) {
    node.getTopLevelElement()?.insertAfter(node);
    return;
  }
  const [before, after] = $splitNode(parent, node.getIndexWithinParent());
  after.insertBefore(node);
  if (before?.isEmpty())
    before.remove();
  if (after.isEmpty())
    after.remove();
};
var $insertButtonNode = (node) => {
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
  $insertNodes([node]);
  if (node.isAttached() && !node.getNextSibling()) {
    const paragraph = $createParagraphNode();
    node.insertAfter(paragraph);
    paragraph.select();
  }
};
var $removeButton = (node) => {
  const sibling = node.getNextSibling() ?? node.getPreviousSibling();
  node.remove();
  if ($isElementNode(sibling))
    sibling.selectStart();
  else if (sibling)
    sibling.selectNext();
  else {
    const paragraph = $createParagraphNode();
    $getRoot().append(paragraph);
    paragraph.select();
  }
};
var INSERT_RICH_TEXT_BUTTON_COMMAND2 = createCommand("INSERT_RICH_TEXT_BUTTON_COMMAND");
var RichTextButtonContext = createContext(null);
var useRichTextButtonContext = () => useContext(RichTextButtonContext);
var RichTextButtonForm = ({
  title,
  initialLabel = "",
  initialHref = "",
  submitText,
  isAllowedHref,
  onSubmit,
  onCancel,
  onRemove,
  className
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [href, setHref] = useState(initialHref);
  const [labelError, setLabelError] = useState(null);
  const [hrefError, setHrefError] = useState(null);
  const labelRef = useRef(null);
  const hrefRef = useRef(null);
  const id = useId();
  const labelId = `${id}-label`;
  const hrefId = `${id}-href`;
  const hrefHelpId = `${id}-href-help`;
  useEffect(() => {
    labelRef.current?.focus();
    labelRef.current?.select();
  }, []);
  const submit = () => {
    const nextLabel = normalizeButtonLabel(label);
    const verdict = checkButtonHref2(href, isAllowedHref);
    const nextLabelError = nextLabel ? null : "Add a label for the button.";
    const nextHrefError = verdict.ok ? null : describeButtonHrefProblem2(verdict.problem, href);
    setLabelError(nextLabelError);
    setHrefError(nextHrefError);
    if (nextLabelError)
      labelRef.current?.focus();
    else if (nextHrefError)
      hrefRef.current?.focus();
    if (nextLabelError || !verdict.ok)
      return;
    onSubmit(nextLabel, verdict.href);
  };
  const onFieldKeyDown = (event) => {
    preventSubmit2(event);
    if (event.key === "Enter")
      submit();
  };
  return /* @__PURE__ */ jsxs("div", {
    role: "group",
    "aria-label": title,
    "data-rich-text-button-form": "",
    className: cn("border-border bg-popover text-popover-foreground flex w-80 max-w-full flex-col gap-3 rounded-md border p-3 text-sm shadow-md", className),
    onKeyDown: (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    },
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-1.5",
        children: [
          /* @__PURE__ */ jsx("label", {
            htmlFor: labelId,
            className: "text-xs font-medium",
            children: "Button text"
          }),
          /* @__PURE__ */ jsx("input", {
            ref: labelRef,
            id: labelId,
            type: "text",
            value: label,
            placeholder: "e.g. Shop the sale",
            "aria-invalid": labelError ? true : undefined,
            "aria-describedby": labelError ? `${labelId}-error` : undefined,
            className: inputClassName2,
            onChange: (event) => {
              setLabel(event.target.value);
              setLabelError(null);
            },
            onKeyDown: onFieldKeyDown
          }),
          labelError && /* @__PURE__ */ jsx("p", {
            id: `${labelId}-error`,
            role: "alert",
            className: "text-destructive text-xs",
            children: labelError
          })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-1.5",
        children: [
          /* @__PURE__ */ jsx("label", {
            htmlFor: hrefId,
            className: "text-xs font-medium",
            children: "Button link"
          }),
          /* @__PURE__ */ jsx("input", {
            ref: hrefRef,
            id: hrefId,
            type: "url",
            inputMode: "url",
            value: href,
            placeholder: "https://",
            "aria-invalid": hrefError ? true : undefined,
            "aria-describedby": hrefHelpId,
            className: inputClassName2,
            onChange: (event) => {
              setHref(event.target.value);
              setHrefError(null);
            },
            onKeyDown: onFieldKeyDown
          }),
          /* @__PURE__ */ jsx("p", {
            id: hrefHelpId,
            role: hrefError ? "alert" : undefined,
            className: cn("text-xs", hrefError ? "text-destructive" : "text-muted-foreground"),
            children: hrefError ?? "An https:// link, or mailto: and an email address."
          })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          onRemove && /* @__PURE__ */ jsx(Button2, {
            variant: "ghost",
            size: "sm",
            className: "text-destructive hover:text-destructive",
            onClick: onRemove,
            children: "Remove"
          }),
          /* @__PURE__ */ jsxs("span", {
            className: "ml-auto flex gap-2",
            children: [
              /* @__PURE__ */ jsx(Button2, {
                variant: "ghost",
                size: "sm",
                onClick: onCancel,
                children: "Cancel"
              }),
              /* @__PURE__ */ jsx(Button2, {
                size: "sm",
                onClick: submit,
                children: submitText
              })
            ]
          })
        ]
      })
    ]
  });
};
var pillClassName = "bg-primary text-primary-foreground inline-flex max-w-full items-center rounded-md px-4 py-2 text-sm font-medium no-underline";
var RichTextButtonView = ({
  nodeKey,
  label,
  href
}) => {
  const [editor] = useLexicalComposerContext();
  const editable = useLexicalEditable();
  const context = useRichTextButtonContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editing, setEditing] = useState(false);
  const pillRef = useRef(null);
  const formRef = useRef(null);
  const canEdit = editable && context !== null;
  const refused = !checkButtonHref2(href, context?.isAllowedHref).ok;
  useIsolateFromEditor2(pillRef);
  useIsolateFromEditor2(formRef);
  const openEdit = useCallback(() => {
    clearSelection();
    setSelected(true);
    setEditing(true);
  }, [clearSelection, setSelected]);
  useEffect(() => {
    if (!canEdit)
      return;
    const $openFromKeyboard = (event) => {
      const selection = $getSelection();
      if (!$isNodeSelection(selection) || !selection.has(nodeKey) || event && $isEventFromEmbeddedInput(event)) {
        return false;
      }
      event?.preventDefault();
      setEditing(true);
      return true;
    };
    return mergeRegister(editor.registerCommand(KEY_ENTER_COMMAND, $openFromKeyboard, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_SPACE_COMMAND, $openFromKeyboard, COMMAND_PRIORITY_LOW));
  }, [editor, nodeKey, canEdit]);
  useEffect(() => {
    if (!canEdit)
      setEditing(false);
  }, [canEdit]);
  const closeEdit = () => {
    setEditing(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isRichTextButtonNode2(node))
        node.selectNext();
    });
    editor.focus();
  };
  const save = (nextLabel, nextHref) => {
    setEditing(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!$isRichTextButtonNode2(node))
        return;
      node.setButton(nextLabel, nextHref);
      node.selectNext();
    }, { tag: HISTORY_PUSH_TAG });
    editor.focus();
  };
  const remove = () => {
    setEditing(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isRichTextButtonNode2(node))
        $removeButton(node);
    }, { tag: HISTORY_PUSH_TAG });
    editor.focus();
  };
  if (!editable) {
    return refused ? /* @__PURE__ */ jsx("span", {
      className: pillClassName,
      "data-rich-text-button": "",
      children: label
    }) : /* @__PURE__ */ jsx("a", {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: pillClassName,
      "data-rich-text-button": "",
      children: label
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex max-w-full flex-col items-start gap-2",
    "data-rich-text-button": "",
    "data-refused": refused ? "" : undefined,
    children: [
      /* @__PURE__ */ jsx("button", {
        ref: pillRef,
        type: "button",
        tabIndex: -1,
        title: href,
        "aria-label": `Edit button: ${label}`,
        "aria-expanded": canEdit ? editing : undefined,
        disabled: !canEdit,
        onClick: () => {
          if (canEdit)
            openEdit();
        },
        className: cn(pillClassName, canEdit && "cursor-pointer", isSelected && "outline-primary outline-2 outline-offset-2", refused && !isSelected && "outline-destructive outline-2 outline-offset-2 outline-dashed"),
        children: /* @__PURE__ */ jsx("span", {
          className: "truncate",
          children: label
        })
      }),
      refused && /* @__PURE__ */ jsxs("span", {
        className: "text-destructive flex items-start gap-1.5 text-xs font-medium",
        children: [
          /* @__PURE__ */ jsx(TriangleAlert, {
            className: "mt-px size-3.5 shrink-0",
            "aria-hidden": true
          }),
          "This link can't be used, so the button sends as plain text. Edit it to fix the link."
        ]
      }),
      isSelected && canEdit && !editing && /* @__PURE__ */ jsx("span", {
        className: "sr-only",
        "aria-live": "polite",
        children: "Button selected. Press Enter to edit it."
      }),
      editing && canEdit && /* @__PURE__ */ jsx("div", {
        ref: formRef,
        className: "max-w-full",
        children: /* @__PURE__ */ jsx(RichTextButtonForm, {
          title: "Edit button",
          initialLabel: label,
          initialHref: href,
          submitText: "Save",
          isAllowedHref: context?.isAllowedHref,
          onSubmit: save,
          onCancel: closeEdit,
          onRemove: remove
        })
      })
    ]
  });
};
var RichTextButtons2 = ({ options, children }) => {
  const [editor] = useLexicalComposerContext();
  const enabled = Boolean(options);
  const isAllowedHref = options?.isAllowedHref;
  if (enabled) {
    editorButtonPolicies.set(editor, { isAllowedHref });
  } else {
    editorButtonPolicies.delete(editor);
  }
  useEffect(() => () => void editorButtonPolicies.delete(editor), [editor]);
  useEffect(() => editor.registerNodeTransform(RichTextButtonNode2, (node) => {
    if (node.isInert())
      $downgradeButton(node);
  }), [editor]);
  const wasEnabled = useRef(enabled);
  useEffect(() => {
    const was = wasEnabled.current;
    wasEnabled.current = enabled;
    if (!was || enabled)
      return;
    editor.update(() => {
      for (const node of $collectButtonNodes())
        $downgradeButton(node);
    }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
  }, [editor, enabled]);
  useEffect(() => {
    if (!enabled)
      return;
    const unregister = mergeRegister(editor.registerCommand(INSERT_RICH_TEXT_BUTTON_COMMAND2, ({ label, href }) => {
      const policy = editorButtonPolicies.get(editor);
      const text = normalizeButtonLabel(label);
      const verdict = checkButtonHref2(href, policy?.isAllowedHref);
      if (!policy || !text || !verdict.ok)
        return false;
      $insertButtonNode($createRichTextButtonNode2({ label: text, href: verdict.href }));
      return true;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_BACKSPACE_COMMAND, (event) => $isEventFromEmbeddedInput(event), COMMAND_PRIORITY_HIGH), editor.registerCommand(KEY_DELETE_COMMAND, (event) => $isEventFromEmbeddedInput(event), COMMAND_PRIORITY_HIGH), editor.registerNodeTransform(RichTextButtonNode2, (node) => {
      if (!node.isInert())
        $liftButtonToBlock(node);
    }));
    editor.update(() => {
      for (const node of $collectButtonNodes())
        $liftButtonToBlock(node);
    }, { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] });
    return unregister;
  }, [editor, enabled]);
  const context = useMemo(() => ({ isAllowedHref }), [isAllowedHref]);
  return /* @__PURE__ */ jsx(RichTextButtonContext.Provider, {
    value: enabled ? context : null,
    children
  });
};
var RichTextButtonToolbarControl2 = ({
  renderButton
}) => {
  const [editor] = useLexicalComposerContext();
  const context = useRichTextButtonContext();
  const [open, setOpen] = useState(false);
  if (!context)
    return null;
  const close = () => {
    setOpen(false);
    editor.focus();
  };
  return /* @__PURE__ */ jsxs("span", {
    className: "inline-flex",
    children: [
      renderButton({
        label: "Insert button",
        icon: /* @__PURE__ */ jsx(RectangleHorizontal, {}),
        pressed: open,
        onClick: () => open ? close() : setOpen(true)
      }),
      open && /* @__PURE__ */ jsx(RichTextButtonForm, {
        title: "Insert button",
        submitText: "Insert",
        isAllowedHref: context.isAllowedHref,
        className: "absolute top-full left-0 z-20 mt-1",
        onSubmit: (label, href) => {
          if (editor.dispatchCommand(INSERT_RICH_TEXT_BUTTON_COMMAND2, {
            label,
            href
          })) {
            close();
          }
        },
        onCancel: close
      })
    ]
  });
};
export { BUTTON_VARIANT2, checkButtonHref2, describeButtonHrefProblem2, RichTextButtonNode2, $createRichTextButtonNode2, $isRichTextButtonNode2, INSERT_RICH_TEXT_BUTTON_COMMAND2, RichTextButtons2, RichTextButtonToolbarControl2 };
