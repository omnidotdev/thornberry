import { afterEach, describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { AiDescribePanel } from "@/registry/thornberry/components/ai-describe-panel";

afterEach(cleanup);

const noop = () => {};

const suggestions = [
  "a 20mm cube with a 6mm hole through the middle",
  "an L-bracket with two bolt holes",
  "a hex nut for an M10 bolt",
];

describe("AiDescribePanel", () => {
  test("drafts a picked example prompt, without generating", async () => {
    const onPickSuggestion = mock();
    const onGenerate = mock();

    render(
      <AiDescribePanel
        open
        onOpenChange={noop}
        mode="generate"
        title="Describe a part"
        prompt=""
        onPromptChange={noop}
        suggestions={suggestions}
        onPickSuggestion={onPickSuggestion}
        onGenerate={onGenerate}
      />,
    );

    const group = await screen.findByRole("group", { name: "Example prompts" });
    const [chip] = Array.from(group.querySelectorAll("button"));

    expect(chip).toBeDefined();
    if (chip) fireEvent.click(chip);

    expect(onPickSuggestion).toHaveBeenCalledTimes(1);
    expect(suggestions).toContain(onPickSuggestion.mock.calls[0]?.[0]);
    expect(onGenerate).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "Describe a part" }),
    );
  });

  test("shows a set of examples with More ideas when there are more than fit", async () => {
    render(
      <AiDescribePanel
        open
        onOpenChange={noop}
        mode="generate"
        prompt=""
        onPromptChange={noop}
        suggestions={suggestions}
        suggestionCount={2}
        onGenerate={noop}
      />,
    );

    const group = await screen.findByRole("group", { name: "Example prompts" });

    expect(group.querySelectorAll("button")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "More ideas" })).toBeDefined();
  });

  test("hides the examples once the prompt holds text or sign-in leads", () => {
    const { rerender } = render(
      <AiDescribePanel
        open
        onOpenChange={noop}
        mode="generate"
        prompt="a bracket"
        onPromptChange={noop}
        suggestions={suggestions}
        onGenerate={noop}
      />,
    );

    expect(screen.queryByRole("group", { name: "Example prompts" })).toBeNull();

    rerender(
      <AiDescribePanel
        open
        onOpenChange={noop}
        mode="signIn"
        prompt=""
        onPromptChange={noop}
        suggestions={suggestions}
        onGenerate={noop}
      />,
    );

    expect(screen.queryByRole("group", { name: "Example prompts" })).toBeNull();
  });
});
