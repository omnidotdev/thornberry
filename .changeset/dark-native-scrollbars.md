---
"@omnidotdev/thornberry": patch
---

`base.css` sets `color-scheme: dark` under the dark theme (`.dark` or `data-theme="dark"`), so scrollbars and native form controls render dark in dark mode instead of light-on-dark, in the command palette, menus, and every other scroll container.
