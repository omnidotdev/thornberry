---
"@omnidotdev/thornberry": minor
---

Add four new components:

- `tree-view`: a data-driven `TreeView` with expandable branches, single or multiple selection, keyboard navigation and typeahead, optional per-node icons and trailing content, and a `fileIcons` file tree style with folder and file icons.
- `qr-code`: a `QrCode` that renders any value as a scannable code, with a `size`, an `errorCorrection` level, and an optional centered `overlay` such as a logo, plus a download trigger part.
- `splitter`: a `Splitter` of resizable panels, horizontal or vertical, with minimum and maximum sizes, collapsible panels, an optional grip handle, and keyboard resizing.
- `steps`: a `Steps` multi-step wizard, horizontal or vertical, showing complete, current, and upcoming steps with per-step content, back and next buttons, and completed content.

The two-factor authentication block now draws its setup QR code with `QrCode`, and the `react-qr-code` dependency is removed.
