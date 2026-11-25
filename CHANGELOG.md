# @omnidotdev/thornberry

## 0.3.0

### Minor Changes

- [#129](https://github.com/omnidotdev/thornberry/pull/129) [`235f78b`](https://github.com/omnidotdev/thornberry/commit/235f78b5574da27c1714e3f704b8e5324f6400e1) Thanks [@coopbri](https://github.com/coopbri)! - `AccountMenu` can list the other accounts signed in on the browser (`accounts` with `onSelectAccount`), so switching takes one click, and splits sign-out when other accounts are signed in: Sign out ends only this account, and Sign out of all accounts (`onSignOutAll`, `signOutAllLabel`) ends every one

- [#125](https://github.com/omnidotdev/thornberry/pull/125) [`a527180`](https://github.com/omnidotdev/thornberry/commit/a52718027d57ad238d17aedb3897a8a3e4ada995) Thanks [@coopbri](https://github.com/coopbri)! - `AccountMenu` takes an optional `onSwitchAccount` (and `switchAccountLabel`), which adds a Switch account entry just above Sign out for apps that let people change which Omni account they use

- [#118](https://github.com/omnidotdev/thornberry/pull/118) [`911f1f5`](https://github.com/omnidotdev/thornberry/commit/911f1f57ba2de998a2832aa45724f75dfb2e220e) Thanks [@coopbri](https://github.com/coopbri)! - Add `account-profile-settings` and `account-security-settings` blocks: full Profile (avatar, name, username, email change) and Security (password, two-factor with backup codes, passkeys, active sessions) settings pages, so an identity server and a relying-party account app render the same account page

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - `Card` and `Avatar` shorthands for the layouts products use most: `<Card title description footer>` puts its children in the content, and `<Avatar src alt fallback>` renders the image over its fallback. Both are built on the composable parts, which stay available for any other layout.

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - `ConfirmDialog` covers what products kept local copies for: `error` shows a failed attempt's message above the actions, `pendingLabel` labels the in-flight confirm button (e.g. "Deleting..."), and `confirmVariant` styles the confirm button for confirmations that are irreversible but not destructive. It now renders with the `alertdialog` role, mounts only while open, and still cancels on an outside click or Escape (newer Ark versions ignore outside clicks on alert dialogs by default).

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - Closes gaps products kept local copies for:
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

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - `GLOBAL_HOTKEYS` now includes `toggleSidebar` (`b`) and `showShortcuts` (`shift+slash`, the `?` key), so every Omni app binds the sidebar and the shortcuts list the same way. The sidebar reads its shortcut from it.

- [#127](https://github.com/omnidotdev/thornberry/pull/127) [`4b7b5fa`](https://github.com/omnidotdev/thornberry/commit/4b7b5fa8e86e1e4c6a4db4c383a0e923a7c49c93) Thanks [@coopbri](https://github.com/coopbri)! - `Image` supports blur-up: pass `lqip` (a tiny data URI made at upload) and a smoothly blurred preview fills the image box until it loads, with no wrapper and no layout change. `blurUpStyle` exposes the same placeholder for images drawn another way

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - New `ShortcutsDialog`: the standard keyboard shortcuts list, opened with `?` (`GLOBAL_HOTKEYS.showShortcuts`). It lists the global hotkeys an app binds, then the app's own shortcut groups, with platform-correct key labels.

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - New `Textarea`: a multi-line text control styled to match `Input`, with an `aria-invalid` error state. `TextareaField` in `form` now renders it.

### Patch Changes

- [#122](https://github.com/omnidotdev/thornberry/pull/122) [`8efd5b7`](https://github.com/omnidotdev/thornberry/commit/8efd5b768367a30728a63a929b44655e98ff9543) Thanks [@coopbri](https://github.com/coopbri)! - `base.css` falls back to the app's `--border` hairline for border color, so a bare `border` or an unmapped token utility (such as `border-input` in an app that never maps `--color-input`) no longer paints a bright text-colored outline

- [#122](https://github.com/omnidotdev/thornberry/pull/122) [`8efd5b7`](https://github.com/omnidotdev/thornberry/commit/8efd5b768367a30728a63a929b44655e98ff9543) Thanks [@coopbri](https://github.com/coopbri)! - `AiChatThread`'s composer inserts a newline on Enter on touch-first devices, where there is no Shift key, and the send button sends. With a hardware keyboard Enter still sends and Shift+Enter adds a line. Cmd/Ctrl+Enter always sends, and Enter never sends while an IME is composing. The decision is exported as `shouldSendOnKey`

- [#122](https://github.com/omnidotdev/thornberry/pull/122) [`8efd5b7`](https://github.com/omnidotdev/thornberry/commit/8efd5b768367a30728a63a929b44655e98ff9543) Thanks [@coopbri](https://github.com/coopbri)! - `AiChatThread` hides its `footerHint` on touch-first devices, where an on-screen keyboard has no Shift+Enter, so keep the hint to keyboard tips

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - `base.css` sets `color-scheme: dark` under the dark theme (`.dark` or `data-theme="dark"`), so scrollbars and native form controls render dark in dark mode instead of light-on-dark, in the command palette, menus, and every other scroll container.

- [#124](https://github.com/omnidotdev/thornberry/pull/124) [`75eb5c2`](https://github.com/omnidotdev/thornberry/commit/75eb5c2019eeffeeff17b340e5c7451a8cff5bf7) Thanks [@coopbri](https://github.com/coopbri)! - Dialogs keep a gutter and rounded corners on narrow screens instead of running edge to edge on a phone, and a dialog taller than the screen scrolls instead of pushing its actions out of reach.

- [#128](https://github.com/omnidotdev/thornberry/pull/128) [`4a4aabc`](https://github.com/omnidotdev/thornberry/commit/4a4aabc8681cc56eedcd967c71774499a2fbe235) Thanks [@coopbri](https://github.com/coopbri)! - `Image` and `blurUpStyle` only use an `lqip` that is a small base64 image data URI; anything else (a URL, SVG, or an oversized value) shows no placeholder, since previews can come from stored user data

## 0.2.0

### Minor Changes

- [#100](https://github.com/omnidotdev/thornberry/pull/100) [`e1a6c63`](https://github.com/omnidotdev/thornberry/commit/e1a6c63da9857cd0f7ca919eb0551057aefdae88) Thanks [@coopbri](https://github.com/coopbri)! - `AccountMenu` takes `variant="sidebar"`: a full-width row with the avatar, name, and email for a sidebar footer, opening the same menu to the right and shrinking to the avatar in a collapsed icon sidebar.

  `WorkspaceSwitcher` workspaces take an optional `slug`, shown as `@handle` under each name in the list, and the "Manage workspaces" link is now a menu entry you can reach with the keyboard.

- [#99](https://github.com/omnidotdev/thornberry/pull/99) [`72f8d3a`](https://github.com/omnidotdev/thornberry/commit/72f8d3a87cf626b4902ca64600b98a01f988a472) Thanks [@coopbri](https://github.com/coopbri)! - Add `account-menu`, the standard Omni account menu: the signed-in user's avatar (with up to two initials while no image loads) opens a menu headed by their name and email, followed by the app's own destinations (`AccountMenuItem`, which wraps any router link with `asChild`), an optional "Manage account" link to the account hub, and Sign out. Every entry is keyboard reachable and gets a 44px target on touch screens.

  `MenuTrigger` now shows a pointer cursor, a keyboard focus ring, and a disabled state, and `MenuRadioItem` highlights on hover and keyboard focus like the other menu items.

- [#81](https://github.com/omnidotdev/thornberry/pull/81) [`606a5fd`](https://github.com/omnidotdev/thornberry/commit/606a5fd1a6f4466b1b69951625d1fe4b74e827fb) Thanks [@coopbri](https://github.com/coopbri)! - feat(ai-describe-panel): add a live `pendingLabel` status and a footer `meta` slot

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

- [#80](https://github.com/omnidotdev/thornberry/pull/80) [`5153f5b`](https://github.com/omnidotdev/thornberry/commit/5153f5b29e7130f8d2cd9030f06ba38e017e56f8) Thanks [@coopbri](https://github.com/coopbri)! - Add a `lineWrapping` option to the code editor so long lines can soft-wrap instead of scrolling sideways.

- [#103](https://github.com/omnidotdev/thornberry/pull/103) [`f2de8b6`](https://github.com/omnidotdev/thornberry/commit/f2de8b63331fda9606429168801da977389d3cd1) Thanks [@coopbri](https://github.com/coopbri)! - `code-editor` adds opt-in token-aware syntax colors to go with `tokenTheme`: `tokenHighlightStyle` (and `tokenSyntax()`, the same style as an editor extension) colors keywords, tags, strings, literals, attributes, properties, comments, and punctuation from the design system's custom properties (`--primary`, `--chart-1` to `--chart-5`, `--muted-foreground`), each with a literal fallback, so code follows the app's palette in light and dark. Pass `theme: [tokenTheme({ dark }), tokenSyntax()]`. `@lezer/highlight` is now a peer dependency, kept external so its identity-keyed tags match the app's language packages.

- [#105](https://github.com/omnidotdev/thornberry/pull/105) [`df4a02e`](https://github.com/omnidotdev/thornberry/commit/df4a02e524039e709fe85119978c0f3ee9f1ce70) Thanks [@coopbri](https://github.com/coopbri)! - feat(ai-describe-panel): show example prompts through `PromptSuggestions`

  The describe panel's starter chips now come from the shared `PromptSuggestions`, the same chips `AiChatThread` shows: drawn in a random order each time the panel opens, with **More ideas** to swap in the next set when there are more than fit. `suggestions` also takes `{ label, prompt }` objects, and the new `suggestionCount` sets how many show at once (4 by default). A pick still hands the prompt to `onPickSuggestion`, and now also focuses the prompt so it can be edited before generating; it never generates outright. Existing callers keep working unchanged.

- [#84](https://github.com/omnidotdev/thornberry/pull/84) [`6e01c83`](https://github.com/omnidotdev/thornberry/commit/6e01c832048b4ef80564e95c0d17faf6872e670e) Thanks [@coopbri](https://github.com/coopbri)! - Upgrade the rich text editor to Lexical 0.53. Consumers must install Lexical 0.53 or newer (peer range raised to >=0.53.0).

- [#107](https://github.com/omnidotdev/thornberry/pull/107) [`b6d3b75`](https://github.com/omnidotdev/thornberry/commit/b6d3b75b0e4b22c1367e569eac434c048c668f06) Thanks [@coopbri](https://github.com/coopbri)! - Add `NativeSelect`, a styled native select for plain form choices.

  It is a real `<select>` that matches `Input` (height, border, focus ring, disabled, and `aria-invalid` error styles) with a chevron, so it submits with forms, opens the OS picker on phones, and keeps full keyboard and screen reader support. Pass `options` and an optional `placeholder` for a one-line select, or write `<option>` and `<optgroup>` children. It comes in `sm`, `md`, and `lg` sizes, follows light and dark themes (including the OS dropdown list), and never grows past its container. Every native prop, `ref` included, goes to the `<select>`; `className` sets the width of the control. Import it from `@omnidotdev/thornberry/native-select`.

  The Select docs now explain when to use `NativeSelect` (plain form choices) and when to use the Ark `Select` (rich custom option rendering).

- [#106](https://github.com/omnidotdev/thornberry/pull/106) [`fb4f9ea`](https://github.com/omnidotdev/thornberry/commit/fb4f9ea586cbc516a82d27607fe83c53f675f286) Thanks [@coopbri](https://github.com/coopbri)! - feat(options-menu): add a settings menu for a composer's secondary choices

  `OptionsMenu` is a small icon trigger (sliders, named "Options") that opens a popover of secondary settings beside a composer's send button, so the main row keeps only the prompt, attach, and send. `OptionsMenuChoice` is a radio group for one setting, each row with a plain name, an optional hint such as a relative cost, and a one-line description. Touch targets are 44px, the menu is portaled so a clipped composer never cuts it off, and the host owns and persists every value.

  fix(ai-describe-panel): stack the footer on phones

  On a narrow screen the describe panel's meta (credit balance, cost estimate) now sits above Cancel and Generate instead of being squeezed into a narrow column beside them, and the footer buttons get 44px touch targets.

- [#94](https://github.com/omnidotdev/thornberry/pull/94) [`273b64e`](https://github.com/omnidotdev/thornberry/commit/273b64ee575b125b6f8c1e84e4bc424973306f9b) Thanks [@coopbri](https://github.com/coopbri)! - Add five new components:
  - `progress`: a linear `Progress` bar and a `CircularProgress` ring, each with determinate and indeterminate states, an optional label and value text, and `sm`/`md`/`lg` sizes.
  - `scroll-area`: a `ScrollArea` container with styled vertical and horizontal scrollbars.
  - `segment-group`: a pill-style `SegmentGroup` segmented control whose indicator slides to the selected option.
  - `toggle` and `toggle-group`: a `Toggle` button and a `ToggleGroup` with single or multiple selection, in `ghost`, `outline`, and `solid` variants sized to match buttons.
  - `clipboard`: a `Clipboard` read-only field with a copy button, plus a standalone `CopyButton` that copies a value and briefly shows a check, so a copy button no longer needs to be hand-rolled.

- [#102](https://github.com/omnidotdev/thornberry/pull/102) [`890142a`](https://github.com/omnidotdev/thornberry/commit/890142a455b73714c6db44110e778049766495c2) Thanks [@coopbri](https://github.com/coopbri)! - Add `prompt-suggestions`: example prompt chips for an empty composer. It shows a few concrete examples drawn in a random order per visit, a More ideas control that cycles through the rest, and hands a picked example's prompt to the host to draft for editing rather than sending. Each chip gets a 44px target on touch screens. `AiChatThread` takes optional `suggestions` (and `suggestionCount`) and shows them above its composer while the thread is empty and the composer is blank; a pick drafts the prompt and focuses the composer.

- [#109](https://github.com/omnidotdev/thornberry/pull/109) [`1894bc9`](https://github.com/omnidotdev/thornberry/commit/1894bc9e7ec1785830bd52a329bee69155d725a0) Thanks [@coopbri](https://github.com/coopbri)! - Add call-to-action buttons to the rich text editor.

  Pass `buttons` to `RichTextEditor` to get an "Insert button" toolbar control that takes button text and a link. Each button is a block of its own and exports as `<p><a href="…" data-variant="button">Label</a></p>`, so your email template or sanitizer styles it. Links must be `https://` or `mailto:` (never `javascript:`, `data:`, or plain `http://`), and `isAllowedHref` can narrow them further, for example to your own domains. Click a button, or select it with the arrow keys and press Enter, to edit its text and link or remove it. Without `buttons`, the editor is unchanged and button links load as ordinary links. `RichTextContent` keeps `data-variant="button"` only on `https://` and `mailto:` links and renders them as pills.

- [#104](https://github.com/omnidotdev/thornberry/pull/104) [`dc40b52`](https://github.com/omnidotdev/thornberry/commit/dc40b522d076c672238d93824569d78fb9e1d639) Thanks [@coopbri](https://github.com/coopbri)! - Add images to the rich text editor and a new date time picker.

  Pass `images` to `RichTextEditor` to upload, paste, drop, or link images. Images are blocks of their own with required alt text, width presets, and keyboard access (select one with the arrow keys, then press Enter). They export as email-safe HTML with https sources only; `isAllowedSrc` keeps every exported image on your own host, and images from elsewhere wait for an uploaded copy (`hasExternalImages`). `onUpdate` also reports `hasMissingAltText` and `isUploading` so sending can wait. Without `images`, the editor is unchanged. `RichTextContent` renders images only with the new `allowImages` prop.

  `DateTimePicker` picks a date and a time in an explicit time zone and reports an ISO 8601 string with offset. It reads times in the locale's own format, explains daylight saving gaps and repeats, keeps the same moment when the time zone changes, and supports `minValue="now"` and `maxValue` limits.

- [#95](https://github.com/omnidotdev/thornberry/pull/95) [`ecf521f`](https://github.com/omnidotdev/thornberry/commit/ecf521f223b886365f2a415d9247bbc52083f899) Thanks [@coopbri](https://github.com/coopbri)! - Add four new components:
  - `tree-view`: a data-driven `TreeView` with expandable branches, single or multiple selection, keyboard navigation and typeahead, optional per-node icons and trailing content, and a `fileIcons` file tree style with folder and file icons.
  - `qr-code`: a `QrCode` that renders any value as a scannable code, with a `size`, an `errorCorrection` level, and an optional centered `overlay` such as a logo, plus a download trigger part.
  - `splitter`: a `Splitter` of resizable panels, horizontal or vertical, with minimum and maximum sizes, collapsible panels, an optional grip handle, and keyboard resizing.
  - `steps`: a `Steps` multi-step wizard, horizontal or vertical, showing complete, current, and upcoming steps with per-step content, back and next buttons, and completed content.

  The two-factor authentication block now draws its setup QR code with `QrCode`, and the `react-qr-code` dependency is removed.

- [`15c01ea`](https://github.com/omnidotdev/thornberry/commit/15c01ea8f770655efd8f969a4ee76ce3a86bebec) Thanks [@coopbri](https://github.com/coopbri)! - Add a workspace banner editor to account organizations

- [#113](https://github.com/omnidotdev/thornberry/pull/113) [`6be0d1c`](https://github.com/omnidotdev/thornberry/commit/6be0d1c6055304e9cb199601ed9021751694a94b) Thanks [@coopbri](https://github.com/coopbri)! - `WorkspaceSwitcher` covers what every Omni app needs, so apps can drop their own switchers:
  - `actions` adds entries below the list, such as "New workspace" or "All workspaces". Each one is a link (in a new tab when `external`) or an in-app callback.
  - A workspace's `description` shows in place of its `@handle` (for example the viewer's role), and its `badge` tags the name (for example "Personal").
  - `onItemIntent` is called when a workspace is highlighted, before it is chosen, so you can preload its route.
  - With no active workspace, the trigger shows `placeholder` and still opens the list. With no workspaces but some actions, the menu offers just the actions.
  - `hideWhenSingle` renders nothing for a single workspace instead of a static label. A single workspace with actions now opens a menu.
  - In a collapsed icon sidebar, the sidebar variant shrinks to the avatar and opens its menu beside the rail.
  - The trigger is named "<workspace>, switch workspace" for screen readers.

  `WorkspaceSwitcher` now has a docs page and a registry entry.

### Patch Changes

- [#101](https://github.com/omnidotdev/thornberry/pull/101) [`0a4bce5`](https://github.com/omnidotdev/thornberry/commit/0a4bce5280f1a557dfaf3ab9d1bfc48a427c159e) Thanks [@coopbri](https://github.com/coopbri)! - In a collapsed icon sidebar, the `AccountMenu` sidebar row now keeps the user's name for screen readers instead of removing it, so the avatar-only row still has an accessible name.

- [#88](https://github.com/omnidotdev/thornberry/pull/88) [`2eaa5a2`](https://github.com/omnidotdev/thornberry/commit/2eaa5a222f31ccdfd956e01ceb933d5d6e75f76f) Thanks [@coopbri](https://github.com/coopbri)! - Update dependencies (Biome, lucide icons, elkjs, devtools) and give the two-factor "Learn more" link a descriptive label.

- [#92](https://github.com/omnidotdev/thornberry/pull/92) [`20fbff4`](https://github.com/omnidotdev/thornberry/commit/20fbff4879054af57fb063318ea7fc9d734156e4) Thanks [@coopbri](https://github.com/coopbri)! - Update tooling and docs dependencies to their latest major versions (TypeScript 7, Vite 8, lucide 1, fumadocs, Tailwind 4.3).

- [#112](https://github.com/omnidotdev/thornberry/pull/112) [`5b57f6c`](https://github.com/omnidotdev/thornberry/commit/5b57f6c6b4b445d4b3b1958e15b4b465569d279c) Thanks [@coopbri](https://github.com/coopbri)! - `Menu` panels now fit the space left in the viewport and scroll when their entries don't fit. Before, a long menu ran off screen and its lower entries couldn't be reached.

  `WorkspaceSwitcher` scrolls its list of workspaces on its own, with the "Workspaces" heading and the "Manage workspaces" link always in view.

- [#98](https://github.com/omnidotdev/thornberry/pull/98) [`37e4906`](https://github.com/omnidotdev/thornberry/commit/37e490639176410735b0f1c5619a6c305e0adc3b) Thanks [@coopbri](https://github.com/coopbri)! - Move to the `@omnidotdev/providers` v0.2.0 release.

- [#114](https://github.com/omnidotdev/thornberry/pull/114) [`2f56f50`](https://github.com/omnidotdev/thornberry/commit/2f56f507fd32ed41946008c10f698b2fa59e6649) Thanks [@coopbri](https://github.com/coopbri)! - Installing a component from the Thornberry registry with `shadcn add` now brings its current source and every package and local file it needs. Several entries had been missing dependencies or shipping outdated code, and eight components (including the AI chat thread, calendar, and command palette) were missing from the registry.

- [#108](https://github.com/omnidotdev/thornberry/pull/108) [`87cc2d6`](https://github.com/omnidotdev/thornberry/commit/87cc2d6d3a4032acb69b58b8a1134ffede778282) Thanks [@coopbri](https://github.com/coopbri)! - Apps using Thornberry no longer need to install `class-variance-authority`, `clsx`, `@internationalized/date`, or `@omnidotdev/cadence` themselves for component types to resolve.

- [#97](https://github.com/omnidotdev/thornberry/pull/97) [`2f1621f`](https://github.com/omnidotdev/thornberry/commit/2f1621fe261933f62da7358df33119ee3892a4be) Thanks [@coopbri](https://github.com/coopbri)! - The "Scheduled for deletion" banner now shows the exact date the workspace will be permanently deleted (for example "December 6, 2026") instead of an approximate one, and says that restoring cancels the deletion.
