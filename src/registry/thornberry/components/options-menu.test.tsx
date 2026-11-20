import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  OptionsMenu,
  OptionsMenuChoice,
} from "@/registry/thornberry/components/options-menu";

afterEach(cleanup);

const getItem = (label: string) => {
  const item = screen.getByText(label).closest('[data-part="item"]');
  if (!item) throw new Error(`expected an option row for ${label}`);
  return item;
};

const options = [
  {
    value: "balanced",
    label: "Balanced",
    description: "Great results for most sites",
  },
  {
    value: "best",
    label: "Most capable",
    description: "Richer, more detailed results",
    hint: "4x credits",
  },
];

describe("OptionsMenu", () => {
  test("names its icon trigger and opens a menu of choices", async () => {
    render(
      <OptionsMenu label="Options">
        <OptionsMenuChoice
          label="Quality"
          value="balanced"
          onValueChange={() => {}}
          options={options}
        />
      </OptionsMenu>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });

    expect(screen.queryByText("Most capable")).toBeNull();

    fireEvent.click(trigger);

    expect(await screen.findByText("Most capable")).toBeDefined();
    expect(screen.getByText("Richer, more detailed results")).toBeDefined();
    expect(screen.getByText("4x credits")).toBeDefined();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(getItem("Balanced").getAttribute("data-state")).toBe("checked");
  });

  test("hands a picked choice to the host", async () => {
    const onValueChange = mock();

    render(
      <OptionsMenu open>
        <OptionsMenuChoice
          label="Quality"
          value="balanced"
          onValueChange={onValueChange}
          options={options}
        />
      </OptionsMenu>,
    );

    await screen.findByText("Most capable");
    const radio = getItem("Most capable").querySelector("input");
    if (!radio) throw new Error("expected a hidden radio input");

    // Ark commits state after the click's microtasks settle
    fireEvent.click(radio);
    await act(async () => {});

    expect(onValueChange).toHaveBeenCalledWith("best");
  });

  test("can show its label beside the icon", () => {
    render(
      <OptionsMenu label="Settings" showLabel>
        <p>Nothing here</p>
      </OptionsMenu>,
    );

    expect(screen.getByRole("button", { name: "Settings" }).textContent).toBe(
      "Settings",
    );
  });
});
