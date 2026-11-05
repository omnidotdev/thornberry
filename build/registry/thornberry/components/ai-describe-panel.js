import {
  Button2
} from "../../../chunks/account-user-two-factor-authentication-qyg3bvpa.js";
import {
  DialogRoot2,
  DialogPortal2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2
} from "../../../chunks/account-user-two-factor-authentication-8q0yqrx6.js";
import {
  Label2
} from "../../../chunks/account-user-two-factor-authentication-fa46q8yp.js";
import"../../../chunks/account-user-two-factor-authentication-hj664zsh.js";
import {
  PasswordInput2
} from "../../../chunks/account-user-two-factor-authentication-e8m4br8p.js";
import {
  cn
} from "../../../chunks/account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/ai-describe-panel.tsx
import { Loader2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var PromptTextarea = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx("textarea", {
  className: cn("flex min-h-24 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50", className),
  ...props
});
var AiDescribePanel = ({
  open,
  onOpenChange,
  mode,
  title = "Describe it",
  description,
  prompt,
  onPromptChange,
  placeholder = "Describe what you want to build",
  suggestions,
  onPickSuggestion,
  onGenerate,
  isPending = false,
  generateLabel = "Generate",
  onSignIn,
  signInLabel = "Sign in",
  notice,
  byok
}) => {
  const showSuggestions = mode === "generate" && prompt.trim().length === 0 && suggestions && suggestions.length > 0;
  const canGenerate = mode === "generate" && prompt.trim().length > 0;
  return /* @__PURE__ */ jsx(DialogRoot2, {
    open,
    onOpenChange: (details) => {
      if (!isPending)
        onOpenChange(details.open);
    },
    children: /* @__PURE__ */ jsxs(DialogPortal2, {
      children: [
        /* @__PURE__ */ jsx(DialogBackdrop2, {}),
        /* @__PURE__ */ jsx(DialogPositioner2, {
          children: /* @__PURE__ */ jsxs(DialogContent2, {
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(DialogTitle2, {
                    children: title
                  }),
                  description && /* @__PURE__ */ jsx(DialogDescription2, {
                    children: description
                  })
                ]
              }),
              mode !== "needsKey" && /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ jsx(PromptTextarea, {
                    value: prompt,
                    onChange: (event) => onPromptChange(event.target.value),
                    onKeyDown: (event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canGenerate && !isPending) {
                        event.preventDefault();
                        onGenerate();
                      }
                    },
                    placeholder,
                    disabled: isPending || mode === "signIn",
                    "aria-label": title
                  }),
                  showSuggestions && /* @__PURE__ */ jsx("div", {
                    className: "flex flex-wrap gap-2",
                    children: suggestions?.map((suggestion) => /* @__PURE__ */ jsx(Button2, {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      disabled: isPending,
                      onClick: () => onPickSuggestion?.(suggestion),
                      children: suggestion
                    }, suggestion))
                  })
                ]
              }),
              notice && /* @__PURE__ */ jsx("div", {
                className: "text-muted-foreground text-sm",
                children: notice
              }),
              byok && /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ jsx("button", {
                    type: "button",
                    className: "cursor-pointer text-muted-foreground text-sm underline-offset-4 hover:underline",
                    onClick: () => byok.onOpenChange(!byok.open),
                    "aria-expanded": byok.open,
                    children: byok.label ?? "Use your own Synapse key"
                  }),
                  byok.open && /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      /* @__PURE__ */ jsx(Label2, {
                        htmlFor: "ai-byok-key",
                        children: byok.label ?? "Synapse API key"
                      }),
                      /* @__PURE__ */ jsx(PasswordInput2, {
                        id: "ai-byok-key",
                        value: byok.value,
                        onChange: (event) => byok.onValueChange(event.target.value),
                        placeholder: byok.placeholder ?? "Synapse API key",
                        autoComplete: "off",
                        spellCheck: false,
                        disabled: isPending
                      }),
                      byok.keyUrl && /* @__PURE__ */ jsxs("p", {
                        className: "text-muted-foreground text-xs",
                        children: [
                          "Need a key?",
                          " ",
                          /* @__PURE__ */ jsx("a", {
                            href: byok.keyUrl,
                            target: "_blank",
                            rel: "noreferrer",
                            className: "underline underline-offset-4",
                            children: "Create a Synapse key"
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex justify-end gap-2",
                children: [
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "outline",
                    onClick: () => onOpenChange(false),
                    disabled: isPending,
                    children: "Cancel"
                  }),
                  mode === "signIn" ? /* @__PURE__ */ jsx(Button2, {
                    onClick: onSignIn,
                    disabled: isPending || !onSignIn,
                    children: signInLabel
                  }) : /* @__PURE__ */ jsx(Button2, {
                    onClick: onGenerate,
                    disabled: isPending || !canGenerate,
                    children: isPending ? /* @__PURE__ */ jsx(Loader2, {
                      className: "size-4 animate-spin"
                    }) : generateLabel
                  })
                ]
              })
            ]
          })
        })
      ]
    })
  });
};
export {
  AiDescribePanel
};
