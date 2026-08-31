import"../../../chunks/account-user-two-factor-authentication-d1wjbx81.js";

// src/registry/thornberry/components/use-hotkeys.tsx
import { useHotkeys } from "react-hotkeys-hook";
var GLOBAL_HOTKEYS = {
  commandPalette: "mod+k",
  toggleTheme: "t"
};
var isApplePlatform = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
var hotkeyLabel = (hotkey) => {
  const apple = isApplePlatform();
  return hotkey.split("+").map((part) => {
    if (part === "mod")
      return apple ? "⌘" : "Ctrl";
    if (part === "shift")
      return apple ? "⇧" : "Shift";
    if (part === "alt")
      return apple ? "⌥" : "Alt";
    if (part === "ctrl")
      return apple ? "⌃" : "Ctrl";
    return part.length === 1 ? part.toUpperCase() : part;
  }).join(apple ? "" : "+");
};
export {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
  useHotkeys
};
