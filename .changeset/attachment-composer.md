---
"@omnidotdev/thornberry": minor
---

Add `AttachmentComposer` pieces (`@omnidotdev/thornberry/attachment-composer`) for chat attachments: `useAttachments` (pick, paste a screenshot, or drop files; each read and checked in the browser, with large images scaled down, up to 3 per message), `AttachButton`, `AttachmentList` (removable previews), `AttachmentError`, and `AttachmentDropOverlay`. The limits match the server checks in `@omnidotdev/providers/attachments`. `AiChatThread` takes the controller as `attachments` (plus `attachTitle`) and wires the button, previews, paste, drop, and refusals into its composer; a message with attachments sends without text, and sent attachments render as new `image` and `file` message parts
