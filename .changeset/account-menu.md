---
"@omnidotdev/thornberry": minor
---

Add `account-menu`, the standard Omni account menu: the signed-in user's avatar (with up to two initials while no image loads) opens a menu headed by their name and email, followed by the app's own destinations (`AccountMenuItem`, which wraps any router link with `asChild`), an optional "Manage account" link to the account hub, and Sign out. Every entry is keyboard reachable and gets a 44px target on touch screens.

`MenuTrigger` now shows a pointer cursor, a keyboard focus ring, and a disabled state, and `MenuRadioItem` highlights on hover and keyboard focus like the other menu items.
