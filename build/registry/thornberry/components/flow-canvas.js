import {
  SmartEdge
} from "../../../chunks/avatar-pw54zh5c.js";
import {
  BaseNode
} from "../../../chunks/avatar-e0wn7nsj.js";
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
import { jsxDEV } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV(ReactFlowProvider, {
    children: /* @__PURE__ */ jsxDEV(ReactFlow, {
      nodeTypes: mergedNodeTypes,
      edgeTypes: mergedEdgeTypes,
      defaultEdgeOptions: mergedEdgeOptions,
      fitView,
      ...rest,
      children: [
        /* @__PURE__ */ jsxDEV(Background, {}, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV(Controls, {}, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV(MiniMap, {}, undefined, false, undefined, this),
        children
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
FlowCanvas.displayName = "FlowCanvas";
export {
  FlowCanvas
};
