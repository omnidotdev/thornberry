import { describe, expect, test } from "bun:test";

import {
  ALLOWED_IMAGE_TYPES,
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
