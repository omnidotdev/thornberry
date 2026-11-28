---
"@omnidotdev/thornberry": minor
---

New `SpendingLimitCard`: a workspace's spending limit for one product, shared by every Omni product that bills usage past its plan. It shows overage spent this billing period against the monthly cap with a progress bar, when the period ends, and a paused notice once the cap is reached. Owners and admins set, raise, or lower the cap ($10 to $100,000) with validation, and confirm before a cap at or below the spend so far pauses usage; there is no way to remove a cap. `variant="row"` fits one product per line in a list, and `withSoftLimit` also edits an alert threshold. The component is presentational: the product passes the value and saves through `onSave`
