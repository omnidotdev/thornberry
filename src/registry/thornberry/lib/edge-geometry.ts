import { Position } from "@xyflow/react";

/** Smooth step path offset for routed edges */
export const EDGE_OFFSET = 20;

/** Penalty applied when a side pair aligns with the node layout direction */
const DIRECTION_BONUS = 50;

/** A node rectangle expressed as top-left corner plus size */
export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

/** Center point of each side of a node rectangle */
function getNodeSideCenters(rect: NodeRect) {
  return {
    top: { x: rect.x + rect.width / 2, y: rect.y },
    bottom: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
    left: { x: rect.x, y: rect.y + rect.height / 2 },
    right: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
  };
}

/** Euclidean distance between two points */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/** A connection point pair with full geometry */
interface ConnectionPoints {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}

/**
 * Determine the best connection point coordinates between two nodes.
 *
 * Scores the four cardinal side pairs (Bottom->Top, Top->Bottom,
 * Right->Left, Left->Right) by distance, with a bonus when the pair
 * aligns with the relative layout direction of the two nodes, and
 * returns the lowest-scoring pair's coordinates.
 */
export function getBestConnectionPoints(
  sourceRect: NodeRect,
  targetRect: NodeRect,
): ConnectionPoints {
  const sourceSides = getNodeSideCenters(sourceRect);
  const targetSides = getNodeSideCenters(targetRect);

  const positionPairs: {
    sourcePos: Position;
    targetPos: Position;
    source: Point;
    target: Point;
  }[] = [
    {
      sourcePos: Position.Bottom,
      targetPos: Position.Top,
      source: sourceSides.bottom,
      target: targetSides.top,
    },
    {
      sourcePos: Position.Top,
      targetPos: Position.Bottom,
      source: sourceSides.top,
      target: targetSides.bottom,
    },
    {
      sourcePos: Position.Right,
      targetPos: Position.Left,
      source: sourceSides.right,
      target: targetSides.left,
    },
    {
      sourcePos: Position.Left,
      targetPos: Position.Right,
      source: sourceSides.left,
      target: targetSides.right,
    },
  ];

  let bestPair = positionPairs[0]!;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const pair of positionPairs) {
    const dist = distance(pair.source, pair.target);
    let penalty = 0;

    if (
      pair.sourcePos === Position.Bottom &&
      pair.targetPos === Position.Top &&
      targetRect.y > sourceRect.y + sourceRect.height
    ) {
      penalty -= DIRECTION_BONUS;
    }
    if (
      pair.sourcePos === Position.Top &&
      pair.targetPos === Position.Bottom &&
      targetRect.y + targetRect.height < sourceRect.y
    ) {
      penalty -= DIRECTION_BONUS;
    }
    if (
      pair.sourcePos === Position.Right &&
      pair.targetPos === Position.Left &&
      targetRect.x > sourceRect.x + sourceRect.width
    ) {
      penalty -= DIRECTION_BONUS;
    }
    if (
      pair.sourcePos === Position.Left &&
      pair.targetPos === Position.Right &&
      targetRect.x + targetRect.width < sourceRect.x
    ) {
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
    targetPosition: bestPair.targetPos,
  };
}

/**
 * Choose which sides of the source and target nodes an edge should
 * connect to, based purely on their geometry.
 */
export function chooseConnectionSides(
  source: NodeRect,
  target: NodeRect,
): { sourcePosition: Position; targetPosition: Position } {
  const { sourcePosition, targetPosition } = getBestConnectionPoints(
    source,
    target,
  );
  return { sourcePosition, targetPosition };
}
