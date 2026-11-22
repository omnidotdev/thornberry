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

  test("runs an action's callback without selecting a workspace", async () => {
    const onSelect = mock((_id: string) => {});
    const onCreate = mock(() => {});

    render(
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspaceId="w1"
        onSelect={onSelect}
        actions={[
          { id: "create", label: "New workspace", onSelect: onCreate },
          { id: "all", label: "All workspaces", href: "/workspaces" },
        ]}
      />,
    );

    await open();

    const create = items().find((item) =>
      item.textContent?.includes("New workspace"),
    );
    if (!create) throw new Error("expected the create entry");

    await choose(create);

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    await open();

    const all = items().find(
      (item) => item.getAttribute("href") === "/workspaces",
    );
    expect(all?.getAttribute("target")).toBeNull();
  });

  test("shows a description in place of the handle, and a badge", async () => {
    render(
      <WorkspaceSwitcher
        workspaces={[
          {
            id: "w1",
            name: "Ada",
            slug: "ada",
            badge: "Personal",
            description: "Owner",
          },
          { id: "w2", name: "Acme", slug: "acme" },
        ]}
        currentWorkspaceId="w1"
        onSelect={() => {}}
      />,
    );

    await open();

    const [ada, acme] = items();
    expect(ada?.textContent).toContain("Personal");
    expect(ada?.textContent).toContain("Owner");
    expect(ada?.textContent).not.toContain("@ada");
    expect(acme?.textContent).toContain("@acme");
  });

  test("shows the placeholder and still opens when no workspace is active", async () => {
    const onSelect = mock((_id: string) => {});

    render(
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspaceId={null}
        onSelect={onSelect}
        placeholder="Pick a workspace"
      />,
    );

    const trigger = document.querySelector("[aria-haspopup='menu']");
    expect(trigger?.textContent).toContain("Pick a workspace");
    expect(trigger?.getAttribute("aria-label")).toBe(
      "Pick a workspace, switch workspace",
    );

    await open();

    const acme = items().find((item) => item.textContent?.includes("Acme"));
    if (!acme) throw new Error("expected the Acme entry");

    await choose(acme);

    expect(onSelect).toHaveBeenCalledWith("w2");
  });

  test("offers only the actions when there are no workspaces", async () => {
    render(
      <WorkspaceSwitcher
        workspaces={[]}
        onSelect={() => {}}
        actions={[{ id: "create", label: "New workspace", href: "/new" }]}
      />,
    );

    await open();

    expect(items()).toHaveLength(1);
    expect(items()[0]?.textContent).toContain("New workspace");
    expect(document.querySelector("[role='group']")).toBeNull();
  });

  test("renders nothing with no workspaces and no actions", () => {
    const { container } = render(
      <WorkspaceSwitcher workspaces={[]} onSelect={() => {}} />,
    );

    expect(container.innerHTML).toBe("");
  });

  test("shows a static label for a single workspace, or nothing with hideWhenSingle", () => {
    const single = [{ id: "w1", name: "Solo" }];

    const { container, rerender } = render(
      <WorkspaceSwitcher
        workspaces={single}
        currentWorkspaceId="w1"
        onSelect={() => {}}
      />,
    );

    expect(container.textContent).toContain("Solo");
    expect(document.querySelector("[aria-haspopup='menu']")).toBeNull();

    rerender(
      <WorkspaceSwitcher
        workspaces={single}
        currentWorkspaceId="w1"
        onSelect={() => {}}
        hideWhenSingle
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  test("opens a menu for a single workspace when there are actions", async () => {
    render(
      <WorkspaceSwitcher
        workspaces={[{ id: "w1", name: "Solo" }]}
        currentWorkspaceId="w1"
        onSelect={() => {}}
        hideWhenSingle
        actions={[{ id: "create", label: "New workspace", href: "/new" }]}
      />,
    );

    await open();

    expect(items().map((item) => item.textContent)).toEqual([
      expect.stringContaining("Solo"),
      expect.stringContaining("New workspace"),
    ]);
  });

  test("reports the highlighted workspace as an intent, not actions", async () => {
    const onItemIntent = mock((_id: string) => {});

    render(
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspaceId="w1"
        onSelect={() => {}}
        onItemIntent={onItemIntent}
        actions={[{ id: "create", label: "New workspace", href: "/new" }]}
      />,
    );

    await open();

    const acme = items().find((item) => item.textContent?.includes("Acme"));
    const create = items().find((item) =>
      item.textContent?.includes("New workspace"),
    );
    if (!acme || !create) throw new Error("expected the entries");

    await act(async () => {
      fireEvent.pointerMove(acme, { pointerType: "mouse" });
    });
    await act(async () => {
      fireEvent.pointerMove(create, { pointerType: "mouse" });
    });

    expect(onItemIntent).toHaveBeenCalledWith("w2");
    expect(onItemIntent).not.toHaveBeenCalledWith("action:create");
    expect(onItemIntent).not.toHaveBeenCalledWith("create");
  });

  test("opens beside a collapsed icon rail instead of at the rail's width", async () => {
    render(
      <div className="group" data-collapsible="icon">
        <WorkspaceSwitcher
          variant="sidebar"
          workspaces={workspaces}
          currentWorkspaceId="w1"
          onSelect={() => {}}
        />
      </div>,
    );

    const trigger = document.querySelector<HTMLElement>(
      "[aria-haspopup='menu']",
    );
    if (!trigger) throw new Error("expected the switcher trigger");

    await act(async () => {
      fireEvent.pointerDown(trigger, { pointerType: "mouse" });
    });
    await open();

    // The rail is too narrow to match, so the panel keeps a width floor
    const content = document.querySelector("[role='menu']");
    expect(content?.classList.contains("min-w-52")).toBe(true);
    expect(content?.classList.contains("min-w-0")).toBe(false);
  });
});
