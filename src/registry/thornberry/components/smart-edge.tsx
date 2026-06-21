"use client";

import { getSmoothStepPath, useStore } from "@xyflow/react";
import { memo, useMemo } from "react";

import {
  NODE_MIN_HEIGHT,
  NODE_WIDTH,
} from "@/registry/thornberry/components/base-node";
import {
  EDGE_OFFSET,
  getBestConnectionPoints,
} from "@/registry/thornberry/lib/edge-geometry";

import type { EdgeProps, ReactFlowState } from "@xyflow/react";
import type { NodeRect } from "@/registry/thornberry/lib/edge-geometry";

/** Edge styling constants */
const EDGE_STROKE_WIDTH = 3;

interface EdgeNodeRects {
  source: NodeRect | null;
  target: NodeRect | null;
}

/**
 * Build a memoized selector that reads the absolute rect of the source
 * and target nodes from the v12 store.
 *
 * In @xyflow/react v12 nodes live in `state.nodeLookup` (a Map of
 * `InternalNode`). Absolute position comes from
 * `internals.positionAbsolute` and measured size from `measured`,
 * falling back to the node's relative `position` and the default
 * dimensions when a node has not been measured yet.
 */
const createEdgePositionsSelector = (sourceId: string, targetId: string) => {
  let prevResult: EdgeNodeRects | null = null;

  return (state: ReactFlowState): EdgeNodeRects => {
    const sourceNode = state.nodeLookup.get(sourceId);
    const targetNode = state.nodeLookup.get(targetId);

    const source: NodeRect | null = sourceNode
      ? {
          x: sourceNode.internals.positionAbsolute.x,
          y: sourceNode.internals.positionAbsolute.y,
          width: sourceNode.measured.width ?? NODE_WIDTH,
          height: sourceNode.measured.height ?? NODE_MIN_HEIGHT,
        }
      : null;

    const target: NodeRect | null = targetNode
      ? {
          x: targetNode.internals.positionAbsolute.x,
          y: targetNode.internals.positionAbsolute.y,
          width: targetNode.measured.width ?? NODE_WIDTH,
          height: targetNode.measured.height ?? NODE_MIN_HEIGHT,
        }
      : null;

    // Preserve referential equality when positions are unchanged
    if (
      prevResult &&
      prevResult.source?.x === source?.x &&
      prevResult.source?.y === source?.y &&
      prevResult.target?.x === target?.x &&
      prevResult.target?.y === target?.y
    ) {
      return prevResult;
    }

    prevResult = { source, target };
    return prevResult;
  };
};

/**
 * SmartEdge automatically connects to the nearest sides of its source
 * and target nodes, routing with a smooth step path.
 */
export const SmartEdge = memo(
  ({
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
    selected,
  }: EdgeProps) => {
    const selector = useMemo(
      () => createEdgePositionsSelector(source, target),
      [source, target],
    );
    const { source: sourceRect, target: targetRect } = useStore(selector);

    let path: string;
    let labelX: number;
    let labelY: number;

    if (!sourceRect || !targetRect) {
      // Fall back to the coordinates React Flow provides
      [path, labelX, labelY] = getSmoothStepPath({
        sourceX: fallbackSourceX,
        sourceY: fallbackSourceY,
        sourcePosition: fallbackSourcePosition,
        targetX: fallbackTargetX,
        targetY: fallbackTargetY,
        targetPosition: fallbackTargetPosition,
        borderRadius: 0,
        offset: EDGE_OFFSET,
      });
    } else {
      const {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      } = getBestConnectionPoints(sourceRect, targetRect);

      [path, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 0,
        offset: EDGE_OFFSET,
      });
    }

    const strokeColor = (style.stroke as string) || "currentColor";

    return (
      <g className="react-flow__edge-smart">
        {/* Invisible wider path for easier selection */}
        <path
          d={path}
          fill="none"
          strokeWidth={20}
          stroke="transparent"
          className="react-flow__edge-interaction"
        />

        {/* Glow effect for the selected state */}
        {selected && (
          <path
            d={path}
            fill="none"
            strokeWidth={EDGE_STROKE_WIDTH + 6}
            stroke={strokeColor}
            strokeOpacity={0.3}
          />
        )}

        {/* Main edge path */}
        <path
          id={id}
          className="react-flow__edge-path"
          d={path}
          fill="none"
          strokeWidth={selected ? EDGE_STROKE_WIDTH + 1 : EDGE_STROKE_WIDTH}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={style}
          markerEnd={markerEnd}
        />

        {/* Optional label */}
        {label && (
          <foreignObject
            width={120}
            height={32}
            x={labelX - 60}
            y={labelY - 16}
            className="react-flow__edge-label"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  backgroundColor: labelShowBg ? "#ffffff" : "transparent",
                  border: labelShowBg ? "1px solid #e2e8f0" : "none",
                  boxShadow: labelShowBg
                    ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                    : "none",
                  ...labelBgStyle,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: strokeColor,
                    letterSpacing: "0.02em",
                    ...labelStyle,
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          </foreignObject>
        )}
      </g>
    );
  },
);

SmartEdge.displayName = "SmartEdge";
