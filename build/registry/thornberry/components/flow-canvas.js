import {
  BaseNode2
} from "../../../chunks/account-user-two-factor-authentication-jkgqd6za.js";
import {
  SmartEdge2
} from "../../../chunks/account-user-two-factor-authentication-mntdd9kx.js";

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
  base: BaseNode2
};
var DEFAULT_EDGE_TYPES = {
  smart: SmartEdge2
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
