import {
  Button2
} from "./ai-describe-panel-k2cwy48h.js";
import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/prompt-suggestions.tsx
import { Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var normalize = (suggestion) => typeof suggestion === "string" ? { label: suggestion } : suggestion;
var shuffledOrder2 = (length, random = Math.random) => {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1;i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const swap = order[i];
    order[i] = order[j];
    order[j] = swap;
  }
  return order;
};
var suggestionWindow2 = (order, page, count) => {
  if (!order.length)
    return [];
  const size = Math.min(count, order.length);
  const start = page * size % order.length;
  return Array.from({ length: size }, (_, offset) => order[(start + offset) % order.length]);
};
var PromptSuggestions2 = ({
  suggestions,
  count = 4,
  onPick,
  shuffle,
  shuffleLabel = "More ideas",
  label = "Example prompts",
  disabled = false,
  className,
  random
}) => {
  const items = suggestions.map(normalize);
  const [order, setOrder] = useState(null);
  const [page, setPage] = useState(0);
  useEffect(() => {
    setOrder(shuffledOrder2(items.length, random));
    setPage(0);
  }, [items.length]);
  if (!items.length)
    return null;
  const ready = order !== null && order.length === items.length;
  const shown = suggestionWindow2(ready ? order : items.map((_, index) => index), page, count);
  const canShuffle = shuffle ?? items.length > count;
  return /* @__PURE__ */ jsxs("div", {
    role: "group",
    "aria-label": label,
    className: cn("flex flex-wrap items-center gap-2 transition-opacity duration-200", ready ? "opacity-100" : "invisible opacity-0", className),
    children: [
      shown.map((index) => {
        const item = items[index];
        return /* @__PURE__ */ jsx(Button2, {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled,
          onClick: () => onPick(item.prompt ?? item.label, item),
          className: "h-auto min-h-8 max-w-full rounded-full py-1.5 text-left whitespace-normal pointer-coarse:min-h-11",
          children: item.label
        }, `${index}-${item.label}`);
      }),
      canShuffle && /* @__PURE__ */ jsxs(Button2, {
        type: "button",
        variant: "ghost",
        size: "sm",
        disabled,
        onClick: () => setPage((current) => current + 1),
        className: "text-muted-foreground rounded-full pointer-coarse:min-h-11",
        children: [
          /* @__PURE__ */ jsx(Shuffle, {
            "aria-hidden": "true"
          }),
          shuffleLabel
        ]
      })
    ]
  });
};
export { shuffledOrder2, suggestionWindow2, PromptSuggestions2 };
