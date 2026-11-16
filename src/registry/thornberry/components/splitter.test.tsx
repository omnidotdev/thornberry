import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { Splitter } from "@/registry/thornberry/components/splitter";

import type { SplitterPanelConfig } from "@/registry/thornberry/components/splitter";

const panels: SplitterPanelConfig[] = [
  { id: "nav", label: "Navigation", minSize: 20, maxSize: 60, content: "Nav" },
  { id: "main", label: "Content", content: "Main" },
];

const panel = (id: string) => {
  const element = document.querySelector(
    `[data-part="panel"][data-id="${id}"]`,
  );
  if (!element) throw new Error(`expected panel ${id}`);
  return element as HTMLElement;
};

// Ark (Zag) machines commit state after the event's microtasks settle, so
// flush them before asserting on the next render
const keyDown = async (element: Element, init: KeyboardEventInit) => {
  fireEvent.keyDown(element, init);
  await act(async () => {});
};

afterEach(() => {
  cleanup();
});

describe("Splitter", () => {
  test("renders the panels with a labelled separator between them", () => {
    render(<Splitter panels={panels} />);

    expect(screen.getByText("Nav")).toBeDefined();
    expect(screen.getByText("Main")).toBeDefined();

    const separator = screen.getByRole("separator", {
      name: "Resize Navigation and Content",
    });
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
  });

  test("shares the space left by sized panels", () => {
    render(
      <Splitter
        panels={[
          { id: "a", defaultSize: 40, content: "A" },
          { id: "b", content: "B" },
          { id: "c", content: "C" },
        ]}
      />,
    );

    expect(panel("a").style.flexGrow).toBe("40");
    expect(panel("b").style.flexGrow).toBe("30");
    expect(panel("c").style.flexGrow).toBe("30");
    expect(screen.getAllByRole("separator")).toHaveLength(2);
    expect(
      screen.getAllByRole("separator", { name: "Resize panels" }),
    ).toHaveLength(2);
  });

  test("resizes with the keyboard within the panel limits", async () => {
    const onResize = mock();
    render(<Splitter panels={panels} onResize={onResize} />);

    const separator = screen.getByRole("separator");
    separator.focus();
    fireEvent.focus(separator);

    await keyDown(separator, { key: "ArrowRight" });
    expect(separator.getAttribute("aria-valuenow")).toBe("51");
    expect(onResize).toHaveBeenCalled();

    await keyDown(separator, { key: "ArrowLeft", shiftKey: true });
    expect(separator.getAttribute("aria-valuenow")).toBe("41");

    // Home and End clamp to the panel's min and max sizes
    await keyDown(separator, { key: "Home" });
    expect(separator.getAttribute("aria-valuenow")).toBe("20");

    await keyDown(separator, { key: "End" });
    expect(separator.getAttribute("aria-valuenow")).toBe("60");
  });

  test("stacks panels vertically", () => {
    render(<Splitter panels={panels} orientation="vertical" withHandle />);

    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(
      separator.querySelector('[data-part="resize-trigger-indicator"]'),
    ).not.toBeNull();
  });
});
