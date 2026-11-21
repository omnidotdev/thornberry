"use client";

import { useState } from "react";

import {
  RichTextContent,
  RichTextEditor,
} from "@/registry/thornberry/components/rich-text-editor";

const RichTextEditorButtons = () => {
  const [html, setHtml] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <RichTextEditor
        placeholder="Write your email, then add a button from the toolbar"
        defaultContent='<p>Our spring sale ends Friday.</p><p><a href="https://example.com/sale" data-variant="button">Shop the sale</a></p>'
        onUpdate={({ getHTML }) => setHtml(getHTML())}
        buttons={{
          // a real app passes its own domains here
          isAllowedHref: (href) =>
            href.startsWith("mailto:") ||
            new URL(href).host.endsWith("example.com"),
        }}
      />
      <details className="text-sm">
        <summary className="cursor-pointer">
          Rendered with RichTextContent
        </summary>
        <RichTextContent className="mt-2 rounded-md border p-3" html={html} />
      </details>
    </div>
  );
};

export default RichTextEditorButtons;
