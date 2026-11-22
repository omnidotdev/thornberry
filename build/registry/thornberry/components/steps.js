import {
  buttonVariants2
} from "../../../chunks/ai-describe-panel-g9z5bw52.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/steps.tsx
import { Steps as ArkSteps, useStepsItemContext } from "@ark-ui/react/steps";
import { Check } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var StepsProvider = ArkSteps.RootProvider;
var StepsContext = ArkSteps.Context;
var StepsItemContext = ArkSteps.ItemContext;
var StepsRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.Root, {
  className: cn("flex w-full flex-col gap-6 data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-8", className),
  ...rest
});
var StepsList = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.List, {
  className: cn("flex w-full items-start gap-3 data-[orientation=vertical]:w-auto data-[orientation=vertical]:shrink-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-0", className),
  ...rest
});
var StepsItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.Item, {
  className: cn("relative flex min-w-0 flex-1 items-center gap-3 last:flex-initial data-[orientation=vertical]:flex-none data-[orientation=vertical]:items-start data-[orientation=vertical]:pb-8 data-[orientation=vertical]:last:pb-0", className),
  ...rest
});
var StepsTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.Trigger, {
  className: cn("group flex min-w-0 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background enabled:cursor-pointer data-[orientation=vertical]:items-start", className),
  ...rest
});
var StepsIndicator = ({
  className,
  children,
  ...rest
}) => {
  const item = useStepsItemContext();
  return /* @__PURE__ */ jsx(ArkSteps.Indicator, {
    className: cn("flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-border font-medium text-muted-foreground text-sm transition-colors data-complete:border-primary data-current:border-primary data-complete:bg-primary data-current:text-primary data-complete:text-primary-foreground", className),
    ...rest,
    children: children ?? (item.completed ? /* @__PURE__ */ jsx(Check, {
      className: "size-4",
      "aria-hidden": "true"
    }) : item.index + 1)
  });
};
var StepsTitle = ({ className, ...rest }) => /* @__PURE__ */ jsx("span", {
  className: cn("font-medium text-foreground text-sm group-data-incomplete:text-muted-foreground group-data-[orientation=horizontal]:truncate", className),
  ...rest
});
var StepsDescription = ({ className, ...rest }) => /* @__PURE__ */ jsx("span", {
  className: cn("text-muted-foreground text-xs group-data-[orientation=horizontal]:truncate", className),
  ...rest
});
var StepsSeparator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.Separator, {
  className: cn("h-0.5 min-w-4 flex-1 rounded-full bg-border transition-colors data-complete:bg-primary", "data-[orientation=vertical]:absolute data-[orientation=vertical]:start-4 data-[orientation=vertical]:top-10 data-[orientation=vertical]:bottom-2 data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:min-w-0 data-[orientation=vertical]:-translate-x-1/2", className),
  ...rest
});
var StepsContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.Content, {
  className: cn("rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary", className),
  ...rest
});
var StepsCompletedContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.CompletedContent, {
  className: cn("rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary", className),
  ...rest
});
var StepsPrevTrigger = ({
  className,
  variant = "outline",
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.PrevTrigger, {
  className: cn(buttonVariants2({ variant, size }), className),
  ...rest
});
var StepsNextTrigger = ({
  className,
  variant,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.NextTrigger, {
  className: cn(buttonVariants2({ variant, size }), className),
  ...rest
});
var StepsProgress = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSteps.Progress, {
  className: cn("relative h-1 w-full overflow-hidden rounded-full bg-muted after:absolute after:inset-y-0 after:start-0 after:w-(--percent) after:bg-primary after:transition-all", className),
  ...rest
});
var Steps = ({
  items,
  completedContent,
  showNavigation = true,
  prevLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  ...rest
}) => /* @__PURE__ */ jsxs(StepsRoot, {
  count: items.length,
  ...rest,
  children: [
    /* @__PURE__ */ jsx(StepsList, {
      children: items.map((item, index) => /* @__PURE__ */ jsxs(StepsItem, {
        index,
        children: [
          /* @__PURE__ */ jsxs(StepsTrigger, {
            children: [
              /* @__PURE__ */ jsx(StepsIndicator, {}),
              /* @__PURE__ */ jsxs("span", {
                className: "flex min-w-0 flex-col gap-0.5",
                children: [
                  /* @__PURE__ */ jsx(StepsTitle, {
                    children: item.title
                  }),
                  item.description && /* @__PURE__ */ jsx(StepsDescription, {
                    children: item.description
                  })
                ]
              })
            ]
          }),
          index < items.length - 1 && /* @__PURE__ */ jsx(StepsSeparator, {})
        ]
      }, index))
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "flex min-w-0 flex-1 flex-col gap-4",
      children: [
        items.map((item, index) => /* @__PURE__ */ jsx(StepsContent, {
          index,
          children: item.content
        }, index)),
        completedContent && /* @__PURE__ */ jsx(StepsCompletedContent, {
          children: completedContent
        }),
        showNavigation && /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between gap-2",
          children: [
            /* @__PURE__ */ jsx(StepsPrevTrigger, {
              children: prevLabel
            }),
            /* @__PURE__ */ jsx(StepsContext, {
              children: (steps) => /* @__PURE__ */ jsx(StepsNextTrigger, {
                children: steps.value >= steps.count - 1 ? finishLabel : nextLabel
              })
            })
          ]
        })
      ]
    })
  ]
});
export {
  Steps,
  StepsCompletedContent,
  StepsContent,
  StepsContext,
  StepsDescription,
  StepsIndicator,
  StepsItem,
  StepsItemContext,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsProgress,
  StepsProvider,
  StepsRoot,
  StepsSeparator,
  StepsTitle,
  StepsTrigger
};
