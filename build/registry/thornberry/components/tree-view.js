import {
  cva
} from "../../../chunks/ai-describe-panel-g7wczx51.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/tree-view.tsx
import {
  TreeView as ArkTreeView,
  createTreeCollection,
  useTreeViewNodeContext
} from "@ark-ui/react/tree-view";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var rowIndentStyle = {
  paddingInlineStart: "calc((var(--depth) - 1) * var(--tree-indent, 1rem) + 0.5rem)"
};
var indentGuideStyle = {
  insetInlineStart: "calc((var(--depth) - 1) * var(--tree-indent, 1rem) + 1rem - 0.5px)"
};
var treeViewRowVariants = cva("text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary data-selected:bg-accent data-selected:text-accent-foreground relative flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pe-2 transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50", {
  variants: {
    size: {
      sm: "min-h-7 text-xs",
      md: "min-h-8 text-sm"
    }
  },
  defaultVariants: { size: "md" }
});
var TreeViewProvider = ArkTreeView.RootProvider;
var TreeViewContext = ArkTreeView.Context;
var TreeViewNodeContext = ArkTreeView.NodeContext;
var TreeViewNodeProvider = ArkTreeView.NodeProvider;
var TreeViewRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.Root, {
  className: cn("flex w-full flex-col gap-2", className),
  ...rest
});
var TreeViewLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.Label, {
  className: cn("font-medium text-foreground text-sm", className),
  ...rest
});
var TreeViewTree = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.Tree, {
  className: cn("flex flex-col gap-px outline-none", className),
  ...rest
});
var TreeViewItem = ({
  className,
  size,
  style,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.Item, {
  className: cn(treeViewRowVariants({ size }), className),
  style: { ...rowIndentStyle, ...style },
  ...rest
});
var TreeViewItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.ItemText, {
  className: cn("flex min-w-0 flex-1 items-center gap-1.5", className),
  ...rest
});
var TreeViewItemIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.ItemIndicator, {
  className: cn("ms-auto flex shrink-0 items-center", className),
  ...rest
});
var TreeViewBranch = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.Branch, {
  className: cn("flex flex-col", className),
  ...rest
});
var TreeViewBranchControl = ({
  className,
  size,
  style,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.BranchControl, {
  className: cn(treeViewRowVariants({ size }), className),
  style: { ...rowIndentStyle, ...style },
  ...rest
});
var TreeViewBranchTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.BranchTrigger, {
  className: cn("flex shrink-0 items-center", className),
  ...rest
});
var TreeViewBranchIndicator = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.BranchIndicator, {
  className: cn("flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform data-[state=open]:rotate-90", className),
  ...rest,
  children: children ?? /* @__PURE__ */ jsx(ChevronRight, {
    className: "size-4",
    "aria-hidden": "true"
  })
});
var TreeViewBranchText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.BranchText, {
  className: cn("flex min-w-0 flex-1 items-center gap-1.5", className),
  ...rest
});
var TreeViewBranchContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.BranchContent, {
  className: cn("relative flex flex-col gap-px", className),
  ...rest
});
var TreeViewBranchIndentGuide = ({
  className,
  style,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTreeView.BranchIndentGuide, {
  className: cn("absolute inset-y-0 z-10 w-px bg-border", className),
  style: { ...indentGuideStyle, ...style },
  ...rest
});
var FileTreeIcon = ({ isBranch }) => {
  const node = useTreeViewNodeContext();
  if (!isBranch) {
    return /* @__PURE__ */ jsx(File, {
      className: "text-muted-foreground size-4 shrink-0",
      "aria-hidden": true
    });
  }
  const Icon = node.expanded ? FolderOpen : Folder;
  return /* @__PURE__ */ jsx(Icon, {
    className: "text-muted-foreground size-4 shrink-0",
    "aria-hidden": true
  });
};
var TreeViewNodeRow = ({
  node,
  indexPath,
  fileIcons,
  size
}) => {
  const icon = node.icon ?? (fileIcons ? /* @__PURE__ */ jsx(FileTreeIcon, {
    isBranch: !!node.children
  }) : null);
  return /* @__PURE__ */ jsx(TreeViewNodeProvider, {
    node,
    indexPath,
    children: node.children ? /* @__PURE__ */ jsxs(TreeViewBranch, {
      children: [
        /* @__PURE__ */ jsxs(TreeViewBranchControl, {
          size,
          children: [
            /* @__PURE__ */ jsx(TreeViewBranchIndicator, {}),
            /* @__PURE__ */ jsxs(TreeViewBranchText, {
              children: [
                icon,
                /* @__PURE__ */ jsx("span", {
                  className: "truncate",
                  children: node.label
                })
              ]
            }),
            node.suffix
          ]
        }),
        /* @__PURE__ */ jsxs(TreeViewBranchContent, {
          children: [
            /* @__PURE__ */ jsx(TreeViewBranchIndentGuide, {}),
            node.children.map((child, index) => /* @__PURE__ */ jsx(TreeViewNodeRow, {
              node: child,
              indexPath: [...indexPath, index],
              fileIcons,
              size
            }, child.id))
          ]
        })
      ]
    }) : /* @__PURE__ */ jsxs(TreeViewItem, {
      size,
      children: [
        /* @__PURE__ */ jsx("span", {
          className: "size-4 shrink-0",
          "aria-hidden": true
        }),
        /* @__PURE__ */ jsxs(TreeViewItemText, {
          children: [
            icon,
            /* @__PURE__ */ jsx("span", {
              className: "truncate",
              children: node.label
            })
          ]
        }),
        node.suffix
      ]
    })
  });
};
var TreeView = ({
  nodes,
  label,
  fileIcons = false,
  defaultExpandAll = false,
  defaultExpandedValue,
  size,
  "aria-label": ariaLabel,
  ...rest
}) => {
  const collection = useMemo(() => createTreeCollection({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.label,
    rootNode: { id: "ROOT", label: "", children: nodes }
  }), [nodes]);
  return /* @__PURE__ */ jsxs(TreeViewRoot, {
    collection,
    defaultExpandedValue: defaultExpandedValue ?? (defaultExpandAll ? collection.getBranchValues() : undefined),
    ...rest,
    children: [
      label && /* @__PURE__ */ jsx(TreeViewLabel, {
        children: label
      }),
      /* @__PURE__ */ jsx(TreeViewTree, {
        "aria-label": ariaLabel,
        children: nodes.map((node, index) => /* @__PURE__ */ jsx(TreeViewNodeRow, {
          node,
          indexPath: [index],
          fileIcons,
          size
        }, node.id))
      })
    ]
  });
};
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
  treeViewRowVariants
};
