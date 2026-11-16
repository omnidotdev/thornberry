import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  Clipboard,
  CopyButton,
} from "@/registry/thornberry/components/clipboard";

const writeText = mock((_text: string) => Promise.resolve());
// Ark (Zag) machines commit state after the click's microtasks settle, so
// flush them before asserting on the next render
const click = async (element: Element) => {
  fireEvent.click(element);
  await act(async () => {});
};

let originalClipboard: PropertyDescriptor | undefined;

beforeEach(() => {
  writeText.mockClear();
  originalClipboard = Object.getOwnPropertyDescriptor(
    window.navigator,
    "clipboard",
  );
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

afterEach(() => {
  cleanup();
  if (originalClipboard) {
    Object.defineProperty(window.navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(window.navigator, "clipboard");
  }
});

describe("CopyButton", () => {
  test("writes the value to the clipboard and shows the copied state", async () => {
    const onCopy = mock();
    render(<CopyButton value="sk_live_123" onCopy={onCopy} />);

    const button = screen.getByRole("button", { name: "Copy to clipboard" });
    await click(button);

    expect(writeText).toHaveBeenCalledWith("sk_live_123");
    expect(onCopy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
    });
    expect(button.hasAttribute("data-copied")).toBe(true);
  });

  test("returns to the idle state after the timeout", async () => {
    render(<CopyButton value="hello" timeout={50} />);

    await click(screen.getByRole("button", { name: "Copy to clipboard" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      ).toBeDefined();
    });
  });

  test("supports custom labels and visible text", () => {
    render(
      <CopyButton value="https://omni.dev" label="Copy link" size="sm">
        Copy link
      </CopyButton>,
    );

    const button = screen.getByRole("button", { name: "Copy link" });
    expect(button.textContent).toContain("Copy link");
  });
});

describe("Clipboard", () => {
  test("shows the value in a read-only input and copies it", async () => {
    render(<Clipboard value="bun add thornberry" label="Install" />);

    const input = screen.getByLabelText("Install") as HTMLInputElement;
    expect(input.value).toBe("bun add thornberry");
    expect(input.readOnly).toBe(true);

    await click(screen.getByRole("button", { name: "Copy to clipboard" }));

    expect(writeText).toHaveBeenCalledWith("bun add thornberry");
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Copied to clipboard" }),
      ).toBeDefined();
    });
  });
});
