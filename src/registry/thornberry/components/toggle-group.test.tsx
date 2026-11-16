import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { Toggle } from "@/registry/thornberry/components/toggle";
import {
  ToggleGroupItem,
  ToggleGroupRoot,
} from "@/registry/thornberry/components/toggle-group";

import type { ComponentProps } from "react";

const renderGroup = (props: ComponentProps<typeof ToggleGroupRoot> = {}) =>
  render(
    <ToggleGroupRoot {...props}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline" variant="solid">
        U
      </ToggleGroupItem>
    </ToggleGroupRoot>,
  );

const item = (label: string) => screen.getByLabelText(label);

// Ark (Zag) machines commit state after the click's microtasks settle, so
// flush them before asserting on the next render
const click = async (element: Element) => {
  fireEvent.click(element);
  await act(async () => {});
};

afterEach(() => {
  cleanup();
});

describe("ToggleGroup", () => {
  test("single selection replaces the active item", async () => {
    const onValueChange = mock();
    renderGroup({ onValueChange });

    await click(item("Bold"));
    expect(item("Bold").getAttribute("data-state")).toBe("on");

    await click(item("Italic"));
    expect(item("Italic").getAttribute("data-state")).toBe("on");
    expect(item("Bold").getAttribute("data-state")).toBe("off");
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: ["italic"] }),
    );
  });

  test("multiple selection keeps several items on", async () => {
    const onValueChange = mock();
    renderGroup({ multiple: true, onValueChange });

    await click(item("Bold"));
    await click(item("Underline"));

    expect(item("Bold").getAttribute("aria-pressed")).toBe("true");
    expect(item("Underline").getAttribute("aria-pressed")).toBe("true");
    expect(item("Italic").getAttribute("aria-pressed")).toBe("false");
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: ["bold", "underline"] }),
    );
  });

  test("items inherit the root variant unless they override it", () => {
    renderGroup({ variant: "outline", size: "sm" });

    expect(item("Bold").className).toContain("border");
    expect(item("Bold").className).toContain("h-8");
    expect(item("Underline").className).toContain("data-[state=on]:bg-primary");
  });
});

describe("Toggle", () => {
  test("flips its pressed state on click", async () => {
    const onPressedChange = mock();
    render(
      <Toggle aria-label="Pin" onPressedChange={onPressedChange}>
        Pin
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "Pin" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");

    await click(toggle);

    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.getAttribute("data-state")).toBe("on");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
