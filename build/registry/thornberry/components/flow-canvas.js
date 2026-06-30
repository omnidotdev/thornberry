import {
  SmartEdge
} from "../../../chunks/avatar-8d3fhx89.js";
import {
  BaseNode
} from "../../../chunks/avatar-sq2amekn.js";
import"../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/flow-canvas.tsx
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
"use client";
var DEFAULT_NODE_TYPES = {
  base: BaseNode
};
var DEFAULT_EDGE_TYPES = {
  smart: SmartEdge
};
var DEFAULT_EDGE_OPTIONS = {
  type: "smart"
};
var FlowCanvas = ({
  nodeTypes,
  edgeTypes,
  defaultEdgeOptions,
  fitView = true,
  children,
  ...rest
}) => {
  const mergedNodeTypes = useMemo(() => ({ ...DEFAULT_NODE_TYPES, ...nodeTypes }), [nodeTypes]);
  const mergedEdgeTypes = useMemo(() => ({ ...DEFAULT_EDGE_TYPES, ...edgeTypes }), [edgeTypes]);
  const mergedEdgeOptions = useMemo(() => ({ ...DEFAULT_EDGE_OPTIONS, ...defaultEdgeOptions }), [defaultEdgeOptions]);
  return /* @__PURE__ */ jsx(ReactFlowProvider, {
    children: /* @__PURE__ */ jsxs(ReactFlow, {
      nodeTypes: mergedNodeTypes,
      edgeTypes: mergedEdgeTypes,
      defaultEdgeOptions: mergedEdgeOptions,
      fitView,
      ...rest,
      children: [
        /* @__PURE__ */ jsx(Background, {}),
        /* @__PURE__ */ jsx(Controls, {}),
        /* @__PURE__ */ jsx(MiniMap, {}),
        children
      ]
    })
  });
};
FlowCanvas.displayName = "FlowCanvas";
export {
  FlowCanvas
};
