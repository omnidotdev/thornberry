import { expect, test } from "bun:test";

import { autoLayout } from "./auto-layout";

import type { Edge, Node } from "@xyflow/react";

test("assigns non-overlapping positions to disconnected nodes", async () => {
  const nodes = [
    { id: "a", position: { x: 0, y: 0 }, data: {} },
    { id: "b", position: { x: 0, y: 0 }, data: {} },
  ] as Node[];
  const { nodes: out } = await autoLayout(nodes, [], { direction: "DOWN" });
  expect(out).toHaveLength(2);
  expect(out[0].position).not.toEqual(out[1].position);
});

test("parent precedes child vertically in a DOWN tree", async () => {
  const nodes = [
    { id: "p", position: { x: 0, y: 0 }, data: {} },
    { id: "c", position: { x: 0, y: 0 }, data: {} },
  ] as Node[];
  const edges = [{ id: "e", source: "p", target: "c" }] as Edge[];
  const { nodes: out } = await autoLayout(nodes, edges, { direction: "DOWN" });
  const p = out.find((n) => n.id === "p")!;
  const c = out.find((n) => n.id === "c")!;
  expect(p.position.y).toBeLessThan(c.position.y);
});

test("larger getNodeSize width increases horizontal separation between siblings", async () => {
  const nodes = [
    { id: "p", position: { x: 0, y: 0 }, data: {} },
    { id: "a", position: { x: 0, y: 0 }, data: {} },
    { id: "b", position: { x: 0, y: 0 }, data: {} },
  ] as Node[];
  const edges = [
    { id: "pa", source: "p", target: "a" },
    { id: "pb", source: "p", target: "b" },
  ] as Edge[];
  // horizontal separation between the two sibling children of a common parent
  const separation = async (width: number) => {
    const { nodes: out } = await autoLayout(nodes, edges, {
      getNodeSize: () => ({ width, height: 100 }),
    });
    const a = out.find((n) => n.id === "a")!;
    const b = out.find((n) => n.id === "b")!;
    return Math.abs(a.position.x - b.position.x);
  };
  const narrow = await separation(100);
  const wide = await separation(600);
  expect(wide).toBeGreaterThan(narrow);
});

test("empty nodes array returns empty result without throwing", async () => {
  const { nodes, edges } = await autoLayout([], []);
  expect(nodes).toEqual([]);
  expect(edges).toEqual([]);
});

test("dangling edge to a missing node does not throw and still positions real nodes", async () => {
  const nodes = [
    { id: "a", position: { x: 0, y: 0 }, data: {} },
    { id: "b", position: { x: 0, y: 0 }, data: {} },
  ] as Node[];
  // "b" -> "ghost" references a node that is not present
  const edges = [
    { id: "ab", source: "a", target: "b" },
    { id: "bg", source: "b", target: "ghost" },
  ] as Edge[];
  const { nodes: out, edges: outEdges } = await autoLayout(nodes, edges);
  expect(out).toHaveLength(2);
  expect(out[0].position).not.toEqual(out[1].position);
  // original edges are returned unchanged, including the dangling one
  expect(outEdges).toBe(edges);
});

test("duplicate node ids throw with a message containing the id", async () => {
  const nodes = [
    { id: "dup", position: { x: 0, y: 0 }, data: {} },
    { id: "dup", position: { x: 0, y: 0 }, data: {} },
  ] as Node[];
  expect(autoLayout(nodes, [])).rejects.toThrow("dup");
});
