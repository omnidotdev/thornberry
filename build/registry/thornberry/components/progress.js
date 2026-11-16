import {
  cva
} from "../../../chunks/ai-describe-panel-g7wczx51.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/progress.tsx
import {
  Progress as ArkProgress,
  useProgressContext
} from "@ark-ui/react/progress";
import { jsx, jsxs } from "react/jsx-runtime";
var progressTrackVariants = cva("bg-muted relative w-full overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-1.5",
      md: "h-2",
      lg: "h-3"
    }
  },
  defaultVariants: { size: "md" }
});
var progressCircleSizes = {
  sm: { "--size": "2rem", "--thickness": "0.1875rem" },
  md: { "--size": "3rem", "--thickness": "0.25rem" },
  lg: { "--size": "4rem", "--thickness": "0.375rem" }
};
var ProgressProvider = ArkProgress.RootProvider;
var ProgressContext = ArkProgress.Context;
var ProgressRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.Root, {
  className: cn("flex w-full flex-col gap-2", className),
  ...rest
});
var ProgressLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.Label, {
  className: cn("font-medium text-foreground text-sm", className),
  ...rest
});
var ProgressValueText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.ValueText, {
  className: cn("text-muted-foreground text-sm tabular-nums", className),
  ...rest
});
var ProgressTrack = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.Track, {
  className: cn(progressTrackVariants({ size }), className),
  ...rest
});
var ProgressRange = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.Range, {
  className: cn("h-full rounded-full bg-primary transition-all duration-300 ease-out", "data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:translate-x-3/1 data-[state=indeterminate]:animate-in data-[state=indeterminate]:slide-in-from-left-4/1 data-[state=indeterminate]:repeat-infinite data-[state=indeterminate]:duration-1500 data-[state=indeterminate]:ease-in-out", className),
  ...rest
});
var ProgressCircle = ({
  className,
  size = "md",
  style,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.Circle, {
  className: cn("shrink-0 data-[state=indeterminate]:animate-spin", className),
  style: { ...progressCircleSizes[size], ...style },
  ...rest
});
var ProgressCircleTrack = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkProgress.CircleTrack, {
  className: cn("stroke-muted", className),
  ...rest
});
var ProgressCircleRange = ({
  className,
  style,
  ...rest
}) => {
  const progress = useProgressContext();
  return /* @__PURE__ */ jsx(ArkProgress.CircleRange, {
    strokeLinecap: "round",
    className: cn("stroke-primary transition-all duration-300 ease-out", className),
    style: {
      ...progress.indeterminate && {
        strokeDasharray: "calc(var(--circumference) * 0.25) var(--circumference)",
        strokeDashoffset: 0
      },
      ...style
    },
    ...rest
  });
};
var Progress = ({
  label,
  showValueText = false,
  size,
  ...rest
}) => /* @__PURE__ */ jsxs(ProgressRoot, {
  ...rest,
  children: [
    (label || showValueText) && /* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between gap-2",
      children: [
        label && /* @__PURE__ */ jsx(ProgressLabel, {
          children: label
        }),
        showValueText && /* @__PURE__ */ jsx(ProgressValueText, {
          className: "ml-auto"
        })
      ]
    }),
    /* @__PURE__ */ jsx(ProgressTrack, {
      size,
      children: /* @__PURE__ */ jsx(ProgressRange, {})
    })
  ]
});
var CircularProgress = ({
  size = "md",
  label,
  showValueText = false,
  className,
  ...rest
}) => /* @__PURE__ */ jsxs(ProgressRoot, {
  className: cn("inline-flex w-fit items-center", className),
  ...rest,
  children: [
    /* @__PURE__ */ jsxs("div", {
      className: "relative inline-flex items-center justify-center",
      children: [
        /* @__PURE__ */ jsxs(ProgressCircle, {
          size,
          children: [
            /* @__PURE__ */ jsx(ProgressCircleTrack, {}),
            /* @__PURE__ */ jsx(ProgressCircleRange, {})
          ]
        }),
        showValueText && /* @__PURE__ */ jsx(ProgressValueText, {
          className: "text-foreground absolute inset-0 flex items-center justify-center text-xs font-medium"
        })
      ]
    }),
    label && /* @__PURE__ */ jsx(ProgressLabel, {
      children: label
    })
  ]
});
export {
  CircularProgress,
  Progress,
  ProgressCircle,
  ProgressCircleRange,
  ProgressCircleTrack,
  ProgressContext,
  ProgressLabel,
  ProgressProvider,
  ProgressRange,
  ProgressRoot,
  ProgressTrack,
  ProgressValueText,
  progressTrackVariants
};
