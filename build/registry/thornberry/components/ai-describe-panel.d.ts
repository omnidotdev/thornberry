import type { ReactNode } from "react";
/**
 * Which affordance the panel leads with:
 * - `generate`: signed in or a key is set, so Generate runs
 * - `signIn`: no identity and no key, but sign-in is available
 * - `needsKey`: no identity, no sign-in, so a key is the only path
 */
export type AiDescribeMode = "generate" | "signIn" | "needsKey";
export interface AiDescribePanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Which affordance to lead with. The host resolves this from auth + key state. */
    mode: AiDescribeMode;
    /** Dialog heading. */
    title?: string;
    /** Short line under the heading. */
    description?: ReactNode;
    /** The prompt text (controlled). */
    prompt: string;
    onPromptChange: (prompt: string) => void;
    placeholder?: string;
    /** Starter prompts shown as chips while the prompt is empty. */
    suggestions?: readonly string[];
    onPickSuggestion?: (suggestion: string) => void;
    /** Fire a generation with the current prompt. */
    onGenerate: () => void;
    /** While true the dialog cannot be dismissed and inputs are disabled. */
    isPending?: boolean;
    generateLabel?: string;
    /**
     * A short live status shown beside a spinner while `isPending`, so a long
     * multi-step generation reads as progress rather than a frozen button (e.g.
     * "Generating...", "Checking the render...", "Refining..."). The host advances
     * it as its own pipeline moves; when omitted the panel just shows the spinner
     */
    pendingLabel?: ReactNode;
    /**
     * A persistent info slot in the footer, left of the actions: the strategic
     * place for host context the user weighs right before spending, e.g. a credit
     * balance and a per-run cost estimate. Hidden while `isPending` (the live
     * status takes its place). Presentational only; the host owns the content
     */
    meta?: ReactNode;
    /** Start sign-in (shown as the primary CTA in `signIn` mode). */
    onSignIn?: () => void;
    signInLabel?: string;
    /**
     * A notice slot, e.g. an error, an out-of-credits message with an upgrade CTA,
     * or a "credits spent" note after a failed-but-billed attempt. The host builds
     * it from `classifyGatewayError`; the panel just renders it
     */
    notice?: ReactNode;
    /** Bring-your-own-key section (a Synapse key, not a raw provider key). */
    byok?: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        value: string;
        onValueChange: (value: string) => void;
        /** Where to mint a key; rendered as a link when present. */
        keyUrl?: string;
        label?: string;
        placeholder?: string;
    };
}
/**
 * Describe-to-draft panel: the shared "describe it in plain English, review the
 * draft" entry point for the fleet's AI-creation flow (Facet models, Fractal
 * services). Presentational only: the host injects generation, sign-in, and the
 * Synapse key state (typically from `@omnidotdev/providers/ai-client`), so this
 * owns no network, auth, or billing logic. A draft never auto-applies; the host
 * closes the panel and shows the result for review.
 */
declare const AiDescribePanel: ({ open, onOpenChange, mode, title, description, prompt, onPromptChange, placeholder, suggestions, onPickSuggestion, onGenerate, isPending, generateLabel, pendingLabel, meta, onSignIn, signInLabel, notice, byok, }: AiDescribePanelProps) => import("react/jsx-runtime").JSX.Element;
export { AiDescribePanel };
