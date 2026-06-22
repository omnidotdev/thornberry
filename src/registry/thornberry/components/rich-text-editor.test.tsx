import { afterEach, expect, test } from "bun:test";

import { cleanup, render } from "@testing-library/react";

import {
  RichTextContent,
  linkifyBareUrls,
} from "@/registry/thornberry/components/rich-text-editor";

afterEach(cleanup);

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
