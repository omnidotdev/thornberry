---
"@omnidotdev/thornberry": patch
---

`base.css` falls back to the app's `--border` hairline for border color, so a bare `border` or an unmapped token utility (such as `border-input` in an app that never maps `--color-input`) no longer paints a bright text-colored outline
