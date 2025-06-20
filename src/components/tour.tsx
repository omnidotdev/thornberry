"use client";

import { Portal } from "@ark-ui/react/portal";
import { useTour } from "@ark-ui/react/tour";

import { Button } from "@/registry/thornberry/components/button";
import {
  TourActions,
  TourActionTrigger,
  TourBackdrop,
  TourCloseTrigger,
  TourContent,
  TourControl,
  TourDescription,
  TourPositioner,
  TourProgressText,
  TourRoot,
  TourSpotlight,
  TourTitle,
} from "@/registry/thornberry/components/tour";

import type { TourStepDetails } from "@ark-ui/react/tour";

// TODO: fix positioning of floating step type
// TODO: provide example for wait step type

const steps: TourStepDetails[] = [
  {
    type: "dialog",
    id: "step-0",
    title: "Welcome to the Tour",
    description:
      "We'll walk you through a few UI elements to show how this tour system works.",
    actions: [{ label: "Start Tour", action: "next" }],
  },
  {
    type: "tooltip",
    id: "step-1",
    title: "Anchored Tooltip",
    description:
      "This step highlights a specific UI element using a tooltip anchored to a target.",
    target: () => document.querySelector<HTMLElement>("#step-1"),
    actions: [
      { label: "Prev", action: "prev" },
      { label: "Next", action: "next" },
    ],
  },
  {
    type: "floating",
    id: "step-2",
    title: "Floating Panel",
    placement: "top-start",
    description:
      "This floating step isn't tied to a specific target, but still appears contextually.",
    actions: [
      { label: "Prev", action: "prev" },
      { label: "Next", action: "next" },
    ],
  },
  {
    id: "step-4",
    type: "dialog",
    title: "You're All Set!",
    description:
      "The tour is complete. You're ready to start building your own guided experience.",
    actions: [
      { label: "Prev", action: "prev" },
      { label: "Finish Tour", action: "dismiss" },
    ],
  },
];

const Tour = () => {
  const tour = useTour({ steps });

  if (!tour) {
    return <div>Loading tour...</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-center rounded-lg bg-muted p-8">
        <Button onClick={() => tour.start()}>Start Tour</Button>
      </div>

      {/* Example target element — replace with your own. */}
      <Button
        id="step-1"
        className="my-4"
        disabled={tour.stepIndex !== 1}
      >
        Step 1
      </Button>

      {tour.open && (
        <TourRoot tour={tour}>
          <Portal>
            <TourBackdrop />
            <TourSpotlight />
            <TourPositioner>
              <TourContent>
                <div className="flex flex-col gap-2">
                  <TourProgressText />
                  <TourTitle />
                  <TourDescription />
                </div>
                <TourCloseTrigger />
                <TourControl>
                  <TourActions>
                    {(actions) =>
                      actions.map((action) => (
                        <TourActionTrigger
                          key={action.label}
                          action={action}
                          asChild
                        >
                          <Button
                            size="sm"
                            variant={
                              action.action === "prev" ? "outline" : "solid"
                            }
                          >
                            {action.label}
                          </Button>
                        </TourActionTrigger>
                      ))
                    }
                  </TourActions>
                </TourControl>
              </TourContent>
            </TourPositioner>
          </Portal>
        </TourRoot>
      )}
    </>
  );
};

export default Tour;
