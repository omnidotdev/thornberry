import { Position } from "@xyflow/react";
/** Smooth step path offset for routed edges */
export declare const EDGE_OFFSET = 20;
/** A node rectangle expressed as top-left corner plus size */
export interface NodeRect {
    x: number;
    y: number;
    width: number;
    height: number;
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
export declare function getBestConnectionPoints(sourceRect: NodeRect, targetRect: NodeRect): ConnectionPoints;
/**
 * Choose which sides of the source and target nodes an edge should
 * connect to, based purely on their geometry.
 */
export declare function chooseConnectionSides(source: NodeRect, target: NodeRect): {
    sourcePosition: Position;
    targetPosition: Position;
};
export {};
