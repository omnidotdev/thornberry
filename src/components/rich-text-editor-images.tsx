"use client";

import { useState } from "react";

import {
  RichTextContent,
  RichTextEditor,
} from "@/registry/thornberry/components/rich-text-editor";

import type {
  RichTextEditorUpdate,
  RichTextImageUploadResult,
} from "@/registry/thornberry/components/rich-text-editor";

// the docs site has no storage, so the demo "uploads" by waiting a moment and
// returning a hosted sample photo; a real app sends the file to its storage
const demoUpload = async (file: File): Promise<RichTextImageUploadResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const seed = encodeURIComponent(file.name);
  return {
    src: `https://picsum.photos/seed/${seed}/1200/800`,
    width: 1200,
    height: 800,
  };
};

const RichTextEditorImages = () => {
  const [update, setUpdate] = useState<RichTextEditorUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const html = update?.getHTML() ?? "";

  return (
    <div className="flex flex-col gap-3">
      <RichTextEditor
        placeholder="Write your email, or paste or drop an image"
        defaultContent='<p>Spring is here.</p><img src="https://picsum.photos/seed/spring/1200/800" alt="" width="600"><img src="https://example.com/elsewhere.png" alt="A logo hosted elsewhere">'
        onUpdate={setUpdate}
        images={{
          upload: demoUpload,
          isAllowedSrc: (src) => new URL(src).host === "picsum.photos",
          maxBytes: 5 * 1024 * 1024,
          onError: (e) => setError(e.message),
        }}
      />
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <p className="text-muted-foreground text-sm">
        {update?.isUploading
          ? "Waiting for uploads to finish."
          : update?.hasExternalImages
            ? "Upload a copy of every image hosted elsewhere before sending."
            : update?.hasMissingAltText
              ? "Add alt text to every image before sending."
              : "Ready to send."}
      </p>
      <details className="text-sm">
        <summary className="cursor-pointer">
          Rendered with RichTextContent
        </summary>
        <RichTextContent
          allowImages
          className="mt-2 rounded-md border p-3"
          html={html}
        />
      </details>
    </div>
  );
};

export default RichTextEditorImages;
