import { Shuffle } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

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

const normalize = (suggestion: string | PromptSuggestion): PromptSuggestion =>
  typeof suggestion === "string" ? { label: suggestion } : suggestion;

/**
 * A shuffled order of `length` indexes (Fisher-Yates), so every visit starts
 * from a different set and "More ideas" walks through them all before repeating
 */
export const shuffledOrder = (
  length: number,
  random: () => number = Math.random,
): number[] => {
  const order = Array.from({ length }, (_, index) => index);

  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const swap = order[i] as number;

    order[i] = order[j] as number;
    order[j] = swap;
  }

  return order;
};

/** The `count` indexes shown at window `page` of `order`, wrapping around */
export const suggestionWindow = (
  order: readonly number[],
  page: number,
  count: number,
): number[] => {
  if (!order.length) return [];

  const size = Math.min(count, order.length);
  const start = (page * size) % order.length;

  return Array.from(
    { length: size },
    (_, offset) => order[(start + offset) % order.length] as number,
  );
};

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
const PromptSuggestions = ({
  suggestions,
  count = 4,
  onPick,
  shuffle,
  shuffleLabel = "More ideas",
  label = "Example prompts",
  disabled = false,
  className,
  random,
}: PromptSuggestionsProps) => {
  const items = suggestions.map(normalize);
  const [order, setOrder] = useState<number[] | null>(null);
  const [page, setPage] = useState(0);

  // Shuffle on the client only, once per mount (a visit) and whenever the
  // examples themselves change
  // biome-ignore lint/correctness/useExhaustiveDependencies: reshuffle when the list's size changes, not on every render's new array
  useEffect(() => {
    setOrder(shuffledOrder(items.length, random));
    setPage(0);
  }, [items.length]);

  if (!items.length) return null;

  const ready = order !== null && order.length === items.length;
  const shown = suggestionWindow(
    ready ? order : items.map((_, index) => index),
    page,
    count,
  );
  const canShuffle = shuffle ?? items.length > count;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex flex-wrap items-center gap-2 transition-opacity duration-200",
        ready ? "opacity-100" : "invisible opacity-0",
        className,
      )}
    >
      {shown.map((index) => {
        const item = items[index] as PromptSuggestion;

        return (
          <Button
            key={`${index}-${item.label}`}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onPick(item.prompt ?? item.label, item)}
            className="h-auto min-h-8 max-w-full rounded-full py-1.5 text-left whitespace-normal pointer-coarse:min-h-11"
          >
            {item.label}
          </Button>
        );
      })}

      {canShuffle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => setPage((current) => current + 1)}
          className="text-muted-foreground rounded-full pointer-coarse:min-h-11"
        >
          <Shuffle aria-hidden="true" />
          {shuffleLabel}
        </Button>
      )}
    </div>
  );
};

export { PromptSuggestions };
