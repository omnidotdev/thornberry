import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render } from "@testing-library/react";

import {
  Sidebar,
  SidebarProvider,
} from "@/registry/thornberry/components/sidebar";

afterEach(() => {
  cleanup();
});

describe("Sidebar", () => {
  test("hides the desktop panel below md until hydration picks a layout", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>Nav</Sidebar>
      </SidebarProvider>,
    );

    const panel = container.querySelector("[data-slot=sidebar]");
    expect(panel?.className).toContain("hidden");
    expect(panel?.className).toContain("md:block");
  });

  test("a non-collapsible sidebar uses the sidebar background", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">Nav</Sidebar>
      </SidebarProvider>,
    );

    const panel = container.querySelector("[data-slot=sidebar]");
    expect(panel?.className).toContain("bg-sidebar");
    expect(panel?.className).not.toContain("bg-red-500");
  });
});
