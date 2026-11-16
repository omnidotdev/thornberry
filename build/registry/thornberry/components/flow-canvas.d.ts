import type { ReactFlowProps } from "@xyflow/react";
import type { ReactNode } from "react";
/** Props for {@link FlowCanvas} */
export interface FlowCanvasProps extends ReactFlowProps {
    /**
     * Extra content rendered inside the flow, after the built-in
     * Background, Controls, and MiniMap. Use this to add panels.
     */
    children?: ReactNode;
}
export declare function FlowCanvas({ nodeTypes, edgeTypes, defaultEdgeOptions, fitView, children, ...rest }: FlowCanvasProps): import("react/jsx-runtime").JSX.Element;
export declare namespace FlowCanvas {
    var displayName: string;
}
