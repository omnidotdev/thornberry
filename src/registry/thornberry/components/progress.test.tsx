import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render, screen } from "@testing-library/react";

import {
  CircularProgress,
  Progress,
} from "@/registry/thornberry/components/progress";

afterEach(() => {
  cleanup();
});

describe("Progress", () => {
  test("exposes the value through progressbar aria attributes", () => {
    render(<Progress value={40} />);

    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(bar.getAttribute("data-state")).toBe("loading");
  });

  test("sizes the range to the percentage of max", () => {
    const { container } = render(<Progress value={30} max={60} />);

    const range = container.querySelector<HTMLElement>('[data-part="range"]');
    expect(range?.style.width).toBe("50%");
  });

  test("renders the label and formatted value text", () => {
    render(<Progress value={25} label="Uploading" showValueText />);

    expect(screen.getByText("Uploading")).toBeDefined();
    expect(screen.getByText("25%")).toBeDefined();
  });

  test("marks a null value as indeterminate", () => {
    render(<Progress value={null} />);

    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBeNull();
    expect(bar.getAttribute("data-state")).toBe("indeterminate");
  });

  test("marks a full bar as complete", () => {
    render(<Progress value={100} />);

    expect(screen.getByRole("progressbar").getAttribute("data-state")).toBe(
      "complete",
    );
  });
});

describe("CircularProgress", () => {
  test("renders an svg progressbar with the value", () => {
    render(<CircularProgress value={70} showValueText />);

    const circle = screen.getByRole("progressbar");
    expect(circle.tagName.toLowerCase()).toBe("svg");
    expect(circle.getAttribute("aria-valuenow")).toBe("70");
    expect(screen.getByText("70%")).toBeDefined();
  });

  test("applies the size preset as css custom properties", () => {
    render(<CircularProgress value={10} size="lg" />);

    const circle = screen.getByRole("progressbar");
    expect(circle.style.getPropertyValue("--size")).toBe("4rem");
    expect(circle.style.getPropertyValue("--thickness")).toBe("0.375rem");
  });

  test("draws a partial arc while indeterminate", () => {
    const { container } = render(<CircularProgress value={null} />);

    const range = container.querySelector<SVGElement>(
      '[data-part="circle-range"]',
    );
    expect(range?.style.strokeDasharray).toContain("0.25");
    expect(screen.getByRole("progressbar").getAttribute("data-state")).toBe(
      "indeterminate",
    );
  });
});
