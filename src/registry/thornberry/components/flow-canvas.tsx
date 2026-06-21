"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { useMemo } from "react";

import { BaseNode } from "@/registry/thornberry/components/base-node";
import { SmartEdge } from "@/registry/thornberry/components/smart-edge";

import type {
  DefaultEdgeOptions,
  EdgeTypes,
  NodeTypes,
  ReactFlowProps,
} from "@xyflow/react";
import type { ReactNode } from "react";

/**
 * Built-in node types provided by the library. Consumer-supplied
 * `nodeTypes` are merged over these (consumer wins on key collision).
 */
const DEFAULT_NODE_TYPES: NodeTypes = {
  base: BaseNode,
};

/**
 * Built-in edge types provided by the library. Consumer-supplied
 * `edgeTypes` are merged over these (consumer wins on key collision).
 */
const DEFAULT_EDGE_TYPES: EdgeTypes = {
  smart: SmartEdge,
};

/**
 * New edges default to the {@link SmartEdge} type. Consumer-provided
 * `defaultEdgeOptions` are merged over this, so the smart default
 * persists unless the consumer explicitly sets `type`.
 */
const DEFAULT_EDGE_OPTIONS: DefaultEdgeOptions = {
  type: "smart",
};

/** Props for {@link FlowCanvas} */
export interface FlowCanvasProps extends ReactFlowProps {
  /**
   * Extra content rendered inside the flow, after the built-in
   * Background, Controls, and MiniMap. Use this to add panels.
   */
  children?: ReactNode;
}

/**
 * Themed wrapper over `@xyflow/react` with sensible defaults: it owns a
 * {@link ReactFlowProvider} (so hooks like `useAutoLayout` work for
 * consumers and children), renders Background, Controls, and MiniMap,
 * registers the library's `base` node and `smart` edge types, and
 * fits the view on mount.
 *
 * FlowCanvas OWNS the provider; do not wrap it in another
 * `<ReactFlowProvider>` or React Flow hooks will read the wrong store.
 *
 * Consumer-provided `nodeTypes` and `edgeTypes` are merged over the
 * built-in defaults, so a consumer key overrides a built-in of the same
 * name. All other React Flow props are forwarded through.
 */
export const FlowCanvas = ({
  nodeTypes,
  edgeTypes,
  defaultEdgeOptions,
  fitView = true,
  children,
  ...rest
}: FlowCanvasProps) => {
  const mergedNodeTypes = useMemo<NodeTypes>(
    () => ({ ...DEFAULT_NODE_TYPES, ...nodeTypes }),
    [nodeTypes],
  );
  const mergedEdgeTypes = useMemo<EdgeTypes>(
    () => ({ ...DEFAULT_EDGE_TYPES, ...edgeTypes }),
    [edgeTypes],
  );
  const mergedEdgeOptions = useMemo<DefaultEdgeOptions>(
    () => ({ ...DEFAULT_EDGE_OPTIONS, ...defaultEdgeOptions }),
    [defaultEdgeOptions],
  );

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodeTypes={mergedNodeTypes}
        edgeTypes={mergedEdgeTypes}
        defaultEdgeOptions={mergedEdgeOptions}
        fitView={fitView}
        {...rest}
      >
        <Background />
        <Controls />
        <MiniMap />
        {children}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

FlowCanvas.displayName = "FlowCanvas";
