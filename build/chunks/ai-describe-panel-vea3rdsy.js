// src/registry/thornberry/components/use-hotkeys.tsx
import { useHotkeys as useHotkeys2 } from "react-hotkeys-hook";
var GLOBAL_HOTKEYS2 = {
  commandPalette: "mod+k",
  toggleTheme: "t",
  toggleSidebar: "b",
  showShortcuts: "shift+slash"
};
var isApplePlatform = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
var NAMED_KEY_GLYPHS = {
  slash: "/",
  space: "Space",
  escape: "Esc",
  esc: "Esc",
  enter: "Enter",
  return: "Enter",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  comma: ",",
  period: ".",
  dot: "."
};
var hotkeyLabel2 = (hotkey) => {
  const apple = isApplePlatform();
  const parts = hotkey.split("+");
  const normalized = parts.map((part) => part.trim().toLowerCase());
  if (normalized.length === 2 && normalized.includes("shift") && normalized.includes("slash")) {
    return "?";
  }
  return parts.map((part) => {
    if (part === "mod")
      return apple ? "⌘" : "Ctrl";
    if (part === "shift")
      return apple ? "⇧" : "Shift";
    if (part === "alt")
      return apple ? "⌥" : "Alt";
    if (part === "ctrl")
      return apple ? "⌃" : "Ctrl";
    const glyph = NAMED_KEY_GLYPHS[part.toLowerCase()];
    if (glyph)
      return glyph;
    return part.length === 1 ? part.toUpperCase() : part;
  }).join(apple ? "" : "+");
};
export { useHotkeys2, GLOBAL_HOTKEYS2, hotkeyLabel2 };
