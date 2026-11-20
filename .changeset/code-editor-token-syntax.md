---
"@omnidotdev/thornberry": minor
---

`code-editor` adds opt-in token-aware syntax colors to go with `tokenTheme`: `tokenHighlightStyle` (and `tokenSyntax()`, the same style as an editor extension) colors keywords, tags, strings, literals, attributes, properties, comments, and punctuation from the design system's custom properties (`--primary`, `--chart-1` to `--chart-5`, `--muted-foreground`), each with a literal fallback, so code follows the app's palette in light and dark. Pass `theme: [tokenTheme({ dark }), tokenSyntax()]`. `@lezer/highlight` is now a peer dependency, kept external so its identity-keyed tags match the app's language packages.
