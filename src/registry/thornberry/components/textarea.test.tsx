import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render } from "@testing-library/react";

import { Textarea } from "@/registry/thornberry/components/textarea";

afterEach(() => {
  cleanup();
});

describe("Textarea", () => {
  test("renders a textarea that forwards props and merges classes", () => {
    const { container } = render(
      <Textarea id="notes" rows={4} className="min-h-40" defaultValue="Hi" />,
    );

    const textarea = container.querySelector("textarea");
    expect(textarea?.id).toBe("notes");
    expect(textarea?.getAttribute("rows")).toBe("4");
    expect(textarea?.value).toBe("Hi");
    expect(textarea?.className).toContain("min-h-40");
    expect(textarea?.className).not.toContain("min-h-20");
  });
});
