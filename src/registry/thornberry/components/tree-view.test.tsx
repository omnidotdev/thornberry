import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { TreeView } from "@/registry/thornberry/components/tree-view";

import type { TreeViewNode } from "@/registry/thornberry/components/tree-view";

const nodes: TreeViewNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "src/index.ts", label: "index.ts" },
      {
        id: "src/lib",
        label: "lib",
        children: [{ id: "src/lib/utils.ts", label: "utils.ts" }],
      },
    ],
  },
  { id: "README.md", label: "README.md" },
  { id: "LICENSE", label: "LICENSE", disabled: true },
];

const node = (label: string) => {
  const element = screen
    .getByText(label)
    .closest('[role="treeitem"], [data-part="branch-control"]');
  if (!element) throw new Error(`expected a tree node for ${label}`);
  return element as HTMLElement;
};

const branch = (label: string) => {
  const element = screen.getByText(label).closest('[data-part="branch"]');
  if (!element) throw new Error(`expected a branch for ${label}`);
  return element;
};

// Ark (Zag) machines commit state after the event's microtasks settle, so
// flush them before asserting on the next render
const flush = () => act(async () => {});

afterEach(() => {
  cleanup();
});

describe("TreeView", () => {
  test("renders a labelled tree with branches collapsed by default", () => {
    render(<TreeView label="Files" nodes={nodes} />);

    expect(screen.getByRole("tree", { name: "Files" })).toBeDefined();
    expect(branch("src").getAttribute("aria-expanded")).toBe("false");
    const content = screen
      .queryByText("index.ts")
      ?.closest('[data-part="branch-content"]');
    expect(content?.hasAttribute("hidden") ?? true).toBe(true);
  });

  test("expands and collapses a branch on click", async () => {
    const onExpandedChange = mock();
    render(<TreeView nodes={nodes} onExpandedChange={onExpandedChange} />);

    fireEvent.click(node("src"));
    await flush();

    expect(branch("src").getAttribute("aria-expanded")).toBe("true");
    expect(onExpandedChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ expandedValue: ["src"] }),
    );

    fireEvent.click(node("src"));
    await flush();

    expect(branch("src").getAttribute("aria-expanded")).toBe("false");
  });

  test("expands every branch with defaultExpandAll", () => {
    render(<TreeView nodes={nodes} defaultExpandAll />);

    expect(branch("src").getAttribute("aria-expanded")).toBe("true");
    expect(branch("lib").getAttribute("aria-expanded")).toBe("true");
    expect(node("utils.ts").getAttribute("aria-level")).toBe("3");
  });

  test("selects a leaf on click and reports it", async () => {
    const onSelectionChange = mock();
    render(<TreeView nodes={nodes} onSelectionChange={onSelectionChange} />);

    fireEvent.click(node("README.md"));
    await flush();

    expect(node("README.md").getAttribute("aria-selected")).toBe("true");
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedValue: ["README.md"] }),
    );
  });

  test("does not select a disabled node", async () => {
    render(<TreeView nodes={nodes} />);

    const license = node("LICENSE");
    expect(license.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(license);
    await flush();

    expect(license.hasAttribute("data-selected")).toBe(false);
  });

  test("navigates and expands with the keyboard", async () => {
    render(<TreeView nodes={nodes} />);

    const tree = screen.getByRole("tree");
    const src = node("src");
    src.focus();
    fireEvent.focus(src);
    await flush();

    // ArrowRight opens the focused branch
    fireEvent.keyDown(src, { key: "ArrowRight" });
    await flush();
    expect(branch("src").getAttribute("aria-expanded")).toBe("true");

    // ArrowDown moves into the branch, Enter selects
    fireEvent.keyDown(document.activeElement ?? tree, { key: "ArrowDown" });
    await flush();
    expect(node("index.ts").hasAttribute("data-focus")).toBe(true);

    fireEvent.keyDown(document.activeElement ?? tree, { key: "Enter" });
    await flush();
    expect(node("index.ts").getAttribute("aria-selected")).toBe("true");

    // ArrowLeft from a child moves focus back to its parent branch
    fireEvent.keyDown(document.activeElement ?? tree, { key: "ArrowLeft" });
    await flush();
    expect(node("src").hasAttribute("data-focus")).toBe(true);
  });

  test("renders file tree icons and trailing content", () => {
    const { container } = render(
      <TreeView
        fileIcons
        defaultExpandAll
        nodes={[
          {
            id: "app",
            label: "app",
            children: [
              { id: "app/page.tsx", label: "page.tsx", suffix: <span>M</span> },
            ],
          },
        ]}
      />,
    );

    expect(container.querySelector(".lucide-folder-open")).not.toBeNull();
    expect(container.querySelector(".lucide-file")).not.toBeNull();
    expect(node("page.tsx").textContent).toContain("M");
  });
});
