import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { OptionsCombobox } from "@/registry/thornberry/components/combobox";

afterEach(() => {
  cleanup();
});

const items = [
  { value: "web", label: "web", description: "Updated 2d ago" },
  { value: "api", label: "api" },
];

describe("OptionsCombobox", () => {
  test("opens on click and lists items with their descriptions", async () => {
    render(<OptionsCombobox items={items} placeholder="Pick a repo" />);

    await act(async () => {
      fireEvent.click(screen.getByPlaceholderText("Pick a repo"));
    });

    expect(screen.getByRole("option", { name: /web/ })).toBeTruthy();
    expect(screen.getByText("Updated 2d ago")).toBeTruthy();
  });

  test("reports the chosen value", async () => {
    const onValueChange = mock((_value: string[]) => {});
    render(
      <OptionsCombobox
        items={items}
        placeholder="Pick a repo"
        onValueChange={onValueChange}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByPlaceholderText("Pick a repo"));
    });
    const api = screen.getByRole("option", { name: /api/ });
    await act(async () => {
      fireEvent.pointerMove(api, { pointerType: "mouse" });
    });
    await act(async () => {
      fireEvent.click(api);
    });

    expect(onValueChange).toHaveBeenCalledWith(["api"]);
  });

  test("shows the empty label when no item matches", async () => {
    render(
      <OptionsCombobox
        items={[]}
        placeholder="Pick a repo"
        emptyLabel="No repositories"
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByPlaceholderText("Pick a repo"));
    });

    expect(screen.getByText("No repositories")).toBeTruthy();
  });
});
