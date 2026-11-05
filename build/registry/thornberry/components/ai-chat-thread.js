import {
  Badge2
} from "../../../chunks/account-user-two-factor-authentication-mhbe1kzg.js";
import {
  Button2
} from "../../../chunks/account-user-two-factor-authentication-qyg3bvpa.js";
import {
  cn
} from "../../../chunks/account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/ai-chat-thread.tsx
import { ArrowUp, Bot, Loader2, User, Wrench } from "lucide-react";
import { useEffect, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Composer = ({ className, ...props }) => /* @__PURE__ */ jsx("textarea", {
  className: cn("flex max-h-40 min-h-11 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50", className),
  ...props
});
var TypingIndicator = () => /* @__PURE__ */ jsx("div", {
  className: "flex items-center gap-1 py-1",
  role: "status",
  "aria-label": "Assistant is typing",
  children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("span", {
    className: "size-1.5 animate-bounce rounded-full bg-muted-foreground/60",
    style: { animationDelay: `${i * 0.15}s` }
  }, i))
});
var toolStatusVariant = (status) => status === "error" ? "destructive" : status === "done" ? "secondary" : "outline";
var MessageParts = ({
  parts,
  renderText
}) => /* @__PURE__ */ jsx("div", {
  className: "space-y-1.5",
  children: parts.map((part, index) => {
    const key = `${part.type}-${index}`;
    if (part.type === "text") {
      return /* @__PURE__ */ jsx("div", {
        className: "whitespace-pre-wrap break-words text-sm",
        children: renderText ? renderText(part.text) : part.text
      }, key);
    }
    if (part.type === "thinking") {
      return /* @__PURE__ */ jsx("div", {
        className: "whitespace-pre-wrap break-words text-muted-foreground text-xs italic",
        children: part.text
      }, key);
    }
    const isResult = part.type === "tool-result";
    const variant = isResult ? part.ok === false ? "destructive" : "secondary" : toolStatusVariant(part.status);
    return /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 text-xs",
      children: [
        /* @__PURE__ */ jsxs(Badge2, {
          variant,
          className: "gap-1",
          children: [
            /* @__PURE__ */ jsx(Wrench, {
              className: "size-3"
            }),
            part.name
          ]
        }),
        part.detail && /* @__PURE__ */ jsx("span", {
          className: "truncate text-muted-foreground",
          children: part.detail
        })
      ]
    }, key);
  })
});
var AiChatThread = ({
  messages,
  status = "idle",
  input,
  onInputChange,
  onSend,
  placeholder = "Send a message",
  emptyState,
  notice,
  disabled = false,
  renderText
}) => {
  const endRef = useRef(null);
  const busy = status === "submitting" || status === "streaming";
  const canSend = !disabled && !busy && input.trim().length > 0;
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);
  return /* @__PURE__ */ jsxs("div", {
    className: "flex h-full min-h-0 flex-col",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "min-h-0 flex-1 space-y-4 overflow-y-auto p-4",
        children: [
          messages.length === 0 && emptyState ? /* @__PURE__ */ jsx("div", {
            className: "flex h-full items-center justify-center text-center text-muted-foreground text-sm",
            children: emptyState
          }) : messages.map((message) => {
            const isUser = message.role === "user";
            return /* @__PURE__ */ jsxs("div", {
              className: cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row"),
              children: [
                /* @__PURE__ */ jsx("div", {
                  className: cn("flex size-7 shrink-0 items-center justify-center rounded-full", isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
                  "aria-hidden": true,
                  children: isUser ? /* @__PURE__ */ jsx(User, {
                    className: "size-4"
                  }) : /* @__PURE__ */ jsx(Bot, {
                    className: "size-4"
                  })
                }),
                /* @__PURE__ */ jsx("div", {
                  className: cn("max-w-[80%] rounded-lg px-3 py-2", isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
                  children: /* @__PURE__ */ jsx(MessageParts, {
                    parts: message.parts,
                    renderText
                  })
                })
              ]
            }, message.id);
          }),
          status === "streaming" && /* @__PURE__ */ jsxs("div", {
            className: "flex gap-3",
            children: [
              /* @__PURE__ */ jsx("div", {
                className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
                "aria-hidden": true,
                children: /* @__PURE__ */ jsx(Bot, {
                  className: "size-4"
                })
              }),
              /* @__PURE__ */ jsx("div", {
                className: "rounded-lg bg-muted px-3 py-2",
                children: /* @__PURE__ */ jsx(TypingIndicator, {})
              })
            ]
          }),
          /* @__PURE__ */ jsx("div", {
            ref: endRef
          })
        ]
      }),
      notice && /* @__PURE__ */ jsx("div", {
        className: "border-border border-t px-4 py-2 text-muted-foreground text-sm",
        children: notice
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-end gap-2 border-border border-t p-3",
        children: [
          /* @__PURE__ */ jsx(Composer, {
            value: input,
            onChange: (event) => onInputChange(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (canSend)
                  onSend();
              }
            },
            placeholder,
            disabled,
            rows: 1,
            "aria-label": "Message"
          }),
          /* @__PURE__ */ jsx(Button2, {
            type: "button",
            size: "icon",
            onClick: onSend,
            disabled: !canSend,
            "aria-label": "Send message",
            children: busy ? /* @__PURE__ */ jsx(Loader2, {
              className: "size-4 animate-spin"
            }) : /* @__PURE__ */ jsx(ArrowUp, {
              className: "size-4"
            })
          })
        ]
      })
    ]
  });
};
export {
  AiChatThread
};
