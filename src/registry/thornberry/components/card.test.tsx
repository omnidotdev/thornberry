import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render } from "@testing-library/react";

import { Card } from "@/registry/thornberry/components/card";

afterEach(() => {
  cleanup();
});

describe("Card", () => {
  test("renders the title, description, content, and footer", () => {
    const { getByText } = render(
      <Card title="Plan" description="Billed monthly" footer="Upgrade">
        Body
      </Card>,
    );

    for (const text of ["Plan", "Billed monthly", "Body", "Upgrade"]) {
      expect(getByText(text)).toBeTruthy();
    }
  });

  test("omits the header and footer when they are unset", () => {
    const { container } = render(<Card>Body</Card>);

    // root plus content only
    expect(container.querySelectorAll("div").length).toBe(2);
  });

  test("does not forward title as an HTML attribute", () => {
    const { container } = render(<Card title="Plan">Body</Card>);

    expect(container.firstElementChild?.getAttribute("title")).toBeNull();
  });
});

describe("Card without a header", () => {
  test("pads the top of the content", () => {
    const { getByText } = render(<Card>Body</Card>);

    expect(getByText("Body").className).toContain("pt-6");
  });

  test("keeps the header's spacing when titled", () => {
    const { getByText } = render(<Card title="Plan">Body</Card>);

    expect(getByText("Body").className).not.toContain("pt-6");
  });
});
