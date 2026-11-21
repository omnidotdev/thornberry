---
"@omnidotdev/thornberry": minor
---

Add `NativeSelect`, a styled native select for plain form choices.

It is a real `<select>` that matches `Input` (height, border, focus ring, disabled, and `aria-invalid` error styles) with a chevron, so it submits with forms, opens the OS picker on phones, and keeps full keyboard and screen reader support. Pass `options` and an optional `placeholder` for a one-line select, or write `<option>` and `<optgroup>` children. It comes in `sm`, `md`, and `lg` sizes, follows light and dark themes (including the OS dropdown list), and never grows past its container. Every native prop, `ref` included, goes to the `<select>`; `className` sets the width of the control. Import it from `@omnidotdev/thornberry/native-select`.

The Select docs now explain when to use `NativeSelect` (plain form choices) and when to use the Ark `Select` (rich custom option rendering).
