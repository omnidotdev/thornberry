import { describe, expect, it } from "bun:test";

import { nodeThemes, resolveTheme } from "./node-themes";

import type { NodeTheme } from "./node-themes";

describe("resolveTheme", () => {
  it("resolves a known semantic key to its theme object", () => {
    const theme = resolveTheme("success");

    expect(theme).toBe(nodeThemes.success);
    expect(theme.border.length).toBeGreaterThan(0);
    expect(theme.bg.length).toBeGreaterThan(0);
  });

  it("resolves the default key", () => {
    const theme = resolveTheme("default");

    expect(theme).toBe(nodeThemes.default);
    expect(theme.border.length).toBeGreaterThan(0);
  });

  it("passes a custom theme object through unchanged", () => {
    const custom: NodeTheme = {
      border: "border-pink-500",
      bg: "bg-pink-50",
      iconBg: "bg-pink-500",
      iconText: "text-white",
      accent: "text-pink-600",
      handleColor: "!bg-pink-500",
    };

    expect(resolveTheme(custom)).toBe(custom);
  });

  it("exposes exactly the six semantic theme keys", () => {
    expect(Object.keys(nodeThemes).sort()).toEqual([
      "accent",
      "danger",
      "default",
      "muted",
      "success",
      "warning",
    ]);
  });
});
