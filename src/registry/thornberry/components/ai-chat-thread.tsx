import { ArrowUp, Bot, FileText, Loader2, User, Wrench } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import {
  ATTACH_ACCEPT,
  ATTACH_IMAGES_ACCEPT,
  AttachButton,
  AttachmentDropOverlay,
  AttachmentError,
  AttachmentList,
} from "@/registry/thornberry/components/attachment-composer";
import { Badge } from "@/registry/thornberry/components/badge";
import { Button } from "@/registry/thornberry/components/button";
import { PromptSuggestions } from "@/registry/thornberry/components/prompt-suggestions";

import type { ComponentProps, ReactNode } from "react";
import type { AttachmentsController } from "@/registry/thornberry/components/attachment-composer";
import type { PromptSuggestion } from "@/registry/thornberry/components/prompt-suggestions";

/**
 * One ordered piece of a chat message. Mirrors the typed-parts model common to
 * streaming chat SDKs: plain text, model thinking, a tool call, and its result.
 * Map your SDK's message parts onto this shape
 */
export type ChatPart =
  | { type: "text"; text: string }
  | { type: "thinking"; text: string }
  | {
      type: "tool-call";
      name: string;
      status?: "pending" | "done" | "error";
      detail?: string;
    }
  | { type: "tool-result"; name: string; ok?: boolean; detail?: string }
  /** An image sent with the message: a URL or `data:` URL to show */
  | { type: "image"; src: string; name?: string }
  /** A file sent with the message, shown by its name */
  | { type: "file"; name: string; detail?: string };

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
export const shouldSendOnKey = (
  event: ComposerKeyEvent,
  touchKeyboard: boolean,
): boolean => {
  if (event.key !== "Enter") return false;

  // Enter confirms an IME candidate rather than sending (keyCode 229 covers Safari)
  if (event.isComposing || event.keyCode === 229) return false;

  if (event.metaKey || event.ctrlKey) return true;

  if (event.shiftKey || event.altKey) return false;

  return !touchKeyboard;
};

/** Whether the primary input is touch, where Enter should insert a newline */
const isTouchKeyboard = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

/** A styled auto-growing textarea matching the input primitive's tokens. */
const Composer = ({ className, ...props }: ComponentProps<"textarea">) => (
  <textarea
    className={cn(
      "flex max-h-40 min-h-11 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

/** Three-dot typing indicator shown while the assistant is streaming. */
const TypingIndicator = () => (
  <div
    className="flex items-center gap-1 py-1"
    role="status"
    aria-label="Assistant is typing"
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const toolStatusVariant = (status?: "pending" | "done" | "error") =>
  status === "error"
    ? "destructive"
    : status === "done"
      ? "secondary"
      : "outline";

/** Render one message's ordered parts. */
const MessageParts = ({
  parts,
  renderText,
}: {
  parts: ChatPart[];
  renderText?: (text: string) => ReactNode;
}) => (
  <div className="space-y-1.5">
    {parts.map((part, index) => {
      const key = `${part.type}-${index}`;
      if (part.type === "text") {
        return (
          <div key={key} className="text-sm break-words whitespace-pre-wrap">
            {renderText ? renderText(part.text) : part.text}
          </div>
        );
      }
      if (part.type === "thinking") {
        return (
          <div
            key={key}
            className="text-muted-foreground text-xs break-words whitespace-pre-wrap italic"
          >
            {part.text}
          </div>
        );
      }
      if (part.type === "image") {
        return (
          <img
            key={key}
            src={part.src}
            alt={part.name ? `Attached image: ${part.name}` : "Attached image"}
            className="border-border max-h-48 max-w-full rounded-md border object-contain"
          />
        );
      }
      if (part.type === "file") {
        return (
          <div
            key={key}
            className="border-border bg-background/60 text-foreground flex max-w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs"
          >
            <FileText className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate" title={part.name}>
              {part.name}
            </span>
            {part.detail && (
              <span className="text-muted-foreground shrink-0">
                {part.detail}
              </span>
            )}
          </div>
        );
      }
      // tool-call / tool-result
      const isResult = part.type === "tool-result";
      const variant = isResult
        ? part.ok === false
          ? "destructive"
          : "secondary"
        : toolStatusVariant(part.status);
      return (
        <div key={key} className="flex items-center gap-2 text-xs">
          <Badge variant={variant} className="gap-1">
            <Wrench className="size-3" />
            {part.name}
          </Badge>
          {part.detail && (
            <span className="text-muted-foreground truncate">
              {part.detail}
            </span>
          )}
        </div>
      );
    })}
  </div>
);

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
const AiChatThread = ({
  messages,
  status = "idle",
  input,
  onInputChange,
  onSend,
  placeholder = "Send a message",
  emptyState,
  notice,
  disabled = false,
  renderText,
  renderAvatar,
  composerAccessory,
  composerActions,
  footerHint,
  suggestions,
  suggestionCount,
  attachments,
  attachTitle,
}: AiChatThreadProps) => {
  const endRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const showSuggestions =
    messages.length === 0 &&
    input.trim().length === 0 &&
    Boolean(suggestions?.length);
  const busy = status === "submitting" || status === "streaming";
  const attached = attachments?.attachments.length ?? 0;
  const canSend =
    !disabled && !busy && (input.trim().length > 0 || attached > 0);

  // The default role icon, used when the host supplies no renderAvatar (or it
  // returns null for this message)
  const defaultAvatar = (role: "user" | "assistant") => (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full",
        role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
      )}
      aria-hidden
    >
      {role === "user" ? (
        <User className="size-4" />
      ) : (
        <Bot className="size-4" />
      )}
    </div>
  );

  const avatarFor = (message: ChatMessage) =>
    renderAvatar?.(message) ?? defaultAvatar(message.role);

  // Keep the latest message (and the streaming tail) in view
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages or stream ticks
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && emptyState ? (
          <div className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
            {emptyState}
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  isUser ? "flex-row-reverse" : "flex-row",
                )}
              >
                {avatarFor(message)}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  <MessageParts parts={message.parts} renderText={renderText} />
                </div>
              </div>
            );
          })
        )}

        {status === "streaming" && (
          <div className="flex gap-3">
            {avatarFor({ id: "__streaming__", role: "assistant", parts: [] })}
            <div className="bg-muted rounded-lg px-3 py-2">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {notice && (
        <div className="border-border text-muted-foreground border-t px-4 py-2 text-sm">
          {notice}
        </div>
      )}

      <div
        className="border-border relative border-t p-3"
        {...(attachments && !disabled ? attachments.dropZoneProps : {})}
      >
        {attachments && <AttachmentDropOverlay active={attachments.dragging} />}
        {showSuggestions && suggestions && (
          <PromptSuggestions
            suggestions={suggestions}
            count={suggestionCount}
            disabled={disabled || busy}
            onPick={(prompt) => {
              onInputChange(prompt);
              composerRef.current?.focus();
            }}
            className="mb-2"
          />
        )}
        {composerAccessory && <div className="mb-2">{composerAccessory}</div>}
        {attachments && (
          <AttachmentList
            attachments={attachments.attachments}
            onRemove={attachments.remove}
            className="mb-2 pt-1"
          />
        )}
        <div className="flex items-end gap-2">
          {attachments && (
            <AttachButton
              count={attached}
              max={attachments.limits.maxAttachments}
              disabled={disabled || busy || attachments.disabled}
              onFiles={(files) => void attachments.addFiles(files)}
              accept={
                attachments.documents ? ATTACH_ACCEPT : ATTACH_IMAGES_ACCEPT
              }
              title={attachTitle}
            />
          )}
          <Composer
            ref={composerRef}
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onPaste={attachments?.onPaste}
            onKeyDown={(event) => {
              const send = shouldSendOnKey(
                {
                  key: event.key,
                  shiftKey: event.shiftKey,
                  altKey: event.altKey,
                  metaKey: event.metaKey,
                  ctrlKey: event.ctrlKey,
                  isComposing: event.nativeEvent.isComposing,
                  keyCode: event.keyCode,
                },
                isTouchKeyboard(),
              );
              if (!send) return;
              event.preventDefault();
              if (canSend) onSend();
            }}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label="Message"
          />
          {composerActions}
          <Button
            type="button"
            size="icon"
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </div>
        {attachments && <AttachmentError message={attachments.error} />}
        {footerHint && (
          <div className="text-muted-foreground mt-1.5 text-xs pointer-coarse:hidden">
            {footerHint}
          </div>
        )}
      </div>
    </div>
  );
};

export { AiChatThread };
