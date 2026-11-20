import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/code-editor.tsx
import { autocompletion } from "@codemirror/autocomplete";
import { indentWithTab, redo, undo } from "@codemirror/commands";
import {
  HighlightStyle,
  indentUnit,
  syntaxHighlighting
} from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { basicSetup } from "codemirror";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { jsx } from "react/jsx-runtime";
var neutralTheme = EditorView.theme({
  "&": {
    fontSize: "0.8125rem"
  },
  ".cm-content": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
  },
  "&.cm-focused": {
    outline: "none"
  }
});
var tokenTheme = (opts = {}) => EditorView.theme({
  "&": {
    backgroundColor: "var(--background, #ffffff)",
    color: "var(--foreground, #0a0a0a)"
  },
  ".cm-content": {
    caretColor: "var(--foreground, #0a0a0a)"
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--foreground, #0a0a0a)"
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "var(--accent, #d4d4d8)"
  },
  ".cm-activeLine": {
    backgroundColor: "var(--muted, #f4f4f5)"
  },
  ".cm-gutters": {
    backgroundColor: "var(--background, #ffffff)",
    color: "var(--muted-foreground, #71717a)",
    borderRight: "1px solid var(--border, #e4e4e7)"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--muted, #f4f4f5)",
    color: "var(--foreground, #0a0a0a)"
  }
}, { dark: opts.dark ?? false });
var tokenHighlightStyle = HighlightStyle.define([
  {
    tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword],
    color: "var(--primary, #7c3aed)"
  },
  { tag: [t.tagName], color: "var(--chart-1, #2563eb)" },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: "var(--chart-1, #2563eb)"
  },
  {
    tag: [t.string, t.special(t.string), t.attributeValue, t.regexp],
    color: "var(--chart-2, #15803d)"
  },
  {
    tag: [t.number, t.bool, t.null, t.atom, t.unit, t.color],
    color: "var(--chart-3, #c2410c)"
  },
  {
    tag: [t.attributeName, t.className, t.typeName],
    color: "var(--chart-4, #b45309)"
  },
  { tag: [t.propertyName], color: "var(--chart-5, #0e7490)" },
  {
    tag: [t.comment, t.lineComment, t.blockComment],
    color: "var(--muted-foreground, #71717a)",
    fontStyle: "italic"
  },
  {
    tag: [t.punctuation, t.angleBracket, t.operator, t.separator],
    color: "var(--muted-foreground, #71717a)"
  }
]);
var tokenSyntax = () => syntaxHighlighting(tokenHighlightStyle);
var createDoubleClickGuard = (mode = "swallow-dblclick") => {
  if (mode === false)
    return [];
  if (mode === "no-word-select") {
    return EditorView.domEventHandlers({
      mousedown(event) {
        if (event.detail === 2) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    });
  }
  return EditorView.domEventHandlers({
    dblclick(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  });
};
function createCodeEditor(parent, opts = {}) {
  const {
    doc = "",
    onChange,
    language,
    theme,
    extensions = [],
    lineWrapping = false,
    completionSources,
    autocompletion: autocompletionConfig,
    readOnly = false,
    placeholder: placeholderText,
    id,
    guardDoubleClick = "swallow-dblclick"
  } = opts;
  const themeCompartment = new Compartment;
  const languageCompartment = new Compartment;
  const extrasCompartment = new Compartment;
  const lineWrappingCompartment = new Compartment;
  const completionCompartment = new Compartment;
  const readOnlyCompartment = new Compartment;
  const placeholderCompartment = new Compartment;
  const idCompartment = new Compartment;
  const completionExtension = (sources) => {
    if (autocompletionConfig) {
      return autocompletion(sources?.length ? { ...autocompletionConfig, override: sources } : autocompletionConfig);
    }
    return sources?.length ? autocompletion({ override: sources }) : [];
  };
  const readOnlyExtension = (value) => [
    EditorState.readOnly.of(value),
    EditorView.editable.of(!value)
  ];
  const placeholderExtension = (text) => text ? placeholder(text) : [];
  const idExtension = (value) => value ? EditorView.contentAttributes.of({ id: value }) : [];
  const lineWrappingExtension = (value) => value ? EditorView.lineWrapping : [];
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        basicSetup,
        keymap.of([
          indentWithTab,
          { key: "Mod-z", run: undo, preventDefault: true },
          { key: "Mod-Shift-z", run: redo, preventDefault: true },
          { key: "Mod-y", run: redo, preventDefault: true }
        ]),
        indentUnit.of("  "),
        readOnlyCompartment.of(readOnlyExtension(readOnly)),
        placeholderCompartment.of(placeholderExtension(placeholderText)),
        idCompartment.of(idExtension(id)),
        createDoubleClickGuard(guardDoubleClick),
        themeCompartment.of(theme ?? neutralTheme),
        languageCompartment.of(language ?? []),
        extrasCompartment.of(extensions),
        lineWrappingCompartment.of(lineWrappingExtension(lineWrapping)),
        completionCompartment.of(completionExtension(completionSources)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged)
            onChange?.(update.state.doc.toString());
        })
      ]
    })
  });
  return {
    getValue: () => view.state.doc.toString(),
    setValue: (text) => view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: text }
    }),
    setTheme: (nextTheme) => view.dispatch({ effects: themeCompartment.reconfigure(nextTheme) }),
    setLanguage: (nextLanguage) => view.dispatch({
      effects: languageCompartment.reconfigure(nextLanguage)
    }),
    setCompletionSources: (sources) => view.dispatch({
      effects: completionCompartment.reconfigure(completionExtension(sources))
    }),
    setExtensions: (exts) => view.dispatch({ effects: extrasCompartment.reconfigure(exts) }),
    setLineWrapping: (wrap) => view.dispatch({
      effects: lineWrappingCompartment.reconfigure(lineWrappingExtension(wrap))
    }),
    setReadOnly: (value) => view.dispatch({
      effects: readOnlyCompartment.reconfigure(readOnlyExtension(value))
    }),
    setPlaceholder: (text) => view.dispatch({
      effects: placeholderCompartment.reconfigure(placeholderExtension(text))
    }),
    setId: (value) => view.dispatch({
      effects: idCompartment.reconfigure(idExtension(value))
    }),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
    view
  };
}
var CodeEditor = forwardRef(({
  value,
  defaultValue,
  onChange,
  language,
  theme,
  extensions,
  lineWrapping,
  completionSources,
  autocompletion: autocompletionConfig,
  readOnly,
  placeholder: placeholderText,
  id,
  guardDoubleClick,
  className
}, ref) => {
  const parentRef = useRef(null);
  const handleRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent)
      return;
    const handle = createCodeEditor(parent, {
      doc: value ?? defaultValue ?? "",
      onChange: (next) => onChangeRef.current?.(next),
      language,
      theme,
      extensions,
      lineWrapping,
      completionSources,
      autocompletion: autocompletionConfig,
      readOnly,
      placeholder: placeholderText,
      id,
      guardDoubleClick
    });
    handleRef.current = handle;
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
  }, []);
  useEffect(() => {
    const handle = handleRef.current;
    if (handle && value !== undefined && value !== handle.getValue()) {
      handle.setValue(value);
    }
  }, [value]);
  useEffect(() => {
    if (handleRef.current && theme)
      handleRef.current.setTheme(theme);
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
    if (handleRef.current && lineWrapping !== undefined)
      handleRef.current.setLineWrapping(lineWrapping);
  }, [lineWrapping]);
  useEffect(() => {
    if (handleRef.current && readOnly !== undefined)
      handleRef.current.setReadOnly(readOnly);
  }, [readOnly]);
  useEffect(() => {
    if (handleRef.current && placeholderText !== undefined)
      handleRef.current.setPlaceholder(placeholderText);
  }, [placeholderText]);
  useEffect(() => {
    if (handleRef.current && id !== undefined)
      handleRef.current.setId(id);
  }, [id]);
  useImperativeHandle(ref, () => ({
    getValue: () => handleRef.current?.getValue() ?? "",
    setValue: (text) => handleRef.current?.setValue(text),
    setTheme: (nextTheme) => handleRef.current?.setTheme(nextTheme),
    setLanguage: (nextLanguage) => handleRef.current?.setLanguage(nextLanguage),
    setCompletionSources: (sources) => handleRef.current?.setCompletionSources(sources),
    setExtensions: (exts) => handleRef.current?.setExtensions(exts),
    setLineWrapping: (wrap) => handleRef.current?.setLineWrapping(wrap),
    setReadOnly: (next) => handleRef.current?.setReadOnly(next),
    setPlaceholder: (text) => handleRef.current?.setPlaceholder(text),
    setId: (next) => handleRef.current?.setId(next),
    focus: () => handleRef.current?.focus(),
    destroy: () => handleRef.current?.destroy(),
    get view() {
      const handle = handleRef.current;
      if (!handle)
        throw new Error("CodeEditor is not mounted");
      return handle.view;
    }
  }), []);
  return /* @__PURE__ */ jsx("div", {
    ref: parentRef,
    className: cn(className)
  });
});
CodeEditor.displayName = "CodeEditor";
export {
  CodeEditor,
  createCodeEditor,
  createDoubleClickGuard,
  tokenHighlightStyle,
  tokenSyntax,
  tokenTheme
};
