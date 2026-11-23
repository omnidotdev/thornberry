---
"@omnidotdev/thornberry": patch
---

`AiChatThread`'s composer inserts a newline on Enter on touch-first devices, where there is no Shift key, and the send button sends. With a hardware keyboard Enter still sends and Shift+Enter adds a line. Cmd/Ctrl+Enter always sends, and Enter never sends while an IME is composing. The decision is exported as `shouldSendOnKey`
