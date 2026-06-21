import type { Edge, Node } from "@xyflow/react";

export const CANVAS_SCHEMA_VERSION = 1 as const;

/** persisted node: only durable fields, transient render state stripped */
export interface SnapshotNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  parentId?: string;
}

/** persisted edge */
export interface SnapshotEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  data?: Record<string, unknown>;
}

/** versioned, JSON-serializable snapshot of a canvas graph */
export interface CanvasSnapshot {
  version: typeof CANVAS_SCHEMA_VERSION;
  nodes: SnapshotNode[];
  edges: SnapshotEdge[];
}

export const serialize = (nodes: Node[], edges: Edge[]): CanvasSnapshot => ({
  version: CANVAS_SCHEMA_VERSION,
  nodes: nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: (n.data ?? {}) as Record<string, unknown>,
    parentId: n.parentId,
  })),
  edges: edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type,
    // only string labels are durable; ReactNode labels are render-only and dropped
    label: typeof e.label === "string" ? e.label : undefined,
    data: e.data as Record<string, unknown> | undefined,
  })),
});

export const deserialize = (
  snapshot: CanvasSnapshot,
): { nodes: Node[]; edges: Edge[] } => {
  if (snapshot?.version !== CANVAS_SCHEMA_VERSION) {
    throw new Error(`Unsupported canvas schema version: ${snapshot?.version}`);
  }
  if (!Array.isArray(snapshot.nodes) || !Array.isArray(snapshot.edges)) {
    throw new Error(
      "Malformed canvas snapshot: nodes and edges must be arrays",
    );
  }
  return {
    nodes: snapshot.nodes as Node[],
    edges: snapshot.edges as Edge[],
  };
};
