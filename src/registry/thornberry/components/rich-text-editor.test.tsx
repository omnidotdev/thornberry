import { afterEach, expect, test } from "bun:test";

import { cleanup, render } from "@testing-library/react";

import {
  RichTextContent,
  linkFromText,
  linkifyBareUrls,
  linkifyMarkdownLinks,
} from "@/registry/thornberry/components/rich-text-editor";

afterEach(cleanup);

test("linkFromText treats a lone URL or email as a link href", () => {
  expect(linkFromText("https://omni.dev")).toBe("https://omni.dev");
  expect(linkFromText("  www.omni.dev  ")).toBe("https://www.omni.dev");
  expect(linkFromText("hey@omni.dev")).toBe("mailto:hey@omni.dev");
});

test("linkFromText ignores multi-token or non-URL pastes", () => {
  expect(linkFromText("see https://omni.dev now")).toBeNull();
  expect(linkFromText("just some words")).toBeNull();
  expect(linkFromText("")).toBeNull();
});

test("collapses a markdown link into a labeled anchor", () => {
  expect(linkifyMarkdownLinks("see [the docs](https://omni.dev) now")).toBe(
    'see <a href="https://omni.dev">the docs</a> now',
  );
});

test("supports mailto and relative targets in markdown links", () => {
  expect(linkifyMarkdownLinks("[mail](mailto:a@b.com) and [post](/p/1)")).toBe(
    '<a href="mailto:a@b.com">mail</a> and <a href="/p/1">post</a>',
  );
});

test("ignores markdown-link syntax whose target is not a real link", () => {
  expect(linkifyMarkdownLinks("a [label](not-a-url) here")).toBe(
    "a [label](not-a-url) here",
  );
});

test("does not rewrite markdown-link syntax already inside an anchor", () => {
  const html = '<a href="https://omni.dev">[x](https://evil.com)</a>';
  expect(linkifyMarkdownLinks(html)).toBe(html);
});

test("RichTextContent renders a pasted markdown link as a labeled link", () => {
  // the exact shape stored for backfeed post #22: a pasted markdown link the
  // keystroke-only MarkdownShortcutPlugin never converted
  const { container } = render(
    <RichTextContent html='<p><span style="white-space: pre-wrap;">a [system gesture](https://developer.apple.com/design/gestures).</span></p>' />,
  );
  const anchor = container.querySelector("a");
  expect(anchor?.getAttribute("href")).toBe(
    "https://developer.apple.com/design/gestures",
  );
  expect(anchor?.textContent).toBe("system gesture");
  // the literal markdown brackets must not survive in the rendered text
  expect(container.textContent).not.toContain("](");
});

test("linkifies a bare http URL in text", () => {
  expect(linkifyBareUrls("Visit https://example.com today")).toBe(
    'Visit <a href="https://example.com">https://example.com</a> today',
  );
});

test("leaves trailing sentence punctuation outside the link", () => {
  expect(linkifyBareUrls("See https://example.com.")).toBe(
    'See <a href="https://example.com">https://example.com</a>.',
  );
});

test("prefixes scheme-less www links with https", () => {
  expect(linkifyBareUrls("www.example.com")).toBe(
    '<a href="https://www.example.com">www.example.com</a>',
  );
});

test("linkifies bare email addresses as mailto links", () => {
  expect(linkifyBareUrls("ping me at a@b.com")).toBe(
    'ping me at <a href="mailto:a@b.com">a@b.com</a>',
  );
});

test("does not double-wrap a URL already inside an anchor", () => {
  const html = '<a href="https://example.com">https://example.com</a>';
  expect(linkifyBareUrls(html)).toBe(html);
});

test("never matches inside tag attributes", () => {
  const html = '<a href="https://example.com">click here</a>';
  expect(linkifyBareUrls(html)).toBe(html);
});

test("leaves plain text without links untouched", () => {
  expect(linkifyBareUrls("just some words, e.g. nothing here")).toBe(
    "just some words, e.g. nothing here",
  );
});

test("linkifies a URL nested in other markup", () => {
  expect(linkifyBareUrls("<p>see https://example.com</p>")).toBe(
    '<p>see <a href="https://example.com">https://example.com</a></p>',
  );
});

test("RichTextContent renders a bare URL as a new-tab link", () => {
  const { container } = render(
    <RichTextContent html="<p>Docs at https://omni.dev</p>" />,
  );
  const anchor = container.querySelector("a");
  expect(anchor?.getAttribute("href")).toBe("https://omni.dev");
  expect(anchor?.getAttribute("target")).toBe("_blank");
  expect(anchor?.getAttribute("rel")).toContain("noopener");
});

test("RichTextContent opens existing links in a new tab", () => {
  const { container } = render(
    <RichTextContent html='<p><a href="https://omni.dev">site</a></p>' />,
  );
  const anchor = container.querySelector("a");
  expect(anchor?.getAttribute("target")).toBe("_blank");
  expect(anchor?.getAttribute("rel")).toContain("noopener");
});

test("RichTextContent keeps relative internal links in the same tab", () => {
  const { container } = render(
    <RichTextContent html='<p><a href="/workspaces/acme/123">#123</a></p>' />,
  );
  const anchor = container.querySelector("a");
  expect(anchor?.getAttribute("target")).toBeNull();
  expect(anchor?.getAttribute("rel")).toBeNull();
});
