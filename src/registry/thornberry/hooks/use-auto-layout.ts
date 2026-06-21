import { useReactFlow } from "@xyflow/react";
import { useCallback, useRef } from "react";

import { autoLayout } from "@/registry/thornberry/lib/auto-layout";

import type { AutoLayoutOptions } from "@/registry/thornberry/lib/auto-layout";

export const useAutoLayout = (opts?: AutoLayoutOptions) => {
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow();
  const optsRef = useRef(opts);
  optsRef.current = opts;
  return useCallback(async () => {
    const { nodes } = await autoLayout(getNodes(), getEdges(), optsRef.current);
    setNodes(nodes);
    // yield a microtask so setNodes commits before fitView reads the store
    await Promise.resolve();
    fitView();
  }, [getNodes, getEdges, setNodes, fitView]);
};
