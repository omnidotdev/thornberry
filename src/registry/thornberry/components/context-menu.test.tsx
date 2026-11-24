import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { ContextMenu } from "@/registry/thornberry/components/menu";

afterEach(() => {
  cleanup();
});

describe("ContextMenu", () => {
  test("opens on right-click and fires the chosen item", async () => {
    const onRename = mock(() => {});
    render(
      <ContextMenu
        items={[
          { label: "Rename", onSelect: onRename },
          { label: "", separator: true },
          { label: "Delete", variant: "destructive" },
        ]}
      >
        <div>Track 1</div>
      </ContextMenu>,
    );

    expect(screen.queryByRole("menuitem", { name: "Rename" })).toBeNull();
    await act(async () => {
      fireEvent.contextMenu(screen.getByText("Track 1"));
    });
    const rename = screen.getByRole("menuitem", { name: "Rename" });
    // a real press highlights the item before the click selects it
    await act(async () => {
      fireEvent.pointerMove(rename, { pointerType: "mouse" });
    });
    await act(async () => {
      fireEvent.click(rename);
    });
    expect(onRename).toHaveBeenCalledTimes(1);
  });

  test("only the innermost of nested context menus opens", async () => {
    render(
      <ContextMenu items={[{ label: "App action" }]}>
        <div>
          <ContextMenu items={[{ label: "Row action" }]}>
            <div>Row</div>
          </ContextMenu>
        </div>
      </ContextMenu>,
    );

    await act(async () => {
      fireEvent.contextMenu(screen.getByText("Row"));
    });
    expect(screen.getByRole("menuitem", { name: "Row action" })).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: "App action" })).toBeNull();
  });
});
