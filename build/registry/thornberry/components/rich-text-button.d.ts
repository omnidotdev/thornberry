import { DecoratorNode } from "lexical";
import type { DOMConversionMap, DOMExportOutput, LexicalCommand, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import type { ReactNode } from "react";
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
type ButtonHrefVerdict = {
    ok: true;
    href: string;
} | {
    ok: false;
    problem: ButtonHrefProblem;
};
/** The value that marks an exported anchor as a button */
declare const BUTTON_VARIANT = "button";
/**
 * Check a button link: only absolute `https://` links and `mailto:` addresses
 * pass (never `javascript:`, `data:`, plain `http://`, or relative links), then
 * `isAllowedHref` judges the normalized form, which is what is kept and exported
 */
declare const checkButtonHref: (href: string | null | undefined, isAllowedHref?: (href: string) => boolean) => ButtonHrefVerdict;
/** The plain-language message for a refused button link */
declare const describeButtonHrefProblem: (problem: ButtonHrefProblem, href: string) => string;
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
type SerializedRichTextButtonNode = Spread<{
    label: string;
    href: string;
}, SerializedLexicalNode>;
/**
 * A block-level call-to-action button in the rich text editor: a label and a
 * link. Exports `<p><a href="…" data-variant="button">Label</a></p>`, with only
 * `https://` or `mailto:` links; consumers style the anchor
 */
declare class RichTextButtonNode extends DecoratorNode<ReactNode> {
    __label: string;
    __href: string;
    __inert: boolean;
    static getType(): string;
    static clone(node: RichTextButtonNode): RichTextButtonNode;
    static importJSON(json: SerializedRichTextButtonNode): RichTextButtonNode;
    static importDOM(): DOMConversionMap;
    constructor(payload?: RichTextButtonPayload, key?: NodeKey);
    exportJSON(): SerializedRichTextButtonNode;
    exportDOM(editor: LexicalEditor): DOMExportOutput;
    createDOM(): HTMLElement;
    updateDOM(): false;
    isInline(): false;
    getTextContent(): string;
    getLabel(): string;
    getHref(): string;
    isInert(): boolean;
    /** Set the label and link; the link is kept normalized when it is a URL */
    setButton(label: string, href: string): this;
    decorate(): ReactNode;
}
declare const $createRichTextButtonNode: (payload: RichTextButtonPayload) => RichTextButtonNode;
declare const $isRichTextButtonNode: (node: LexicalNode | null | undefined) => node is RichTextButtonNode;
/** Insert a button with a label and an `https://` or `mailto:` link at the selection */
declare const INSERT_RICH_TEXT_BUTTON_COMMAND: LexicalCommand<{
    label: string;
    href: string;
}>;
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
declare const RichTextButtons: ({ options, children }: RichTextButtonsProps) => import("react/jsx-runtime").JSX.Element;
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
declare const RichTextButtonToolbarControl: ({ renderButton, }: RichTextButtonToolbarControlProps) => import("react/jsx-runtime").JSX.Element | null;
export type { ButtonHrefProblem, ButtonHrefVerdict, RichTextButtonOptions, SerializedRichTextButtonNode, };
export { $createRichTextButtonNode, $isRichTextButtonNode, BUTTON_VARIANT, INSERT_RICH_TEXT_BUTTON_COMMAND, RichTextButtonNode, RichTextButtonToolbarControl, RichTextButtons, checkButtonHref, describeButtonHrefProblem, };
