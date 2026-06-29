import type { EditorThemeClasses, Klass, LexicalNode } from "lexical";
import type { ComponentProps, ReactNode, RefObject } from "react";
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
interface RichTextEditorProps extends Omit<ComponentProps<"div">, "placeholder" | "onChange"> {
    /** Imperative handle for clearing/focusing the editor. */
    editorApi?: RefObject<EditorApi | null>;
    /** Called on every change with the current HTML/text and empty state. */
    onUpdate?: (update: {
        getHTML: () => string;
        getText: () => string;
        isEmpty: boolean;
    }) => void;
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
declare const RichTextEditor: ({ editorApi, onUpdate, defaultContent, editable, placeholder, hideToolbar, toolbarClassName, mentionItems, issueReferenceItems, enableChecklist, extraNodes, plugins, theme, skeletonClassName, className, editorClassName, ...rest }: RichTextEditorProps) => import("react/jsx-runtime").JSX.Element;
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
}
/**
 * Render stored rich-text HTML, sanitized with DOMPurify to keep
 * user-generated content safe. Mirrors the editor's node-class theme.
 */
declare const RichTextContent: ({ html, fallback, className, ...rest }: RichTextContentProps) => import("react/jsx-runtime").JSX.Element;
export { RichTextEditor, RichTextContent, linkFromText, linkifyBareUrls, linkifyMarkdownLinks, };
export default RichTextEditor;
