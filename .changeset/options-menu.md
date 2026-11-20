---
"@omnidotdev/thornberry": minor
---

feat(options-menu): add a settings menu for a composer's secondary choices

`OptionsMenu` is a small icon trigger (sliders, named "Options") that opens a popover of secondary settings beside a composer's send button, so the main row keeps only the prompt, attach, and send. `OptionsMenuChoice` is a radio group for one setting, each row with a plain name, an optional hint such as a relative cost, and a one-line description. Touch targets are 44px, the menu is portaled so a clipped composer never cuts it off, and the host owns and persists every value.

fix(ai-describe-panel): stack the footer on phones

On a narrow screen the describe panel's meta (credit balance, cost estimate) now sits above Cancel and Generate instead of being squeezed into a narrow column beside them, and the footer buttons get 44px touch targets.
