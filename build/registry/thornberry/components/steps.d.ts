import { Steps as ArkSteps } from "@ark-ui/react/steps";
import { buttonVariants } from "../../../registry/thornberry/components/button";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
declare const StepsProvider: import("react").ForwardRefExoticComponent<ArkSteps.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const StepsContext: {
    (props: ArkSteps.ContextProps): ReactNode;
    displayName: string;
};
declare const StepsItemContext: {
    (props: ArkSteps.ItemContextProps): ReactNode;
    displayName: string;
};
/**
 * Horizontal (the default) stacks the step list above the content; vertical
 * puts the list beside it.
 */
declare const StepsRoot: ({ className, ...rest }: ComponentProps<typeof ArkSteps.Root>) => import("react/jsx-runtime").JSX.Element;
declare const StepsList: ({ className, ...rest }: ComponentProps<typeof ArkSteps.List>) => import("react/jsx-runtime").JSX.Element;
/** One step. Its trigger, indicator, and separator read their index from it. */
declare const StepsItem: ({ className, ...rest }: ComponentProps<typeof ArkSteps.Item>) => import("react/jsx-runtime").JSX.Element;
/**
 * The step's header: its indicator and title. Clicking it jumps to the step
 * unless the root is `linear`.
 */
declare const StepsTrigger: ({ className, ...rest }: ComponentProps<typeof ArkSteps.Trigger>) => import("react/jsx-runtime").JSX.Element;
/**
 * The step's numbered badge, showing a check once complete. Ark marks it
 * `aria-hidden`; the trigger's text carries the step's name.
 */
declare const StepsIndicator: ({ className, children, ...rest }: ComponentProps<typeof ArkSteps.Indicator>) => import("react/jsx-runtime").JSX.Element;
declare const StepsTitle: ({ className, ...rest }: ComponentProps<"span">) => import("react/jsx-runtime").JSX.Element;
declare const StepsDescription: ({ className, ...rest }: ComponentProps<"span">) => import("react/jsx-runtime").JSX.Element;
/**
 * The line joining a step to the next one, filled once the step is complete.
 * Horizontal lines grow between items; vertical lines run down from the
 * indicator to the next step.
 */
declare const StepsSeparator: ({ className, ...rest }: ComponentProps<typeof ArkSteps.Separator>) => import("react/jsx-runtime").JSX.Element;
/** The panel for one step (`index`), shown while that step is current. */
declare const StepsContent: ({ className, ...rest }: ComponentProps<typeof ArkSteps.Content>) => import("react/jsx-runtime").JSX.Element;
/** Shown once every step is complete (after the last step's next). */
declare const StepsCompletedContent: ({ className, ...rest }: ComponentProps<typeof ArkSteps.CompletedContent>) => import("react/jsx-runtime").JSX.Element;
declare const StepsPrevTrigger: ({ className, variant, size, ...rest }: ComponentProps<typeof ArkSteps.PrevTrigger> & VariantProps<typeof buttonVariants>) => import("react/jsx-runtime").JSX.Element;
declare const StepsNextTrigger: ({ className, variant, size, ...rest }: ComponentProps<typeof ArkSteps.NextTrigger> & VariantProps<typeof buttonVariants>) => import("react/jsx-runtime").JSX.Element;
/** A progress bar filled to the share of completed steps. */
declare const StepsProgress: ({ className, ...rest }: ComponentProps<typeof ArkSteps.Progress>) => import("react/jsx-runtime").JSX.Element;
interface StepsItemData {
    title: ReactNode;
    description?: ReactNode;
    /** The panel shown while this step is current. */
    content?: ReactNode;
}
interface StepsProps extends Omit<ComponentProps<typeof ArkSteps.Root>, "count" | "children"> {
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
declare const Steps: ({ items, completedContent, showNavigation, prevLabel, nextLabel, finishLabel, ...rest }: StepsProps) => import("react/jsx-runtime").JSX.Element;
export type { StepsItemData };
export { Steps, StepsCompletedContent, StepsContent, StepsContext, StepsDescription, StepsIndicator, StepsItem, StepsItemContext, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsProgress, StepsProvider, StepsRoot, StepsSeparator, StepsTitle, StepsTrigger, };
