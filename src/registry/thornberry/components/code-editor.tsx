import { autocompletion } from "@codemirror/autocomplete";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

import type { CompletionSource } from "@codemirror/autocomplete";
import type { Extension } from "@codemirror/state";

/**
 * Config object accepted by `@codemirror/autocomplete`'s `autocompletion()`
 * (e.g. `activateOnTyping`, `maxRenderedOptions`, `override`). Derived from the
 * function signature because the package does not export the interface by name
 */
export type AutocompletionConfig = NonNullable<
  Parameters<typeof autocompletion>[0]
>;

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
 * Neutral default theme used when no `theme` is supplied. Deliberately palette-free
 * (monospace font and a removed focus outline only) so the component carries no
 * product styling; consumers inject their own theme extension
 */
const neutralTheme = EditorView.theme({
  "&": {
    fontSize: "0.8125rem",
  },
  ".cm-content": {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  },
  "&.cm-focused": {
    outline: "none",
  },
});

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
export const tokenTheme = (opts: { dark?: boolean } = {}): Extension =>
  EditorView.theme(
    {
      "&": {
        backgroundColor: "var(--background, #ffffff)",
        color: "var(--foreground, #0a0a0a)",
      },
      ".cm-content": {
        caretColor: "var(--foreground, #0a0a0a)",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--foreground, #0a0a0a)",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        {
          backgroundColor: "var(--accent, #d4d4d8)",
        },
      ".cm-activeLine": {
        backgroundColor: "var(--muted, #f4f4f5)",
      },
      ".cm-gutters": {
        backgroundColor: "var(--background, #ffffff)",
        color: "var(--muted-foreground, #71717a)",
        borderRight: "1px solid var(--border, #e4e4e7)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "var(--muted, #f4f4f5)",
        color: "var(--foreground, #0a0a0a)",
      },
    },
    { dark: opts.dark ?? false },
  );

/**
 * Build the double-click guard extension for a given mode. Exported so the guard
 * logic can be exercised without mounting a full editor
 */
export const createDoubleClickGuard = (
  mode: DoubleClickGuard = "swallow-dblclick",
): Extension => {
  if (mode === false) return [];

  if (mode === "no-word-select") {
    // Cancel the second mousedown of a double-click, which is the gesture
    // CodeMirror uses to select a word, so word-select is disabled entirely
    return EditorView.domEventHandlers({
      mousedown(event) {
        if (event.detail === 2) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    });
  }

  // "swallow-dblclick": swallow only the dblclick event a dictionary extension
  // listens on. CodeMirror selects a word on mousedown (clickCount via
  // event.detail), NOT on dblclick, so word-select keeps working here
  return EditorView.domEventHandlers({
    dblclick(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    },
  });
};

/**
 * Create a CodeMirror 6 code editor mounted into `parent`. Language and theme are
 * consumer-injected through compartments, so one editor serves JS, SQL, JSON,
 * YAML, dotenv, and the rest, and `setTheme`/`setLanguage` reconfigure it live
 */
export function createCodeEditor(
  parent: HTMLElement,
  opts: CodeEditorOptions = {},
): CodeEditorHandle {
  const {
    doc = "",
    onChange,
    language,
    theme,
    extensions = [],
    completionSources,
    autocompletion: autocompletionConfig,
    readOnly = false,
    placeholder: placeholderText,
    id,
    guardDoubleClick = "swallow-dblclick",
  } = opts;

  const themeCompartment = new Compartment();
  const languageCompartment = new Compartment();
  const extrasCompartment = new Compartment();
  const completionCompartment = new Compartment();
  const readOnlyCompartment = new Compartment();
  const placeholderCompartment = new Compartment();
  const idCompartment = new Compartment();

  // Wire completion from the (mount-time) config and the live sources. With a
  // config, pass it through to autocompletion() and merge any sources in as its
  // override; without a config, keep the original sources-only path (empty
  // reverts to basicSetup's autocompletion and the language's own completions)
  const completionExtension = (sources?: CompletionSource[]): Extension => {
    if (autocompletionConfig) {
      return autocompletion(
        sources?.length
          ? { ...autocompletionConfig, override: sources }
          : autocompletionConfig,
      );
    }
    return sources?.length ? autocompletion({ override: sources }) : [];
  };

  // Read-only also toggles editability so a read-only view is not focusable for
  // text entry; both live in one compartment so setReadOnly reconfigures them
  const readOnlyExtension = (value: boolean): Extension => [
    EditorState.readOnly.of(value),
    EditorView.editable.of(!value),
  ];

  const placeholderExtension = (text?: string): Extension =>
    text ? placeholder(text) : [];

  const idExtension = (value?: string): Extension =>
    value ? EditorView.contentAttributes.of({ id: value }) : [];

  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        // 2-space indent as a neutral fleet default; a consumer language or
        // extension can override it
        indentUnit.of("  "),
        readOnlyCompartment.of(readOnlyExtension(readOnly)),
        placeholderCompartment.of(placeholderExtension(placeholderText)),
        idCompartment.of(idExtension(id)),
        createDoubleClickGuard(guardDoubleClick),
        themeCompartment.of(theme ?? neutralTheme),
        languageCompartment.of(language ?? []),
        extrasCompartment.of(extensions),
        completionCompartment.of(completionExtension(completionSources)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange?.(update.state.doc.toString());
        }),
      ],
    }),
  });

  return {
    getValue: () => view.state.doc.toString(),
    setValue: (text) =>
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
      }),
    setTheme: (nextTheme) =>
      view.dispatch({ effects: themeCompartment.reconfigure(nextTheme) }),
    setLanguage: (nextLanguage) =>
      view.dispatch({
        effects: languageCompartment.reconfigure(nextLanguage),
      }),
    setCompletionSources: (sources) =>
      view.dispatch({
        effects: completionCompartment.reconfigure(
          completionExtension(sources),
        ),
      }),
    setExtensions: (exts) =>
      view.dispatch({ effects: extrasCompartment.reconfigure(exts) }),
    setReadOnly: (value) =>
      view.dispatch({
        effects: readOnlyCompartment.reconfigure(readOnlyExtension(value)),
      }),
    setPlaceholder: (text) =>
      view.dispatch({
        effects: placeholderCompartment.reconfigure(placeholderExtension(text)),
      }),
    setId: (value) =>
      view.dispatch({
        effects: idCompartment.reconfigure(idExtension(value)),
      }),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
    view,
  };
}

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
export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      language,
      theme,
      extensions,
      completionSources,
      autocompletion: autocompletionConfig,
      readOnly,
      placeholder: placeholderText,
      id,
      guardDoubleClick,
      className,
    },
    ref,
  ) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<CodeEditorHandle | null>(null);
    // keep onChange current without remounting the editor on every render
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Mount once. Theme/language/value changes flow through the effects below so
    // the editor is never torn down and rebuilt mid-edit
    // biome-ignore lint/correctness/useExhaustiveDependencies: mount-once, later prop changes are handled by the effects below
    useEffect(() => {
      const parent = parentRef.current;
      if (!parent) return;

      const handle = createCodeEditor(parent, {
        doc: value ?? defaultValue ?? "",
        onChange: (next) => onChangeRef.current?.(next),
        language,
        theme,
        extensions,
        completionSources,
        autocompletion: autocompletionConfig,
        readOnly,
        placeholder: placeholderText,
        id,
        guardDoubleClick,
      });
      handleRef.current = handle;

      return () => {
        handle.destroy();
        handleRef.current = null;
      };
    }, []);

    // Sync a controlled value only when it differs, so the consumer's onChange
    // round-trip does not fight the editor or move the cursor on every keystroke
    useEffect(() => {
      const handle = handleRef.current;
      if (handle && value !== undefined && value !== handle.getValue()) {
        handle.setValue(value);
      }
    }, [value]);

    useEffect(() => {
      if (handleRef.current && theme) handleRef.current.setTheme(theme);
    }, [theme]);

    useEffect(() => {
      if (handleRef.current && language)
        handleRef.current.setLanguage(language);
    }, [language]);

    useEffect(() => {
      if (handleRef.current && completionSources)
        handleRef.current.setCompletionSources(completionSources);
    }, [completionSources]);

    useEffect(() => {
      if (handleRef.current && extensions)
        handleRef.current.setExtensions(extensions);
    }, [extensions]);

    useEffect(() => {
      if (handleRef.current && readOnly !== undefined)
        handleRef.current.setReadOnly(readOnly);
    }, [readOnly]);

    useEffect(() => {
      if (handleRef.current && placeholderText !== undefined)
        handleRef.current.setPlaceholder(placeholderText);
    }, [placeholderText]);

    useEffect(() => {
      if (handleRef.current && id !== undefined) handleRef.current.setId(id);
    }, [id]);

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => handleRef.current?.getValue() ?? "",
        setValue: (text) => handleRef.current?.setValue(text),
        setTheme: (nextTheme) => handleRef.current?.setTheme(nextTheme),
        setLanguage: (nextLanguage) =>
          handleRef.current?.setLanguage(nextLanguage),
        setCompletionSources: (sources) =>
          handleRef.current?.setCompletionSources(sources),
        setExtensions: (exts) => handleRef.current?.setExtensions(exts),
        setReadOnly: (next) => handleRef.current?.setReadOnly(next),
        setPlaceholder: (text) => handleRef.current?.setPlaceholder(text),
        setId: (next) => handleRef.current?.setId(next),
        focus: () => handleRef.current?.focus(),
        destroy: () => handleRef.current?.destroy(),
        get view() {
          const handle = handleRef.current;
          if (!handle) throw new Error("CodeEditor is not mounted");
          return handle.view;
        },
      }),
      [],
    );

    return <div ref={parentRef} className={cn(className)} />;
  },
);

CodeEditor.displayName = "CodeEditor";
