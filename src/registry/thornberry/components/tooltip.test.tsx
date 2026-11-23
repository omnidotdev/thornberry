import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render, screen } from "@testing-library/react";

import { Tooltip } from "@/registry/thornberry/components/tooltip";

afterEach(() => {
  cleanup();
});

describe("Tooltip", () => {
  test("renders the trigger as the child element", () => {
    render(
      <Tooltip content="Copy link">
        <button type="button">Copy</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Copy" });
    expect(trigger.getAttribute("data-scope")).toBe("tooltip");
  });

  test("shows the content when open, wrapping long text", () => {
    render(
      <Tooltip content="A longer explanation that wraps" open>
        <button type="button">Help</button>
      </Tooltip>,
    );

    const content = screen.getByText("A longer explanation that wraps");
    expect(content.className).toContain("max-w-xs");
    expect(content.className).not.toContain("h-10");
  });
});
