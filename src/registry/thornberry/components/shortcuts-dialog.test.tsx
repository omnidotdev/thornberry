import { afterEach, describe, expect, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { ShortcutsDialog } from "@/registry/thornberry/components/shortcuts-dialog";

afterEach(() => {
  cleanup();
});

const pressQuestionMark = async () => {
  await act(async () => {
    fireEvent.keyDown(document.body, {
      key: "?",
      code: "Slash",
      shiftKey: true,
    });
    fireEvent.keyUp(document.body, { key: "?", code: "Slash", shiftKey: true });
  });
};

describe("ShortcutsDialog", () => {
  test("opens with the ? key", async () => {
    render(<ShortcutsDialog />);
    expect(screen.queryByText("Keyboard shortcuts")).toBeNull();

    await pressQuestionMark();

    expect(screen.getByText("Keyboard shortcuts")).toBeTruthy();
  });

  test("lists the default globals, app shortcuts, and product groups", () => {
    render(
      <ShortcutsDialog
        open
        general={[{ keys: "g", label: "Go home" }]}
        groups={[
          {
            title: "Board",
            hint: "Hover a card, then press:",
            shortcuts: [{ keys: "c", label: "New task" }],
          },
        ]}
      />,
    );

    for (const text of [
      "Open command palette",
      "Show keyboard shortcuts",
      "Toggle light/dark theme",
      "Go home",
      "Board",
      "Hover a card, then press:",
      "New task",
    ]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
    // only apps with a sidebar list the sidebar key
    expect(screen.queryByText("Toggle sidebar")).toBeNull();
  });

  test("lists the sidebar key when the app binds it", () => {
    render(
      <ShortcutsDialog
        open
        globals={["commandPalette", "showShortcuts", "toggleSidebar"]}
      />,
    );

    expect(screen.getByText("Toggle sidebar")).toBeTruthy();
    expect(screen.queryByText("Toggle light/dark theme")).toBeNull();
  });

  test("renders the ? key as its glyph", () => {
    render(<ShortcutsDialog open />);

    const row = screen.getByText("Show keyboard shortcuts").parentElement;
    expect(row?.querySelector("kbd")?.textContent).toBe("?");
  });
});
