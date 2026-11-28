import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";

import {
  ATTACH_ACCEPT,
  AttachButton,
  AttachmentDropOverlay,
  AttachmentError,
  AttachmentList,
  attachmentsLabel,
  base64Bytes,
  documentFileProblem,
  documentTypeOf,
  fitWithin,
  fromDataUrl,
  imageFileProblem,
  prepareAttachment,
  prepareDocument,
  useAttachments,
} from "@/registry/thornberry/components/attachment-composer";

import type { ComposerAttachment } from "@/registry/thornberry/components/attachment-composer";

afterEach(cleanup);

const image = (id: string, name: string): ComposerAttachment => ({
  kind: "image",
  id,
  name,
  mediaType: "image/png",
  data: "iVBORw0KGgo=",
  previewUrl: "data:image/png;base64,iVBORw0KGgo=",
});

const document = (id: string, name: string): ComposerAttachment => ({
  kind: "document",
  id,
  name,
  mediaType: "application/pdf",
  data: "JVBERi0=",
});

const csv = (name = "products.csv") =>
  new File(["name,price\nMug,12\n"], name, { type: "text/csv" });

describe("file checks", () => {
  test("take the image types a model reads, refusing others and huge ones", () => {
    expect(imageFileProblem({ type: "image/webp", size: 10 })).toBeNull();
    expect(imageFileProblem({ type: "image/svg+xml", size: 10 })).toContain(
      "PNG, JPEG, WebP, or GIF",
    );
    expect(imageFileProblem({ type: "image/png", size: 30_000_000 })).toContain(
      "too large",
    );
  });

  test("read a document's type from its label, or else its extension", () => {
    expect(documentTypeOf({ name: "a", type: "application/pdf" })).toBe(
      "application/pdf",
    );
    expect(documentTypeOf({ name: "notes.MD", type: "" })).toBe(
      "text/markdown",
    );
    expect(documentTypeOf({ name: "brief.docx", type: "" })).toBeNull();
  });

  test("cap each document type's size, using the product's limits", () => {
    expect(
      documentFileProblem({
        name: "a.pdf",
        type: "application/pdf",
        size: 6_000_000,
      }),
    ).toBe("Each PDF can be up to 5 MB.");
    expect(
      documentFileProblem({ name: "a.txt", type: "text/plain", size: 300_000 }),
    ).toBe("Each text, Markdown, or CSV file can be up to 200 KB.");
    expect(
      documentFileProblem(
        { name: "a.txt", type: "text/plain", size: 60_000 },
        {
          maxAttachments: 3,
          maxImageBytes: 1,
          maxSourceImageBytes: 1,
          maxImageEdge: 1,
          maxPdfBytes: 1,
          maxTextFileBytes: 50_000,
        },
      ),
    ).toBe("Each text, Markdown, or CSV file can be up to 50 KB.");
    expect(
      documentFileProblem({ name: "a.txt", type: "text/plain", size: 0 }),
    ).toBe("That file is empty.");
  });

  test("scale the longest edge down, keeping the shape", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
    expect(fitWithin(3136, 1568)).toEqual({ width: 1568, height: 784 });
  });

  test("split data URLs and count base64 bytes", () => {
    expect(fromDataUrl("data:image/png;base64,QUJD")).toEqual({
      mediaType: "image/png",
      data: "QUJD",
    });
    expect(fromDataUrl("not a data url")).toBeNull();
    expect(base64Bytes("QUJD")).toBe(3);
    expect(base64Bytes("QQ==")).toBe(1);
  });

  test("label what is attached", () => {
    expect(attachmentsLabel(1)).toBe("1 image attached");
    expect(attachmentsLabel(0, 2)).toBe("2 files attached");
    expect(attachmentsLabel(1, 1)).toBe("1 image and 1 file attached");
  });

  test("offer images and documents in the picker", () => {
    for (const type of ["image/png", "application/pdf", ".md", ".csv"]) {
      expect(ATTACH_ACCEPT).toContain(type);
    }
  });
});

describe("prepareDocument and prepareAttachment", () => {
  test("read a text file for sending", async () => {
    const result = await prepareDocument(csv());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.attachment).toMatchObject({
        kind: "document",
        name: "products.csv",
        mediaType: "text/csv",
      });
      expect(atob(result.attachment.data)).toBe("name,price\nMug,12\n");
    }
  });

  test("refuse a file named .pdf that isn't one, and types not read", async () => {
    expect(
      await prepareDocument(
        new File(["hello"], "menu.pdf", { type: "application/pdf" }),
      ),
    ).toEqual({ ok: false, message: "That file isn't a readable PDF." });
    expect(
      (
        await prepareAttachment(
          new File(["x"], "brief.docx", { type: "application/msword" }),
        )
      ).ok,
    ).toBe(false);
  });

  test("take only images when documents are off", async () => {
    const result = await prepareAttachment(csv(), undefined, false);

    expect(result).toEqual({
      ok: false,
      message: "Attach PNG, JPEG, WebP, or GIF images.",
    });
  });
});

describe("useAttachments", () => {
  test("attaches files up to the limit, saying why the rest were refused", async () => {
    const { result } = renderHook(() =>
      useAttachments({ limits: { maxAttachments: 2 } }),
    );

    await act(() => result.current.addFiles([csv("a.csv"), csv("b.csv")]));

    expect(result.current.attachments.map((a) => a.name)).toEqual([
      "a.csv",
      "b.csv",
    ]);

    await act(() => result.current.addFiles([csv("c.csv")]));

    expect(result.current.attachments).toHaveLength(2);
    expect(result.current.error).toBe("Attach up to 2 files to one message.");

    const first = result.current.attachments[0]?.id ?? "";

    act(() => result.current.remove(first));

    expect(result.current.attachments.map((a) => a.name)).toEqual(["b.csv"]);

    act(() => result.current.clear());

    expect(result.current.attachments).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("attaches dropped files and ignores drags that carry none", async () => {
    const { result } = renderHook(() => useAttachments());
    const files = [csv()];
    const drag = (types: string[]) =>
      ({
        preventDefault: mock(),
        dataTransfer: { types, files, dropEffect: "none" },
      }) as never;

    act(() => result.current.dropZoneProps.onDragEnter(drag(["Files"])));

    expect(result.current.dragging).toBe(true);

    await act(async () => {
      result.current.dropZoneProps.onDrop(drag(["Files"]));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(result.current.dragging).toBe(false);
    expect(result.current.attachments).toHaveLength(1);

    act(() => result.current.dropZoneProps.onDragEnter(drag(["text/plain"])));

    expect(result.current.dragging).toBe(false);
  });

  test("leaves pasted text alone", () => {
    const { result } = renderHook(() => useAttachments());
    const preventDefault = mock();

    act(() =>
      result.current.onPaste({
        preventDefault,
        clipboardData: { files: [], getData: () => "hello" },
      } as never),
    );

    expect(preventDefault).not.toHaveBeenCalled();
  });
});

describe("AttachmentList", () => {
  test("shows images as thumbnails and documents by name, each removable", () => {
    const onRemove = mock();

    render(
      <AttachmentList
        attachments={[image("a", "mockup.png"), document("b", "menu.pdf")]}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByAltText("Attachment 1: mockup.png")).toBeTruthy();
    expect(screen.getByText("menu.pdf")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe(
      "1 image and 1 file attached",
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove menu.pdf" }));

    expect(onRemove).toHaveBeenCalledWith("b");
  });

  test("shows nothing without attachments", () => {
    const { container } = render(
      <AttachmentList attachments={[]} onRemove={() => {}} />,
    );

    expect(container.innerHTML).toBe("");
  });
});

describe("AttachButton", () => {
  test("opens a picker and hands over the picked files", () => {
    const onFiles = mock();
    const { container } = render(
      <AttachButton count={0} onFiles={onFiles} title="Kept with the chat" />,
    );
    const button = screen.getByRole("button", { name: "Attach files" });
    const input = container.querySelector(
      "input[type=file]",
    ) as HTMLInputElement;

    expect(button.getAttribute("title")).toBe("Kept with the chat");
    expect(input.accept).toBe(ATTACH_ACCEPT);

    const file = new File(["x"], "menu.pdf", { type: "application/pdf" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  test("stops at the limit", () => {
    render(<AttachButton count={3} onFiles={() => {}} />);

    const button = screen.getByRole("button", {
      name: "Attach files",
    }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.title).toBe("Up to 3 files per message");
  });
});

describe("AttachmentError and AttachmentDropOverlay", () => {
  test("announce a refusal and show the drop target only while dragging", () => {
    const { rerender, container } = render(
      <>
        <AttachmentError message="That file is empty." />
        <AttachmentDropOverlay active={false} />
      </>,
    );

    expect(screen.getByRole("alert").textContent).toBe("That file is empty.");
    expect(container.textContent).not.toContain("Drop files");

    rerender(<AttachmentDropOverlay active />);

    expect(container.textContent).toContain("Drop files to attach");
  });
});
