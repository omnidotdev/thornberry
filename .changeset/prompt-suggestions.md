---
"@omnidotdev/thornberry": minor
---

Add `prompt-suggestions`: example prompt chips for an empty composer. It shows a few concrete examples drawn in a random order per visit, a More ideas control that cycles through the rest, and hands a picked example's prompt to the host to draft for editing rather than sending. Each chip gets a 44px target on touch screens. `AiChatThread` takes optional `suggestions` (and `suggestionCount`) and shows them above its composer while the thread is empty and the composer is blank; a pick drafts the prompt and focuses the composer.
