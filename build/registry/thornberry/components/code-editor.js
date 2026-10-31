import {
  cn
} from "../../../chunks/account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/code-editor.tsx
import { autocompletion } from "@codemirror/autocomplete";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
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
    completionSources,
    readOnly = false,
    guardDoubleClick = "swallow-dblclick"
  } = opts;
  const themeCompartment = new Compartment;
  const languageCompartment = new Compartment;
  const extrasCompartment = new Compartment;
  const completionCompartment = new Compartment;
  const completionExtension = (sources) => sources?.length ? autocompletion({ override: sources }) : [];
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        indentUnit.of("  "),
        EditorState.readOnly.of(readOnly),
        createDoubleClickGuard(guardDoubleClick),
        themeCompartment.of(theme ?? neutralTheme),
        languageCompartment.of(language ?? []),
        extrasCompartment.of(extensions),
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
  completionSources,
  readOnly,
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
      completionSources,
      readOnly,
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
  useImperativeHandle(ref, () => ({
    getValue: () => handleRef.current?.getValue() ?? "",
    setValue: (text) => handleRef.current?.setValue(text),
    setTheme: (nextTheme) => handleRef.current?.setTheme(nextTheme),
    setLanguage: (nextLanguage) => handleRef.current?.setLanguage(nextLanguage),
    setCompletionSources: (sources) => handleRef.current?.setCompletionSources(sources),
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
  createDoubleClickGuard
};
