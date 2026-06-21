import { afterEach, expect, test } from "bun:test";

import { cleanup, render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";

import { BaseNode } from "@/registry/thornberry/components/base-node";
import { resolveTheme } from "@/registry/thornberry/lib/node-themes";

import type { Node, NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/registry/thornberry/components/base-node";

// Render the BaseNode node component the way React Flow registers it: as a
// node type inside a provider, with content driven entirely by `data`. These
// tests guard the data->render mapping that replaced the old adapter
const renderNode = (data: BaseNodeData, selected = false) => {
  // React Flow passes many props to a node component; only `data` and
  // `selected` are read by BaseNode, so a partial cast is sufficient here
  const props = { data, selected } as unknown as NodeProps<Node<BaseNodeData>>;
  return render(
    <ReactFlowProvider>
      <BaseNode {...props} />
    </ReactFlowProvider>,
  );
};

afterEach(() => {
  cleanup();
});

test("renders label, description, and badge from data", () => {
  renderNode({
    theme: "accent",
    label: "Hello",
    description: "desc",
    badge: "B",
  });

  expect(screen.getByText("Hello")).toBeDefined();
  expect(screen.getByText("desc")).toBeDefined();
  expect(screen.getByText("B")).toBeDefined();
});

test("applies the accent theme classes to the container", () => {
  const { container } = renderNode({ theme: "accent", label: "Hello" });
  const accent = resolveTheme("accent");

  const node = container.querySelector("div");
  expect(node).not.toBeNull();
  const className = node?.className ?? "";

  // Source the expected classes from resolveTheme rather than duplicating
  for (const cls of accent.border.split(" ")) {
    expect(className).toContain(cls);
  }
  for (const cls of accent.bg.split(" ")) {
    expect(className).toContain(cls);
  }
});

test("renders the delete button when onDelete is set", () => {
  renderNode({ theme: "default", label: "Hello", onDelete: () => {} });

  expect(screen.getByLabelText("Delete node")).toBeDefined();
});

test("omits the delete button when onDelete is absent", () => {
  renderNode({ theme: "default", label: "Hello" });

  expect(screen.queryByLabelText("Delete node")).toBeNull();
});

test("is not a button and not clickable without onClick", () => {
  const { container } = renderNode({ theme: "default", label: "Hello" });

  expect(screen.queryByRole("button")).toBeNull();
  const node = container.querySelector("div");
  expect(node?.className ?? "").not.toContain("cursor-pointer");
});
