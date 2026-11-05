import { ArrowUp, Bot, Loader2, User, Wrench } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/thornberry/components/badge";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps, ReactNode } from "react";

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
  | { type: "tool-result"; name: string; ok?: boolean; detail?: string };

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
        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
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
          <div key={key} className="whitespace-pre-wrap break-words text-sm">
            {renderText ? renderText(part.text) : part.text}
          </div>
        );
      }
      if (part.type === "thinking") {
        return (
          <div
            key={key}
            className="whitespace-pre-wrap break-words text-muted-foreground text-xs italic"
          >
            {part.text}
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
            <span className="truncate text-muted-foreground">
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
}: AiChatThreadProps) => {
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitting" || status === "streaming";
  const canSend = !disabled && !busy && input.trim().length > 0;

  // Keep the latest message (and the streaming tail) in view
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages or stream ticks
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && emptyState ? (
          <div className="flex h-full items-center justify-center text-center text-muted-foreground text-sm">
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
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {isUser ? (
                    <User className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </div>
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
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-hidden
            >
              <Bot className="size-4" />
            </div>
            <div className="rounded-lg bg-muted px-3 py-2">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {notice && (
        <div className="border-border border-t px-4 py-2 text-muted-foreground text-sm">
          {notice}
        </div>
      )}

      <div className="flex items-end gap-2 border-border border-t p-3">
        <Composer
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (canSend) onSend();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message"
        />
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
    </div>
  );
};

export { AiChatThread };
