import { describe, expect, test } from "bun:test";

import {
  ALLOWED_IMAGE_TYPES,
  BANNER_ASPECT,
  MAX_BANNER_IMAGE_SIZE,
  MAX_IMAGE_SIZE,
} from "@/registry/thornberry/lib/crop";

// The personal avatar and the workspace logo both import these, so they accept
// exactly the same inputs. Asserting the shared source keeps that parity locked
// without rendering either heavy dialog
describe("shared image upload constraints", () => {
  test("whitelist is JPEG/PNG/WebP/GIF and excludes SVG", () => {
    expect(ALLOWED_IMAGE_TYPES).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
    expect(ALLOWED_IMAGE_TYPES).not.toContain("image/svg+xml");
  });

  test("max size is 5 MB", () => {
    expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024);
  });
});

// The workspace banner shares the type whitelist but has its own size budget
// and a wide crop, matching the identity server's banner upload contract
describe("workspace banner upload constraints", () => {
  test("max size is 10 MB", () => {
    expect(MAX_BANNER_IMAGE_SIZE).toBe(10 * 1024 * 1024);
  });

  test("crop aspect is 4:1", () => {
    expect(BANNER_ASPECT).toBe(4);
  });
});
