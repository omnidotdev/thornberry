---
"@omnidotdev/thornberry": minor
---

`WorkspaceSwitcher` covers what every Omni app needs, so apps can drop their own switchers:

- `actions` adds entries below the list, such as "New workspace" or "All workspaces". Each one is a link (in a new tab when `external`) or an in-app callback.
- A workspace's `description` shows in place of its `@handle` (for example the viewer's role), and its `badge` tags the name (for example "Personal").
- `onItemIntent` is called when a workspace is highlighted, before it is chosen, so you can preload its route.
- With no active workspace, the trigger shows `placeholder` and still opens the list. With no workspaces but some actions, the menu offers just the actions.
- `hideWhenSingle` renders nothing for a single workspace instead of a static label. A single workspace with actions now opens a menu.
- In a collapsed icon sidebar, the sidebar variant shrinks to the avatar and opens its menu beside the rail.
- The trigger is named "<workspace>, switch workspace" for screen readers.

`WorkspaceSwitcher` now has a docs page and a registry entry.
