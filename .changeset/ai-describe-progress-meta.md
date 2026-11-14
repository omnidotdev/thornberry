---
"@omnidotdev/thornberry": minor
---

feat(ai-describe-panel): add a live `pendingLabel` status and a footer `meta` slot

The describe-to-draft panel now surfaces host-driven progress and context so a
multi-step generation no longer reads as a frozen spinner:

- `pendingLabel`: a short live status shown beside the spinner while `isPending`
  (e.g. "Generating", "Checking the render", "Refining"), so the host can
  narrate a multi-call pipeline.
- `meta`: a persistent footer slot, left of the actions, for the context a user
  weighs right before spending (a credit balance, a per-run cost estimate). It
  is hidden while pending so the live status takes its place, and the actions
  never shift.

Both are optional and presentational; existing callers are unaffected.
