import { afterEach, describe, expect, test } from "bun:test";

import { hotkeyLabel } from "@/registry/thornberry/components/use-hotkeys";

/** Pin `navigator.platform` so `hotkeyLabel`'s Apple detection is deterministic. */
const setPlatform = (platform: string) => {
  Object.defineProperty(navigator, "platform", {
    value: platform,
    configurable: true,
  });
};

const APPLE = "MacIntel";
const NON_APPLE = "Linux x86_64";

afterEach(() => {
  setPlatform(NON_APPLE);
});

describe("hotkeyLabel", () => {
  test("renders the shift+slash binding as a single ? on every platform", () => {
    setPlatform(APPLE);
    expect(hotkeyLabel("shift+slash")).toBe("?");
    setPlatform(NON_APPLE);
    expect(hotkeyLabel("shift+slash")).toBe("?");
  });

  test("treats shift+slash as ? regardless of part order or casing", () => {
    expect(hotkeyLabel("slash+shift")).toBe("?");
    expect(hotkeyLabel("Shift+Slash")).toBe("?");
  });

  test("renders a lone slash as /", () => {
    setPlatform(NON_APPLE);
    expect(hotkeyLabel("slash")).toBe("/");
    setPlatform(APPLE);
    expect(hotkeyLabel("slash")).toBe("/");
  });

  test("renders other named keys as their glyph", () => {
    setPlatform(NON_APPLE);
    expect(hotkeyLabel("escape")).toBe("Esc");
    expect(hotkeyLabel("esc")).toBe("Esc");
    expect(hotkeyLabel("enter")).toBe("Enter");
    expect(hotkeyLabel("return")).toBe("Enter");
    expect(hotkeyLabel("arrowup")).toBe("↑");
    expect(hotkeyLabel("arrowdown")).toBe("↓");
    expect(hotkeyLabel("arrowleft")).toBe("←");
    expect(hotkeyLabel("arrowright")).toBe("→");
    expect(hotkeyLabel("comma")).toBe(",");
    expect(hotkeyLabel("period")).toBe(".");
    expect(hotkeyLabel("space")).toBe("Space");
  });

  test("renders mod+k per platform", () => {
    setPlatform(APPLE);
    expect(hotkeyLabel("mod+k")).toBe("⌘K");
    setPlatform(NON_APPLE);
    expect(hotkeyLabel("mod+k")).toBe("Ctrl+K");
  });

  test("renders modifier chords per platform", () => {
    setPlatform(APPLE);
    expect(hotkeyLabel("mod+shift+z")).toBe("⌘⇧Z");
    expect(hotkeyLabel("alt+ctrl+x")).toBe("⌥⌃X");
    setPlatform(NON_APPLE);
    expect(hotkeyLabel("mod+shift+z")).toBe("Ctrl+Shift+Z");
    expect(hotkeyLabel("alt+ctrl+x")).toBe("Alt+Ctrl+X");
  });

  test("uppercases single-character keys and leaves other words intact", () => {
    setPlatform(NON_APPLE);
    expect(hotkeyLabel("t")).toBe("T");
    expect(hotkeyLabel("tab")).toBe("tab");
  });

  test("still renders a glyph key combined with a modifier", () => {
    setPlatform(NON_APPLE);
    // only the bare shift+slash pair collapses to ?, a mod+slash stays split
    expect(hotkeyLabel("mod+slash")).toBe("Ctrl+/");
    setPlatform(APPLE);
    expect(hotkeyLabel("mod+slash")).toBe("⌘/");
  });
});
