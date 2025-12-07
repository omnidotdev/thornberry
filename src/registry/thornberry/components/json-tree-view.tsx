"use client";

import { JsonTreeView as ArkJsonTreeView } from "@ark-ui/react/json-tree-view";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const JsonTreeViewProvider = ArkJsonTreeView.RootProvider;

const JsonTreeViewRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkJsonTreeView.Root>) => (
  <ArkJsonTreeView.Root
    className={cn(
      "overflow-auto rounded-md border bg-background p-4 font-mono text-sm",
      className,
    )}
    {...rest}
  />
);

const JsonTreeViewTree = ({
  className,
  arrow,
  ...rest
}: ComponentProps<typeof ArkJsonTreeView.Tree>) => (
  <ArkJsonTreeView.Tree
    className={cn("flex flex-col gap-0.5", className)}
    arrow={arrow || <ChevronRight className="h-4 w-4" />}
    {...rest}
  />
);

export { JsonTreeViewRoot, JsonTreeViewTree, JsonTreeViewProvider };
