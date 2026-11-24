import { GLOBAL_HOTKEYS } from "../../../registry/thornberry/components/use-hotkeys";
type GlobalHotkey = keyof typeof GLOBAL_HOTKEYS;
interface Shortcut {
    /** `react-hotkeys-hook` binding, e.g. `mod+k` or `shift+slash` */
    keys: string;
    /** What the shortcut does */
    label: string;
}
interface ShortcutGroup {
    title: string;
    /** Hint shown beside the heading (e.g. "Hover a card, then press:") */
    hint?: string;
    shortcuts: Shortcut[];
}
interface ShortcutsDialogProps {
    /**
     * Global hotkeys the app binds, listed first under "General". Defaults to
     * every one except `toggleSidebar`; include it when the app has a sidebar.
     */
    globals?: GlobalHotkey[];
    /** App-wide shortcuts appended to the "General" group */
    general?: Shortcut[];
    /** Product shortcut groups, listed after "General" */
    groups?: ShortcutGroup[];
    /** Controlled open state, e.g. to open the list from the command palette */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
/**
 * Keyboard shortcuts list, opened with `?` (`GLOBAL_HOTKEYS.showShortcuts`).
 * Mount once in the app root, next to the command palette, and pass the
 * product's own shortcuts so every key the app binds is discoverable in one
 * place. Labels render with {@link hotkeyLabel}, so they match the platform.
 */
declare const ShortcutsDialog: ({ globals, general, groups, open: openProp, onOpenChange, }: ShortcutsDialogProps) => import("react/jsx-runtime").JSX.Element;
export { type Shortcut, type ShortcutGroup, ShortcutsDialog };
