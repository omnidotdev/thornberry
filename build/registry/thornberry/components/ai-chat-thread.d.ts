import type { ReactNode } from "react";
/**
 * One ordered piece of a chat message. Mirrors the typed-parts model common to
 * streaming chat SDKs: plain text, model thinking, a tool call, and its result.
 * Map your SDK's message parts onto this shape
 */
export type ChatPart = {
    type: "text";
    text: string;
} | {
    type: "thinking";
    text: string;
} | {
    type: "tool-call";
    name: string;
    status?: "pending" | "done" | "error";
    detail?: string;
} | {
    type: "tool-result";
    name: string;
    ok?: boolean;
    detail?: string;
};
export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    parts: ChatPart[];
}
export type ChatStatus = "idle" | "submitting" | "streaming";
export interface AiChatThreadProps {
    messages: ChatMessage[];
    /** Streaming/busy state: shows a typing indicator and disables send. */
    status?: ChatStatus;
    /** Composer text (controlled). */
    input: string;
    onInputChange: (value: string) => void;
    /** Send the current input. Enter sends; Shift+Enter inserts a newline. */
    onSend: () => void;
    placeholder?: string;
    /** Shown when there are no messages yet. */
    emptyState?: ReactNode;
    /** A notice slot (e.g. an error or "no AI provider configured" message). */
    notice?: ReactNode;
    /** Hard-disable the composer regardless of status. */
    disabled?: boolean;
    /**
     * Render a text part, e.g. as markdown. Defaults to plain text with preserved
     * whitespace. Keep it presentational: the host owns any markdown library
     */
    renderText?: (text: string) => ReactNode;
}
/**
 * Chat thread: the shared conversation surface for the fleet's AI assistants
 * (Beacon's Omni chat) and the agentic describe-validate-repair loop. A
 * scrollable message list with role-aligned bubbles, typed message parts (text,
 * thinking, tool calls), a streaming indicator, and an auto-growing composer.
 *
 * Presentational only: the host drives it from any streaming chat hook, mapping
 * that hook's messages onto `ChatMessage`/`ChatPart` and passing `status` and
 * the send handler. This owns no network, streaming, or tool-execution logic
 */
declare const AiChatThread: ({ messages, status, input, onInputChange, onSend, placeholder, emptyState, notice, disabled, renderText, }: AiChatThreadProps) => import("react/jsx-runtime").JSX.Element;
export { AiChatThread };
