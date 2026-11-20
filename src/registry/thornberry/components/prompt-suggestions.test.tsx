import { afterEach, describe, expect, mock, test } from "bun:test";

import { act, cleanup, fireEvent, render } from "@testing-library/react";

import {
  PromptSuggestions,
  shuffledOrder,
  suggestionWindow,
} from "@/registry/thornberry/components/prompt-suggestions";

afterEach(cleanup);

const examples = [
  "A booking site for a dog groomer",
  "A portfolio for a wedding photographer",
  "A menu site for a ramen bar",
  "A landing page for a budgeting app",
  "A site for a neighborhood book club",
  { label: "A bakery", prompt: "A bakery site with a menu and opening hours" },
];

/** A random source that keeps the examples in their written order */
const inOrder = () => 0.999;

const chips = (container: HTMLElement) =>
  [
    ...container.querySelectorAll<HTMLButtonElement>(
      "[role='group'] button:not(:last-child)",
    ),
  ].map((button) => button.textContent);

describe("shuffledOrder", () => {
  test("holds every index exactly once", () => {
    const order = shuffledOrder(18);

    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 18 }, (_, index) => index),
    );
  });

  test("follows the random source", () => {
    expect(shuffledOrder(4, inOrder)).toEqual([0, 1, 2, 3]);
    expect(shuffledOrder(4, () => 0)).not.toEqual([0, 1, 2, 3]);
  });
});

describe("suggestionWindow", () => {
  test("walks through every example before repeating", () => {
    const order = [5, 3, 1, 0, 2, 4];

    expect(suggestionWindow(order, 0, 4)).toEqual([5, 3, 1, 0]);
    expect(suggestionWindow(order, 1, 4)).toEqual([2, 4, 5, 3]);
  });

  test("shows no more than there are", () => {
    expect(suggestionWindow([1, 0], 0, 4)).toEqual([1, 0]);
    expect(suggestionWindow([], 3, 4)).toEqual([]);
  });
});

describe("PromptSuggestions", () => {
  test("shows a few examples in a labelled group", async () => {
    const { container, getByRole } = render(
      <PromptSuggestions
        suggestions={examples}
        count={3}
        onPick={() => {}}
        random={inOrder}
      />,
    );

    expect(getByRole("group", { name: "Example prompts" })).toBeDefined();
    expect(chips(container)).toEqual(
      examples.slice(0, 3) as unknown as string[],
    );
  });

  test("hands over the full prompt on a pick, never the short label", () => {
    const onPick = mock();
    const { getByText } = render(
      <PromptSuggestions
        suggestions={examples}
        onPick={onPick}
        count={6}
        random={inOrder}
      />,
    );

    fireEvent.click(getByText("A bakery"));

    expect(onPick).toHaveBeenCalledWith(
      "A bakery site with a menu and opening hours",
      {
        label: "A bakery",
        prompt: "A bakery site with a menu and opening hours",
      },
    );
  });

  test("swaps in the next examples on More ideas", async () => {
    const { container, getByText } = render(
      <PromptSuggestions
        suggestions={examples}
        count={2}
        onPick={() => {}}
        random={inOrder}
      />,
    );

    await act(async () => {
      fireEvent.click(getByText("More ideas"));
    });

    expect(chips(container)).toEqual([
      "A menu site for a ramen bar",
      "A landing page for a budgeting app",
    ]);
  });

  test("offers no shuffle when every example already shows", () => {
    const { queryByText } = render(
      <PromptSuggestions
        suggestions={examples.slice(0, 2)}
        onPick={() => {}}
      />,
    );

    expect(queryByText("More ideas")).toBeNull();
  });

  test("gives every chip a 44px target on touch screens", () => {
    const { container } = render(
      <PromptSuggestions suggestions={examples} onPick={() => {}} />,
    );

    for (const button of container.querySelectorAll("button")) {
      expect(button.className).toContain("pointer-coarse:min-h-11");
    }
  });

  test("renders nothing without examples", () => {
    const { container } = render(
      <PromptSuggestions suggestions={[]} onPick={() => {}} />,
    );

    expect(container.innerHTML).toBe("");
  });
});
