---
"@omnidotdev/thornberry": minor
---

Closes gaps products kept local copies for:

- One scrollbar look across the fleet: `base.css` makes scrollbars thin with a muted, theme-following thumb on a clear track, and ships the `no-scrollbar` utility so it means the same in every app; tables no longer hide their horizontal scrollbar

- `OptionsSelect`: a single-choice select from a flat list of options (label, hints, disabled options, placeholder), so products stop carrying their own dropdown wrappers; its list mounts on open so it stays above a dialog it sits in; select lists now show their scrollbar like menus do
- `DataTable` takes controlled `sorting`/`onSortingChange` (e.g. sort kept in the URL), `onRowClick`, an `emptyState` that replaces the whole table, `minWidth`, right-aligned columns via `meta.align`, and marks sorted headers with `aria-sort`; `getRowId` is optional
- `OptionsCombobox` (items with descriptions, opens on click, empty state, list matches the input width so long labels truncate) and a `ComboboxEmpty` part
- `Skeleton` uses the muted surface instead of the accent color (which read red or teal in branded apps), and `Switch` shows a disabled state
- `ContextMenu`: a right-click menu from a list of items that nests safely inside other menus and context menus
- `Checkbox` and `Tooltip` shorthands (`<Checkbox label>` with an indeterminate dash, `<Tooltip content>`); tooltips wrap longer text instead of clipping to one line
- `CheckboxLabel` takes `className` and wraps long labels with readable line height; the box no longer shrinks beside them
- `Button` gains an `xs` size
- `SheetPortal`, `SheetBackdrop` ships the standard overlay styling, and sheets close when swiped toward their edge on touch screens (`swipeToClose={false}` opts out)
- A `Card` without a title or description pads its content's top edge
- A wide child (a code editor) no longer stretches a dialog past a phone screen, and dialog text uses the foreground color (titles were unreadable in dark-only apps)
- `Sidebar` no longer flashes the desktop panel on phones before hydration, its phone drawer is wider (`w-5/6 max-w-xs`, overridable with `mobileClassName`) and has a backdrop
- `Sidebar` with `collapsible="none"` uses the sidebar background instead of a leftover red debug color, and sidebar menu buttons show a pointer
