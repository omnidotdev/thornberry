import { autocompletion } from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";
import type { CompletionSource } from "@codemirror/autocomplete";
import type { Extension } from "@codemirror/state";
/**
 * Config object accepted by `@codemirror/autocomplete`'s `autocompletion()`
 * (e.g. `activateOnTyping`, `maxRenderedOptions`, `override`). Derived from the
 * function signature because the package does not export the interface by name
 */
export type AutocompletionConfig = NonNullable<Parameters<typeof autocompletion>[0]>;
/**
 * Shared CodeMirror 6 code editor. Language and theme are consumer-injected
 * through compartments, so one component serves JS, SQL, JSON, YAML, dotenv, and
 * the rest. Autocompletion ships via `basicSetup` (Ctrl+Space / Mod-Space opens
 * the popup) and completion sources are injectable through `completionSources`.
 *
 * The default theme is palette-free so the component carries no product styling.
 * For a design-system-themed editor, pass the opt-in {@link tokenTheme} as the
 * `theme` prop; it binds editor colors to these CSS custom properties (each with
 * a literal fallback): `--background`, `--foreground`, `--muted`,
 * `--muted-foreground`, `--accent`, `--border`.
 *
 * WebAssembly text (WAST / `.wat`) editing works today by injecting a WAST
 * language extension through the `language` prop (recommended package:
 * `@codemirror/lang-wast`); the component takes no hard dependency on it.
 *
 * ROADMAP: a WASM-powered editor as a whole, not merely editing WAST text. A
 * future where the component's own core and tooling run on WebAssembly, e.g. a
 * Rust/WASM editor and analysis core plus WASM-compiled language servers driving
 * LSP-based completion and diagnostics, is explicitly postponed and not built
 * here yet.
 */
/**
 * How the editor guards against a double-click. A Brave dictionary extension (and
 * similar page-level listeners) pops a definition popup on the `dblclick` event,
 * which is jarring inside a code field. CodeMirror does its own word-select on
 * `mousedown` (via `event.detail`/clickCount), never on `dblclick`, so swallowing
 * the `dblclick` event keeps word-select working while hiding the popup.
 *
 * - `"swallow-dblclick"` (default) swallows the `dblclick` event only, preserving
 *   CodeMirror word-select
 * - `"no-word-select"` cancels the second `mousedown` so double-click word-select
 *   is disabled entirely (stronger, for consumers who want that)
 * - `false` installs no guard
 *
 * NB none of these stop the macOS system "Look Up" gesture: the OS reads the
 * current selection directly, so that remains a browser/OS setting, not something
 * this guard can intercept. The guard targets the extension `dblclick` case only.
 */
export type DoubleClickGuard = "swallow-dblclick" | "no-word-select" | false;
/** Imperative handle returned by {@link createCodeEditor} and the {@link CodeEditor} ref. */
export interface CodeEditorHandle {
    /** Current document text. */
    getValue(): string;
    /** Replace the whole document with `text`. */
    setValue(text: string): void;
    /** Reconfigure the theme compartment live (e.g. on a light/dark toggle). */
    setTheme(theme: Extension): void;
    /** Reconfigure the language compartment live (e.g. switch JSON to YAML). */
    setLanguage(language: Extension): void;
    /** Reconfigure the injectable completion sources live (empty reverts to the language's own). */
    setCompletionSources(sources: CompletionSource[]): void;
    /** Reconfigure the extra extensions compartment live (replaces the previous extras). */
    setExtensions(exts: Extension[]): void;
    /** Reconfigure the read-only state live (also toggles the view's editability). */
    setReadOnly(readOnly: boolean): void;
    /** Reconfigure the placeholder text live (empty string clears it). */
    setPlaceholder(text: string): void;
    /** Reconfigure the content DOM `id` live (empty string clears it). */
    setId(id: string): void;
    /** Focus the editor. */
    focus(): void;
    /** Tear down the underlying CodeMirror view. */
    destroy(): void;
    /** The underlying CodeMirror view. */
    readonly view: EditorView;
}
/** Options for {@link createCodeEditor}. */
export interface CodeEditorOptions {
    /** Initial document text. */
    doc?: string;
    /** Called with the new text whenever the document changes. */
    onChange?: (value: string) => void;
    /** Language extension (e.g. `javascript()`, `sql()`, `json()`); consumer-provided. */
    language?: Extension;
    /** Theme extension(s); falls back to a neutral default when omitted. */
    theme?: Extension;
    /** Extra extensions layered on top (consumer-provided). */
    extensions?: Extension[];
    /**
     * Completion sources to inject (e.g. a product's domain API). When provided,
     * they override the language's own completions via
     * `autocompletion({ override })`; when omitted, `basicSetup`'s autocompletion
     * and the language's completions are used.
     */
    completionSources?: CompletionSource[];
    /**
     * Autocompletion config passed through to `@codemirror/autocomplete`'s
     * `autocompletion()` (e.g. `activateOnTyping`, `maxRenderedOptions`,
     * `override`). When provided, the completion compartment wires
     * `autocompletion(config)` so completion is configured without layering a
     * second `autocompletion()` in `extensions`. If `completionSources` is also
     * given, it is merged in as the config's `override`. Applied at mount;
     * `setCompletionSources` still reconfigures the override live
     */
    autocompletion?: AutocompletionConfig;
    /** Whether the document is read-only. */
    readOnly?: boolean;
    /** Placeholder shown when the document is empty (CodeMirror `placeholder()` extension). */
    placeholder?: string;
    /** `id` set on the editor's content DOM, so a form label's `htmlFor` can target it. */
    id?: string;
    /** Double-click guard mode (see {@link DoubleClickGuard}); defaults to `"swallow-dblclick"`. */
    guardDoubleClick?: DoubleClickGuard;
}
/**
 * Opt-in token-aware theme that binds the editor's colors to the design-system
 * CSS custom properties, so an app gets a themed editor without hand-rolling one.
 * Pass it as the `theme` prop/option; it does NOT replace the palette-free
 * {@link neutralTheme} default, so consumers that inject their own theme are
 * unaffected.
 *
 * CSS custom properties read (each with a literal fallback via `var(--x, …)`):
 * - `--background`: editor + gutter background
 * - `--foreground`: text, caret, and active-line gutter text
 * - `--muted`: active line and active-line-gutter background
 * - `--muted-foreground`: gutter text
 * - `--accent`: selection background
 * - `--border`: gutter border
 *
 * @param opts.dark marks the theme dark so CodeMirror picks dark-appropriate
 *   defaults for anything not bound here (defaults to `false`)
 */
export declare const tokenTheme: (opts?: {
    dark?: boolean;
}) => Extension;
/**
 * Build the double-click guard extension for a given mode. Exported so the guard
 * logic can be exercised without mounting a full editor
 */
export declare const createDoubleClickGuard: (mode?: DoubleClickGuard) => Extension;
/**
 * Create a CodeMirror 6 code editor mounted into `parent`. Language and theme are
 * consumer-injected through compartments, so one editor serves JS, SQL, JSON,
 * YAML, dotenv, and the rest, and `setTheme`/`setLanguage` reconfigure it live
 */
export declare function createCodeEditor(parent: HTMLElement, opts?: CodeEditorOptions): CodeEditorHandle;
/** Props for the {@link CodeEditor} React wrapper. */
export interface CodeEditorProps {
    /** Controlled document text; dispatches a replace when it differs from the doc. */
    value?: string;
    /** Initial document text for an uncontrolled editor. */
    defaultValue?: string;
    /** Called with the new text whenever the document changes. */
    onChange?: (value: string) => void;
    /** Language extension (consumer-provided). */
    language?: Extension;
    /** Theme extension(s); falls back to a neutral default when omitted. */
    theme?: Extension;
    /** Extra extensions layered on top (consumer-provided). */
    extensions?: Extension[];
    /** Completion sources to inject; override the language's own completions when provided. */
    completionSources?: CompletionSource[];
    /** Autocompletion config passed through to `autocompletion()` (see {@link CodeEditorOptions.autocompletion}). */
    autocompletion?: AutocompletionConfig;
    /** Whether the document is read-only; reconfigures live when it changes. */
    readOnly?: boolean;
    /** Placeholder shown when the document is empty; reconfigures live when it changes. */
    placeholder?: string;
    /** `id` set on the editor's content DOM (for a label's `htmlFor`); reconfigures live when it changes. */
    id?: string;
    /** Double-click guard mode (see {@link DoubleClickGuard}); defaults to `"swallow-dblclick"`. */
    guardDoubleClick?: DoubleClickGuard;
    /** Class applied to the mount element. */
    className?: string;
}
/**
 * Thin React wrapper over {@link createCodeEditor}. Mounts the editor into a div,
 * forwards the imperative handle via a ref, and keeps a controlled `value` in sync
 */
export declare const CodeEditor: import("react").ForwardRefExoticComponent<CodeEditorProps & import("react").RefAttributes<CodeEditorHandle>>;
