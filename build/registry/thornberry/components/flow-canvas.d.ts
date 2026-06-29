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
export declare const FlowCanvas: {
    ({ nodeTypes, edgeTypes, defaultEdgeOptions, fitView, children, ...rest }: FlowCanvasProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
