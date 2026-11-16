import { Splitter as ArkSplitter } from "@ark-ui/react/splitter";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SplitterPanelData } from "@ark-ui/react/splitter";
import type { ComponentProps, ReactNode } from "react";

const SplitterProvider = ArkSplitter.RootProvider;
const SplitterContext = ArkSplitter.Context;

/**
 * Lays out panels in a row (`orientation="horizontal"`, the default) or a
 * column. Sizes are percentages of the root, so give the root (or its parent)
 * a definite height for vertical splits.
 */
const SplitterRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSplitter.Root>) => (
  <ArkSplitter.Root className={cn("size-full", className)} {...rest} />
);

const SplitterPanel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSplitter.Panel>) => (
  <ArkSplitter.Panel className={cn("min-h-0 min-w-0", className)} {...rest} />
);

/**
 * The draggable divider between two panels (`id` is `"<before>:<after>"`).
 * Focus it and use the arrow keys to resize (Shift for larger steps),
 * Home/End to jump to the limits, and Enter to collapse a collapsible panel.
 * Ark gives it `role="separator"`; it is labelled "Resize panels" unless an
 * `aria-label` is passed.
 */
const SplitterResizeTrigger = ({
  className,
  "aria-label": ariaLabel = "Resize panels",
  ...rest
}: ComponentProps<typeof ArkSplitter.ResizeTrigger>) => (
  <ArkSplitter.ResizeTrigger
    type="button"
    aria-label={ariaLabel}
    className={cn(
      // A 1px line with a wider invisible hit area for the pointer
      "relative flex shrink-0 items-center justify-center bg-border outline-none transition-colors after:absolute hover:bg-primary/50 focus-visible:ring-2 focus-visible:ring-primary data-disabled:pointer-events-none data-dragging:bg-primary",
      "data-[orientation=horizontal]:w-px data-[orientation=horizontal]:after:-inset-x-1.5 data-[orientation=horizontal]:after:inset-y-0",
      "data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:-inset-y-1.5 data-[orientation=vertical]:after:inset-x-0",
      className,
    )}
    {...rest}
  />
);

/** A grip drawn on the resize trigger. Place it inside `SplitterResizeTrigger`. */
const SplitterResizeTriggerIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSplitter.ResizeTriggerIndicator>) => (
  <ArkSplitter.ResizeTriggerIndicator
    className={cn(
      "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border text-muted-foreground data-[orientation=vertical]:rotate-90",
      className,
    )}
    {...rest}
  >
    {children ?? <GripVertical className="size-2.5" aria-hidden="true" />}
  </ArkSplitter.ResizeTriggerIndicator>
);

interface SplitterPanelConfig extends SplitterPanelData {
  /** The panel's content. */
  content: ReactNode;
  /** Initial size as a percentage. Panels without one share what is left. */
  defaultSize?: number;
  /** Human-readable name, used to label the adjacent resize triggers. */
  label?: string;
}

interface SplitterProps
  extends Omit<
    ComponentProps<typeof ArkSplitter.Root>,
    "panels" | "defaultSize" | "children"
  > {
  /** Panels in order, with their constraints (`minSize`/`maxSize` in percent). */
  panels: SplitterPanelConfig[];
  /** Draw a grip on each resize trigger. */
  withHandle?: boolean;
}

/** Fill in missing panel sizes by sharing the space the sized panels leave. */
const resolveDefaultSizes = (panels: SplitterPanelConfig[]) => {
  const sized = panels.filter((panel) => panel.defaultSize != null);
  const taken = sized.reduce((sum, panel) => sum + (panel.defaultSize ?? 0), 0);
  const share = (100 - taken) / Math.max(panels.length - sized.length, 1);

  return panels.map((panel) => panel.defaultSize ?? share);
};

/**
 * Resizable panels separated by draggable, keyboard-accessible dividers.
 *
 * @example
 * <Splitter
 *   className="h-64"
 *   withHandle
 *   panels={[
 *     { id: "nav", label: "Navigation", defaultSize: 30, minSize: 20, content: <Nav /> },
 *     { id: "main", label: "Content", content: <Main /> },
 *   ]}
 * />
 */
const Splitter = ({ panels, withHandle = false, ...rest }: SplitterProps) => (
  <SplitterRoot
    panels={panels.map(({ content, defaultSize, label, ...panel }) => panel)}
    defaultSize={resolveDefaultSizes(panels)}
    {...rest}
  >
    {panels.map((panel, index) => {
      const next = panels[index + 1];

      return [
        <SplitterPanel key={panel.id} id={panel.id}>
          {panel.content}
        </SplitterPanel>,
        next && (
          <SplitterResizeTrigger
            key={`${panel.id}:${next.id}`}
            id={`${panel.id}:${next.id}`}
            aria-label={
              panel.label && next.label
                ? `Resize ${panel.label} and ${next.label}`
                : undefined
            }
          >
            {withHandle && <SplitterResizeTriggerIndicator />}
          </SplitterResizeTrigger>
        ),
      ];
    })}
  </SplitterRoot>
);

export type { SplitterPanelConfig };
export {
  Splitter,
  SplitterContext,
  SplitterPanel,
  SplitterProvider,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
  SplitterRoot,
};
