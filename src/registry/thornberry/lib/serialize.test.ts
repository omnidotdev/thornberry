import { expect, test } from "bun:test";

import { deserialize, serialize } from "./serialize";

import type { Edge, Node } from "@xyflow/react";
import type { CanvasSnapshot } from "./serialize";

test("round-trips nodes and edges, dropping transient fields", () => {
  const nodes = [
    {
      id: "a",
      type: "base",
      position: { x: 1, y: 2 },
      data: { label: "A" },
      selected: true,
      dragging: true,
      measured: { width: 100, height: 50 },
    },
  ] as Node[];
  const edges = [{ id: "e", source: "a", target: "a" }] as Edge[];

  const snap = serialize(nodes, edges);
  expect(snap.version).toBe(1);
  // transient render state must not survive serialization
  const persisted = snap.nodes[0] as unknown as {
    selected?: unknown;
    dragging?: unknown;
    measured?: unknown;
  };
  expect(persisted.selected).toBeUndefined();
  expect(persisted.dragging).toBeUndefined();
  expect(persisted.measured).toBeUndefined();

  const back = deserialize(snap);
  expect(back.nodes[0]).toMatchObject({
    id: "a",
    type: "base",
    position: { x: 1, y: 2 },
    data: { label: "A" },
  });
  expect(back.edges).toEqual([{ id: "e", source: "a", target: "a" }]);
});

test("snapshot is JSON-stable (survives stringify/parse round-trip)", () => {
  const nodes = [{ id: "a", position: { x: 0, y: 0 }, data: {} }] as Node[];
  const snap = serialize(nodes, []);
  const reparsed = JSON.parse(JSON.stringify(snap)) as CanvasSnapshot;
  expect(deserialize(reparsed).nodes[0].id).toBe("a");
});

test("deserialize rejects an unknown schema version", () => {
  expect(() =>
    deserialize({ version: 99 } as unknown as CanvasSnapshot),
  ).toThrow(/version/i);
});

test("deserialize rejects a missing version", () => {
  expect(() => deserialize({} as unknown as CanvasSnapshot)).toThrow(
    /version/i,
  );
});

test("deserialize rejects a malformed snapshot (nodes not an array)", () => {
  expect(() =>
    deserialize({ version: 1, edges: [] } as unknown as CanvasSnapshot),
  ).toThrow(/array/i);
});

test("drops non-string (ReactNode) edge labels", () => {
  const edges = [
    { id: "e", source: "a", target: "a", label: { foo: 1 } },
  ] as unknown as Edge[];
  expect(serialize([], edges).edges[0].label).toBeUndefined();
});

test("preserves parentId and edge label/type/data when present", () => {
  const nodes = [
    { id: "p", position: { x: 0, y: 0 }, data: {} },
    { id: "c", parentId: "p", position: { x: 0, y: 0 }, data: {} },
  ] as Node[];
  const edges = [
    {
      id: "e",
      source: "p",
      target: "c",
      type: "smart",
      label: "go",
      data: { k: 1 },
    },
  ] as Edge[];
  const back = deserialize(serialize(nodes, edges));
  expect(back.nodes[1].parentId).toBe("p");
  expect(back.edges[0]).toMatchObject({
    type: "smart",
    label: "go",
    data: { k: 1 },
  });
});
