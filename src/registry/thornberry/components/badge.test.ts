import { describe, expect, test } from "bun:test";

import { badgeVariants } from "@/registry/thornberry/components/badge";

describe("badgeVariants", () => {
  test("defaults to the solid variant", () => {
    expect(badgeVariants()).toContain("bg-primary");
  });

  test("soft status variants carry a tinted fill and matching text for both themes", () => {
    // a light tint with a dark-mode counterpart, so status badges read as quiet
    // markers rather than loud solid chips (see runa's usage)
    expect(badgeVariants({ variant: "warning" })).toContain("bg-amber-50");
    expect(badgeVariants({ variant: "warning" })).toContain(
      "dark:text-amber-300",
    );
    expect(badgeVariants({ variant: "success" })).toContain("bg-emerald-50");
    expect(badgeVariants({ variant: "info" })).toContain("bg-blue-50");
    expect(badgeVariants({ variant: "danger" })).toContain("bg-red-50");
    expect(badgeVariants({ variant: "soft" })).toContain("bg-muted");
  });
});
