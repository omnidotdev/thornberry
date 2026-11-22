import { afterEach, describe, expect, mock, test } from "bun:test";

import { act, cleanup, fireEvent, render } from "@testing-library/react";

import { WorkspaceSwitcher } from "@/registry/thornberry/components/workspace-switcher";

afterEach(() => {
  cleanup();
});

const workspaces = [
  { id: "w1", name: "Ada's Workspace", slug: "ada" },
  { id: "w2", name: "Acme Studio", slug: "acme" },
  { id: "w3", name: "No Handle" },
];

/** Open the switcher the way a click does */
const open = async () => {
  const trigger = document.querySelector<HTMLElement>("[aria-haspopup='menu']");
  if (!trigger) throw new Error("expected the switcher trigger");

  await act(async () => {
    fireEvent.click(trigger);
  });
};

/** Choose a menu entry the way a pointer does: highlight, then click */
const choose = async (item: HTMLElement) => {
  await act(async () => {
    fireEvent.pointerMove(item, { pointerType: "mouse" });
  });
  await act(async () => {
    fireEvent.click(item);
  });
};

const items = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[role='menuitem']"));

describe("WorkspaceSwitcher", () => {
  test("lists each workspace by name with its @handle under it", async () => {
    render(
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspaceId="w1"
        onSelect={() => {}}
      />,
    );

    await open();

    const [first, second, third] = items();

    expect(first?.textContent).toContain("Ada's Workspace");
    expect(first?.textContent).toContain("@ada");
    expect(second?.textContent).toContain("Acme Studio");
    expect(second?.textContent).toContain("@acme");
    expect(third?.textContent).toContain("No Handle");
    expect(third?.textContent).not.toContain("@");
  });

  test("selects a workspace by id", async () => {
    const onSelect = mock((_id: string) => {});

    render(
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspaceId="w1"
        onSelect={onSelect}
      />,
    );

    await open();

    const acme = items().find((item) => item.textContent?.includes("Acme"));
    if (!acme) throw new Error("expected the Acme entry");

    await choose(acme);

    expect(onSelect).toHaveBeenCalledWith("w2");
  });

  test("offers the manage link as a keyboard-reachable entry that is not a workspace", async () => {
    const onSelect = mock((_id: string) => {});

    render(
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspaceId="w1"
        onSelect={onSelect}
        manageUrl="https://account.example.com/workspaces"
      />,
    );

    await open();

    const manage = items().find(
      (item) =>
        item.getAttribute("href") === "https://account.example.com/workspaces",
    );
    if (!manage) throw new Error("expected the manage entry");

    expect(manage.textContent).toContain("Manage workspaces");

    await choose(manage);

    expect(onSelect).not.toHaveBeenCalled();
  });

  test("scrolls a long workspace list instead of running off screen", async () => {
    const many = Array.from({ length: 40 }, (_, i) => ({
      id: `w${i}`,
      name: `Workspace ${i}`,
    }));

    render(
      <WorkspaceSwitcher
        workspaces={many}
        currentWorkspaceId="w0"
        onSelect={() => {}}
        manageUrl="https://account.example.com/workspaces"
      />,
    );

    await open();

    // Layout is not computed under happy-dom, so assert the overflow contract:
    // the panel is capped to the viewport and the workspace list scrolls
    const content = document.querySelector<HTMLElement>("[role='menu']");
    expect(content?.className).toContain("max-h-(--available-height)");
    expect(content?.className).toContain("overflow-y-auto");

    const list = document.querySelector<HTMLElement>("[role='group']");
    expect(list?.className).toContain("overflow-y-auto");
    expect(list?.querySelectorAll("[role='menuitem']")).toHaveLength(40);
  });
});
