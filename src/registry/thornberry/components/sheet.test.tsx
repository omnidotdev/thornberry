import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  SheetContent,
  SheetRoot,
  SheetTitle,
} from "@/registry/thornberry/components/sheet";

afterEach(() => {
  cleanup();
});

const renderSheet = (onOpenChange: (open: boolean) => void, swipe = true) =>
  render(
    <SheetRoot open onOpenChange={({ open }) => onOpenChange(open)}>
      <SheetContent side="left" swipeToClose={swipe}>
        <SheetTitle>Navigation</SheetTitle>
      </SheetContent>
    </SheetRoot>,
  );

const swipe = async (target: HTMLElement, dx: number, dy = 0) => {
  const at = (x: number, y: number) => ({
    pointerType: "touch",
    clientX: x,
    clientY: y,
  });
  await act(async () => {
    fireEvent.pointerDown(target, at(200, 200));
    fireEvent.pointerMove(target, at(200 + dx / 2, 200 + dy / 2));
    fireEvent.pointerMove(target, at(200 + dx, 200 + dy));
    fireEvent.pointerUp(target, at(200 + dx, 200 + dy));
  });
};

describe("SheetContent swipe to close", () => {
  test("a swipe toward the sheet's edge closes it", async () => {
    const onOpenChange = mock((_open: boolean) => {});
    renderSheet(onOpenChange);

    await swipe(screen.getByText("Navigation"), -120);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("a short swipe, or one mostly across the axis, keeps it open", async () => {
    const onOpenChange = mock((_open: boolean) => {});
    renderSheet(onOpenChange);

    await swipe(screen.getByText("Navigation"), -40);
    await swipe(screen.getByText("Navigation"), -100, 200);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("swipeToClose={false} ignores swipes", async () => {
    const onOpenChange = mock((_open: boolean) => {});
    renderSheet(onOpenChange, false);

    await swipe(screen.getByText("Navigation"), -200);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
