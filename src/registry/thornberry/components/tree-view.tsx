"use client";

import { TreeView as ArkTreeView } from "@ark-ui/react/tree-view";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const TreeViewProvider = ArkTreeView.RootProvider;
const TreeViewContext = ArkTreeView.Context;
const TreeViewNodeProvider = ArkTreeView.NodeProvider;
const TreeViewBranchIndentGuide = ArkTreeView.BranchIndentGuide;

const TreeViewRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Root>) => (
  <ArkTreeView.Root
    className={cn("flex flex-col gap-1.5", className)}
    {...rest}
  />
);

const TreeViewLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Label>) => (
  <ArkTreeView.Label
    className={cn("font-medium text-sm", className)}
    {...rest}
  />
);

const TreeViewTree = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Tree>) => (
  <ArkTreeView.Tree
    className={cn("flex flex-col gap-0.5 rounded-md border p-2", className)}
    {...rest}
  />
);

const TreeViewBranch = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Branch>) => (
  <ArkTreeView.Branch className={cn("flex flex-col", className)} {...rest} />
);

const TreeViewBranchControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchControl>) => (
  <ArkTreeView.BranchControl
    className={cn(
      "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary data-[state=open]:bg-accent",
      className,
    )}
    {...rest}
  />
);

const TreeViewBranchContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchContent>) => (
  <ArkTreeView.BranchContent
    className={cn("ml-4 flex flex-col gap-0.5 border-l pl-2", className)}
    {...rest}
  />
);

const TreeViewBranchText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchText>) => (
  <ArkTreeView.BranchText
    className={cn("flex flex-1 items-center gap-1.5", className)}
    {...rest}
  />
);

const TreeViewBranchIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchIndicator>) => (
  <ArkTreeView.BranchIndicator
    className={cn(
      "transition-transform duration-200 data-[state=open]:rotate-90",
      className,
    )}
    {...rest}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </ArkTreeView.BranchIndicator>
);

const TreeViewBranchTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchTrigger>) => (
  <ArkTreeView.BranchTrigger
    className={cn(
      "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary",
      className,
    )}
    {...rest}
  />
);

const TreeViewItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Item>) => (
  <ArkTreeView.Item
    className={cn(
      "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground",
      className,
    )}
    {...rest}
  />
);

const TreeViewItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.ItemText>) => (
  <ArkTreeView.ItemText
    className={cn("flex flex-1 items-center gap-1.5", className)}
    {...rest}
  />
);

const TreeViewItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.ItemIndicator>) => (
  <ArkTreeView.ItemIndicator
    className={cn("flex h-4 w-4 items-center justify-center", className)}
    {...rest}
  />
);

export {
  TreeViewRoot,
  TreeViewLabel,
  TreeViewTree,
  TreeViewBranch,
  TreeViewBranchControl,
  TreeViewBranchContent,
  TreeViewBranchText,
  TreeViewBranchIndicator,
  TreeViewBranchTrigger,
  TreeViewBranchIndentGuide,
  TreeViewItem,
  TreeViewItemText,
  TreeViewItemIndicator,
  TreeViewProvider,
  TreeViewContext,
  TreeViewNodeProvider,
};

// Re-export createTreeCollection for convenience
export { createTreeCollection } from "@ark-ui/react/tree-view";
