import {
  Button2
} from "../../../chunks/ai-describe-panel-h4yrvya3.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/combobox.tsx
import {
  Combobox as ArkCombobox,
  createListCollection
} from "@ark-ui/react/combobox";
import { Portal } from "@ark-ui/react/portal";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ComboboxProvider = ArkCombobox.RootProvider;
var ComboboxContext = ArkCombobox.Context;
var ComboboxRoot = ({ className, ...rest }) => /* @__PURE__ */ jsx(ArkCombobox.Root, {
  className: cn("flex w-full flex-col gap-1.5", className),
  ...rest
});
var ComboboxLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Label, {
  className: cn("block font-medium text-sm", className),
  ...rest
});
var ComboboxControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Control, {
  className: cn("relative flex items-center justify-between", className),
  ...rest
});
var ComboboxInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Input, {
  className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var ComboboxTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Trigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button2, {
    variant: "ghost",
    size: "icon",
    className: cn("absolute top-0.5 right-0.5 opacity-50 hover:bg-background", className),
    children: /* @__PURE__ */ jsx(ChevronsUpDown, {
      className: "size-4"
    })
  })
});
var ComboboxClearTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ClearTrigger, {
  className: cn("absolute top-0 right-10 flex h-full items-center justify-center pr-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none", className),
  ...rest
});
var ComboboxPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Positioner, {
  className: cn("z-50 w-full min-w-32", className),
  ...rest
});
var ComboboxContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var ComboboxItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Item, {
  className: cn("flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 pr-2 text-sm outline-none data-disabled:pointer-events-none data-[state=checked]:bg-muted data-highlighted:bg-muted data-disabled:opacity-50", className),
  ...rest,
  children
});
var ComboboxItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemGroup, {
  className: cn("p-1", className),
  ...rest
});
var ComboboxItemGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemGroupLabel, {
  className: cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className),
  ...rest
});
var ComboboxItemIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemIndicator, {
  className: cn("ml-auto flex h-3.5 w-3.5 items-center justify-center", className),
  ...rest,
  children: /* @__PURE__ */ jsx(Check, {
    className: "size-4"
  })
});
var ComboboxItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemText, {
  className,
  ...rest
});
var ComboboxEmpty = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Empty, {
  className: cn("px-2 py-4 text-center text-muted-foreground text-sm", className),
  ...rest
});
var OptionsCombobox = ({
  items,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  placeholder = "Select...",
  label,
  emptyLabel = "No results",
  disabled,
  className
}) => {
  const collection = useMemo(() => createListCollection({
    items,
    isItemDisabled: (item) => Boolean(item.disabled)
  }), [items]);
  return /* @__PURE__ */ jsxs(ComboboxRoot, {
    collection,
    value,
    onValueChange: (details) => onValueChange?.(details.value),
    inputValue,
    onInputValueChange: (details) => onInputValueChange?.(details.inputValue),
    disabled,
    loopFocus: true,
    openOnClick: true,
    positioning: { sameWidth: true },
    lazyMount: true,
    unmountOnExit: true,
    className,
    children: [
      label && /* @__PURE__ */ jsx(ComboboxLabel, {
        children: label
      }),
      /* @__PURE__ */ jsxs(ComboboxControl, {
        children: [
          /* @__PURE__ */ jsx(ComboboxInput, {
            placeholder
          }),
          /* @__PURE__ */ jsx(ComboboxTrigger, {})
        ]
      }),
      /* @__PURE__ */ jsx(Portal, {
        children: /* @__PURE__ */ jsx(ComboboxPositioner, {
          children: /* @__PURE__ */ jsxs(ComboboxContent, {
            className: "w-full",
            children: [
              items.map((item) => /* @__PURE__ */ jsxs(ComboboxItem, {
                item,
                children: [
                  /* @__PURE__ */ jsxs(ComboboxItemText, {
                    className: "flex min-w-0 flex-1 items-center",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        className: "min-w-0 truncate",
                        children: item.label
                      }),
                      item.description && /* @__PURE__ */ jsx("span", {
                        className: "text-muted-foreground ml-2 shrink-0 text-xs",
                        children: item.description
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsx(ComboboxItemIndicator, {})
                ]
              }, item.value)),
              /* @__PURE__ */ jsx(ComboboxEmpty, {
                children: emptyLabel
              })
            ]
          })
        })
      })
    ]
  });
};
export {
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxContext,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxPositioner,
  ComboboxProvider,
  ComboboxRoot,
  ComboboxTrigger,
  OptionsCombobox
};
