---
"@omnidotdev/thornberry": minor
---

feat(ai-describe-panel): show example prompts through `PromptSuggestions`

The describe panel's starter chips now come from the shared `PromptSuggestions`, the same chips `AiChatThread` shows: drawn in a random order each time the panel opens, with **More ideas** to swap in the next set when there are more than fit. `suggestions` also takes `{ label, prompt }` objects, and the new `suggestionCount` sets how many show at once (4 by default). A pick still hands the prompt to `onPickSuggestion`, and now also focuses the prompt so it can be edited before generating; it never generates outright. Existing callers keep working unchanged.
