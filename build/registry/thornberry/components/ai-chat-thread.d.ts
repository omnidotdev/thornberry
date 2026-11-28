import type { ReactNode } from "react";
import type { AttachmentsController } from "../../../registry/thornberry/components/attachment-composer";
import type { PromptSuggestion } from "../../../registry/thornberry/components/prompt-suggestions";
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
}
/** An image sent with the message: a URL or `data:` URL to show */
 | {
    type: "image";
    src: string;
    name?: string;
}
/** A file sent with the message, shown by its name */
 | {
    type: "file";
    name: string;
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
    /**
     * Send the current input. With a hardware keyboard Enter sends and
     * Shift+Enter inserts a newline; on touch-first devices Enter inserts a
     * newline and the send button sends. Cmd/Ctrl+Enter always sends
     */
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
    /**
     * Render the avatar beside a message, replacing the default role icon. Lets a
     * persona-driven host (Beacon) show the assistant's face and the signed-in
     * user's picture. Called with a synthetic assistant message for the streaming
     * row. Return null to fall back to the default icon
     */
    renderAvatar?: (message: ChatMessage) => ReactNode;
    /**
     * A block rendered directly above the composer, e.g. a model picker. Full
     * width, inside the composer's border
     */
    composerAccessory?: ReactNode;
    /**
     * Extra controls placed between the composer and the send button, e.g. a
     * voice-input button. Aligned to the composer's baseline
     */
    composerActions?: ReactNode;
    /**
     * A small keyboard hint under the composer, e.g. "Shift+Enter for a new
     * line". Hidden on touch-first devices, where an on-screen keyboard has no
     * such shortcut
     */
    footerHint?: ReactNode;
    /**
     * Example prompts shown as chips above the composer while the thread is
     * empty and the composer is blank (see `PromptSuggestions`). Picking one
     * drafts its prompt into the composer and focuses it; it is never sent
     * until the user sends it
     */
    suggestions?: readonly (string | PromptSuggestion)[];
    /** How many example prompts show at once. Defaults to 4 */
    suggestionCount?: number;
    /**
     * Attachments for the composer, from `useAttachments`: shows an attach
     * button, previews above the composer, and refusals under it; a pasted
     * screenshot or dropped file attaches. A message with attachments can be
     * sent without text. The host sends `attachments.attachments` with the
     * message and clears them once it is sent
     */
    attachments?: AttachmentsController;
    /** Tooltip for the attach button: what can be attached and where it goes */
    attachTitle?: string;
}
/** The subset of a keydown event the composer needs */
export interface ComposerKeyEvent {
    key: string;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    /** True while an IME (e.g. Japanese or Chinese input) is composing text */
    isComposing: boolean;
    keyCode?: number;
}
/**
 * Whether a composer keydown should send the message. Follows the common chat
 * convention: Enter sends and Shift+Enter inserts a newline, except on touch
 * keyboards, where Enter inserts a newline and the send button sends since
 * there is no Shift key to reach for. Cmd/Ctrl+Enter always sends
 * @param event - the keydown event
 * @param touchKeyboard - whether the primary pointer is coarse (phones, tablets)
 */
export declare const shouldSendOnKey: (event: ComposerKeyEvent, touchKeyboard: boolean) => boolean;
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
declare const AiChatThread: ({ messages, status, input, onInputChange, onSend, placeholder, emptyState, notice, disabled, renderText, renderAvatar, composerAccessory, composerActions, footerHint, suggestions, suggestionCount, attachments, attachTitle, }: AiChatThreadProps) => import("react/jsx-runtime").JSX.Element;
export { AiChatThread };
