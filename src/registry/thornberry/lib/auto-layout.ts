import ELK from "elkjs/lib/elk.bundled.js";

import type { Edge, Node } from "@xyflow/react";

const elk = new ELK();

export interface AutoLayoutOptions {
  /** elk layout algorithm */
  algorithm?: "layered" | "mrtree" | "force" | "stress" | (string & {});
  /** layout direction */
  direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
  /** spacing between adjacent nodes */
  nodeSpacing?: number;
  /** spacing between layers (applies to the layered algorithm) */
  layerSpacing?: number;
  /** override per-node sizing (defaults to measured width/height or 250x150) */
  getNodeSize?: (node: Node) => { width: number; height: number };
}

export const autoLayout = async (
  nodes: Node[],
  edges: Edge[],
  opts: AutoLayoutOptions = {},
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const {
    algorithm = "layered",
    direction = "DOWN",
    nodeSpacing = 200,
    layerSpacing = 200,
    getNodeSize = (n) => ({
      width: n.measured?.width ?? 250,
      height: n.measured?.height ?? 150,
    }),
  } = opts;

  // fail loud on duplicate ids rather than silently mis-positioning
  const ids = new Set<string>();
  for (const n of nodes) {
    if (ids.has(n.id)) throw new Error(`autoLayout: duplicate node id ${n.id}`);
    ids.add(n.id);
  }

  // drop dangling edges; elk throws if an edge references a missing shape
  const validEdges = edges.filter(
    (e) => ids.has(e.source) && ids.has(e.target),
  );

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": algorithm,
      "elk.direction": direction,
      "elk.spacing.nodeNode": String(nodeSpacing),
      "elk.layered.spacing.nodeNodeBetweenLayers": String(layerSpacing),
      "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    },
    children: nodes.map((n) => ({ id: n.id, ...getNodeSize(n) })),
    edges: validEdges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const laid = await elk.layout(graph);
  const byId = new Map((laid.children ?? []).map((ch) => [ch.id, ch]));
  const positioned = nodes.map((n) => {
    const c = byId.get(n.id);
    // origin is the fallback when elk returns no coordinate
    return c ? { ...n, position: { x: c.x ?? 0, y: c.y ?? 0 } } : n;
  });
  return { nodes: positioned, edges };
};
