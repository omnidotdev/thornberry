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
  mergeRegister,
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
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";
import {
  inputClassName,
  preventSubmit,
  useIsolateFromEditor,
} from "@/registry/thornberry/components/rich-text-image";

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
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";

/** Turns on call-to-action buttons in the rich text editor */
interface RichTextButtonOptions {
  /**
   * Which links a button may point to, called with the normalized link
   * (`new URL(href).href`) after the built-in check (`https://` or `mailto:`
   * only). Return false to refuse it, e.g. to keep buttons on your own domains
   */
  isAllowedHref?: (href: string) => boolean;
}

/** Why a button link was refused: none given, not `https://` or `mailto:`, or refused by `isAllowedHref` */
type ButtonHrefProblem = "missing" | "invalid" | "refused";

/** The outcome of checking a button link: the normalized link, or why it was refused */
type ButtonHrefVerdict =
  | { ok: true; href: string }
  | { ok: false; problem: ButtonHrefProblem };

/** The value that marks an exported anchor as a button */
const BUTTON_VARIANT = "button";

// the button settings of each editor with buttons turned on; the node class is
// shared by every editor, so it looks its editor up here
const editorButtonPolicies = new WeakMap<
  LexicalEditor,
  RichTextButtonOptions
>();

/** The button settings of the editor being updated, or null when buttons are off */
const $getButtonPolicy = (): RichTextButtonOptions | null => {
  try {
    return editorButtonPolicies.get($getEditor()) ?? null;
  } catch {
    return null;
  }
};

/**
 * Check a button link: only absolute `https://` links and `mailto:` addresses
 * pass (never `javascript:`, `data:`, plain `http://`, or relative links), then
 * `isAllowedHref` judges the normalized form, which is what is kept and exported
 */
const checkButtonHref = (
  href: string | null | undefined,
  isAllowedHref?: (href: string) => boolean,
): ButtonHrefVerdict => {
  const value = href?.trim() ?? "";
  if (!value) return { ok: false, problem: "missing" };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { ok: false, problem: "invalid" };
  }
  const valid =
    url.protocol === "https:"
      ? url.hostname !== ""
      : url.protocol === "mailto:" && url.pathname.includes("@");
  if (!valid) return { ok: false, problem: "invalid" };
  if (isAllowedHref && !isAllowedHref(url.href)) {
    return { ok: false, problem: "refused" };
  }
  return { ok: true, href: url.href };
};

/** A button label on one line, with runs of whitespace collapsed */
const normalizeButtonLabel = (label: string): string =>
  label.replace(/\s+/g, " ").trim();

/** The plain-language message for a refused button link */
const describeButtonHrefProblem = (
  problem: ButtonHrefProblem,
  href: string,
): string => {
  if (problem === "missing") return "Add a link for the button.";
  if (problem === "invalid") {
    return "Use a full link that starts with https:// (for example, https://example.com), or mailto: and an email address.";
  }
  try {
    const url = new URL(href.trim());
    return url.protocol === "mailto:"
      ? "Buttons can't email this address. Use a different link."
      : `Buttons can't link to ${url.host}. Use a different link.`;
  } catch {
    return "Buttons can't use this link. Use a different link.";
  }
};

/** The canonical form of a link (`new URL(href).href`), or the trimmed input when it is not a URL */
const normalizeHref = (href: string): string => {
  const trimmed = href.trim();
  try {
    return new URL(trimmed).href;
  } catch {
    return trimmed;
  }
};

/** Whether an element is an anchor marked as a button */
const isButtonAnchor = (domNode: HTMLElement): boolean =>
  domNode.nodeName === "A" &&
  domNode.getAttribute("data-variant") === BUTTON_VARIANT;

interface RichTextButtonPayload {
  label: string;
  href: string;
  /**
   * True for a button that must never render or export (pasted editor data
   * while buttons are off, or a refused link); on the next update it becomes
   * an ordinary link when `href` is set, or plain text otherwise
   */
  inert?: boolean;
}

type SerializedRichTextButtonNode = Spread<
  { label: string; href: string },
  SerializedLexicalNode
>;

const convertButtonAnchor = (domNode: HTMLElement): DOMConversionOutput => {
  const policy = $getButtonPolicy();
  const label = normalizeButtonLabel(domNode.textContent ?? "");
  const verdict = checkButtonHref(
    domNode.getAttribute("href"),
    policy?.isAllowedHref,
  );
  // a refused link (or an empty label) keeps only its text, never the link
  if (!policy || !verdict.ok || !label) return { node: null };
  return { node: $createRichTextButtonNode({ label, href: verdict.href }) };
};

/**
 * A block-level call-to-action button in the rich text editor: a label and a
 * link. Exports `<p><a href="…" data-variant="button">Label</a></p>`, with only
 * `https://` or `mailto:` links; consumers style the anchor
 */
class RichTextButtonNode extends DecoratorNode<ReactNode> {
  __label: string;
  __href: string;
  __inert: boolean;

  static getType(): string {
    return "rich-text-button";
  }

  static clone(node: RichTextButtonNode): RichTextButtonNode {
    return new RichTextButtonNode(
      { label: node.__label, href: node.__href, inert: node.__inert },
      node.__key,
    );
  }

  static importJSON(json: SerializedRichTextButtonNode): RichTextButtonNode {
    // editor data (e.g. pasted from another editor) is untrusted: coerce every
    // field, and keep the button inert when buttons are off here or its link
    // is refused, so it never renders or exports as a button
    const policy = $getButtonPolicy();
    const label =
      typeof json.label === "string" ? normalizeButtonLabel(json.label) : "";
    const href = typeof json.href === "string" ? json.href : "";
    if (!policy) {
      // with buttons off it becomes the ordinary link loading its HTML would give
      const verdict = checkButtonHref(href);
      return $createRichTextButtonNode({
        label,
        href: verdict.ok ? verdict.href : "",
        inert: true,
      });
    }
    const verdict = checkButtonHref(href, policy.isAllowedHref);
    if (!verdict.ok || !label) {
      return $createRichTextButtonNode({ label, href: "", inert: true });
    }
    return $createRichTextButtonNode({ label, href: verdict.href });
  }

  static importDOM(): DOMConversionMap {
    return {
      // with buttons off this importer stands aside, so the anchor loads as an
      // ordinary link, exactly as before
      a: (domNode: HTMLElement) =>
        $getButtonPolicy() && isButtonAnchor(domNode)
          ? { conversion: convertButtonAnchor, priority: 2 }
          : null,
    };
  }

  constructor(
    payload: RichTextButtonPayload = { label: "", href: "" },
    key?: NodeKey,
  ) {
    super(key);
    this.__label = payload.label;
    this.__href = payload.href;
    this.__inert = payload.inert ?? false;
  }

  exportJSON(): SerializedRichTextButtonNode {
    return {
      type: RichTextButtonNode.getType(),
      version: 1,
      label: this.__label,
      href: this.__href,
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    if (this.__inert || !this.__label) return { element: null };
    const paragraph = document.createElement("p");
    const verdict = checkButtonHref(
      this.__href,
      editorButtonPolicies.get(editor)?.isAllowedHref,
    );
    // a link refused since it was added (e.g. a stricter `isAllowedHref`)
    // exports only its label, never the link
    if (!verdict.ok) {
      paragraph.textContent = this.__label;
      return { element: paragraph };
    }
    const anchor = document.createElement("a");
    anchor.setAttribute("href", verdict.href);
    anchor.setAttribute("data-variant", BUTTON_VARIANT);
    anchor.textContent = this.__label;
    paragraph.append(anchor);
    return { element: paragraph };
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "my-2 max-w-full";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): false {
    return false;
  }

  getTextContent(): string {
    return this.getLatest().__inert ? "" : this.getLatest().__label;
  }

  getLabel(): string {
    return this.getLatest().__label;
  }

  getHref(): string {
    return this.getLatest().__href;
  }

  isInert(): boolean {
    return this.getLatest().__inert;
  }

  /** Set the label and link; the link is kept normalized when it is a URL */
  setButton(label: string, href: string): this {
    const writable = this.getWritable();
    writable.__label = normalizeButtonLabel(label);
    writable.__href = normalizeHref(href);
    return writable;
  }

  decorate(): ReactNode {
    if (this.__inert) return null;
    return (
      <RichTextButtonView
        nodeKey={this.getKey()}
        label={this.__label}
        href={this.__href}
      />
    );
  }
}

// every link enters the node here or through `setButton`, normalized
const $createRichTextButtonNode = (
  payload: RichTextButtonPayload,
): RichTextButtonNode =>
  $applyNodeReplacement(
    new RichTextButtonNode({
      ...payload,
      label: normalizeButtonLabel(payload.label),
      href: normalizeHref(payload.href),
    }),
  );

const $isRichTextButtonNode = (
  node: LexicalNode | null | undefined,
): node is RichTextButtonNode => node instanceof RichTextButtonNode;

/** Every button node in the document, in order */
const $collectButtonNodes = (): RichTextButtonNode[] => {
  const found: RichTextButtonNode[] = [];
  const visit = (node: LexicalNode) => {
    if ($isRichTextButtonNode(node)) found.push(node);
    else if ($isElementNode(node)) {
      for (const child of node.getChildren()) visit(child);
    }
  };
  visit($getRoot());
  return found;
};

/**
 * Turn a button into what its HTML would load as without buttons: an ordinary
 * link to its `href` (or just its label when it has none), in a paragraph of
 * its own at the top level
 */
const $downgradeButton = (node: RichTextButtonNode) => {
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

/**
 * Lift a button found inside a block (e.g. `<p><a data-variant="button"></p>`
 * in loaded HTML) to the top level: a paragraph, heading, or quote is split
 * around it (halves left empty are dropped), and a button deeper in (a list
 * item) moves after its top-level block
 */
const $liftButtonToBlock = (node: RichTextButtonNode) => {
  const parent = node.getParent();
  if (!parent || $isRootOrShadowRoot(parent)) return;
  const grandparent = parent.getParent();
  if (!grandparent || !$isRootOrShadowRoot(grandparent)) {
    node.getTopLevelElement()?.insertAfter(node);
    return;
  }
  const [before, after] = $splitNode(parent, node.getIndexWithinParent());
  after.insertBefore(node);
  if (before?.isEmpty()) before.remove();
  if (after.isEmpty()) after.remove();
};

/** Insert a block at the selection (splitting a paragraph), or at the end when there is none */
const $insertButtonNode = (node: RichTextButtonNode) => {
  const selection = $getSelection();
  if (!selection) {
    $getRoot().selectEnd();
  } else if ($isNodeSelection(selection)) {
    // insert beside a selected node rather than replacing it
    const last = selection.getNodes().at(-1);
    if (last) last.selectNext();
    else $getRoot().selectEnd();
  }
  $insertNodes([node]);
  // keep somewhere to type after a button at the end of the document
  if (node.isAttached() && !node.getNextSibling()) {
    const paragraph = $createParagraphNode();
    node.insertAfter(paragraph);
    paragraph.select();
  }
};

/** Remove a button, leaving the caret where it was */
const $removeButton = (node: RichTextButtonNode) => {
  const sibling = node.getNextSibling() ?? node.getPreviousSibling();
  node.remove();
  if ($isElementNode(sibling)) sibling.selectStart();
  else if (sibling) sibling.selectNext();
  else {
    const paragraph = $createParagraphNode();
    $getRoot().append(paragraph);
    paragraph.select();
  }
};

/** Insert a button with a label and an `https://` or `mailto:` link at the selection */
const INSERT_RICH_TEXT_BUTTON_COMMAND: LexicalCommand<{
  label: string;
  href: string;
}> = createCommand("INSERT_RICH_TEXT_BUTTON_COMMAND");

const RichTextButtonContext = createContext<RichTextButtonOptions | null>(null);

/** The button settings in scope, or null when buttons are off */
const useRichTextButtonContext = () => useContext(RichTextButtonContext);

interface RichTextButtonFormProps {
  /** Accessible name of the form */
  title: string;
  initialLabel?: string;
  initialHref?: string;
  /** Text of the confirm button */
  submitText: string;
  /** Link policy the form checks against */
  isAllowedHref?: (href: string) => boolean;
  /** Called with a label and the normalized link once both are valid */
  onSubmit: (label: string, href: string) => void;
  onCancel: () => void;
  /** Shows a Remove action when set */
  onRemove?: () => void;
  className?: string;
}

/**
 * The label and link fields for inserting or editing a button. Not a `<form>`,
 * since the editor often sits inside one: Enter in a field submits, Escape cancels
 */
const RichTextButtonForm = ({
  title,
  initialLabel = "",
  initialHref = "",
  submitText,
  isAllowedHref,
  onSubmit,
  onCancel,
  onRemove,
  className,
}: RichTextButtonFormProps) => {
  const [label, setLabel] = useState(initialLabel);
  const [href, setHref] = useState(initialHref);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [hrefError, setHrefError] = useState<string | null>(null);
  const labelRef = useRef<HTMLInputElement>(null);
  const hrefRef = useRef<HTMLInputElement>(null);
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
    const verdict = checkButtonHref(href, isAllowedHref);
    const nextLabelError = nextLabel ? null : "Add a label for the button.";
    const nextHrefError = verdict.ok
      ? null
      : describeButtonHrefProblem(verdict.problem, href);
    setLabelError(nextLabelError);
    setHrefError(nextHrefError);
    if (nextLabelError) labelRef.current?.focus();
    else if (nextHrefError) hrefRef.current?.focus();
    if (nextLabelError || !verdict.ok) return;
    onSubmit(nextLabel, verdict.href);
  };

  const onFieldKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    preventSubmit(event);
    if (event.key === "Enter") submit();
  };

  return (
    <div
      role="group"
      aria-label={title}
      data-rich-text-button-form=""
      className={cn(
        "border-border bg-popover text-popover-foreground flex w-80 max-w-full flex-col gap-3 rounded-md border p-3 text-sm shadow-md",
        className,
      )}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={labelId} className="text-xs font-medium">
          Button text
        </label>
        <input
          ref={labelRef}
          id={labelId}
          type="text"
          value={label}
          placeholder="e.g. Shop the sale"
          aria-invalid={labelError ? true : undefined}
          aria-describedby={labelError ? `${labelId}-error` : undefined}
          className={inputClassName}
          onChange={(event) => {
            setLabel(event.target.value);
            setLabelError(null);
          }}
          onKeyDown={onFieldKeyDown}
        />
        {labelError && (
          <p
            id={`${labelId}-error`}
            role="alert"
            className="text-destructive text-xs"
          >
            {labelError}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={hrefId} className="text-xs font-medium">
          Button link
        </label>
        <input
          ref={hrefRef}
          id={hrefId}
          type="url"
          inputMode="url"
          value={href}
          placeholder="https://"
          aria-invalid={hrefError ? true : undefined}
          aria-describedby={hrefHelpId}
          className={inputClassName}
          onChange={(event) => {
            setHref(event.target.value);
            setHrefError(null);
          }}
          onKeyDown={onFieldKeyDown}
        />
        <p
          id={hrefHelpId}
          role={hrefError ? "alert" : undefined}
          className={cn(
            "text-xs",
            hrefError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {hrefError ?? "An https:// link, or mailto: and an email address."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            Remove
          </Button>
        )}
        <span className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            {submitText}
          </Button>
        </span>
      </div>
    </div>
  );
};

const pillClassName =
  "bg-primary text-primary-foreground inline-flex max-w-full items-center rounded-md px-4 py-2 text-sm font-medium no-underline";

interface RichTextButtonViewProps {
  nodeKey: NodeKey;
  label: string;
  href: string;
}

/** The in-editor rendering of a button: a pill, and its edit form while open */
const RichTextButtonView = ({
  nodeKey,
  label,
  href,
}: RichTextButtonViewProps) => {
  const [editor] = useLexicalComposerContext();
  const editable = useLexicalEditable();
  const context = useRichTextButtonContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editing, setEditing] = useState(false);
  const pillRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const canEdit = editable && context !== null;
  const refused = !checkButtonHref(href, context?.isAllowedHref).ok;

  useIsolateFromEditor(pillRef);
  useIsolateFromEditor(formRef);

  const openEdit = useCallback(() => {
    clearSelection();
    setSelected(true);
    setEditing(true);
  }, [clearSelection, setSelected]);

  // the keyboard route to editing: select the button with the arrow keys, then
  // press Enter or Space
  useEffect(() => {
    if (!canEdit) return;
    const $openFromKeyboard = (event: KeyboardEvent | null) => {
      const selection = $getSelection();
      if (
        !$isNodeSelection(selection) ||
        !selection.has(nodeKey) ||
        (event && $isEventFromEmbeddedInput(event))
      ) {
        return false;
      }
      event?.preventDefault();
      setEditing(true);
      return true;
    };
    return mergeRegister(
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
  }, [editor, nodeKey, canEdit]);

  // buttons turned off or the editor made read-only close the form
  useEffect(() => {
    if (!canEdit) setEditing(false);
  }, [canEdit]);

  const closeEdit = () => {
    setEditing(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isRichTextButtonNode(node)) node.selectNext();
    });
    editor.focus();
  };

  const save = (nextLabel: string, nextHref: string) => {
    setEditing(false);
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if (!$isRichTextButtonNode(node)) return;
        node.setButton(nextLabel, nextHref);
        node.selectNext();
      },
      { tag: HISTORY_PUSH_TAG },
    );
    editor.focus();
  };

  const remove = () => {
    setEditing(false);
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if ($isRichTextButtonNode(node)) $removeButton(node);
      },
      { tag: HISTORY_PUSH_TAG },
    );
    editor.focus();
  };

  if (!editable) {
    return refused ? (
      <span className={pillClassName} data-rich-text-button="">
        {label}
      </span>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={pillClassName}
        data-rich-text-button=""
      >
        {label}
      </a>
    );
  }

  return (
    <div
      className="flex max-w-full flex-col items-start gap-2"
      data-rich-text-button=""
      data-refused={refused ? "" : undefined}
    >
      <button
        ref={pillRef}
        type="button"
        tabIndex={-1}
        title={href}
        aria-label={`Edit button: ${label}`}
        aria-expanded={canEdit ? editing : undefined}
        disabled={!canEdit}
        onClick={() => {
          if (canEdit) openEdit();
        }}
        className={cn(
          pillClassName,
          canEdit && "cursor-pointer",
          isSelected && "outline-primary outline-2 outline-offset-2",
          refused &&
            !isSelected &&
            "outline-destructive outline-2 outline-offset-2 outline-dashed",
        )}
      >
        <span className="truncate">{label}</span>
      </button>
      {refused && (
        <span className="text-destructive flex items-start gap-1.5 text-xs font-medium">
          <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          This link can't be used, so the button sends as plain text. Edit it to
          fix the link.
        </span>
      )}
      {isSelected && canEdit && !editing && (
        <span className="sr-only" aria-live="polite">
          Button selected. Press Enter to edit it.
        </span>
      )}
      {editing && canEdit && (
        <div ref={formRef} className="max-w-full">
          <RichTextButtonForm
            title="Edit button"
            initialLabel={label}
            initialHref={href}
            submitText="Save"
            isAllowedHref={context?.isAllowedHref}
            onSubmit={save}
            onCancel={closeEdit}
            onRemove={remove}
          />
        </div>
      )}
    </div>
  );
};

interface RichTextButtonsProps {
  /** Button settings; buttons are off while this is undefined */
  options: RichTextButtonOptions | undefined;
  children: ReactNode;
}

/**
 * Turns on buttons inside a `LexicalComposer`: registers the insert command,
 * HTML import, and lifting buttons to blocks of their own, and provides the
 * settings the button view and toolbar control read. `RichTextEditor` always
 * renders this (with `options` undefined while buttons are off), so `buttons`
 * can be toggled without remounting the editor. The editor must register
 * {@link RichTextButtonNode}
 */
const RichTextButtons = ({ options, children }: RichTextButtonsProps) => {
  const [editor] = useLexicalComposerContext();
  const enabled = Boolean(options);
  const isAllowedHref = options?.isAllowedHref;

  // register the policy during render, not in an effect: child plugins (which
  // load `defaultContent`) run their effects before this component's would
  if (enabled) {
    editorButtonPolicies.set(editor, { isAllowedHref });
  } else {
    editorButtonPolicies.delete(editor);
  }
  useEffect(() => () => void editorButtonPolicies.delete(editor), [editor]);

  // inert buttons (editor data pasted while buttons are off, or a refused
  // link) never stay in the document, whether buttons are on or off
  useEffect(
    () =>
      editor.registerNodeTransform(RichTextButtonNode, (node) => {
        if (node.isInert()) $downgradeButton(node);
      }),
    [editor],
  );

  // turning buttons off turns existing buttons into ordinary links, the same
  // as loading their HTML without buttons
  const wasEnabled = useRef(enabled);
  useEffect(() => {
    const was = wasEnabled.current;
    wasEnabled.current = enabled;
    if (!was || enabled) return;
    editor.update(
      () => {
        for (const node of $collectButtonNodes()) $downgradeButton(node);
      },
      { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
    );
  }, [editor, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const unregister = mergeRegister(
      editor.registerCommand(
        INSERT_RICH_TEXT_BUTTON_COMMAND,
        ({ label, href }) => {
          const policy = editorButtonPolicies.get(editor);
          const text = normalizeButtonLabel(label);
          const verdict = checkButtonHref(href, policy?.isAllowedHref);
          if (!policy || !text || !verdict.ok) return false;
          $insertButtonNode(
            $createRichTextButtonNode({ label: text, href: verdict.href }),
          );
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      // never let keys typed in a button's edit form delete the button
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
      // buttons are blocks of their own: lift any found inside a paragraph
      editor.registerNodeTransform(RichTextButtonNode, (node) => {
        if (!node.isInert()) $liftButtonToBlock(node);
      }),
    );
    // lift buttons in content loaded before the transform was registered
    editor.update(
      () => {
        for (const node of $collectButtonNodes()) $liftButtonToBlock(node);
      },
      { tag: [HISTORY_MERGE_TAG, SKIP_DOM_SELECTION_TAG] },
    );
    return unregister;
  }, [editor, enabled]);

  const context = useMemo<RichTextButtonOptions>(
    () => ({ isAllowedHref }),
    [isAllowedHref],
  );

  // always the same element, so turning buttons on or off never remounts the
  // editor (which would lose its content, undo history, and focus)
  return (
    <RichTextButtonContext.Provider value={enabled ? context : null}>
      {children}
    </RichTextButtonContext.Provider>
  );
};

interface RichTextButtonToolbarControlProps {
  /** Toolbar button wrapper used by the host toolbar, so the control matches it */
  renderButton: (props: {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    pressed?: boolean;
  }) => ReactNode;
}

/** Toolbar control that inserts a button from a label and a link. Renders nothing while buttons are off */
const RichTextButtonToolbarControl = ({
  renderButton,
}: RichTextButtonToolbarControlProps) => {
  const [editor] = useLexicalComposerContext();
  const context = useRichTextButtonContext();
  const [open, setOpen] = useState(false);

  if (!context) return null;

  const close = () => {
    setOpen(false);
    editor.focus();
  };

  // the form anchors to the toolbar (not this button), so it never overflows
  // a narrow screen
  return (
    <span className="inline-flex">
      {renderButton({
        label: "Insert button",
        icon: <RectangleHorizontal />,
        pressed: open,
        onClick: () => (open ? close() : setOpen(true)),
      })}
      {open && (
        <RichTextButtonForm
          title="Insert button"
          submitText="Insert"
          isAllowedHref={context.isAllowedHref}
          className="absolute top-full left-0 z-20 mt-1"
          onSubmit={(label, href) => {
            if (
              editor.dispatchCommand(INSERT_RICH_TEXT_BUTTON_COMMAND, {
                label,
                href,
              })
            ) {
              close();
            }
          }}
          onCancel={close}
        />
      )}
    </span>
  );
};

export type {
  ButtonHrefProblem,
  ButtonHrefVerdict,
  RichTextButtonOptions,
  SerializedRichTextButtonNode,
};
export {
  $createRichTextButtonNode,
  $isRichTextButtonNode,
  BUTTON_VARIANT,
  INSERT_RICH_TEXT_BUTTON_COMMAND,
  RichTextButtonNode,
  RichTextButtonToolbarControl,
  RichTextButtons,
  checkButtonHref,
  describeButtonHrefProblem,
};
