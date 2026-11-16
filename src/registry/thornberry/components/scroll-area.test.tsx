import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { ScrollArea } from "@/registry/thornberry/components/scroll-area";

const getPart = (container: HTMLElement, part: string) =>
  container.querySelectorAll<HTMLElement>(`[data-part="${part}"]`);

afterEach(() => {
  cleanup();
});

describe("ScrollArea", () => {
  test("renders its children inside a viewport that hides the native scrollbar", () => {
    const { container } = render(
      <ScrollArea className="h-40">
        <p>Scrollable content</p>
      </ScrollArea>,
    );

    expect(screen.getByText("Scrollable content")).toBeDefined();

    const [viewport] = getPart(container, "viewport");
    expect(viewport?.style.overflow).toBe("auto");
    expect(viewport?.style.scrollbarWidth).toBe("none");
  });

  test("renders a vertical scrollbar with a thumb by default", () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );

    const scrollbars = getPart(container, "scrollbar");
    expect(scrollbars).toHaveLength(1);
    expect(scrollbars[0]?.getAttribute("data-orientation")).toBe("vertical");
    expect(getPart(container, "thumb")).toHaveLength(1);
    expect(getPart(container, "corner")).toHaveLength(0);
  });

  test("renders both scrollbars and a corner for orientation both", () => {
    const { container } = render(
      <ScrollArea orientation="both">
        <p>Content</p>
      </ScrollArea>,
    );

    const orientations = [...getPart(container, "scrollbar")].map((el) =>
      el.getAttribute("data-orientation"),
    );
    expect(orientations).toEqual(["vertical", "horizontal"]);
    expect(getPart(container, "corner")).toHaveLength(1);
  });

  test("forwards viewport class names and keeps scrolling the viewport", () => {
    const { container } = render(
      <ScrollArea viewportClassName="pr-3">
        <p>Content</p>
      </ScrollArea>,
    );

    const [viewport] = getPart(container, "viewport");
    if (!viewport) throw new Error("expected a viewport");
    expect(viewport.className).toContain("pr-3");

    viewport.scrollTop = 120;
    fireEvent.scroll(viewport);
    expect(viewport.scrollTop).toBe(120);
  });
});
