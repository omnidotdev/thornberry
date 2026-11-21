---
"@omnidotdev/thornberry": minor
---

Add call-to-action buttons to the rich text editor.

Pass `buttons` to `RichTextEditor` to get an "Insert button" toolbar control that takes button text and a link. Each button is a block of its own and exports as `<p><a href="…" data-variant="button">Label</a></p>`, so your email template or sanitizer styles it. Links must be `https://` or `mailto:` (never `javascript:`, `data:`, or plain `http://`), and `isAllowedHref` can narrow them further, for example to your own domains. Click a button, or select it with the arrow keys and press Enter, to edit its text and link or remove it. Without `buttons`, the editor is unchanged and button links load as ordinary links. `RichTextContent` keeps `data-variant="button"` only on `https://` and `mailto:` links and renders them as pills.
