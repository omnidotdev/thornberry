import { Steps as ArkSteps, useStepsItemContext } from "@ark-ui/react/steps";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/thornberry/components/button";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const StepsProvider = ArkSteps.RootProvider;
const StepsContext = ArkSteps.Context;
const StepsItemContext = ArkSteps.ItemContext;

/**
 * Horizontal (the default) stacks the step list above the content; vertical
 * puts the list beside it.
 */
const StepsRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Root>) => (
  <ArkSteps.Root
    className={cn(
      "flex w-full flex-col gap-6 data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-8",
      className,
    )}
    {...rest}
  />
);

const StepsList = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.List>) => (
  <ArkSteps.List
    className={cn(
      "flex w-full items-start gap-3 data-[orientation=vertical]:w-auto data-[orientation=vertical]:shrink-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-0",
      className,
    )}
    {...rest}
  />
);

/** One step. Its trigger, indicator, and separator read their index from it. */
const StepsItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Item>) => (
  <ArkSteps.Item
    className={cn(
      "relative flex min-w-0 flex-1 items-center gap-3 last:flex-initial data-[orientation=vertical]:flex-none data-[orientation=vertical]:items-start data-[orientation=vertical]:pb-8 data-[orientation=vertical]:last:pb-0",
      className,
    )}
    {...rest}
  />
);

/**
 * The step's header: its indicator and title. Clicking it jumps to the step
 * unless the root is `linear`.
 */
const StepsTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Trigger>) => (
  <ArkSteps.Trigger
    className={cn(
      "group flex min-w-0 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background enabled:cursor-pointer data-[orientation=vertical]:items-start",
      className,
    )}
    {...rest}
  />
);

/**
 * The step's numbered badge, showing a check once complete. Ark marks it
 * `aria-hidden`; the trigger's text carries the step's name.
 */
const StepsIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSteps.Indicator>) => {
  const item = useStepsItemContext();

  return (
    <ArkSteps.Indicator
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-border font-medium text-muted-foreground text-sm transition-colors data-complete:border-primary data-current:border-primary data-complete:bg-primary data-current:text-primary data-complete:text-primary-foreground",
        className,
      )}
      {...rest}
    >
      {children ??
        (item.completed ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          item.index + 1
        ))}
    </ArkSteps.Indicator>
  );
};

const StepsTitle = ({ className, ...rest }: ComponentProps<"span">) => (
  <span
    className={cn(
      "font-medium text-foreground text-sm group-data-incomplete:text-muted-foreground group-data-[orientation=horizontal]:truncate",
      className,
    )}
    {...rest}
  />
);

const StepsDescription = ({ className, ...rest }: ComponentProps<"span">) => (
  <span
    className={cn(
      "text-muted-foreground text-xs group-data-[orientation=horizontal]:truncate",
      className,
    )}
    {...rest}
  />
);

/**
 * The line joining a step to the next one, filled once the step is complete.
 * Horizontal lines grow between items; vertical lines run down from the
 * indicator to the next step.
 */
const StepsSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Separator>) => (
  <ArkSteps.Separator
    className={cn(
      "h-0.5 min-w-4 flex-1 rounded-full bg-border transition-colors data-complete:bg-primary",
      "data-[orientation=vertical]:absolute data-[orientation=vertical]:start-4 data-[orientation=vertical]:top-10 data-[orientation=vertical]:bottom-2 data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:min-w-0 data-[orientation=vertical]:-translate-x-1/2",
      className,
    )}
    {...rest}
  />
);

/** The panel for one step (`index`), shown while that step is current. */
const StepsContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Content>) => (
  <ArkSteps.Content
    className={cn(
      "rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary",
      className,
    )}
    {...rest}
  />
);

/** Shown once every step is complete (after the last step's next). */
const StepsCompletedContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.CompletedContent>) => (
  <ArkSteps.CompletedContent
    className={cn(
      "rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary",
      className,
    )}
    {...rest}
  />
);

const StepsPrevTrigger = ({
  className,
  variant = "outline",
  size,
  ...rest
}: ComponentProps<typeof ArkSteps.PrevTrigger> &
  VariantProps<typeof buttonVariants>) => (
  <ArkSteps.PrevTrigger
    className={cn(buttonVariants({ variant, size }), className)}
    {...rest}
  />
);

const StepsNextTrigger = ({
  className,
  variant,
  size,
  ...rest
}: ComponentProps<typeof ArkSteps.NextTrigger> &
  VariantProps<typeof buttonVariants>) => (
  <ArkSteps.NextTrigger
    className={cn(buttonVariants({ variant, size }), className)}
    {...rest}
  />
);

/** A progress bar filled to the share of completed steps. */
const StepsProgress = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Progress>) => (
  <ArkSteps.Progress
    className={cn(
      "relative h-1 w-full overflow-hidden rounded-full bg-muted after:absolute after:inset-y-0 after:start-0 after:w-(--percent) after:bg-primary after:transition-all",
      className,
    )}
    {...rest}
  />
);

interface StepsItemData {
  title: ReactNode;
  description?: ReactNode;
  /** The panel shown while this step is current. */
  content?: ReactNode;
}

interface StepsProps
  extends Omit<ComponentProps<typeof ArkSteps.Root>, "count" | "children"> {
  /** The steps, in order. */
  items: StepsItemData[];
  /** Shown once every step is complete. */
  completedContent?: ReactNode;
  /** Render back and next buttons below the content. */
  showNavigation?: boolean;
  prevLabel?: ReactNode;
  nextLabel?: ReactNode;
  /** Label of the next button on the last step. */
  finishLabel?: ReactNode;
}

/**
 * A multi-step progress indicator and wizard: a numbered list of steps with
 * complete/current/upcoming states, the current step's content, and back and
 * next buttons.
 *
 * @example
 * <Steps
 *   items={[
 *     { title: "Account", content: <AccountForm /> },
 *     { title: "Workspace", content: <WorkspaceForm /> },
 *     { title: "Invite", content: <InviteForm /> },
 *   ]}
 *   completedContent={<p>All set.</p>}
 * />
 */
const Steps = ({
  items,
  completedContent,
  showNavigation = true,
  prevLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  ...rest
}: StepsProps) => (
  <StepsRoot count={items.length} {...rest}>
    <StepsList>
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are positional, the index is their identity
        <StepsItem key={index} index={index}>
          <StepsTrigger>
            <StepsIndicator />
            <span className="flex min-w-0 flex-col gap-0.5">
              <StepsTitle>{item.title}</StepsTitle>
              {item.description && (
                <StepsDescription>{item.description}</StepsDescription>
              )}
            </span>
          </StepsTrigger>

          {index < items.length - 1 && <StepsSeparator />}
        </StepsItem>
      ))}
    </StepsList>

    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are positional, the index is their identity
        <StepsContent key={index} index={index}>
          {item.content}
        </StepsContent>
      ))}

      {completedContent && (
        <StepsCompletedContent>{completedContent}</StepsCompletedContent>
      )}

      {showNavigation && (
        <div className="flex items-center justify-between gap-2">
          <StepsPrevTrigger>{prevLabel}</StepsPrevTrigger>
          <StepsContext>
            {(steps) => (
              <StepsNextTrigger>
                {steps.value >= steps.count - 1 ? finishLabel : nextLabel}
              </StepsNextTrigger>
            )}
          </StepsContext>
        </div>
      )}
    </div>
  </StepsRoot>
);

export type { StepsItemData };
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
  StepsTrigger,
};
