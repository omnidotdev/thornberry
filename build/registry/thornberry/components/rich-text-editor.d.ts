import type { EditorThemeClasses, Klass, LexicalNode } from "lexical";
import type { ComponentProps, ReactNode, RefObject } from "react";
import type { RichTextButtonOptions } from "../../../registry/thornberry/components/rich-text-button";
import type { RichTextImageOptions } from "../../../registry/thornberry/components/rich-text-image";
/** Imperative handle exposed via `editorApi` for clearing/focusing the editor. */
export interface EditorApi {
    clearContent: () => void;
    focus: () => void;
}
/**
 * Normalize a pasted token into a link href, or null when it is not a single
 * URL/email. Drives "paste a URL over a selection to link it": only a lone
 * token (no whitespace) that reads as a URL or email becomes a link, so pasting
 * a sentence still replaces the selection as text.
 */
declare const linkFromText: (text: string) => string | null;
/**
 * The ordered draggable units inside the editor root: every top-level block,
 * except a list block contributes its direct list items instead, so checklist
 * and list rows reorder individually (Lexical's stock plugin only sees the whole
 * list). Nested sublists are left to drag with their parent item in this pass.
 */
declare const getDragUnits: (rootEl: HTMLElement) => HTMLElement[];
/**
 * A draggable unit is either a list item or a top-level block. A unit only drops
 * among units of its own kind (item among items, block among blocks), so a move
 * can never put a list item at the document root or a block inside a list and
 * corrupt the tree.
 */
declare const dragUnitClass: (el: HTMLElement) => "list-item" | "block";
/** Which edge of a unit a drop lands on, from the pointer's y within it. */
declare const dropSide: (top: number, height: number, clientY: number) => "before" | "after";
/** A mentionable entity offered in the `@`-typeahead. */
export interface MentionItem {
    /** Stable id (e.g. user id). */
    id: string;
    /** Display label, shown after the `@` (no leading `@`). */
    label: string;
    /** Optional link target inserted for the mention. */
    url?: string;
}
/** An item offered in the `#`-reference typeahead (e.g. an issue/post). */
export interface IssueReferenceItem {
    /** Stable id (e.g. post rowId). */
    id: string;
    /** Numeric reference inserted after `#` (e.g. an issue number). */
    number: number;
    /** Title, shown in the menu. */
    title: string;
}
/** What `onUpdate` reports on every change. */
interface RichTextEditorUpdate {
    /** Read the content as HTML. */
    getHTML: () => string;
    /** Read the content as plain text. */
    getText: () => string;
    /** Whether the editor holds no text (and, with `images`, no images). */
    isEmpty: boolean;
    /**
     * Whether any image lacks alt text. Always false without `images`. Block
     * publishing while true.
     */
    hasMissingAltText: boolean;
    /**
     * Whether any image is still uploading (its placeholder exports nothing).
     * Always false without `images`. Block publishing while true.
     */
    isUploading: boolean;
    /**
     * Whether any loaded or pasted image is hosted elsewhere (refused by
     * `images.isAllowedSrc`, or plain http) and waits for an uploaded copy; it
     * exports nothing until then. Always false without `images`. Warn or block
     * publishing while true.
     */
    hasExternalImages: boolean;
}
interface RichTextEditorProps extends Omit<ComponentProps<"div">, "placeholder" | "onChange"> {
    /** Imperative handle for clearing/focusing the editor. */
    editorApi?: RefObject<EditorApi | null>;
    /** Called on every change with the current HTML/text and empty state. */
    onUpdate?: (update: RichTextEditorUpdate) => void;
    /** Initial HTML content. */
    defaultContent?: string;
    /** Whether the editor accepts input. */
    editable?: boolean;
    /** Placeholder shown when empty. */
    placeholder?: string;
    /** Hide the formatting toolbar. */
    hideToolbar?: boolean;
    /** Class applied to the formatting toolbar (e.g. to tint its background). */
    toolbarClassName?: string;
    /** When provided, enables an `@`-mention typeahead over these items. */
    mentionItems?: MentionItem[];
    /** When provided, enables a `#`-issue-reference typeahead over these items. */
    issueReferenceItems?: IssueReferenceItem[];
    /** Show a checklist (task list) button in the toolbar and enable the plugin. */
    enableChecklist?: boolean;
    /**
     * Enable a hover drag handle for reordering top-level blocks (Notion-style).
     * Off by default: it reserves a left gutter on the editor surface, which is
     * unwanted on single-line surfaces (titles, list items). Turn on for rich,
     * multi-block editors (e.g. a task description).
     */
    enableBlockDrag?: boolean;
    /**
     * Turn on images: a toolbar upload button, "insert from link" (https only),
     * paste, and drag-and-drop. Each image needs alt text, and exports as
     * email-safe markup with an absolute URL and a pixel width. Off when omitted
     * (and may be turned on or off after mount).
     */
    images?: RichTextImageOptions;
    /**
     * Turn on call-to-action buttons: an "Insert button" toolbar control that
     * takes a label and an `https://` or `mailto:` link. Each button is a block
     * of its own and exports as
     * `<p><a href="…" data-variant="button">Label</a></p>` for the consumer to
     * style. Off when omitted (and may be turned on or off after mount)
     */
    buttons?: RichTextButtonOptions;
    /** Extra Lexical node classes to register (e.g. an app's image node). */
    extraNodes?: ReadonlyArray<Klass<LexicalNode>>;
    /** Extra Lexical plugins rendered inside the composer (e.g. image paste, code highlighting). */
    plugins?: ReactNode;
    /** Override the node-class theme (e.g. to match an app's prose styling). */
    theme?: EditorThemeClasses;
    /** Class applied to the loading skeleton. */
    skeletonClassName?: string;
    /** Class applied to the editor surface. */
    editorClassName?: string;
}
/**
 * Friendly rich-text editor built on Lexical: bold, italic, lists, and links
 * via a minimal toolbar. Content is read out as sanitizable HTML through
 * `onUpdate`. Render stored HTML back with {@link RichTextContent}.
 */
declare const RichTextEditor: ({ editorApi, onUpdate, defaultContent, editable, placeholder, hideToolbar, toolbarClassName, mentionItems, issueReferenceItems, enableChecklist, enableBlockDrag, images, buttons, extraNodes, plugins, theme, skeletonClassName, className, editorClassName, ...rest }: RichTextEditorProps) => import("react/jsx-runtime").JSX.Element;
/**
 * Linkify bare URLs and email addresses in a rich-text HTML string so plain
 * links in stored content render as anchors. Splits on tags so matching only
 * happens in text (never inside attributes), and skips text already inside an
 * anchor so existing links are never double-wrapped.
 */
declare const linkifyBareUrls: (html: string) => string;
/**
 * Collapse markdown inline links `[text](url)` into anchors. The keystroke-only
 * MarkdownShortcutPlugin never converts links that are pasted (or otherwise not
 * typed character by character), so they reach storage as literal markdown;
 * this renders them as proper labeled links. Splits on tags so matching only
 * happens in text, and skips text already inside an anchor. Run before
 * {@link linkifyBareUrls} so the target becomes the href instead of being
 * re-linkified as bare text.
 */
declare const linkifyMarkdownLinks: (html: string) => string;
interface RichTextContentProps extends ComponentProps<"div"> {
    /** Stored HTML to render (sanitized before insertion). */
    html: string;
    /** Optional fallback when there is no content. */
    fallback?: ReactNode;
    /**
     * Render `<img>` tags (https sources only, with just `src`, `alt`, and a
     * pixel `width`). Off by default, so stored content cannot load remote images
     * (such as tracking pixels) unless the app opts in.
     */
    allowImages?: boolean;
    /** With `allowImages`, also render `http://` images. For local development only. */
    allowInsecureHttp?: boolean;
    /**
     * With `allowImages`, render only images whose source this accepts (e.g. a
     * host whitelist); others are dropped.
     */
    isAllowedSrc?: (src: string) => boolean;
}
/**
 * Render stored rich-text HTML, sanitized with DOMPurify to keep
 * user-generated content safe. Mirrors the editor's node-class theme.
 */
declare const RichTextContent: ({ html, fallback, allowImages, allowInsecureHttp, isAllowedSrc, className, ...rest }: RichTextContentProps) => import("react/jsx-runtime").JSX.Element;
export type { RichTextButtonOptions } from "../../../registry/thornberry/components/rich-text-button";
export type { RichTextImageError, RichTextImageErrorCode, RichTextImageOptions, RichTextImageUploadResult, } from "../../../registry/thornberry/components/rich-text-image";
export type { RichTextEditorProps, RichTextEditorUpdate };
export { RichTextContent, RichTextEditor, dragUnitClass, dropSide, getDragUnits, linkFromText, linkifyBareUrls, linkifyMarkdownLinks, };
export default RichTextEditor;
