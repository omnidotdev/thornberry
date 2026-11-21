import { afterEach, describe, expect, test } from "bun:test";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  $createNodeSelection,
  $getRoot,
  $setSelection,
  KEY_ENTER_COMMAND,
  KEY_SPACE_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import {
  $isRichTextButtonNode,
  INSERT_RICH_TEXT_BUTTON_COMMAND,
  RichTextButtonNode,
  checkButtonHref,
  describeButtonHrefProblem,
} from "@/registry/thornberry/components/rich-text-button";
import {
  RichTextContent,
  RichTextEditor,
} from "@/registry/thornberry/components/rich-text-editor";

import type { LexicalEditor } from "lexical";
import type {
  RichTextButtonOptions,
  RichTextEditorUpdate,
} from "@/registry/thornberry/components/rich-text-editor";

afterEach(cleanup);

const button = (href: string, label: string) =>
  `<p><a href="${href}" data-variant="button">${label}</a></p>`;

/** Capture the Lexical editor so tests can dispatch commands */
const EditorCapture = ({
  onReady,
}: {
  onReady: (e: LexicalEditor) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  onReady(editor);
  return null;
};

interface Harness {
  updates: RichTextEditorUpdate[];
  editor: () => LexicalEditor;
  html: () => string;
  container: HTMLElement;
  rerender: (buttons?: RichTextButtonOptions) => void;
}

const renderEditor = ({
  buttons = {},
  defaultContent,
  editable,
}: {
  buttons?: RichTextButtonOptions | null;
  defaultContent?: string;
  editable?: boolean;
} = {}): Harness => {
  const updates: RichTextEditorUpdate[] = [];
  let editor: LexicalEditor | null = null;
  const view = (options?: RichTextButtonOptions) => (
    <RichTextEditor
      defaultContent={defaultContent}
      editable={editable}
      onUpdate={(update) => updates.push(update)}
      buttons={options}
      plugins={
        <EditorCapture
          onReady={(e) => {
            editor = e;
          }}
        />
      }
    />
  );
  const { container, rerender } = render(view(buttons ?? undefined));
  return {
    updates,
    container,
    rerender: (options) => rerender(view(options)),
    editor: () => {
      if (!editor) throw new Error("editor not mounted");
      return editor;
    },
    html: () => {
      const last = updates.at(-1);
      if (!last) throw new Error("no update yet");
      return last.getHTML();
    },
  };
};

const ready = async (h: Harness) => {
  await waitFor(() =>
    expect(h.container.querySelector("[contenteditable]") === null).toBe(false),
  );
  await waitFor(() => h.editor());
};

const buttonNodes = (editor: LexicalEditor) =>
  editor.getEditorState().read(() =>
    $getRoot()
      .getChildren()
      .filter($isRichTextButtonNode)
      .map((node) => ({
        key: node.getKey(),
        label: node.getLabel(),
        href: node.getHref(),
      })),
  );

const topLevelTypes = (editor: LexicalEditor) =>
  editor.getEditorState().read(() =>
    $getRoot()
      .getChildren()
      .map((c) => c.getType()),
  );

const openInsertForm = () => {
  fireEvent.click(screen.getByLabelText("Insert button"));
  return screen.getByRole("group", { name: "Insert button" });
};

const fill = (label: string, href: string) => {
  fireEvent.change(screen.getByLabelText("Button text"), {
    target: { value: label },
  });
  fireEvent.change(screen.getByLabelText("Button link"), {
    target: { value: href },
  });
};

describe("checkButtonHref", () => {
  test("accepts https and mailto links, normalized", () => {
    expect(checkButtonHref(" HTTPS://Example.com/a/../sale ")).toEqual({
      ok: true,
      href: "https://example.com/sale",
    });
    expect(checkButtonHref("mailto:hi@example.com")).toEqual({
      ok: true,
      href: "mailto:hi@example.com",
    });
  });

  test("refuses script, data, plain http, relative, and empty links", () => {
    for (const href of [
      "javascript:alert(1)",
      " JavaScript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "http://example.com",
      "/sale",
      "example.com",
      "mailto:",
      "mailto:nobody",
      "ftp://example.com",
    ]) {
      expect(checkButtonHref(href)).toEqual({ ok: false, problem: "invalid" });
    }
    expect(checkButtonHref("  ")).toEqual({ ok: false, problem: "missing" });
    expect(checkButtonHref(null)).toEqual({ ok: false, problem: "missing" });
  });

  test("isAllowedHref judges the normalized link", () => {
    const seen: string[] = [];
    const isAllowedHref = (href: string) => {
      seen.push(href);
      return new URL(href).host === "shop.example.com";
    };
    expect(checkButtonHref("https://SHOP.example.com", isAllowedHref)).toEqual({
      ok: true,
      href: "https://shop.example.com/",
    });
    expect(checkButtonHref("https://evil.example", isAllowedHref)).toEqual({
      ok: false,
      problem: "refused",
    });
    // the built-in check runs first, so the policy never sees a script link
    checkButtonHref("javascript:alert(1)", isAllowedHref);
    expect(seen).toEqual([
      "https://shop.example.com/",
      "https://evil.example/",
    ]);
    expect(describeButtonHrefProblem("refused", "https://evil.example")).toBe(
      "Buttons can't link to evil.example. Use a different link.",
    );
  });
});

describe("inserting a button", () => {
  test("the toolbar form inserts a block button", async () => {
    const h = renderEditor({ defaultContent: "<p>Hello</p>" });
    await ready(h);

    const form = openInsertForm();
    // the label field takes focus
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("Button text")),
    );
    fill("Shop  the sale ", "https://shop.example.com/sale");
    fireEvent.click(
      Array.from(form.querySelectorAll("button")).find(
        (b) => b.textContent === "Insert",
      ) as HTMLButtonElement,
    );

    await waitFor(() =>
      expect(h.html()).toContain(
        button("https://shop.example.com/sale", "Shop the sale"),
      ),
    );
    expect(screen.queryByRole("group", { name: "Insert button" })).toBeNull();
    expect(buttonNodes(h.editor())).toHaveLength(1);
    // a button is a block of its own, with somewhere to type after it
    expect(topLevelTypes(h.editor())).toContain("rich-text-button");
    expect(topLevelTypes(h.editor()).at(-1)).toBe("paragraph");
    expect(h.updates.at(-1)?.isEmpty).toBe(false);
  });

  test("Enter in a field submits, and mailto links are allowed", async () => {
    const h = renderEditor();
    await ready(h);
    openInsertForm();
    fill("Email us", "mailto:hello@example.com");
    fireEvent.keyDown(screen.getByLabelText("Button link"), { key: "Enter" });
    await waitFor(() =>
      expect(h.html()).toContain(
        button("mailto:hello@example.com", "Email us"),
      ),
    );
  });

  test("refuses script, data, and http links and a missing label", async () => {
    const h = renderEditor();
    await ready(h);
    openInsertForm();

    fill("", "https://example.com");
    fireEvent.keyDown(screen.getByLabelText("Button link"), { key: "Enter" });
    expect(screen.getByText("Add a label for the button.")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("Button text"));

    for (const href of [
      "javascript:alert(1)",
      "data:text/html,hi",
      "http://example.com",
    ]) {
      fill("Go", href);
      fireEvent.keyDown(screen.getByLabelText("Button link"), { key: "Enter" });
      expect(
        screen.getByLabelText("Button link").getAttribute("aria-invalid"),
      ).toBe("true");
      expect(screen.getByRole("alert").textContent).toContain("https://");
    }
    expect(buttonNodes(h.editor())).toHaveLength(0);
    expect(screen.getByRole("group", { name: "Insert button" })).toBeTruthy();

    // Escape closes the form without inserting
    fireEvent.keyDown(screen.getByLabelText("Button link"), { key: "Escape" });
    expect(screen.queryByRole("group", { name: "Insert button" })).toBeNull();
    expect(buttonNodes(h.editor())).toHaveLength(0);
  });

  test("refuses a link isAllowedHref rejects", async () => {
    const h = renderEditor({
      buttons: {
        isAllowedHref: (href) => new URL(href).host === "shop.example.com",
      },
    });
    await ready(h);
    openInsertForm();
    fill("Go", "https://elsewhere.example/x");
    fireEvent.keyDown(screen.getByLabelText("Button link"), { key: "Enter" });
    expect(screen.getByRole("alert").textContent).toBe(
      "Buttons can't link to elsewhere.example. Use a different link.",
    );
    expect(buttonNodes(h.editor())).toHaveLength(0);
  });

  test("the insert command validates too", async () => {
    const h = renderEditor();
    await ready(h);
    let handled = true;
    await act(async () => {
      handled = h.editor().dispatchCommand(INSERT_RICH_TEXT_BUTTON_COMMAND, {
        label: "Go",
        href: "javascript:alert(1)",
      });
    });
    expect(handled).toBe(false);
    expect(buttonNodes(h.editor())).toHaveLength(0);
  });
});

describe("editing and removing a button", () => {
  const selectButton = async (h: Harness) => {
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(1));
    const key = buttonNodes(h.editor())[0]?.key ?? "";
    await act(async () => {
      h.editor().update(() => {
        const selection = $createNodeSelection();
        selection.add(key);
        $setSelection(selection);
      });
    });
  };

  test("clicking the button opens its edit form, and Save updates it", async () => {
    const h = renderEditor({
      defaultContent: `<p>Hi</p>${button("https://example.com/a", "Old")}`,
    });
    await ready(h);
    fireEvent.click(await screen.findByLabelText("Edit button: Old"));
    const form = await screen.findByRole("group", { name: "Edit button" });
    expect(
      (screen.getByLabelText("Button text") as HTMLInputElement).value,
    ).toBe("Old");
    expect(
      (screen.getByLabelText("Button link") as HTMLInputElement).value,
    ).toBe("https://example.com/a");

    fill("New", "https://example.com/b");
    fireEvent.click(
      Array.from(form.querySelectorAll("button")).find(
        (b) => b.textContent === "Save",
      ) as HTMLButtonElement,
    );
    await waitFor(() =>
      expect(h.html()).toContain(button("https://example.com/b", "New")),
    );
    expect(h.html()).not.toContain("Old");
    expect(screen.queryByRole("group", { name: "Edit button" })).toBeNull();
  });

  test("editing refuses a bad link and keeps the old one", async () => {
    const h = renderEditor({
      defaultContent: button("https://example.com/a", "Go"),
    });
    await ready(h);
    fireEvent.click(await screen.findByLabelText("Edit button: Go"));
    fill("Go", "javascript:alert(1)");
    fireEvent.keyDown(screen.getByLabelText("Button link"), { key: "Enter" });
    expect(screen.getByRole("alert").textContent).toContain("https://");
    expect(h.html()).toContain(button("https://example.com/a", "Go"));
    expect(h.html()).not.toContain("javascript");
  });

  for (const [name, command] of [
    ["Enter", KEY_ENTER_COMMAND],
    ["Space", KEY_SPACE_COMMAND],
  ] as const) {
    test(`${name} on a selected button opens its edit form, Escape closes it`, async () => {
      const h = renderEditor({
        defaultContent: `<p>Before</p>${button("https://example.com/", "Go")}<p>After</p>`,
      });
      await ready(h);
      await selectButton(h);
      await waitFor(() =>
        expect(screen.getByText(/Button selected/).textContent).toContain(
          "Press Enter",
        ),
      );
      await act(async () => {
        h.editor().dispatchCommand(
          command as typeof KEY_ENTER_COMMAND,
          new KeyboardEvent("keydown", { key: name === "Space" ? " " : name }),
        );
      });
      const label = await screen.findByLabelText("Button text");
      await waitFor(() => expect(document.activeElement).toBe(label));

      fireEvent.keyDown(label, { key: "Escape" });
      await waitFor(() =>
        expect(screen.queryByRole("group", { name: "Edit button" })).toBeNull(),
      );
      expect(buttonNodes(h.editor())).toHaveLength(1);
    });
  }

  test("Remove deletes the button, and undo brings it back", async () => {
    const h = renderEditor({
      defaultContent: `<p>Before</p>${button("https://example.com/", "Go")}<p>After</p>`,
    });
    await ready(h);
    fireEvent.click(await screen.findByLabelText("Edit button: Go"));
    const form = await screen.findByRole("group", { name: "Edit button" });
    fireEvent.click(
      Array.from(form.querySelectorAll("button")).find(
        (b) => b.textContent === "Remove",
      ) as HTMLButtonElement,
    );
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(0));
    expect(h.html()).not.toContain("data-variant");
    expect(h.html()).toContain("Before");
    expect(h.html()).toContain("After");

    await act(async () => {
      h.editor().dispatchCommand(UNDO_COMMAND, undefined);
    });
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(1));
  });

  test("Delete with the button selected removes it", async () => {
    const h = renderEditor({
      defaultContent: `<p>Before</p>${button("https://example.com/", "Go")}`,
    });
    await ready(h);
    await selectButton(h);
    const root = h.container.querySelector<HTMLElement>("[contenteditable]");
    await act(async () => {
      root?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
      );
    });
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(0));
  });

  test("keys typed in the edit form never delete the button", async () => {
    const h = renderEditor({
      defaultContent: button("https://example.com/", "Go"),
    });
    await ready(h);
    fireEvent.click(await screen.findByLabelText("Edit button: Go"));
    const label = await screen.findByLabelText("Button text");
    fireEvent.keyDown(label, { key: "Backspace" });
    fireEvent.keyDown(label, { key: "Delete" });
    expect(buttonNodes(h.editor())).toHaveLength(1);
  });
});

describe("HTML round trip", () => {
  test("imports button anchors and exports them unchanged", async () => {
    const html = `<p>Intro</p>${button("https://example.com/sale?a=1&amp;b=2", "Shop &amp; save")}`;
    const h = renderEditor({ defaultContent: html });
    await ready(h);
    await waitFor(() =>
      expect(h.html()).toContain(
        button("https://example.com/sale?a=1&amp;b=2", "Shop &amp; save"),
      ),
    );
    expect(buttonNodes(h.editor())).toEqual([
      expect.objectContaining({
        label: "Shop & save",
        href: "https://example.com/sale?a=1&b=2",
      }),
    ]);

    // the export loads back to the same thing
    const out = h.html();
    cleanup();
    const again = renderEditor({ defaultContent: out });
    await ready(again);
    await waitFor(() => expect(again.html()).toBe(out));
  });

  test("a bare button anchor and one inside a paragraph become blocks", async () => {
    const h = renderEditor({
      defaultContent: `<p>Before<a href="https://example.com/a" data-variant="button">A</a>After</p><a href="https://example.com/b" data-variant="button">B</a>`,
    });
    await ready(h);
    await waitFor(() =>
      expect(topLevelTypes(h.editor())).toEqual([
        "paragraph",
        "rich-text-button",
        "paragraph",
        "rich-text-button",
      ]),
    );
    const html = h.html();
    expect(html).toContain(button("https://example.com/a", "A"));
    expect(html).toContain(button("https://example.com/b", "B"));
    expect(html).toContain("Before");
    expect(html).toContain("After");
  });

  test("a button anchor in a list moves after the list", async () => {
    const h = renderEditor({
      defaultContent: `<ul><li>One <a href="https://example.com/" data-variant="button">Go</a></li></ul>`,
    });
    await ready(h);
    await waitFor(() =>
      expect(topLevelTypes(h.editor())).toEqual(["list", "rich-text-button"]),
    );
  });

  test("refuses javascript: and data: links on import, keeping only the label", async () => {
    const h = renderEditor({
      defaultContent: `<p><a href="javascript:alert(1)" data-variant="button">Bad</a></p><p><a href="data:text/html,hi" data-variant="button">Worse</a></p>`,
    });
    await ready(h);
    await waitFor(() => expect(h.html()).toContain("Bad"));
    expect(h.html()).toContain("Worse");
    expect(h.html()).not.toContain("javascript");
    expect(h.html()).not.toContain("data:");
    expect(h.html()).not.toContain("<a");
    expect(buttonNodes(h.editor())).toHaveLength(0);
  });

  test("a link isAllowedHref refuses loads as plain text", async () => {
    const h = renderEditor({
      buttons: { isAllowedHref: (href) => href.startsWith("https://ok.") },
      defaultContent: `${button("https://ok.example/", "Yes")}${button("https://no.example/", "No")}`,
    });
    await ready(h);
    await waitFor(() => expect(h.html()).toContain("No"));
    expect(h.html()).toContain(button("https://ok.example/", "Yes"));
    expect(h.html()).not.toContain("no.example");
  });

  test("a stricter isAllowedHref after mount exports only the label", async () => {
    const h = renderEditor({
      defaultContent: button("https://example.com/", "Go"),
    });
    await ready(h);
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(1));
    h.rerender({ isAllowedHref: () => false });
    await waitFor(() =>
      expect(
        h.container.querySelector("[data-rich-text-button][data-refused]"),
      ).not.toBeNull(),
    );
    const html = h.html();
    expect(html).not.toContain("example.com");
    expect(screen.getByText(/This link can't be used/)).toBeTruthy();
  });

  test("untrusted editor data with a script link never becomes a button", async () => {
    const h = renderEditor();
    await ready(h);
    await act(async () => {
      h.editor().update(() => {
        $getRoot().append(
          RichTextButtonNode.importJSON({
            type: "rich-text-button",
            version: 1,
            label: "Bad",
            href: "javascript:alert(1)",
          }),
        );
      });
    });
    await waitFor(() => expect(h.html()).toContain("Bad"));
    expect(h.html()).not.toContain("javascript");
    expect(buttonNodes(h.editor())).toHaveLength(0);
  });

  test("read-only editors render the button as a link", async () => {
    const h = renderEditor({
      editable: false,
      defaultContent: button("https://example.com/", "Go"),
    });
    await ready(h);
    const link = await waitFor(() => {
      const el = h.container.querySelector<HTMLAnchorElement>(
        "a[data-rich-text-button]",
      );
      if (!el) throw new Error("no link yet");
      return el;
    });
    expect(link.getAttribute("href")).toBe("https://example.com/");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.queryByLabelText("Edit button: Go")).toBeNull();
  });
});

describe("without buttons", () => {
  test("no toolbar control, and button anchors load as ordinary links", async () => {
    const off = renderEditor({
      buttons: null,
      defaultContent: `<p>Hi</p>${button("https://example.com/", "Go")}`,
    });
    await ready(off);
    expect(screen.queryByLabelText("Insert button")).toBeNull();
    await waitFor(() => expect(off.html()).toContain("Go"));
    const offHtml = off.html();
    expect(offHtml).not.toContain("data-variant");
    expect(buttonNodes(off.editor())).toHaveLength(0);
    cleanup();

    // identical to the same content without the button marker
    const plain = renderEditor({
      buttons: null,
      defaultContent: `<p>Hi</p><p><a href="https://example.com/">Go</a></p>`,
    });
    await ready(plain);
    await waitFor(() => expect(plain.html()).toBe(offHtml));
  });

  test("the update report matches an editor that never had buttons", async () => {
    const content = "<p>Hello <b>world</b></p><ul><li>one</li></ul>";
    const off = renderEditor({ buttons: null, defaultContent: content });
    await ready(off);
    await waitFor(() => expect(off.html()).toContain("world"));
    const offUpdate = off.updates.at(-1);
    cleanup();
    const on = renderEditor({ defaultContent: content });
    await ready(on);
    await waitFor(() => expect(on.html()).toContain("world"));
    expect(on.html()).toBe(offUpdate?.getHTML() ?? "");
    expect(on.updates.at(-1)?.getText()).toBe(offUpdate?.getText() ?? "");
  });

  test("turning buttons off turns existing buttons into ordinary links", async () => {
    const h = renderEditor({
      defaultContent: button("https://example.com/", "Go"),
    });
    await ready(h);
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(1));
    h.rerender(undefined);
    await waitFor(() => expect(buttonNodes(h.editor())).toHaveLength(0));
    await waitFor(() =>
      expect(h.html()).toContain('<a href="https://example.com/"'),
    );
    expect(h.html()).not.toContain("data-variant");
    expect(screen.queryByLabelText("Insert button")).toBeNull();

    h.rerender({});
    await waitFor(() =>
      expect(screen.queryByLabelText("Insert button")).not.toBeNull(),
    );
  });

  test("pasted button data becomes an ordinary link", async () => {
    const h = renderEditor({ buttons: null });
    await ready(h);
    await act(async () => {
      h.editor().update(() => {
        $getRoot().append(
          RichTextButtonNode.importJSON({
            type: "rich-text-button",
            version: 1,
            label: "Go",
            href: "https://example.com/",
          }),
        );
      });
    });
    await waitFor(() =>
      expect(h.html()).toContain('<a href="https://example.com/"'),
    );
    expect(buttonNodes(h.editor())).toHaveLength(0);
    expect(h.html()).not.toContain("data-variant");
  });
});

describe("RichTextContent buttons", () => {
  test("keeps data-variant=button on links", () => {
    const { container } = render(
      <RichTextContent html={button("https://example.com/", "Go")} />,
    );
    const link = container.querySelector("a");
    expect(link?.getAttribute("data-variant")).toBe("button");
    expect(link?.getAttribute("href")).toBe("https://example.com/");
    expect(link?.textContent).toBe("Go");
  });

  test("keeps mailto buttons", () => {
    const { container } = render(
      <RichTextContent html={button("mailto:hi@example.com", "Email")} />,
    );
    expect(container.querySelector("a")?.getAttribute("data-variant")).toBe(
      "button",
    );
  });

  test("strips data-variant with any other value, element, or link", () => {
    const { container } = render(
      <RichTextContent
        html={[
          '<p data-variant="button">p</p>',
          '<p><a href="https://example.com/" data-variant="primary">x</a></p>',
          '<p><a href="http://example.com/" data-variant="button">y</a></p>',
          '<p><a href="javascript:alert(1)" data-variant="button">z</a></p>',
        ].join("")}
      />,
    );
    expect(container.querySelectorAll("[data-variant]")).toHaveLength(0);
    expect(container.innerHTML).not.toContain("javascript");
    expect(container.textContent).toBe("pxyz");
  });
});
