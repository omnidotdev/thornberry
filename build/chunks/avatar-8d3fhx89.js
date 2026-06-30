import {
  NODE_MIN_HEIGHT,
  NODE_WIDTH
} from "./avatar-sq2amekn.js";

// src/registry/thornberry/components/smart-edge.tsx
import { getSmoothStepPath, useStore } from "@xyflow/react";
import { memo, useMemo } from "react";

// src/registry/thornberry/lib/edge-geometry.ts
import { Position } from "@xyflow/react";
var EDGE_OFFSET = 20;
var DIRECTION_BONUS = 50;
function getNodeSideCenters(rect) {
  return {
    top: { x: rect.x + rect.width / 2, y: rect.y },
    bottom: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
    left: { x: rect.x, y: rect.y + rect.height / 2 },
    right: { x: rect.x + rect.width, y: rect.y + rect.height / 2 }
  };
}
function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}
function getBestConnectionPoints(sourceRect, targetRect) {
  const sourceSides = getNodeSideCenters(sourceRect);
  const targetSides = getNodeSideCenters(targetRect);
  const positionPairs = [
    {
      sourcePos: Position.Bottom,
      targetPos: Position.Top,
      source: sourceSides.bottom,
      target: targetSides.top
    },
    {
      sourcePos: Position.Top,
      targetPos: Position.Bottom,
      source: sourceSides.top,
      target: targetSides.bottom
    },
    {
      sourcePos: Position.Right,
      targetPos: Position.Left,
      source: sourceSides.right,
      target: targetSides.left
    },
    {
      sourcePos: Position.Left,
      targetPos: Position.Right,
      source: sourceSides.left,
      target: targetSides.right
    }
  ];
  let bestPair = positionPairs[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const pair of positionPairs) {
    const dist = distance(pair.source, pair.target);
    let penalty = 0;
    if (pair.sourcePos === Position.Bottom && pair.targetPos === Position.Top && targetRect.y > sourceRect.y + sourceRect.height) {
      penalty -= DIRECTION_BONUS;
    }
    if (pair.sourcePos === Position.Top && pair.targetPos === Position.Bottom && targetRect.y + targetRect.height < sourceRect.y) {
      penalty -= DIRECTION_BONUS;
    }
    if (pair.sourcePos === Position.Right && pair.targetPos === Position.Left && targetRect.x > sourceRect.x + sourceRect.width) {
      penalty -= DIRECTION_BONUS;
    }
    if (pair.sourcePos === Position.Left && pair.targetPos === Position.Right && targetRect.x + targetRect.width < sourceRect.x) {
      penalty -= DIRECTION_BONUS;
    }
    const score = dist + penalty;
    if (score < bestScore) {
      bestScore = score;
      bestPair = pair;
    }
  }
  return {
    sourceX: bestPair.source.x,
    sourceY: bestPair.source.y,
    targetX: bestPair.target.x,
    targetY: bestPair.target.y,
    sourcePosition: bestPair.sourcePos,
    targetPosition: bestPair.targetPos
  };
}

// src/registry/thornberry/components/smart-edge.tsx
import { jsx, jsxs } from "react/jsx-runtime";
"use client";
var EDGE_STROKE_WIDTH = 3;
var createEdgePositionsSelector = (sourceId, targetId) => {
  let prevResult = null;
  return (state) => {
    const sourceNode = state.nodeLookup.get(sourceId);
    const targetNode = state.nodeLookup.get(targetId);
    const source = sourceNode ? {
      x: sourceNode.internals.positionAbsolute.x,
      y: sourceNode.internals.positionAbsolute.y,
      width: sourceNode.measured.width ?? NODE_WIDTH,
      height: sourceNode.measured.height ?? NODE_MIN_HEIGHT
    } : null;
    const target = targetNode ? {
      x: targetNode.internals.positionAbsolute.x,
      y: targetNode.internals.positionAbsolute.y,
      width: targetNode.measured.width ?? NODE_WIDTH,
      height: targetNode.measured.height ?? NODE_MIN_HEIGHT
    } : null;
    if (prevResult && prevResult.source?.x === source?.x && prevResult.source?.y === source?.y && prevResult.target?.x === target?.x && prevResult.target?.y === target?.y) {
      return prevResult;
    }
    prevResult = { source, target };
    return prevResult;
  };
};
var SmartEdge = memo(({
  id,
  source,
  target,
  sourceX: fallbackSourceX,
  sourceY: fallbackSourceY,
  targetX: fallbackTargetX,
  targetY: fallbackTargetY,
  sourcePosition: fallbackSourcePosition,
  targetPosition: fallbackTargetPosition,
  style = {},
  markerEnd,
  label,
  labelStyle,
  labelShowBg = true,
  labelBgStyle,
  selected
}) => {
  const selector = useMemo(() => createEdgePositionsSelector(source, target), [source, target]);
  const { source: sourceRect, target: targetRect } = useStore(selector);
  let path;
  let labelX;
  let labelY;
  if (!sourceRect || !targetRect) {
    [path, labelX, labelY] = getSmoothStepPath({
      sourceX: fallbackSourceX,
      sourceY: fallbackSourceY,
      sourcePosition: fallbackSourcePosition,
      targetX: fallbackTargetX,
      targetY: fallbackTargetY,
      targetPosition: fallbackTargetPosition,
      borderRadius: 0,
      offset: EDGE_OFFSET
    });
  } else {
    const {
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition
    } = getBestConnectionPoints(sourceRect, targetRect);
    [path, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
      offset: EDGE_OFFSET
    });
  }
  const strokeColor = style.stroke || "currentColor";
  return /* @__PURE__ */ jsxs("g", {
    className: "react-flow__edge-smart",
    children: [
      /* @__PURE__ */ jsx("path", {
        d: path,
        fill: "none",
        strokeWidth: 20,
        stroke: "transparent",
        className: "react-flow__edge-interaction"
      }),
      selected && /* @__PURE__ */ jsx("path", {
        d: path,
        fill: "none",
        strokeWidth: EDGE_STROKE_WIDTH + 6,
        stroke: strokeColor,
        strokeOpacity: 0.3
      }),
      /* @__PURE__ */ jsx("path", {
        id,
        className: "react-flow__edge-path",
        d: path,
        fill: "none",
        strokeWidth: selected ? EDGE_STROKE_WIDTH + 1 : EDGE_STROKE_WIDTH,
        stroke: strokeColor,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style,
        markerEnd
      }),
      label && /* @__PURE__ */ jsx("foreignObject", {
        width: 120,
        height: 32,
        x: labelX - 60,
        y: labelY - 16,
        className: "react-flow__edge-label",
        requiredExtensions: "http://www.w3.org/1999/xhtml",
        children: /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            pointerEvents: "none"
          },
          children: /* @__PURE__ */ jsx("div", {
            style: {
              padding: "4px 10px",
              borderRadius: 6,
              backgroundColor: labelShowBg ? "#ffffff" : "transparent",
              border: labelShowBg ? "1px solid #e2e8f0" : "none",
              boxShadow: labelShowBg ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
              ...labelBgStyle
            },
            children: /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 11,
                fontWeight: 600,
                color: strokeColor,
                letterSpacing: "0.02em",
                ...labelStyle
              },
              children: label
            })
          })
        })
      })
    ]
  });
});
SmartEdge.displayName = "SmartEdge";

export { SmartEdge };
