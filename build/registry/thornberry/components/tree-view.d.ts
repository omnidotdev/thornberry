import { TreeView as ArkTreeView, createTreeCollection } from "@ark-ui/react/tree-view";
import type { TreeNode } from "@ark-ui/react/tree-view";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
declare const treeViewRowVariants: (props?: ({
    size?: "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const TreeViewProvider: ArkTreeView.RootProviderComponent<{}>;
declare const TreeViewContext: <T extends unknown>(props: ArkTreeView.ContextProps<T>) => ReactNode;
declare const TreeViewNodeContext: (props: ArkTreeView.NodeContextProps) => ReactNode;
declare const TreeViewNodeProvider: typeof ArkTreeView.NodeProvider;
declare const TreeViewRoot: <T extends TreeNode>({ className, ...rest }: ArkTreeView.RootProps<T>) => import("react/jsx-runtime").JSX.Element;
declare const TreeViewLabel: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.Label>) => import("react/jsx-runtime").JSX.Element;
/** The `role="tree"` element that owns keyboard navigation and typeahead. */
declare const TreeViewTree: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.Tree>) => import("react/jsx-runtime").JSX.Element;
/** A leaf node row. */
declare const TreeViewItem: ({ className, size, style, ...rest }: ComponentProps<typeof ArkTreeView.Item> & VariantProps<typeof treeViewRowVariants>) => import("react/jsx-runtime").JSX.Element;
declare const TreeViewItemText: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.ItemText>) => import("react/jsx-runtime").JSX.Element;
declare const TreeViewItemIndicator: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.ItemIndicator>) => import("react/jsx-runtime").JSX.Element;
/** A node with children. Wraps its control row and its collapsible content. */
declare const TreeViewBranch: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.Branch>) => import("react/jsx-runtime").JSX.Element;
/** The branch's row: selects the branch and toggles it open on click. */
declare const TreeViewBranchControl: ({ className, size, style, ...rest }: ComponentProps<typeof ArkTreeView.BranchControl> & VariantProps<typeof treeViewRowVariants>) => import("react/jsx-runtime").JSX.Element;
/** Expands or collapses the branch without selecting it. */
declare const TreeViewBranchTrigger: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.BranchTrigger>) => import("react/jsx-runtime").JSX.Element;
/** Rotates its children (a right chevron by default) a quarter turn when open. */
declare const TreeViewBranchIndicator: ({ className, children, ...rest }: ComponentProps<typeof ArkTreeView.BranchIndicator>) => import("react/jsx-runtime").JSX.Element;
declare const TreeViewBranchText: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.BranchText>) => import("react/jsx-runtime").JSX.Element;
declare const TreeViewBranchContent: ({ className, ...rest }: ComponentProps<typeof ArkTreeView.BranchContent>) => import("react/jsx-runtime").JSX.Element;
/** A vertical line connecting a branch to its children. */
declare const TreeViewBranchIndentGuide: ({ className, style, ...rest }: ComponentProps<typeof ArkTreeView.BranchIndentGuide>) => import("react/jsx-runtime").JSX.Element;
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
interface TreeViewProps extends Omit<ArkTreeView.RootProps<TreeViewNode>, "collection" | "children">, VariantProps<typeof treeViewRowVariants> {
    /** Top-level nodes of the tree. */
    nodes: TreeViewNode[];
    /** Visible label rendered above the tree, also its accessible name. */
    label?: ReactNode;
    /** Show folder icons on branches and file icons on leaves. */
    fileIcons?: boolean;
    /** Expand every branch on first render (ignored when `defaultExpandedValue` is set). */
    defaultExpandAll?: boolean;
}
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
declare const TreeView: ({ nodes, label, fileIcons, defaultExpandAll, defaultExpandedValue, size, "aria-label": ariaLabel, ...rest }: TreeViewProps) => import("react/jsx-runtime").JSX.Element;
export type { TreeViewNode };
export { TreeView, TreeViewBranch, TreeViewBranchContent, TreeViewBranchControl, TreeViewBranchIndentGuide, TreeViewBranchIndicator, TreeViewBranchText, TreeViewBranchTrigger, TreeViewContext, TreeViewItem, TreeViewItemIndicator, TreeViewItemText, TreeViewLabel, TreeViewNodeContext, TreeViewNodeProvider, TreeViewProvider, TreeViewRoot, TreeViewTree, createTreeCollection, treeViewRowVariants, };
