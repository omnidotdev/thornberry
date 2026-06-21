import { afterEach, expect, test } from "bun:test";

import { cleanup, render, screen } from "@testing-library/react";

import { FlowCanvas } from "@/registry/thornberry/components/flow-canvas";

// Smoke + wiring tests only. happy-dom does not lay out or measure nodes, so
// these assert that the canvas mounts and forwards children, NOT geometry
afterEach(() => {
  cleanup();
});

test("mounts with empty nodes/edges and renders child panels", () => {
  render(
    <FlowCanvas nodes={[]} edges={[]}>
      <div data-testid="panel">x</div>
    </FlowCanvas>,
  );

  expect(screen.getByTestId("panel")).toBeDefined();
});

test("renders the React Flow container", () => {
  const { container } = render(
    <FlowCanvas nodes={[]} edges={[]}>
      <div data-testid="panel">x</div>
    </FlowCanvas>,
  );

  expect(container.querySelector(".react-flow")).not.toBeNull();
});
