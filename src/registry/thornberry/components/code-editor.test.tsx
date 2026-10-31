import { afterEach, expect, test } from "bun:test";

import {
  completionStatus,
  currentCompletions,
  startCompletion,
} from "@codemirror/autocomplete";

import {
  createCodeEditor,
  createDoubleClickGuard,
} from "@/registry/thornberry/components/code-editor";

import type { CompletionSource } from "@codemirror/autocomplete";
import type { CodeEditorHandle } from "@/registry/thornberry/components/code-editor";

let editor: CodeEditorHandle | null = null;
let parent: HTMLElement | null = null;

afterEach(() => {
  editor?.destroy();
  editor = null;
  parent?.remove();
  parent = null;
});

const mount = (opts?: Parameters<typeof createCodeEditor>[1]) => {
  parent = document.createElement("div");
  document.body.appendChild(parent);
  editor = createCodeEditor(parent, opts);
  return editor;
};

test("getValue returns the initial doc", () => {
  const handle = mount({ doc: "const x = 1" });
  expect(handle.getValue()).toBe("const x = 1");
});

test("getValue defaults to an empty document", () => {
  expect(mount().getValue()).toBe("");
});

test("setValue replaces the whole document", () => {
  const handle = mount({ doc: "old" });
  handle.setValue("brand new");
  expect(handle.getValue()).toBe("brand new");
});

test("onChange fires with the new text on a document change", () => {
  const changes: string[] = [];
  const handle = mount({ doc: "a", onChange: (value) => changes.push(value) });
  handle.setValue("b");
  expect(changes).toContain("b");
});

test("the default editor mounts with a guard and exposes its view", () => {
  // the default guardDoubleClick is "swallow-dblclick"; constructing must not
  // throw and the underlying view must exist
  const handle = mount();
  expect(handle.view).toBeDefined();
  expect(handle.view.state.doc.toString()).toBe("");
});

test("createDoubleClickGuard builds an extension for each mode", () => {
  // false installs no guard (an empty extension array)
  expect(createDoubleClickGuard(false)).toEqual([]);
  // the two active modes build a non-empty extension without throwing
  expect(createDoubleClickGuard("swallow-dblclick")).toBeDefined();
  expect(createDoubleClickGuard("no-word-select")).toBeDefined();
  // the default is the swallow-dblclick mode
  expect(createDoubleClickGuard()).toBeDefined();
});

test("a read-only editor still reports its value", () => {
  const handle = mount({ doc: "frozen", readOnly: true });
  expect(handle.getValue()).toBe("frozen");
  expect(handle.view.state.readOnly).toBe(true);
});

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

test("Ctrl+Space autocomplete surfaces an injected completion source", async () => {
  // a domain source like Facet's modeling api (fillet, chamfer, ...)
  const source: CompletionSource = (context) => ({
    from: context.pos,
    options: [{ label: "fillet" }, { label: "chamfer" }],
  });
  const handle = mount({ doc: "", completionSources: [source] });

  // Ctrl+Space / Mod-Space is bound to startCompletion in basicSetup's keymap
  expect(startCompletion(handle.view)).toBe(true);

  // completion resolves asynchronously; wait for the state to become active
  for (
    let i = 0;
    i < 50 && completionStatus(handle.view.state) !== "active";
    i++
  ) {
    await flush();
  }
  expect(completionStatus(handle.view.state)).toBe("active");
  const labels = currentCompletions(handle.view.state).map((c) => c.label);
  expect(labels).toContain("fillet");
});

test("setCompletionSources reconfigures the sources without throwing", () => {
  const handle = mount({ doc: "" });
  const source: CompletionSource = (context) => ({
    from: context.pos,
    options: [{ label: "cube" }, { label: "cylinder" }],
  });
  expect(() => handle.setCompletionSources([source])).not.toThrow();
  // reverting to language completions (empty) must also be safe
  expect(() => handle.setCompletionSources([])).not.toThrow();
});
