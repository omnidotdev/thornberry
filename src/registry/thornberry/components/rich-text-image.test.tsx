import { afterEach, describe, expect, mock, test } from "bun:test";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
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
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $setSelection,
  KEY_ENTER_COMMAND,
  KEY_SPACE_COMMAND,
  PASTE_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import {
  RichTextContent,
  RichTextEditor,
} from "@/registry/thornberry/components/rich-text-editor";
import {
  $createRichTextImageNode,
  $isRichTextImageNode,
  REPLACE_RICH_TEXT_IMAGE_COMMAND,
  UPLOAD_RICH_TEXT_IMAGES_COMMAND,
  checkImageSrc,
  isHttpsUrl,
  isSafeImageSrc,
  rememberUploadOutcome,
  validateImageFile,
} from "@/registry/thornberry/components/rich-text-image";

import type { LexicalEditor, LexicalNode } from "lexical";
import type {
  RichTextEditorUpdate,
  RichTextImageError,
  RichTextImageOptions,
  RichTextImageUploadResult,
} from "@/registry/thornberry/components/rich-text-editor";

afterEach(cleanup);

const CDN = "https://cdn.example.com";
const EMAIL_STYLE = 'style="display:block;max-width:100%;height:auto;border:0"';

/** A promise whose outcome the test controls */
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

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
  errors: RichTextImageError[];
  editor: () => LexicalEditor;
  latest: () => RichTextEditorUpdate;
  root: () => HTMLElement;
  container: HTMLElement;
}

const renderEditor = ({
  upload = mock(
    async (_file: File): Promise<RichTextImageUploadResult> => ({
      src: `${CDN}/a.png`,
    }),
  ),
  defaultContent,
  withOnError = true,
  ...options
}: Partial<RichTextImageOptions> & {
  defaultContent?: string;
  withOnError?: boolean;
} = {}): Harness => {
  const updates: RichTextEditorUpdate[] = [];
  const errors: RichTextImageError[] = [];
  let editor: LexicalEditor | null = null;
  const { container } = render(
    <RichTextEditor
      defaultContent={defaultContent}
      onUpdate={(update) => updates.push(update)}
      images={{
        upload,
        onError: withOnError ? (error) => errors.push(error) : undefined,
        ...options,
      }}
      plugins={
        <EditorCapture
          onReady={(e) => {
            editor = e;
          }}
        />
      }
    />,
  );
  return {
    updates,
    errors,
    container,
    editor: () => {
      if (!editor) throw new Error("editor not mounted");
      return editor;
    },
    latest: () => {
      const last = updates.at(-1);
      if (!last) throw new Error("no update yet");
      return last;
    },
    root: () => {
      const el = container.querySelector<HTMLElement>(
        '[contenteditable="true"]',
      );
      if (!el) throw new Error("editor not ready");
      return el;
    },
  };
};

const pickFiles = (container: HTMLElement, files: File[]) => {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("no file input");
  Object.defineProperty(input, "files", { value: files, configurable: true });
  fireEvent.change(input);
};

const png = (name = "a.png", bytes = 4) =>
  new File([new Uint8Array(bytes)], name, { type: "image/png" });

const imageNodes = (editor: LexicalEditor) =>
  editor.getEditorState().read(() => {
    const found: Array<{ key: string; uploading: boolean; external: boolean }> =
      [];
    const visit = (node: LexicalNode) => {
      if ($isRichTextImageNode(node)) {
        found.push({
          key: node.getKey(),
          uploading: node.isUploading(),
          external: node.isExternal(),
        });
      }
      if ($isElementNode(node)) {
        for (const child of node.getChildren()) visit(child);
      }
    };
    visit($getRoot());
    return found;
  });

const ready = async (h: Harness) => {
  await waitFor(() => h.root());
  await waitFor(() => h.editor());
};

describe("image uploads", () => {
  test("shows a placeholder, then the image, then focuses the alt text field", async () => {
    const pending = deferred<RichTextImageUploadResult>();
    const upload = mock((_file: File) => pending.promise);
    const h = renderEditor({ upload });
    await ready(h);
    // focus is in the editor, so the alt text field may take it
    h.root().focus();

    const file = png("hero.png");
    pickFiles(h.container, [file]);

    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "Uploading hero.png",
      ),
    );
    expect(upload).toHaveBeenCalledTimes(1);
    // the exact File is handed to the consumer, never re-encoded
    expect(upload.mock.calls[0]?.[0]).toBe(file);
    expect(h.latest().isUploading).toBe(true);
    // a placeholder exports nothing
    expect(h.latest().getHTML()).not.toContain("<img");

    await act(async () => {
      pending.resolve({ src: `${CDN}/hero.png`, width: 1200, height: 600 });
    });

    await waitFor(() =>
      expect(
        h.container.querySelector(`img[src="${CDN}/hero.png"]`) === null,
      ).toBe(false),
    );
    expect(h.latest().isUploading).toBe(false);
    expect(h.latest().hasMissingAltText).toBe(true);
    expect(h.latest().isEmpty).toBe(false);
    expect(Boolean(screen.getByText("Add alt text"))).toBe(true);

    const alt = await screen.findByLabelText(/Alt text/);
    await waitFor(() => expect(document.activeElement?.id).toBe(alt.id));
    expect(alt.getAttribute("aria-invalid")).toBe("true");
    fireEvent.change(alt, { target: { value: "Spring sale banner" } });

    await waitFor(() => expect(h.latest().hasMissingAltText).toBe(false));
    expect(screen.queryByText("Add alt text") === null).toBe(true);
    // natural width 1200 is clamped to the 600px default max
    expect(h.latest().getHTML()).toContain(
      `<img src="${CDN}/hero.png" alt="Spring sale banner" width="600" ${EMAIL_STYLE}>`,
    );
  });

  test("does not take focus when focus has left the editor", async () => {
    const pending = deferred<RichTextImageUploadResult>();
    const h = renderEditor({ upload: () => pending.promise });
    await ready(h);
    const outside = document.createElement("input");
    document.body.appendChild(outside);
    try {
      h.root().focus();
      pickFiles(h.container, [png()]);
      await waitFor(() =>
        expect(Boolean(screen.getByRole("status"))).toBe(true),
      );
      outside.focus();
      await act(async () => {
        pending.resolve({ src: `${CDN}/a.png`, width: 300 });
      });
      await waitFor(() => expect(h.latest().isUploading).toBe(false));
      expect(document.activeElement === outside).toBe(true);
      // no settings opened, but the warning shows
      expect(screen.queryByLabelText(/Alt text/) === null).toBe(true);
      expect(Boolean(screen.getByText("Add alt text"))).toBe(true);
    } finally {
      outside.remove();
    }
  });

  test("removes the placeholder and reports a failed upload", async () => {
    const pending = deferred<RichTextImageUploadResult>();
    const h = renderEditor({ upload: () => pending.promise });
    await ready(h);

    pickFiles(h.container, [png("broken.png")]);
    await waitFor(() => expect(Boolean(screen.getByRole("status"))).toBe(true));

    await act(async () => {
      pending.reject(new Error("503 from storage"));
    });

    await waitFor(() => expect(h.errors).toHaveLength(1));
    expect(h.errors[0]?.code).toBe("upload-failed");
    expect(h.errors[0]?.file?.name).toBe("broken.png");
    // the message is plain language, never the raw failure
    expect(h.errors[0]?.message).not.toContain("503");
    await waitFor(() =>
      expect(screen.queryByRole("status") === null).toBe(true),
    );
    expect(h.latest().isUploading).toBe(false);
    expect(h.latest().getHTML()).not.toContain("<img");
  });

  test("two uploads settling out of order each land correctly", async () => {
    const a = deferred<RichTextImageUploadResult>();
    const b = deferred<RichTextImageUploadResult>();
    const h = renderEditor({
      upload: (f) => (f.name === "a.png" ? a.promise : b.promise),
    });
    await ready(h);
    await act(async () => {
      h.editor().dispatchCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND, [
        png("a.png"),
        png("b.png"),
      ]);
    });
    await act(async () => {
      b.resolve({ src: `${CDN}/b.png` });
    });
    await act(async () => {
      a.reject(new Error("x"));
    });
    await waitFor(() => expect(h.latest().isUploading).toBe(false));
    const html = h.latest().getHTML();
    expect(html).toContain(`${CDN}/b.png`);
    expect(html.match(/<img/g)).toHaveLength(1);
    expect(h.errors.map((e) => e.file?.name)).toEqual(["a.png"]);
  });

  test("an upload result that is not https counts as failed", async () => {
    const h = renderEditor({
      upload: async () => ({ src: "http://localhost:9000/a.png" }),
    });
    await ready(h);
    pickFiles(h.container, [png()]);
    await waitFor(() => expect(h.errors[0]?.code).toBe("upload-failed"));
    expect(h.latest().getHTML()).not.toContain("<img");
  });

  test("allowInsecureHttp accepts an http upload result, clamped", async () => {
    const h = renderEditor({
      allowInsecureHttp: true,
      upload: async () => ({
        src: "http://localhost:9000/a.png",
        width: 99999,
      }),
    });
    await ready(h);
    pickFiles(h.container, [png()]);
    await waitFor(() =>
      expect(h.latest().getHTML()).toContain(
        '<img src="http://localhost:9000/a.png" alt="" width="600"',
      ),
    );
  });

  test("an upload result refused by isAllowedSrc counts as failed", async () => {
    const h = renderEditor({
      isAllowedSrc: (src) => src.startsWith(`${CDN}/`),
      upload: async () => ({ src: "https://elsewhere.example/a.png" }),
    });
    await ready(h);
    pickFiles(h.container, [png()]);
    await waitFor(() => expect(h.errors[0]?.code).toBe("upload-failed"));
  });

  test("rejects unsupported and oversized files before uploading", async () => {
    const upload = mock(async () => ({ src: `${CDN}/x.png` }));
    const h = renderEditor({ upload, maxBytes: 1024 });
    await ready(h);

    pickFiles(h.container, [
      new File(["<svg/>"], "logo.svg", { type: "image/svg+xml" }),
      png("huge.png", 4096),
    ]);

    await waitFor(() => expect(h.errors).toHaveLength(2));
    expect(h.errors.map((e) => e.code)).toEqual([
      "unsupported-type",
      "file-too-large",
    ]);
    expect(h.errors[1]?.message).toContain("1 KB");
    expect(upload).not.toHaveBeenCalled();
  });

  test("shows the error inline when no onError is given", async () => {
    const h = renderEditor({ withOnError: false });
    await ready(h);
    pickFiles(h.container, [
      new File(["x"], "notes.txt", { type: "text/plain" }),
    ]);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("isn't a supported image");
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(screen.queryByRole("alert") === null).toBe(true);
  });
});

describe("undo and redo around uploads", () => {
  test("undo after typing during an upload never leaves a stuck placeholder", async () => {
    const d = deferred<RichTextImageUploadResult>();
    const h = renderEditor({ upload: () => d.promise });
    await ready(h);
    await act(async () => {
      h.editor().update(() => {
        $getRoot().selectEnd();
      });
    });
    await act(async () => {
      h.editor().dispatchCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND, [png()]);
    });
    // a later keystroke is its own undo step (history merges within 1s)
    await new Promise((r) => setTimeout(r, 1100));
    await act(async () => {
      h.editor().update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.insertText("hello");
      });
    });
    await act(async () => {
      d.resolve({ src: `${CDN}/a.png`, width: 300 });
    });
    await waitFor(() => expect(h.latest().isUploading).toBe(false));

    await act(async () => {
      h.editor().dispatchCommand(UNDO_COMMAND, undefined);
    });
    await waitFor(() => expect(h.latest().getHTML()).not.toContain("hello"));
    await waitFor(() => expect(h.latest().isUploading).toBe(false));
    expect(h.container.querySelector('[role="status"]') === null).toBe(true);
    // the settled upload was re-applied to the restored placeholder
    expect(h.latest().getHTML()).toContain(`${CDN}/a.png`);
  });

  test("an upload settling after its placeholder was undone applies on redo", async () => {
    const d = deferred<RichTextImageUploadResult>();
    const h = renderEditor({ upload: () => d.promise });
    await ready(h);
    // some text first, so the insert is an undo step of its own
    await act(async () => {
      h.editor().update(() => {
        $getRoot().selectEnd();
        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.insertText("Intro");
      });
    });
    await act(async () => {
      h.editor().dispatchCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND, [png()]);
    });
    await waitFor(() => expect(h.latest().isUploading).toBe(true));
    await act(async () => {
      h.editor().dispatchCommand(UNDO_COMMAND, undefined);
    });
    await waitFor(() => expect(imageNodes(h.editor())).toHaveLength(0));
    await act(async () => {
      d.resolve({ src: `${CDN}/late.png`, width: 200 });
    });
    await act(async () => {
      h.editor().dispatchCommand(REDO_COMMAND, undefined);
    });
    await waitFor(() =>
      expect(h.latest().getHTML()).toContain(`${CDN}/late.png`),
    );
    expect(h.latest().isUploading).toBe(false);
  });

  test("a placeholder with no running or settled upload is removed", async () => {
    const h = renderEditor();
    await ready(h);
    await act(async () => {
      h.editor().update(() => {
        $getRoot().append(
          $createRichTextImageNode({ src: "", uploading: true }),
        );
      });
    });
    await waitFor(() => expect(imageNodes(h.editor())).toHaveLength(0));
    expect(h.latest().isUploading).toBe(false);
  });
});

describe("paste and drop", () => {
  test("pasting an image file uploads it and inserts the image", async () => {
    const upload = mock(async (_file: File) => ({
      src: `${CDN}/pasted.gif`,
      width: 320,
    }));
    const h = renderEditor({ upload });
    await ready(h);

    const gif = new File([new Uint8Array(8)], "dance.gif", {
      type: "image/gif",
    });
    const data = new DataTransfer();
    data.items.add(gif);
    await act(async () => {
      h.root().dispatchEvent(
        new ClipboardEvent("paste", {
          clipboardData: data,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    // GIFs go to the consumer as-is, so they stay animated
    expect(upload.mock.calls[0]?.[0]).toBe(gif);
    await waitFor(() =>
      expect(h.latest().getHTML()).toContain(
        `<img src="${CDN}/pasted.gif" alt="" width="320" ${EMAIL_STYLE}>`,
      ),
    );
    expect(h.latest().hasMissingAltText).toBe(true);
  });

  test("pasting text alongside a picture of it keeps the text", async () => {
    const upload = mock(async () => ({ src: `${CDN}/x.png` }));
    const h = renderEditor({ upload });
    await ready(h);
    const data = new DataTransfer();
    data.items.add(png("rendition.png"));
    data.setData("text/html", "<p>Quarterly numbers</p>");
    data.setData("text/plain", "Quarterly numbers");
    await act(async () => {
      h.root().dispatchEvent(
        new ClipboardEvent("paste", {
          clipboardData: data,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    expect(upload).not.toHaveBeenCalled();
  });

  test("dropped image files are uploaded", async () => {
    const upload = mock(async () => ({ src: `${CDN}/dropped.webp` }));
    const h = renderEditor({ upload });
    await ready(h);
    const webp = new File([new Uint8Array(8)], "drop.webp", {
      type: "image/webp",
    });
    await act(async () => {
      h.editor().dispatchCommand(DRAG_DROP_PASTE, [webp]);
    });
    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        h.container.querySelector(`img[src="${CDN}/dropped.webp"]`) === null,
      ).toBe(false),
    );
  });
});

describe("insert from link", () => {
  test("rejects a non-https link (reporting invalid-url) and inserts an https one", async () => {
    const h = renderEditor();
    const trigger = await screen.findByLabelText("Insert image from link");
    fireEvent.click(trigger);

    const input = await screen.findByLabelText("Image link");
    fireEvent.change(input, { target: { value: "http://example.com/a.png" } });
    fireEvent.click(screen.getByRole("button", { name: "Insert" }));
    expect((await screen.findByRole("alert")).textContent).toContain(
      "https://",
    );
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(
      h.container.querySelector("[data-rich-text-image] img") === null,
    ).toBe(true);
    expect(h.errors.at(-1)?.code).toBe("invalid-url");
    expect(h.errors.at(-1)?.url).toBe("http://example.com/a.png");

    fireEvent.change(input, {
      target: { value: "data:image/png;base64,AAAA" },
    });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(
      h.container.querySelector("[data-rich-text-image] img") === null,
    ).toBe(true);

    fireEvent.change(input, { target: { value: `${CDN}/linked.jpg` } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() =>
      expect(
        h.container.querySelector(`img[src="${CDN}/linked.jpg"]`) === null,
      ).toBe(false),
    );
    expect(screen.queryByLabelText("Image link") === null).toBe(true);
    // alt text is asked for straight away (focus was in the link form)
    expect(Boolean(await screen.findByLabelText(/Alt text/))).toBe(true);
    expect(h.latest().hasMissingAltText).toBe(true);
  });

  test("refuses a link isAllowedSrc rejects", async () => {
    const h = renderEditor({ isAllowedSrc: (src) => src.startsWith(CDN) });
    fireEvent.click(await screen.findByLabelText("Insert image from link"));
    const input = await screen.findByLabelText("Image link");
    fireEvent.change(input, {
      target: { value: "https://elsewhere.example/a.png" },
    });
    fireEvent.keyDown(input, { key: "Enter" });
    expect((await screen.findByRole("alert")).textContent).toContain(
      "elsewhere.example",
    );
    expect(h.errors.at(-1)?.code).toBe("invalid-url");
    expect(
      h.container.querySelector("[data-rich-text-image] img") === null,
    ).toBe(true);
  });
});

describe("alt text and width edits", () => {
  test("each alt text edit is its own undo step", async () => {
    const h = renderEditor({
      defaultContent: `<p>Hi</p><img src="${CDN}/a.png" alt="" width="300">`,
    });
    await ready(h);
    await waitFor(() =>
      expect(
        h.container.querySelector("[data-rich-text-image] img") === null,
      ).toBe(false),
    );
    fireEvent.click(screen.getByText("Add alt text"));
    const alt = await screen.findByLabelText(/Alt text/);
    fireEvent.focus(alt);
    fireEvent.change(alt, { target: { value: "C" } });
    fireEvent.change(alt, { target: { value: "Cat" } });
    await waitFor(() => expect(h.latest().getHTML()).toContain('alt="Cat"'));

    await act(async () => {
      h.editor().dispatchCommand(UNDO_COMMAND, undefined);
    });
    // the whole alt edit undoes at once, and the image stays
    await waitFor(() => expect(h.latest().getHTML()).toContain('alt=""'));
    expect(h.latest().getHTML()).toContain(`${CDN}/a.png`);
    expect(h.latest().hasMissingAltText).toBe(true);
  });

  test("width presets resize within the max width", async () => {
    const h = renderEditor({
      defaultContent: `<img src="${CDN}/a.png" alt="A" width="600">`,
    });
    const img = await waitFor(() => {
      const el = h.container.querySelector("[data-rich-text-image] img");
      if (!el) throw new Error("no image");
      return el;
    });
    await act(async () => {
      fireEvent.click(img);
    });
    const half = await screen.findByLabelText("50% width (300 pixels)");
    fireEvent.click(half);
    await waitFor(() => expect(h.latest().getHTML()).toContain('width="300"'));

    const px = screen.getByLabelText("Width in pixels");
    fireEvent.change(px, { target: { value: "5000" } });
    fireEvent.blur(px);
    await waitFor(() => expect(h.latest().getHTML()).toContain('width="600"'));
  });
});

describe("keyboard access", () => {
  for (const [name, command] of [
    ["Enter", KEY_ENTER_COMMAND],
    ["Space", KEY_SPACE_COMMAND],
  ] as const) {
    test(`${name} on a selected image opens its settings, Escape closes them`, async () => {
      const h = renderEditor({
        defaultContent: `<p>Before</p><img src="${CDN}/a.png" alt="" width="300"><p>After</p>`,
      });
      await ready(h);
      await waitFor(() => expect(imageNodes(h.editor())).toHaveLength(1));
      const key = imageNodes(h.editor())[0]?.key ?? "";

      // arrow keys land a node selection on a block image; set it directly
      await act(async () => {
        h.editor().update(() => {
          const selection = $createNodeSelection();
          selection.add(key);
          $setSelection(selection);
        });
      });
      // screen readers hear how to reach the settings
      await waitFor(() =>
        expect(screen.getByText(/Image selected/).textContent).toContain(
          "Press Enter",
        ),
      );
      await act(async () => {
        h.editor().dispatchCommand(
          command as typeof KEY_ENTER_COMMAND,
          new KeyboardEvent("keydown", { key: name === "Space" ? " " : name }),
        );
      });
      const alt = await screen.findByLabelText(/Alt text/);
      await waitFor(() => expect(document.activeElement?.id).toBe(alt.id));

      fireEvent.keyDown(alt, { key: "Escape" });
      await waitFor(() =>
        expect(screen.queryByLabelText(/Alt text/) === null).toBe(true),
      );
    });
  }

  test("an image inside a paragraph is lifted to a block of its own", async () => {
    const h = renderEditor({
      defaultContent: `<p>Before<img src="${CDN}/a.png" alt="A" width="300">After</p><p><img src="${CDN}/b.png" alt="B"></p>`,
    });
    await waitFor(() => expect(imageNodes(h.editor())).toHaveLength(2));
    await waitFor(() =>
      expect(
        h
          .editor()
          .getEditorState()
          .read(() =>
            $getRoot()
              .getChildren()
              .map((c) => c.getType()),
          ),
      ).toEqual([
        "paragraph",
        "rich-text-image",
        "paragraph",
        "rich-text-image",
      ]),
    );
    const html = h.latest().getHTML();
    expect(html).not.toMatch(/<p[^>]*>(?:(?!<\/p>).)*<img/);
    expect(html).toContain("Before");
    expect(html).toContain("After");
  });
});

describe("HTML round-trip", () => {
  test("imports existing images and exports them unchanged", async () => {
    const html = `<p>Hello</p><img src="${CDN}/party.gif" alt="Confetti" width="300" ${EMAIL_STYLE}>`;
    const h = renderEditor({ defaultContent: html });
    await waitFor(() =>
      expect(
        h.container.querySelector("[data-rich-text-image] img") === null,
      ).toBe(false),
    );
    const out = h.latest().getHTML();
    expect(out).toContain(
      `<img src="${CDN}/party.gif" alt="Confetti" width="300" ${EMAIL_STYLE}>`,
    );
    expect(h.latest().hasMissingAltText).toBe(false);

    // feeding the export back in produces the same image markup
    cleanup();
    const again = renderEditor({ defaultContent: out });
    await waitFor(() =>
      expect(
        again.container.querySelector("[data-rich-text-image] img") === null,
      ).toBe(false),
    );
    expect(again.latest().getHTML()).toContain(
      `<img src="${CDN}/party.gif" alt="Confetti" width="300" ${EMAIL_STYLE}>`,
    );
  });

  test("clamps imported widths and ignores non-numeric ones", async () => {
    const h = renderEditor({
      defaultContent: `<p><img src="${CDN}/a.png" alt="a" width="5000"><img src="${CDN}/b.png" alt="b" width="100&quot; onerror=&quot;x"></p>`,
    });
    await waitFor(() => expect(h.latest().getHTML()).toContain("b.png"));
    const out = h.latest().getHTML();
    expect(out).toContain(`<img src="${CDN}/a.png" alt="a" width="600"`);
    expect(out).toContain(`<img src="${CDN}/b.png" alt="b" ${EMAIL_STYLE}>`);
    expect(out).not.toContain("onerror");
  });

  test("respects a custom maxWidth on import and export", async () => {
    const h = renderEditor({
      maxWidth: 480,
      defaultContent: `<img src="${CDN}/a.png" alt="a" width="600">`,
    });
    await waitFor(() => expect(h.latest().getHTML()).toContain('width="480"'));
  });

  test("reads a pixel width from an inline style", async () => {
    const h = renderEditor({
      defaultContent: `<img src="${CDN}/a.png" alt="A" style="width: 240px">`,
    });
    await waitFor(() =>
      expect(
        h.container.querySelector("[data-rich-text-image] img") === null,
      ).toBe(false),
    );
    expect(h.latest().getHTML()).toContain('width="240"');
  });

  test("drops data: and relative images on import", async () => {
    const h = renderEditor({
      defaultContent:
        '<p>a<img src="data:image/png;base64,AAAA" alt="x">b<img src="/local.png" alt="y"></p>',
    });
    await waitFor(() => expect(h.updates.length).toBeGreaterThan(0));
    const out = h.latest().getHTML();
    expect(out).not.toContain("<img");
    expect(out).not.toContain("data:");
  });
});

describe("external images", () => {
  test("an image from a host isAllowedSrc refuses becomes a placeholder until replaced", async () => {
    const upload = mock(async (_file: File) => ({
      src: `${CDN}/copy.png`,
      width: 400,
    }));
    const h = renderEditor({
      upload,
      isAllowedSrc: (src) => new URL(src).host === "cdn.example.com",
      defaultContent: `<p>Hi</p><img src="https://tracker.example/p.gif" alt="Logo" width="300"><img src="${CDN}/ok.png" alt="ok">`,
    });
    await waitFor(() => expect(h.latest().hasExternalImages).toBe(true));
    // the external image is never loaded or exported
    expect(
      h.container.querySelector('img[src^="https://tracker.example"]') === null,
    ).toBe(true);
    expect(h.latest().getHTML()).not.toContain("tracker.example");
    expect(h.latest().getHTML()).toContain(`${CDN}/ok.png`);
    expect(Boolean(screen.getByText(/hosted on tracker\.example/))).toBe(true);

    const external = imageNodes(h.editor()).find((n) => n.external);
    await act(async () => {
      h.editor().dispatchCommand(REPLACE_RICH_TEXT_IMAGE_COMMAND, {
        key: external?.key ?? "",
        file: png("copy.png"),
      });
    });
    await waitFor(() => expect(h.latest().hasExternalImages).toBe(false));
    // the replacement keeps the alt text the image already had
    expect(h.latest().getHTML()).toContain(
      `<img src="${CDN}/copy.png" alt="Logo" width="400"`,
    );
  });

  test("a plain http image is external unless allowInsecureHttp", async () => {
    const h = renderEditor({
      defaultContent: '<img src="http://ex.com/a.png" alt="a">',
    });
    await waitFor(() => expect(h.latest().hasExternalImages).toBe(true));
    expect(h.latest().getHTML()).not.toContain("<img");
  });
});

describe("turning images on and off", () => {
  test("toggling images after mount works without remounting errors", async () => {
    const upload = async () => ({ src: `${CDN}/a.png` });
    const updates: RichTextEditorUpdate[] = [];
    const view = (images?: RichTextImageOptions) => (
      <RichTextEditor
        defaultContent={`<p>Hi<img src="${CDN}/a.png" alt="A"></p>`}
        onUpdate={(u) => updates.push(u)}
        images={images}
      />
    );
    const { container, rerender } = render(view());
    await waitFor(() =>
      expect(container.querySelector('[contenteditable="true"]') === null).toBe(
        false,
      ),
    );
    // off: no image controls, and the image in defaultContent was dropped
    expect(screen.queryByLabelText("Upload image") === null).toBe(true);
    await waitFor(() => expect(updates.length).toBeGreaterThan(0));
    expect(updates.at(-1)?.getHTML()).not.toContain("<img");

    rerender(view({ upload }));
    await waitFor(() =>
      expect(Boolean(screen.getByLabelText("Upload image"))).toBe(true),
    );
    rerender(view());
    await waitFor(() =>
      expect(screen.queryByLabelText("Upload image") === null).toBe(true),
    );
  });
});

describe("without images", () => {
  test("keeps the toolbar and import behavior unchanged", async () => {
    const updates: RichTextEditorUpdate[] = [];
    const { container } = render(
      <RichTextEditor
        defaultContent={`<p>Hi<img src="${CDN}/a.png" alt="A"></p>`}
        onUpdate={(u) => updates.push(u)}
      />,
    );
    await waitFor(() =>
      expect(container.querySelector('[contenteditable="true"]') === null).toBe(
        false,
      ),
    );
    expect(screen.queryByLabelText("Upload image") === null).toBe(true);
    expect(screen.queryByLabelText("Insert image from link") === null).toBe(
      true,
    );
    expect(container.querySelector('input[type="file"]') === null).toBe(true);
    await waitFor(() => expect(updates.length).toBeGreaterThan(0));
    const last = updates.at(-1);
    expect(last?.getHTML()).not.toContain("<img");
    expect(last?.hasMissingAltText).toBe(false);
    expect(last?.isUploading).toBe(false);
    expect(last?.hasExternalImages).toBe(false);
  });
});

describe("RichTextContent images", () => {
  test("strips images unless allowImages is set", () => {
    const { container } = render(
      <RichTextContent html='<p>hi<img src="https://tracker.example/p.gif?u=123" width="1"></p>' />,
    );
    expect(container.querySelector("img") === null).toBe(true);
    expect(container.textContent).toBe("hi");
  });

  test("renders hosted images with only src, alt, and a pixel width", () => {
    const { container } = render(
      <RichTextContent
        allowImages
        html={`<p><img src="${CDN}/a.png" alt="A cat" width="300" style="position:fixed" class="fixed inset-0 z-50" srcset="https://evil.example/x 2x" onerror="alert(1)"></p>`}
      />,
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe(`${CDN}/a.png`);
    expect(img?.getAttribute("alt")).toBe("A cat");
    expect(img?.getAttribute("width")).toBe("300");
    expect(
      Array.from(img?.attributes ?? [])
        .map((a) => a.name)
        .sort(),
    ).toEqual(["alt", "src", "width"]);
  });

  test("drops unsafe image sources and non-numeric widths", () => {
    const html = [
      "<img src=x onerror=alert(1)>",
      '<img src="javascript:alert(1)">',
      '<img src="//evil.example/a.png">',
      '<img src="data:image/svg+xml;base64,PHN2Zz4=">',
      '<img src="http://plain.example/a.png">',
      '<img src="https://ok.example/a.png" width="100%">',
      '<p>t <img src=" HTTPS://ok.example/b.png" alt="b"></p>',
      '<svg><image href="https://evil.example/x"></image></svg>',
      '<a href="https://x.example"><img src="https://ok.example/c.png" alt="c"></a>',
    ].join("");
    const { container } = render(<RichTextContent allowImages html={html} />);
    const imgs = Array.from(container.querySelectorAll("img"));
    expect(imgs.map((i) => i.getAttribute("src"))).toEqual([
      "https://ok.example/a.png",
      "https://ok.example/b.png",
      "https://ok.example/c.png",
    ]);
    expect(imgs[0]?.hasAttribute("width")).toBe(false);
    expect(container.querySelector("svg, image") === null).toBe(true);
  });

  test("allowInsecureHttp renders http images", () => {
    const { container } = render(
      <RichTextContent
        allowImages
        allowInsecureHttp
        html='<img src="http://localhost:9000/a.png" alt="a">'
      />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "http://localhost:9000/a.png",
    );
  });
});

describe("helpers", () => {
  test("checkImageSrc is https-only by default", () => {
    expect(checkImageSrc(`${CDN}/a.png`)).toBe("allowed");
    expect(checkImageSrc("http://localhost:3000/a.png")).toBe("external");
    expect(
      checkImageSrc("http://localhost:3000/a.png", { allowInsecureHttp: true }),
    ).toBe("allowed");
    expect(checkImageSrc(`${CDN}/a.png`, { isAllowedSrc: () => false })).toBe(
      "external",
    );
    expect(checkImageSrc("data:image/png;base64,AAAA")).toBe("invalid");
    expect(checkImageSrc("blob:https://a.example/1")).toBe("invalid");
    expect(checkImageSrc("/a.png")).toBe("invalid");
    expect(checkImageSrc("//cdn.example.com/a.png")).toBe("invalid");
    expect(checkImageSrc("")).toBe("invalid");
    expect(isSafeImageSrc(`${CDN}/a.png`)).toBe(true);
    expect(isSafeImageSrc("http://a.example/a.png")).toBe(false);
    expect(isSafeImageSrc("http://a.example/a.png", true)).toBe(true);
  });

  test("isHttpsUrl requires https", () => {
    expect(isHttpsUrl(" https://a.example/x.jpg ")).toBe(true);
    expect(isHttpsUrl("http://a.example/x.jpg")).toBe(false);
    expect(isHttpsUrl("ftp://a.example/x.jpg")).toBe(false);
    expect(isHttpsUrl("a.example/x.jpg")).toBe(false);
  });

  test("validateImageFile checks type and size", () => {
    expect(validateImageFile(png(), {})).toBeNull();
    expect(
      validateImageFile(new File(["x"], "a.gif", { type: "image/gif" }), {}),
    ).toBeNull();
    expect(
      validateImageFile(new File(["x"], "a.bmp", { type: "image/bmp" }), {})
        ?.message,
    ).toContain("JPEG, PNG, WebP, or GIF");
    expect(
      validateImageFile(png("a.png", 3 * 1024 * 1024), {
        maxBytes: 2 * 1024 * 1024,
      })?.message,
    ).toBe('"a.png" is 3 MB. Images must be 2 MB or smaller.');
    expect(
      validateImageFile(new File(["x"], "a.heic", { type: "" }), {
        accept: ".heic",
      }),
    ).toBeNull();
  });
});

/** A paste event carrying another editor's data in Lexical's clipboard format */
const lexicalPaste = (nodes: unknown[]) => {
  const payload = JSON.stringify({ namespace: "RichTextEditor", nodes });
  const data = new DataTransfer();
  data.setData("application/x-lexical-editor", payload);
  data.setData("text/plain", "pasted");
  return new ClipboardEvent("paste", {
    clipboardData: data,
    bubbles: true,
    cancelable: true,
  });
};

const serializedImage = (fields: Record<string, unknown>) => ({
  type: "rich-text-image",
  version: 1,
  src: `${CDN}/a.png`,
  alt: "a",
  width: 300,
  ...fields,
});

const pasteInto = async (h: Harness, nodes: unknown[]) => {
  await act(async () => {
    h.editor().update(() => {
      $getRoot().selectEnd();
    });
  });
  await act(async () => {
    h.editor().dispatchCommand(PASTE_COMMAND, lexicalPaste(nodes));
  });
  await new Promise((r) => setTimeout(r, 20));
};

describe("re-review fixes", () => {
  test("toggling images keeps the content, undo history, and editor surface", async () => {
    const updates: RichTextEditorUpdate[] = [];
    let editor: LexicalEditor | null = null;
    const view = (images?: RichTextImageOptions) => (
      <RichTextEditor
        defaultContent="<p>seed</p>"
        onUpdate={(u) => updates.push(u)}
        images={images}
        plugins={
          <EditorCapture
            onReady={(e) => {
              editor = e;
            }}
          />
        }
      />
    );
    const { container, rerender } = render(view());
    await waitFor(() => expect(editor === null).toBe(false));
    const ed = editor as unknown as LexicalEditor;
    await new Promise((r) => setTimeout(r, 20));
    await act(async () => {
      ed.update(() => {
        $getRoot().selectEnd();
        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.insertText(" EDITED");
      });
    });
    await waitFor(() =>
      expect(updates.at(-1)?.getHTML()).toContain("seed EDITED"),
    );
    const surface = container.querySelector("[contenteditable]");

    rerender(view({ upload: async () => ({ src: `${CDN}/a.png` }) }));
    await waitFor(() =>
      expect(Boolean(screen.getByLabelText("Upload image"))).toBe(true),
    );
    rerender(view());
    await waitFor(() =>
      expect(screen.queryByLabelText("Upload image") === null).toBe(true),
    );
    expect(container.querySelector("[contenteditable]") === surface).toBe(true);
    expect(
      ed.getEditorState().read(() => $getRoot().getTextContent()),
    ).toContain("seed EDITED");

    await act(async () => {
      ed.dispatchCommand(UNDO_COMMAND, undefined);
    });
    await waitFor(() =>
      expect(
        ed.getEditorState().read(() => $getRoot().getTextContent()),
      ).not.toContain("EDITED"),
    );
  });

  test("pasted editor data with images is dropped while images are off", async () => {
    const updates: RichTextEditorUpdate[] = [];
    let editor: LexicalEditor | null = null;
    const { container } = render(
      <RichTextEditor
        onUpdate={(u) => updates.push(u)}
        plugins={
          <EditorCapture
            onReady={(e) => {
              editor = e;
            }}
          />
        }
      />,
    );
    await waitFor(() => expect(editor === null).toBe(false));
    const h = {
      editor: () => editor as unknown as LexicalEditor,
    } as Harness;
    await pasteInto(h, [
      serializedImage({}),
      serializedImage({ src: "https://evil.example/x.png" }),
    ]);
    expect(imageNodes(h.editor())).toHaveLength(0);
    expect(container.querySelector("[data-rich-text-image]") === null).toBe(
      true,
    );
    expect(updates.at(-1)?.getHTML() ?? "").not.toContain("<img");
  });

  test("pasted editor data is coerced: odd fields are fixed, bad sources dropped", async () => {
    const h = renderEditor({
      isAllowedSrc: (src) => src.startsWith(`${CDN}/`),
    });
    await ready(h);
    await pasteInto(h, [
      serializedImage({ alt: 42, width: "abc" }),
      serializedImage({ src: `${CDN}/b.png`, width: -5 }),
      serializedImage({ src: `${CDN}/c.png`, width: 99999 }),
      serializedImage({ src: { x: 1 } }),
      serializedImage({ src: "https://evil.example/d.png" }),
    ]);
    await waitFor(() => expect(h.latest().hasExternalImages).toBe(true));
    const html = h.latest().getHTML();
    // alt 42 is not text, so it is treated as missing
    expect(html).toContain(`<img src="${CDN}/a.png" alt="" ${EMAIL_STYLE}>`);
    expect(html).toContain(`<img src="${CDN}/b.png" alt="a" ${EMAIL_STYLE}>`);
    expect(html).toContain(`<img src="${CDN}/c.png" alt="a" width="600"`);
    expect(html).not.toContain("evil.example");
    expect(h.latest().hasMissingAltText).toBe(true);
    // the object source was dropped; the evil one is an external placeholder
    expect(imageNodes(h.editor()).map((n) => n.external)).toEqual([
      false,
      false,
      false,
      true,
    ]);
  });

  test("a failed replacement upload restores the external placeholder", async () => {
    const h = renderEditor({
      isAllowedSrc: (src) => src.startsWith(`${CDN}/`),
      upload: async () => {
        throw new Error("storage down");
      },
      defaultContent: '<img src="https://other.example/a.png" alt="Cat">',
    });
    await waitFor(() => expect(h.latest().hasExternalImages).toBe(true));
    const key = imageNodes(h.editor())[0]?.key ?? "";
    await act(async () => {
      h.editor().dispatchCommand(REPLACE_RICH_TEXT_IMAGE_COMMAND, {
        key,
        file: png("copy.png"),
      });
    });
    await waitFor(() => expect(h.errors[0]?.code).toBe("upload-failed"));
    await waitFor(() => expect(h.latest().isUploading).toBe(false));
    expect(imageNodes(h.editor())).toEqual([
      { key, uploading: false, external: true },
    ]);
    expect(h.latest().hasExternalImages).toBe(true);
    expect(screen.getByText(/Alt text: Cat/)).toBeTruthy();
  });

  test("turning images off mid-upload ends the upload and reports it", async () => {
    const pending = deferred<RichTextImageUploadResult>();
    const updates: RichTextEditorUpdate[] = [];
    let editor: LexicalEditor | null = null;
    const images: RichTextImageOptions = {
      upload: () => pending.promise,
      onError: () => {},
    };
    const view = (on: boolean) => (
      <RichTextEditor
        onUpdate={(u) => updates.push(u)}
        images={on ? images : undefined}
        plugins={
          <EditorCapture
            onReady={(e) => {
              editor = e;
            }}
          />
        }
      />
    );
    const { rerender } = render(view(true));
    await waitFor(() => expect(editor === null).toBe(false));
    const ed = editor as unknown as LexicalEditor;
    await act(async () => {
      ed.dispatchCommand(UPLOAD_RICH_TEXT_IMAGES_COMMAND, [png()]);
    });
    await waitFor(() => expect(updates.at(-1)?.isUploading).toBe(true));

    rerender(view(false));
    await waitFor(() => expect(imageNodes(ed)).toHaveLength(0));
    expect(updates.at(-1)?.isUploading).toBe(false);

    // a late result changes nothing, and turning images back on is clean
    await act(async () => {
      pending.resolve({ src: `${CDN}/late.png` });
    });
    rerender(view(true));
    await new Promise((r) => setTimeout(r, 20));
    expect(imageNodes(ed)).toHaveLength(0);
    expect(updates.at(-1)?.isUploading).toBe(false);
  });

  test("settled upload outcomes are bounded", () => {
    const outcomes = new Map<string, number>();
    for (let i = 0; i < 120; i++) rememberUploadOutcome(outcomes, `k${i}`, i);
    expect(outcomes.size).toBe(50);
    expect(outcomes.has("k0")).toBe(false);
    expect(outcomes.get("k119")).toBe(119);
    // remembering a key again moves it to the newest end
    rememberUploadOutcome(outcomes, "k70", 1, 50);
    rememberUploadOutcome(outcomes, "new", 2, 50);
    expect(outcomes.has("k70")).toBe(true);
    expect(outcomes.has("k71")).toBe(false);
  });

  test("a stricter isAllowedSrc after mount turns existing images external", async () => {
    const updates: RichTextEditorUpdate[] = [];
    const view = (allowed: string[]) => (
      <RichTextEditor
        defaultContent={`<img src="${CDN}/a.png" alt="A"><img src="https://old.example/b.png" alt="B">`}
        onUpdate={(u) => updates.push(u)}
        images={{
          upload: async () => ({ src: `${CDN}/x.png` }),
          isAllowedSrc: (src) => allowed.includes(new URL(src).host),
        }}
      />
    );
    const both = ["cdn.example.com", "old.example"];
    const { rerender } = render(view(both));
    await waitFor(() => expect(updates.at(-1)?.getHTML()).toContain("b.png"));
    expect(updates.at(-1)?.hasExternalImages).toBe(false);

    rerender(view(["cdn.example.com"]));
    await waitFor(() => expect(updates.at(-1)?.hasExternalImages).toBe(true));
    expect(updates.at(-1)?.getHTML()).not.toContain("old.example");
    expect(updates.at(-1)?.getHTML()).toContain(`${CDN}/a.png`);

    // and looser again brings it back
    rerender(view(both));
    await waitFor(() => expect(updates.at(-1)?.hasExternalImages).toBe(false));
    expect(updates.at(-1)?.getHTML()).toContain("old.example");
  });

  test("RichTextContent applies isAllowedSrc", () => {
    const { container } = render(
      <RichTextContent
        allowImages
        isAllowedSrc={(src) => src.startsWith(`${CDN}/`)}
        html={`<img src="${CDN}/a.png" alt="a"><img src="https://other.example/b.png" alt="b">`}
      />,
    );
    expect(
      Array.from(container.querySelectorAll("img")).map((i) =>
        i.getAttribute("src"),
      ),
    ).toEqual([`${CDN}/a.png`]);
  });
});
