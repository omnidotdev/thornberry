import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { Checkbox } from "@/registry/thornberry/components/checkbox";

afterEach(() => {
  cleanup();
});

describe("Checkbox", () => {
  test("renders the label and toggles", async () => {
    const onCheckedChange = mock(() => {});
    render(<Checkbox label="Remember me" onCheckedChange={onCheckedChange} />);

    expect(screen.getByText("Remember me")).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByText("Remember me"));
    });
    expect(onCheckedChange).toHaveBeenCalled();
  });

  test("keeps the box from shrinking beside a long label", () => {
    const { container } = render(<Checkbox label="A long consent label" />);

    const control = container.querySelector("[data-part=control]");
    expect(control?.className).toContain("shrink-0");
  });
});
