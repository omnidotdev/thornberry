/**
 * One example prompt. `label` is the short chip text; `prompt` is what a pick
 * drafts into the composer, when it should be fuller than the label
 */
export interface PromptSuggestion {
    label: string;
    prompt?: string;
}
export interface PromptSuggestionsProps {
    /** Every example to draw from; a string is both the label and the prompt */
    suggestions: readonly (string | PromptSuggestion)[];
    /** How many chips show at once. Defaults to 4 */
    count?: number;
    /**
     * Called with the picked example's prompt. Draft it into the composer and
     * focus it, so the user can edit it before sending; never send it outright
     */
    onPick: (prompt: string, suggestion: PromptSuggestion) => void;
    /**
     * Show a control that swaps in the next set of examples. Defaults to on
     * whenever there are more examples than `count`
     */
    shuffle?: boolean;
    /** Text of the shuffle control. Defaults to "More ideas" */
    shuffleLabel?: string;
    /** Accessible name of the chip group. Defaults to "Example prompts" */
    label?: string;
    disabled?: boolean;
    className?: string;
    /**
     * Random source for the order the examples are drawn in, in [0, 1). Defaults
     * to `Math.random`; pass a fixed one for a stable order in tests or stories
     */
    random?: () => number;
}
/**
 * A shuffled order of `length` indexes (Fisher-Yates), so every visit starts
 * from a different set and "More ideas" walks through them all before repeating
 */
export declare const shuffledOrder: (length: number, random?: () => number) => number[];
/** The `count` indexes shown at window `page` of `order`, wrapping around */
export declare const suggestionWindow: (order: readonly number[], page: number, count: number) => number[];
/**
 * Example prompt chips for an empty composer: a few short, concrete examples
 * drawn in a random order per visit, and a "More ideas" control that swaps in
 * the next few. Picking one hands its prompt to the host to draft into the
 * composer (never to send), so the user can edit it first. The host decides
 * when to show it, typically while the conversation is empty and the composer
 * is blank.
 *
 * The order is shuffled after mount, so a server render and its hydration
 * agree; until then the first examples hold the space, hidden
 */
declare const PromptSuggestions: ({ suggestions, count, onPick, shuffle, shuffleLabel, label, disabled, className, random, }: PromptSuggestionsProps) => import("react/jsx-runtime").JSX.Element | null;
export { PromptSuggestions };
