---
"@omnidotdev/thornberry": minor
---

Closes gaps products kept local copies for:

- `OptionsSelect`: a single-choice select from a flat list of options (label, hints, disabled options, placeholder), so products stop carrying their own dropdown wrappers; select lists now show their scrollbar like menus do
- `DataTable` takes controlled `sorting`/`onSortingChange` (e.g. sort kept in the URL), `onRowClick`, an `emptyState` that replaces the whole table, `minWidth`, right-aligned columns via `meta.align`, and marks sorted headers with `aria-sort`; `getRowId` is optional
- `ContextMenu`: a right-click menu from a list of items that nests safely inside other menus and context menus
- `Checkbox` and `Tooltip` shorthands (`<Checkbox label>`, `<Tooltip content>`); tooltips wrap longer text instead of clipping to one line
- `CheckboxLabel` takes `className` and wraps long labels with readable line height; the box no longer shrinks beside them
- `Button` gains an `xs` size
- `SheetPortal`, and `SheetBackdrop` ships the standard overlay styling
- A `Card` without a title or description pads its content's top edge
- A wide child (a code editor) no longer stretches a dialog past a phone screen
- `Sidebar` with `collapsible="none"` uses the sidebar background instead of a leftover red debug color, and sidebar menu buttons show a pointer
