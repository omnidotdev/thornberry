import {
  TreeView as ArkTreeView,
  createTreeCollection,
  useTreeViewNodeContext,
} from "@ark-ui/react/tree-view";
import { cva } from "class-variance-authority";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import type { TreeNode } from "@ark-ui/react/tree-view";
import type { VariantProps } from "class-variance-authority";
import type { CSSProperties, ComponentProps, ReactNode } from "react";

// Ark sets `--depth` (1 for top-level nodes) on every item and branch, so rows
// indent by depth. Override the step per tree with `--tree-indent` on the root
const rowIndentStyle: CSSProperties = {
  paddingInlineStart:
    "calc((var(--depth) - 1) * var(--tree-indent, 1rem) + 0.5rem)",
};

// The guide line sits under the parent branch's chevron (a 1rem icon after the
// row's 0.5rem start padding), so it lines up with the node that owns it
const indentGuideStyle: CSSProperties = {
  insetInlineStart:
    "calc((var(--depth) - 1) * var(--tree-indent, 1rem) + 1rem - 0.5px)",
};

const treeViewRowVariants = cva(
  "text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary data-selected:bg-accent data-selected:text-accent-foreground relative flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pe-2 transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-7 text-xs",
        md: "min-h-8 text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const TreeViewProvider = ArkTreeView.RootProvider;
const TreeViewContext = ArkTreeView.Context;
const TreeViewNodeContext = ArkTreeView.NodeContext;
const TreeViewNodeProvider = ArkTreeView.NodeProvider;

const TreeViewRoot = <T extends TreeNode>({
  className,
  ...rest
}: ArkTreeView.RootProps<T>) => (
  <ArkTreeView.Root
    className={cn("flex w-full flex-col gap-2", className)}
    {...rest}
  />
);

const TreeViewLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Label>) => (
  <ArkTreeView.Label
    className={cn("font-medium text-foreground text-sm", className)}
    {...rest}
  />
);

/** The `role="tree"` element that owns keyboard navigation and typeahead. */
const TreeViewTree = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Tree>) => (
  <ArkTreeView.Tree
    className={cn("flex flex-col gap-px outline-none", className)}
    {...rest}
  />
);

/** A leaf node row. */
const TreeViewItem = ({
  className,
  size,
  style,
  ...rest
}: ComponentProps<typeof ArkTreeView.Item> &
  VariantProps<typeof treeViewRowVariants>) => (
  <ArkTreeView.Item
    className={cn(treeViewRowVariants({ size }), className)}
    style={{ ...rowIndentStyle, ...style }}
    {...rest}
  />
);

const TreeViewItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.ItemText>) => (
  <ArkTreeView.ItemText
    className={cn("flex min-w-0 flex-1 items-center gap-1.5", className)}
    {...rest}
  />
);

const TreeViewItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.ItemIndicator>) => (
  <ArkTreeView.ItemIndicator
    className={cn("ms-auto flex shrink-0 items-center", className)}
    {...rest}
  />
);

/** A node with children. Wraps its control row and its collapsible content. */
const TreeViewBranch = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.Branch>) => (
  <ArkTreeView.Branch className={cn("flex flex-col", className)} {...rest} />
);

/** The branch's row: selects the branch and toggles it open on click. */
const TreeViewBranchControl = ({
  className,
  size,
  style,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchControl> &
  VariantProps<typeof treeViewRowVariants>) => (
  <ArkTreeView.BranchControl
    className={cn(treeViewRowVariants({ size }), className)}
    style={{ ...rowIndentStyle, ...style }}
    {...rest}
  />
);

/** Expands or collapses the branch without selecting it. */
const TreeViewBranchTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchTrigger>) => (
  <ArkTreeView.BranchTrigger
    className={cn("flex shrink-0 items-center", className)}
    {...rest}
  />
);

/** Rotates its children (a right chevron by default) a quarter turn when open. */
const TreeViewBranchIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchIndicator>) => (
  <ArkTreeView.BranchIndicator
    className={cn(
      "flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform data-[state=open]:rotate-90",
      className,
    )}
    {...rest}
  >
    {children ?? <ChevronRight className="size-4" aria-hidden="true" />}
  </ArkTreeView.BranchIndicator>
);

const TreeViewBranchText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchText>) => (
  <ArkTreeView.BranchText
    className={cn("flex min-w-0 flex-1 items-center gap-1.5", className)}
    {...rest}
  />
);

const TreeViewBranchContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchContent>) => (
  <ArkTreeView.BranchContent
    className={cn("relative flex flex-col gap-px", className)}
    {...rest}
  />
);

/** A vertical line connecting a branch to its children. */
const TreeViewBranchIndentGuide = ({
  className,
  style,
  ...rest
}: ComponentProps<typeof ArkTreeView.BranchIndentGuide>) => (
  <ArkTreeView.BranchIndentGuide
    className={cn("absolute inset-y-0 z-10 w-px bg-border", className)}
    style={{ ...indentGuideStyle, ...style }}
    {...rest}
  />
);

interface TreeViewNode {
  /** Unique id, used as the node's value for selection and expansion. */
  id: string;
  /** Text shown for the node, also used for typeahead. */
  label: string;
  /** Child nodes. A node with a `children` array renders as a branch. */
  children?: TreeViewNode[];
  /** Icon shown before the label. Overrides the file tree icons. */
  icon?: ReactNode;
  /** Trailing content, such as a status badge or a count. */
  suffix?: ReactNode;
  disabled?: boolean;
}

interface TreeViewProps
  extends Omit<ArkTreeView.RootProps<TreeViewNode>, "collection" | "children">,
    VariantProps<typeof treeViewRowVariants> {
  /** Top-level nodes of the tree. */
  nodes: TreeViewNode[];
  /** Visible label rendered above the tree, also its accessible name. */
  label?: ReactNode;
  /** Show folder icons on branches and file icons on leaves. */
  fileIcons?: boolean;
  /** Expand every branch on first render (ignored when `defaultExpandedValue` is set). */
  defaultExpandAll?: boolean;
}

/** Folder/file icons for the file tree style, swapping the folder open. */
const FileTreeIcon = ({ isBranch }: { isBranch: boolean }) => {
  const node = useTreeViewNodeContext();

  if (!isBranch) {
    return (
      <File className="text-muted-foreground size-4 shrink-0" aria-hidden />
    );
  }

  const Icon = node.expanded ? FolderOpen : Folder;

  return <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />;
};

interface TreeViewNodeRowProps {
  node: TreeViewNode;
  indexPath: number[];
  fileIcons: boolean;
  size: VariantProps<typeof treeViewRowVariants>["size"];
}

const TreeViewNodeRow = ({
  node,
  indexPath,
  fileIcons,
  size,
}: TreeViewNodeRowProps) => {
  const icon =
    node.icon ??
    (fileIcons ? <FileTreeIcon isBranch={!!node.children} /> : null);

  return (
    <TreeViewNodeProvider node={node} indexPath={indexPath}>
      {node.children ? (
        <TreeViewBranch>
          <TreeViewBranchControl size={size}>
            <TreeViewBranchIndicator />
            <TreeViewBranchText>
              {icon}
              <span className="truncate">{node.label}</span>
            </TreeViewBranchText>
            {node.suffix}
          </TreeViewBranchControl>

          <TreeViewBranchContent>
            <TreeViewBranchIndentGuide />
            {node.children.map((child, index) => (
              <TreeViewNodeRow
                key={child.id}
                node={child}
                indexPath={[...indexPath, index]}
                fileIcons={fileIcons}
                size={size}
              />
            ))}
          </TreeViewBranchContent>
        </TreeViewBranch>
      ) : (
        <TreeViewItem size={size}>
          {/* Keeps leaves aligned with sibling branches' chevrons */}
          <span className="size-4 shrink-0" aria-hidden />
          <TreeViewItemText>
            {icon}
            <span className="truncate">{node.label}</span>
          </TreeViewItemText>
          {node.suffix}
        </TreeViewItem>
      )}
    </TreeViewNodeProvider>
  );
};

/**
 * A data-driven tree with expandable branches, selection, and full keyboard
 * navigation (arrows, Home/End, `*` to expand siblings, typeahead). Pass
 * `fileIcons` for a file tree with folder and file icons.
 *
 * @example
 * <TreeView
 *   label="Files"
 *   fileIcons
 *   defaultExpandAll
 *   nodes={[{ id: "src", label: "src", children: [{ id: "src/index.ts", label: "index.ts" }] }]}
 *   onSelectionChange={({ selectedValue }) => open(selectedValue[0])}
 * />
 */
const TreeView = ({
  nodes,
  label,
  fileIcons = false,
  defaultExpandAll = false,
  defaultExpandedValue,
  size,
  "aria-label": ariaLabel,
  ...rest
}: TreeViewProps) => {
  const collection = useMemo(
    () =>
      createTreeCollection<TreeViewNode>({
        nodeToValue: (node) => node.id,
        nodeToString: (node) => node.label,
        rootNode: { id: "ROOT", label: "", children: nodes },
      }),
    [nodes],
  );

  return (
    <TreeViewRoot
      collection={collection}
      defaultExpandedValue={
        defaultExpandedValue ??
        (defaultExpandAll ? collection.getBranchValues() : undefined)
      }
      {...rest}
    >
      {label && <TreeViewLabel>{label}</TreeViewLabel>}

      <TreeViewTree aria-label={ariaLabel}>
        {nodes.map((node, index) => (
          <TreeViewNodeRow
            key={node.id}
            node={node}
            indexPath={[index]}
            fileIcons={fileIcons}
            size={size}
          />
        ))}
      </TreeViewTree>
    </TreeViewRoot>
  );
};

export type { TreeViewNode };
export {
  TreeView,
  TreeViewBranch,
  TreeViewBranchContent,
  TreeViewBranchControl,
  TreeViewBranchIndentGuide,
  TreeViewBranchIndicator,
  TreeViewBranchText,
  TreeViewBranchTrigger,
  TreeViewContext,
  TreeViewItem,
  TreeViewItemIndicator,
  TreeViewItemText,
  TreeViewLabel,
  TreeViewNodeContext,
  TreeViewNodeProvider,
  TreeViewProvider,
  TreeViewRoot,
  TreeViewTree,
  createTreeCollection,
  treeViewRowVariants,
};
